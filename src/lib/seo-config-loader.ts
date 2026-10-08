// Node-side config loader for build scripts (emit-seo.mjs etc.): reads
// config.json from disk and validates it with the same zod schema the site
// runtime uses, so build-time artifacts can't drift from the validated app
// config. Errors name the offending path (get-config.ts conventions).
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ConfigSchema, type Config } from "../../src/lib/config";

export function buildConfig(rootDir: string): Config {
  const raw = JSON.parse(readFileSync(resolve(rootDir, "config.json"), "utf8"));
  const result = ConfigSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`config.json is invalid. Fix the following and try again:\n${issues}`);
  }
  return result.data;
}

// Alias with an explicit environment name: routes.ts (config-loader context)
// imports this to disambiguate from the app-runtime get-config (which loads
// config.json via the bundler import, not fs).
export function buildConfigNode(rootDir: string): Config {
  return buildConfig(rootDir);
}