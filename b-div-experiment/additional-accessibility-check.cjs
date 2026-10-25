const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 640, height: 800 } });

  try {
    await page.goto(process.env.BOOKMARK_URL || 'http://127.0.0.1:4173/b/');
    await page.waitForSelector('[data-book-id]');

    await page.evaluate(() => { document.documentElement.style.zoom = '200%'; });
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflows) throw new Error('The page has horizontal overflow at 200% zoom.');

    await page.evaluate(() => { document.documentElement.style.zoom = '100%'; });
    await page.getByRole('button', { name: 'Join the Reading Club' }).click();

    const name = page.getByLabel('Name', { exact: true });
    if (!(await name.evaluate((element) => element === document.activeElement))) {
      throw new Error('Invalid submission did not focus the first invalid field.');
    }
    if (await name.getAttribute('aria-invalid') !== 'true') {
      throw new Error('The invalid name field does not expose aria-invalid.');
    }
    const descriptionId = await name.getAttribute('aria-describedby');
    if (!descriptionId || !(await page.locator(`#${descriptionId}`).isVisible())) {
      throw new Error('The name error is not visibly and programmatically associated.');
    }

    console.log('Additional accessibility check passed: 200% reflow and form error handling.');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
