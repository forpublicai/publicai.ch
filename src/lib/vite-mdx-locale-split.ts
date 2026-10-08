// Locale-split MDX transform: a single vite/rollup plugin that
// turns each content `.mdx` page (ONE file, ALL locales,) into a JS
// module exporting one compiled component per locale section (`MdxEn`,
// `MdxDe`, `MdxFr`, `MdxIt`, `MdxRm`).
//
// Mechanism: on transform of a `.mdx` page id, read the file, strip
// frontmatter, split the body into per-locale sections via the page model,
// and compile EACH section with @mdx-js/mdx `compile` using the same
// remark plugins as the site pipeline. The compiled outputs are inlined as
// preact-style function components (jsx automatic runtime) in one module:
//
// const MdxEn = _jsx(...);  // per section, hoisted function components
// export { MdxEn, MdxDe,... };
//
// This design has NO cross-environment transform chain (vite Environment API
// runs plugin transforms per environment; a chain that depended on a second
// pass proved non-deterministic in the client build), and remark/frontmatter
// plugins are configured INSIDE this plugin verbatim.
import type { Plugin } from "vite";
import { readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { compile, type CompileOptions } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { splitLocaleSections, stripFrontmatter } from "./mdx-page-model";
import { rehypeMarkdownTables } from "./rehype-markdown-tables";

const LOCALES = ["en", "de", "fr", "it", "rm"] as const;

// Registry import prepended to every section body so MDX authors can call all
// eleven registered components directly. The specifier is computed
// relative to each MDX file because acorn rejects bare `~` aliases in imports.
const REGISTRY_EXPORTS =
  "Accordion, Box, Callout, CTA, Divider, Embed, Figure, Lead, LinkRow, PosterGrid, StatGrid, TeamGrid";
function componentImportsFor(fileId: string): string {
  const registryAbs = resolve(process.cwd(), "src/components/mdx/index");
  const spec = relative(dirname(fileId), registryAbs).split(sep).join("/");
  const withDots = spec.startsWith(".") ? spec : `./${spec}`;
  return `import { ${REGISTRY_EXPORTS} } from ${JSON.stringify(withDots)};\n\n`;
}

const COMPILE_OPTIONS: CompileOptions = {
  // Sections are compiled to PLAIN JS (jsx: false → automatic runtime via
  // react/jsx-runtime; jsx: true would emit literal JSX that rollup cannot
  // parse inside.mdx modules). remark-frontmatter parses/preserves the
  // YAML block — required because the section body sits inside an MDX doc
  // whose frontmatter was already stripped here, so plain content only.
  // NOTE: no remarkMdxFrontmatter — the renderer reads frontmatter from the
  // content manifest ; two `export const frontmatter` redeclarations
  // would be a SyntaxError.
  remarkPlugins: [remarkFrontmatter, [remarkGfm, { singleTilde: false }]],
  jsx: false,
  outputFormat: "program",
};

// Accessible Markdown chrome is localized with the actual section, including
// when that section is displayed through the existing fallback mechanism.
const MARKDOWN_LABELS = {
  en: { table: "Table", footnotes: "Footnotes", back: "Back to reference" },
  de: { table: "Tabelle", footnotes: "Fussnoten", back: "Zurück zur Referenz" },
  fr: { table: "Tableau", footnotes: "Notes de bas de page", back: "Retour à la référence" },
  it: { table: "Tabella", footnotes: "Note a piè di pagina", back: "Torna al riferimento" },
  rm: { table: "Tabella", footnotes: "Notas a pe", back: "Enavos a la referenza" },
} as const;

export function mdxLocaleSplitPlugin(): Plugin {
  return {
    name: "mdx-locale-split",
    enforce: "pre",
    async transform(_code, id) {
      if (!id.endsWith(".mdx") || id.includes("?")) return null;
      const source = readFileSync(id, "utf8");
      // Locale-section errors throw PageModelError naming the file.
      const sections = splitLocaleSections(stripFrontmatter(source), id);

      const imports = new Set<string>();
      const bodies: { name: string; js: string }[] = [];
      for (const locale of LOCALES) {
        const body = sections.get(locale);
        if (body === undefined) continue; // absent section → absent export (§ 7.2 fallback)
        let compiled: unknown;
        try {
          compiled = await compile(componentImportsFor(id) + body, {
            ...COMPILE_OPTIONS,
            rehypePlugins: [[rehypeMarkdownTables, { label: MARKDOWN_LABELS[locale].table }]],
            remarkRehypeOptions: {
              footnoteLabel: MARKDOWN_LABELS[locale].footnotes,
              footnoteLabelProperties: { className: [] },
              footnoteBackLabel: MARKDOWN_LABELS[locale].back,
            },
          });
        } catch (error) {
          throw new Error(
            `MDX compile failed for ${id} [${locale}]: ${(error as Error).message}`,
            { cause: error },
          );
        }
        const js = String(compiled);
        const componentName = `Mdx${locale.toUpperCase()}`;
        // Hoist the compiled module's top-level imports (react/jsx-runtime
        // et al.) — imports are legal only at module top level, and each
        // section compiles to its own module text. Deduped: all sections
        // import identically.
        let bodyCode = js;
        bodyCode = bodyCode.replace(/^import\s[^;]+;\s*$/gm, (statement) => {
          imports.add(statement);
          return "";
        });
        // Each section lives inside an IIFE, so its program-level default
        // export becomes a local function; only the locale exports survive.
        bodyCode = bodyCode.replace(/^export default function MDXContent/m, "function MDXContent");
        if (!bodyCode.includes("function MDXContent")) {
          throw new Error(`unexpected MDX compile output shape for ${id} [${locale}]`);
        }
        bodies.push({ name: componentName, js: bodyCode });
      }
      // Each compiled section is a module text declaring helper functions
      // plus `MDXContent`; scope each in an IIFE-bound const so the per-
      // section helpers can never collide, then export one name per locale.
      const parts = bodies.map(({ name, js }) => `const ${name} = /*#__PURE__*/ (() => {\n${js}\nreturn MDXContent;\n})();`);
      const moduleTop = [...imports].join("\n") + "\n";
      const codeOut =
        moduleTop + parts.join("\n\n") + `\nexport { ${bodies.map((b) => b.name).join(", ")} };\n`;
      return { code: codeOut, map: null };
    },
  };
}
