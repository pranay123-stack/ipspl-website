import { defineConfig, devices } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Where the capture email provider writes, so a test can assert delivery. */
export const EMAIL_CAPTURE_DIR = join(tmpdir(), "ipspl-email-capture");

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
    // The capture provider replaces the console fallback so an integration
    // test can assert what was actually sent, not merely that a 200 came back.
    env: { EMAIL_CAPTURE_DIR },
    url: "http://localhost:3210",
    // Never reuse: port 3100 was already serving an unrelated project, and
    // reuseExistingServer attached to it — every assertion then ran against
    // the wrong app and failed for the wrong reason.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
