import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 120_000,
    // Astro's CLI auto-detects an agentic environment (via `am-i-vibing`) and
    // silently forces `astro preview` into detached background mode in that
    // case, which makes the spawned process exit immediately instead of
    // staying alive to serve requests — breaking Playwright's webServer,
    // which expects the command to block in the foreground. Setting this
    // env var opts back into normal foreground behaviour regardless of the
    // agent-detection heuristic. See node_modules/astro/dist/cli/preview/index.js.
    env: {
      ASTRO_PREVIEW_BACKGROUND: '0',
    },
  },
});
