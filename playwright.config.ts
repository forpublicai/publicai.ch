// Browser smoke and accessibility checks against the static production output.
// Starts scripts/preview-server.mjs when a preview server is not already running.
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 4173);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // The server is started by `yarn test:e2e` (preview script); webServer
  // here reuses it if already running, otherwise serves the prerendered
  // build via react-router-serve (static output; ssr:false).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "yarn node ./scripts/preview-server.mjs",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 30_000,
      },
});