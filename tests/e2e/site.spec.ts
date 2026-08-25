import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', heading: /I build software/ },
  { path: '/work', heading: /Things I've built/ },
  { path: '/writing', heading: /^Writing$/ },
  { path: '/about', heading: /About me/ },
  { path: '/404', heading: /This page doesn't exist/ },
];

test.describe('pages render', () => {
  for (const { path, heading } of PAGES) {
    test(`${path} renders its heading`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    });
  }
});

test('navigation reaches every page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'work' }).click();
  await expect(page).toHaveURL('/work');

  await page.getByRole('navigation').getByRole('link', { name: 'writing' }).click();
  await expect(page).toHaveURL('/writing');

  await page.getByRole('navigation').getByRole('link', { name: 'about' }).click();
  await expect(page).toHaveURL('/about');
});

test('work page lists all ten projects', async ({ page }) => {
  await page.goto('/work');
  await expect(page.locator('article')).toHaveCount(10);
});

test('work page shows a screenshot for every project that has one', async ({ page }) => {
  await page.goto('/work');
  await expect(page.locator('article img')).toHaveCount(8);
});

test('work page has no placeholder gradients', async ({ page }) => {
  await page.goto('/work');
  // The old fallback drew `bg-linear-to-br from-sun/40 to-accent/25` for every
  // project, because nothing ever set an image. Cards without a screenshot now
  // render no image area at all.
  await expect(page.locator('article [class*="bg-linear-to-br"]')).toHaveCount(0);
});

test('screenshots are decorative and lazy', async ({ page }) => {
  await page.goto('/work');
  const images = page.locator('article img');

  for (let i = 0; i < (await images.count()); i++) {
    const img = images.nth(i);
    // A UI screenshot cannot be usefully described in an alt string, and the
    // card's title and blurb follow immediately. Decorative is the honest
    // declaration, but it must be explicit, not missing.
    await expect(img).toHaveAttribute('alt', '');
    await expect(img).toHaveAttribute('loading', 'lazy');
  }
});

test('the mark is decorative and appears once per page that uses it', async ({ page }) => {
  for (const path of ['/', '/404']) {
    await page.goto(path);
    const mark = page.locator('[data-mark]');
    await expect(mark).toHaveCount(1);
    await expect(mark).toHaveAttribute('aria-hidden', 'true');

    // The mark carries no information the copy does not already give, so it
    // must contribute no accessible name.
    expect(await mark.evaluate((el) => el.textContent?.trim())).toBe('');
  }
});

test('writing page links out to dev.to', async ({ page }) => {
  await page.goto('/writing');
  const links = page.locator('article a[href*="dev.to"]');
  expect(await links.count()).toBeGreaterThan(0);

  for (const href of await links.evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).href),
  )) {
    expect(href).toContain('dev.to/kmhigashioka');
  }
});

test('external links point where they claim', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('a[href="https://github.com/kmhigashioka"]').first()).toBeVisible();
  await expect(page.locator('a[href="mailto:kmhigashioka@gmail.com"]').first()).toBeVisible();
});

test('every page unfurls with a share card', async ({ page }) => {
  for (const { path } of PAGES) {
    await page.goto(path);

    // Must be absolute: relative og:image URLs are ignored by most unfurlers,
    // which is indistinguishable from having no tag at all.
    const image = page.locator('meta[property="og:image"]');
    await expect(image).toHaveAttribute('content', /^https:\/\/kazuhito\.dev\/og\.png$/);

    await expect(page.locator('meta[property="og:image:width"]'))
      .toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]'))
      .toHaveAttribute('content', '630');
    await expect(page.locator('meta[property="og:image:alt"]'))
      .toHaveAttribute('content', /I build software for humans/);
    await expect(page.locator('meta[name="twitter:card"]'))
      .toHaveAttribute('content', 'summary_large_image');
  }
});

test('no console errors on any page', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  for (const { path } of PAGES) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }

  expect(errors).toEqual([]);
});

test.describe('accessibility', () => {
  for (const { path } of PAGES) {
    test(`${path} has no detectable a11y violations`, async ({ page }) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(
        violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
      ).toEqual([]);
    });
  }
});
