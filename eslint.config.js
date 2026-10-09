// ESLint flat config: typescript-eslint recommended, browser + node globals.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "build/",
      ".yarn/",
      ".react-router/",
      ".venv/",
      ".claude/",
      ".desloppify/",
      "scripts/",
      "*.tmp",
      ".pnp.cjs",
      ".pnp.loader.mjs",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
