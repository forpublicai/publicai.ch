// Vite content manifest: discovers and validates MDX at startup and build time.
// Runtime renderers consume virtual:content-manifest without filesystem access.
// Content events refresh feeds; restart dev for new or changed routes because
// React Router loads its route configuration separately.
import { resolve } from "node:path";
import { discoverContent, type ContentManifest } from "./content-discovery";
import type { Plugin, ViteDevServer } from "vite";

const VIRTUAL_ID = "virtual:content-manifest";
const VIRTUAL_RESOLVED = "\0" + VIRTUAL_ID;

export function contentDiscoveryPlugin(): Plugin {
  let manifestJSON = "{}";
  let contentDirAbs = "";

  function refresh(): void {
    const manifest = discoverContent(contentDirAbs);
    manifestJSON = JSON.stringify(serializeManifest(manifest));
  }

  return {
    name: "mdx-content-discovery",
    enforce: "pre",
    configResolved(config) {
      contentDirAbs = resolve(config.root, "content");
      refresh();
    },
    configureServer(server: ViteDevServer) {
      const watcher = server.watcher;
      const onChange = async (file: string): Promise<void> => {
        if (!file.includes("/content/") || !file.endsWith(".mdx")) return;
        try {
          refresh();
          const mod = server.moduleGraph.getModuleById(VIRTUAL_RESOLVED);
          if (mod) await server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        } catch (error) {
          // Loud failure: content errors must surface in dev overlay immediately.
          server.ssrFixStacktrace(error as Error);
          console.error(`\n[content error]\n${(error as Error).message}\n`);
        }
      };
      watcher.on("add", onChange);
      watcher.on("unlink", onChange);
      watcher.on("change", onChange);
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return VIRTUAL_RESOLVED;
    },
    load(id) {
      if (id !== VIRTUAL_RESOLVED) return;
      // NOTE: no `as const` — virtual modules parse as plain JS.
      return `export const contentManifest = ${manifestJSON};\nexport default contentManifest;\n`;
    },
  };
}

// JSON-safe manifest shape (PageEntry minus maps).
type SerializedPage = {
  slug: string;
  theme: string;
  file: string;
  type: "standard" | "news";
  frontmatter: {
    title: string;
    description: string;
    draft: boolean;
    noindex: boolean;
    updatedAt?: string;
    date?: string;
    category?: string;
    author?: string;
    heroImage?: string;
    externalUrl?: string;
  };
  localesPresent: string[];
};

type SerializedAuthor = {
  authorId: string;
  file: string;
  frontmatter: {
    name: string;
    affiliation?: string;
    image?: string;
  };
  localesPresent: string[];
};

function serializeManifest(manifest: ContentManifest): {
  pages: SerializedPage[];
  authors: SerializedAuthor[];
} {
  return {
    pages: manifest.pages.map((p) => ({
      slug: p.slug,
      theme: p.theme,
      file: p.file,
      type: p.type,
      frontmatter: p.frontmatter,
      localesPresent: p.localesPresent,
    })),
    authors: [...manifest.authors.values()].map((a) => ({
      authorId: a.authorId,
      file: a.file,
      frontmatter: a.frontmatter,
      localesPresent: a.localesPresent,
    })),
  };
}