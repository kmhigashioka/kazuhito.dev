import { test, expect } from '@playwright/test';

const url = 'http://localhost:3000/my-work';

const viewports = [
  [320, 710],
  [375, 710],
  [425, 710],
  [768, 710],
  [1024, 947],
  [1440, 1184],
  [2560, 2030],
];

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
