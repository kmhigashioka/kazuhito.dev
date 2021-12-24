import { test, expect } from '@playwright/test';

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
