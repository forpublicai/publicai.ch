// Virtual module declaration: the content manifest produced by the vite
// content-discovery plugin at config/dev time (see vite-content-discovery.ts).
declare module "virtual:content-manifest" {
  export const contentManifest: {
    pages: {
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
    }[];
    authors: {
      authorId: string;
      file: string;
      frontmatter: {
        name: string;
        affiliation?: string;
        image?: string;
      };
      localesPresent: string[];
    }[];
  };
  export default contentManifest;
}

// Virtual module: per-slug map of compiled MDX page modules (see
// vite-mdx-page-modules.ts). Values are the compiled module namespaces with
// per-locale section components (`MdxEN`, `MdxDE`, …).
declare module "virtual:mdx-page-modules" {
  export const mdxPageModules: Record<string, Record<string, unknown>>;
  export default mdxPageModules;
}