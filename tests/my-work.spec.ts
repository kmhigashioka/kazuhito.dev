import { test, expect } from '@playwright/test';
import viewports from './viewports';

const url = 'http://localhost:3000/my-work';

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
