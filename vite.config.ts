import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { contentDiscoveryPlugin } from "./src/lib/vite-content-discovery";
import { mdxPageModulesPlugin } from "./src/lib/vite-mdx-page-modules";
import { mdxLocaleSplitPlugin } from "./src/lib/vite-mdx-locale-split";

// Publishes the /progress social card, rendered in the shared progress/
// subtree, at /assets/progress/card.png, so it stays in step with the data.
function progressCardPlugin(): Plugin {
  const src = fileURLToPath(new URL("./progress/static/dist/card.png", import.meta.url));
  const url = "/assets/progress/card.png";
  return {
    name: "progress-card",
    configureServer(server) {
      server.middlewares.use(url, (_req, res) => {
        res.setHeader("Content-Type", "image/png");
        res.end(readFileSync(src));
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: url.slice(1), source: readFileSync(src) });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    contentDiscoveryPlugin(),
    mdxPageModulesPlugin(),
    mdxLocaleSplitPlugin(),
    tailwindcss(),
    progressCardPlugin(),
    reactRouter(),
  ],
});
