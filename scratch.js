const { chromium } = require('playwright');
const credentials = require('./test-data/credentials.json');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost'); // Need to check config for base url, let's use playwright test instead of raw node.
  await browser.close();
})();
