import { test, expect } from '@playwright/test';
import viewports from './viewports';

const url = 'http://localhost:3000';

test('can navigate to "my work" page', async ({ page }) => {
  await page.goto(url);
  await page.click('text=my work');
  await expect(page.locator('text=Currently a Senior Software Developer with over 7 years of experience in software development.')).toBeVisible();
});

test('can navigate to "contact me" page', async ({ page }) => {
  await page.goto(url);
  await page.click('text=contact me');
  await expect(page.locator('text=Just say hi')).toBeVisible();
});

test('can navigate to employer page', async ({ page }) => {
  const currentEmployer = 'https://www.engagerocket.co/';
  await page.goto(url);
  await page.click('text=EngageRocket');
  expect(page.url()).toBe(currentEmployer);
});

viewports.forEach(([width, height]) => {
  test.describe('visual tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
      await page.setViewportSize({ width, height });
      await page.waitForLoadState('networkidle');
    });

    test(`visual test for viewport ${width}x${height}`, async ({ page, browserName }) => {
      const path = `${browserName}-${width}x${height}-index_page.png`;
      expect(await page.screenshot()).toMatchSnapshot(path, { threshold: 0.2 });
    });
  });
});
