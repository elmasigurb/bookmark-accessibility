import { defineConfig } from '@playwright/test';

const target = process.env.BOOKMARK_TARGET ?? 'a';

if (!['a', 'b'].includes(target)) {
  throw new Error('BOOKMARK_TARGET must be either "a" or "b".');
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:4173/${target}/`,
    browserName: 'chromium',
    headless: true,
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
  reporter: 'list',
});
