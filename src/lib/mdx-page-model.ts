// The MDX page model: parsing a single multi-locale MDX
// page file into (a) validated frontmatter and (b) per-locale raw content
// sections. Pure string/state machine logic — no vite, no remark pipeline —
// so it can run at discovery time AND be unit-tested directly. The vite
// plugin layer (discovery, route generation) builds on this module.
import { z } from "zod";
import { LOCALES, type Locale } from "./config";

// ---------------------------------------------------------------------------
// Locale-section splitting: `<!-- locale: xx -->` markers delimit
// per-locale MDX documents.
// ---------------------------------------------------------------------------

// Matches a marker line: leading whitespace, HTML comment, exactly the word
// `locale`, a colon, and the locale id. Trailing whitespace allowed.
const MARKER_RE = /^[ \t]*<!--[ \t]*locale[ \t]*:[ \t]*([A-Za-z-]+)[ \t]*-->[ \t]*$/;

// Split a page file's body into per-locale sections keyed by locale id.
// Errors (naming file + 1-based line) on: unknown locale markers, duplicate
// markers for one locale, stray content before the first marker, and files
// with no marker at all.
export function splitLocaleSections(source: string, fileName: string): Map<Locale, string> {
  const lines = source.split("\n");
  const sections = new Map<Locale, string>();
  let current: Locale | null = null;
  let buffer: string[] = [];

  function flush(): void {
    if (current === null) return;
    const previous = sections.get(current);
    if (previous !== undefined) {
      throw new PageModelError(
        fileName,
        `duplicate locale marker for "${current}" — a page file must contain each locale at most once`,
      );
    }
    sections.set(current, buffer.join("\n").trim());
  }

  lines.forEach((line, index) => {
    const match = line.match(MARKER_RE);
    if (match) {
      const locale = match[1];
      if (!(LOCALES as readonly string[]).includes(locale)) {
        throw new PageModelError(
          fileName,
          `unknown locale "${locale}" on line ${index + 1} (valid locales: ${LOCALES.join(", ")})`,
        );
      }
      flush();
      current = locale as Locale;
      buffer = [];
      return;
    }
    if (current === null) {
      // Lines before the first marker: allowed only if blank (the caller
      // strips the frontmatter block first); anything else is stray content
      // with no locale, so it is an error naming the line.
      if (line.trim() !== "") {
        throw new PageModelError(
          fileName,
          `content before the first "locale:" marker on line ${index + 1} — every section must start with a <!-- locale: xx --> marker`,
        );
      }
      return;
    }
    buffer.push(line);
  });
  flush();

  if (sections.size === 0) {
    throw new PageModelError(
      fileName,
      "no locale section found — a page file MUST contain at least one <!-- locale: xx --> section (§ 6.2 rule 2)",
    );
  }
  return sections;
}

// Strips the YAML frontmatter block from source (returns body without it).
export function stripFrontmatter(source: string): string {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return match ? source.slice(match[0].length) : source;
}

// ---------------------------------------------------------------------------
// Frontmatter schemas ( standard, news)
// ---------------------------------------------------------------------------

// YYYY-MM-DD (calendar shape; broad range OK — content dates are historical).
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Absolute http(s) URL for externalUrl link-out articles.
const ABSOLUTE_URL_RE = /^https?:\/\//;

const FrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    draft: z.boolean().optional().default(false),
    noindex: z.boolean().optional().default(false),
    updatedAt: z.string().regex(DATE_RE).optional(),
    date: z.string().regex(DATE_RE).optional(),
    category: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    heroImage: z.string().min(1).optional(),
    externalUrl: z.string().regex(ABSOLUTE_URL_RE).optional(),
    // Per-locale titles (user decision 2026-09-30): optional overrides per
    // locale; resolution falls back to the locale-neutral `title` via the
    // chain. Renderers pick titleFor(frontmatter, locale).
    title_en: z.string().min(1).optional(),
    title_de: z.string().min(1).optional(),
    title_fr: z.string().min(1).optional(),
    title_it: z.string().min(1).optional(),
    title_rm: z.string().min(1).optional(),
    description_en: z.string().min(1).optional(),
    description_de: z.string().min(1).optional(),
    description_fr: z.string().min(1).optional(),
    description_it: z.string().min(1).optional(),
    description_rm: z.string().min(1).optional(),
  })
  // (no transform: type news vs standard is derived at the page-model level,
  // not the frontmatter level — date + category presence,)

export type PageFrontmatter = z.infer<typeof FrontmatterSchema>;

// The page's title/description in a locale (user decision 2026-09-30):
// title_<locale> when present, else the locale-neutral field ( chain:
// requested → en → de → any present).
export function titleFor(frontmatter: PageFrontmatter, locale: Locale): string {
  return (
    frontmatter[`title_${locale}` as const] ??
    frontmatter.title_en ??
    frontmatter.title_de ??
    frontmatter.title
  );
}

export function descriptionFor(frontmatter: PageFrontmatter, locale: Locale): string {
  return (
    frontmatter[`description_${locale}` as const] ??
    frontmatter.description_en ??
    frontmatter.description_de ??
    frontmatter.description
  );
}

// Author record frontmatter: the FILENAME is the authorID; the body
// carries per-locale bio sections (the usual marker format).
const AuthorFrontmatterSchema = z.object({
  name: z.string().min(1),
  affiliation: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
});

export type AuthorFrontmatter = z.infer<typeof AuthorFrontmatterSchema>;

export type AuthorModel = {
  authorId: string;
  frontmatter: AuthorFrontmatter;
  localesPresent: Locale[];
};

// Extract + validate the YAML frontmatter block. NOTE: uses a minimal YAML
// key/value parser here rather than adding `js-yaml`; page frontmatter is a
// flat string/boolean map by spec (/6.4), which the parser covers. A
// structured error names the file and field so non-developers can fix it.
export function parseFrontmatter(source: string, fileName: string): PageFrontmatter {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new PageModelError(fileName, "missing frontmatter block (--- … ---)");
  }
  const raw: Record<string, string | boolean> = {};
  match[1].split("\n").forEach((line) => {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)\s*$/);
    if (!kv) return;
    const [, key, value] = kv;
    if (value === "true") raw[key] = true;
    else if (value === "false") raw[key] = false;
    else raw[key] = value.replace(/^["']|["']$/g, "");
  });
  const result = FrontmatterSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `- ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new PageModelError(fileName, `invalid frontmatter:\n${issues}`);
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// Page model: what discovery records for a page file 
// ---------------------------------------------------------------------------

export type PageType = "standard" | "news";

export type PageModel = {
  // Slug: MDX filename without extension, flat + globally unique.
  slug: string;
  // Theme folder the file lives in (organizational only;).
  theme: string;
  type: PageType;
  frontmatter: PageFrontmatter;
  // Locales the file actually carries (for the untranslated report,).
  localesPresent: Locale[];
};

// Parse + validate one page file's source into its model.
export function validatePageFile(source: string, filePath: string): PageModel {
  const frontmatter = parseFrontmatter(source, filePath);
  const localesPresent = [...splitLocaleSections(stripFrontmatter(source), filePath).keys()];

  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];
  if (!fileName.endsWith(".mdx")) {
    throw new PageModelError(filePath, "only .mdx files are page sources");
  }
  const slug = fileName.replace(/\.mdx$/, "");
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new PageModelError(
      filePath,
      `slug "${slug}" is not URL-safe (must be lowercase letters/digits/hyphens)`,
    );
  }
  const theme = parts.length > 1 ? parts.slice(0, -1).join("/") : "";

  return {
    slug,
    theme,
    type: frontmatter.date !== undefined && frontmatter.category !== undefined ? "news" : "standard",
    frontmatter,
    localesPresent,
  };
}

// Parse + validate one AUTHOR file's source into its model. The
// authorID is the filename; the body must follow the usual locale-marker
// format (bio sections).
export function validateAuthorFile(source: string, filePath: string): AuthorModel {
  const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    throw new PageModelError(filePath, "missing frontmatter block (--- … ---)");
  }
  const raw: Record<string, string> = {};
  frontmatterMatch[1].split("\n").forEach((line) => {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)\s*$/);
    if (!kv) return;
    raw[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  });
  const parsed = AuthorFrontmatterSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `- ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new PageModelError(filePath, `invalid author frontmatter:\n${issues}`);
  }
  const authorId = filePath.split("/").pop()!.replace(/\.mdx$/, "");
  if (!/^[a-z0-9-]+$/.test(authorId)) {
    throw new PageModelError(filePath, `authorID "${authorId}" is not URL-safe`);
  }
  const localesPresent = [...splitLocaleSections(stripFrontmatter(source), filePath).keys()];
  return { authorId, frontmatter: parsed.data, localesPresent };
}

// Readable build-time error type: every content/config validation failure
// throws this so the build log can present a uniform, file-named message.
export class PageModelError extends Error {
  readonly file: string;
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
    this.name = "PageModelError";
    this.file = file;
  }
}