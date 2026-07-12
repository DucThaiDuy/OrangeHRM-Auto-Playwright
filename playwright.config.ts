import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* No retries locally — retry only on CI */
  retries: process.env.CI ? 1 : 0,

  /* 2 workers locally: chạy 2 file test song song */
  workers: process.env.CI ? 2 : 4,

  /* Timeout per test */
  timeout: 60000,

  /* Timeout per expect assertion */
  expect: {
    timeout: 8000,
  },

  /* Reporter */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/',

    /* Chỉ trace/screenshot/video khi test FAIL — tránh tốn I/O */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Headless = nhanh hơn ~25% so với có UI */
    headless: true,

    viewport: { width: 1280, height: 720 },

    /* Timeout mỗi action (click, fill...) — tránh treo vô thời hạn */
    actionTimeout: 15000,

    /* Timeout mỗi navigation */
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
