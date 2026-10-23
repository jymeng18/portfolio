/** Optional browser verification. The website itself has no dependencies. */
import assert from 'node:assert/strict';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    'playwright-module': { type: 'string', default: 'playwright' },
    'chromium-path': { type: 'string' },
    url: { type: 'string', default: 'http://127.0.0.1:8000' },
  },
});
const { chromium } = await import(values['playwright-module']);
const browser = await chromium.launch({
  executablePath: values['chromium-path'],
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const viewports = [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
  ];
  await page.setViewportSize(viewports[0]);
  await page.goto(values.url, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'false');

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(80);
    const result = await page.evaluate(() => ({
      scale: getComputedStyle(document.documentElement).getPropertyValue('--pixel').trim(),
      layout: document.querySelector('#world').dataset.layout,
      overflow: document.documentElement.scrollWidth > innerWidth,
      integerSprites: [...document.querySelectorAll('canvas')].every(canvas => {
        const bounds = canvas.getBoundingClientRect();
        return Number.isInteger(bounds.width / canvas.width)
          && Number.isInteger(bounds.height / canvas.height);
      }),
      menuFits: [...document.querySelectorAll('.menu-button')].every(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth
          && bounds.top >= 0 && bounds.bottom <= innerHeight;
      }),
      touchTargetsFit: [...document.querySelectorAll('.menu-button, .utility-button')].every(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.width >= 44 && bounds.height >= 44;
      }),
    }));
    assert.equal(result.overflow, false, 'Horizontal overflow');
    assert.ok(result.integerSprites, 'A sprite uses fractional scaling');
    assert.ok(result.menuFits, 'A menu button is outside the viewport');
    assert.ok(result.touchTargetsFit, 'A control has a small touch target');
    console.log(`${viewport.width}×${viewport.height}: ${JSON.stringify(result)}`);
    if (viewport.width === 1280 || viewport.width === 390) {
      const name = viewport.width === 1280 ? 'desktop-1280x720' : 'mobile-390x844';
      await page.screenshot({ path: `screenshots/${name}.png` });
    }
  }

  await page.setViewportSize(viewports[0]);
  await page.locator('[data-page="projects"]').focus();
  await page.keyboard.press('ArrowRight');
  assert.ok(await page.locator('[data-page="about"]').evaluate(element => element === document.activeElement));
  await page.keyboard.press('Enter');
  await page.locator('#route-notice').waitFor({ state: 'visible' });
  for (const destination of ['projects', 'about', 'contact']) {
    await page.locator(`[data-page="${destination}"]`).click();
    assert.equal(new URL(page.url()).hash, `#${destination}`);
    assert.equal(await page.locator('#route-notice').isVisible(), true);
  }
  console.log('PASS: keyboard navigation and all three pending destinations');

  await page.locator('#help-toggle').click();
  await page.locator('#help-dialog').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#help-dialog').evaluate(element => element.open), false);
  assert.ok(await page.locator('#help-toggle').evaluate(element => element === document.activeElement));
  console.log('PASS: help dialog, Escape, and focus restoration');

  await page.locator('#sound-toggle').click();
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'true');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'true');
  await page.locator('#sound-toggle').click();
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'false');
  console.log('PASS: sound defaults off, toggles, and persists across reload');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.ok(await page.locator('.cloud, .star').evaluateAll(elements =>
    elements.every(element => getComputedStyle(element).animationPlayState === 'paused')));
  console.log('PASS: reduced-motion preference pauses decorative animation');

  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => ({
    url: entry.name,
    bytes: entry.decodedBodySize,
  })));
  assert.ok(resources.every(resource => new URL(resource.url).origin === new URL(values.url).origin));
  assert.ok(resources.reduce((total, resource) => total + resource.bytes, 0) < 1_000_000);
  assert.deepEqual(errors, [], 'Unexpected browser errors');
  console.log('PASS: local assets, page weight under 1 MB, and no browser errors');
} finally {
  await browser.close();
}
