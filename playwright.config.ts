import { defineConfig, devices } from "@playwright/test";

/**
 * Regression tests for the two bugs that were invisible to single-width
 * checking: the deep-link anchor landing and the header overflow band.
 *
 * Runs against the production build — dev-mode layout and timing are not
 * representative.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:3210", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npx next start -p 3210",
    url: "http://localhost:3210",
    // Never reuse: port 3100 was already serving an unrelated project, and
    // reuseExistingServer attached to it — every assertion then ran against
    // the wrong app and failed for the wrong reason.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
