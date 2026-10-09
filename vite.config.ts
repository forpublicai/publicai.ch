import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { contentDiscoveryPlugin } from "./src/lib/vite-content-discovery";
import { mdxPageModulesPlugin } from "./src/lib/vite-mdx-page-modules";
import { mdxLocaleSplitPlugin } from "./src/lib/vite-mdx-locale-split";

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
    reactRouter(),
  ],
});
