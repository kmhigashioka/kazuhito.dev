import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

/**
 * Renders the 1200x630 share card to public/og.png.
 *
 * Run on demand (`node scripts/make-og.mjs`) when the card's content
 * changes, NOT as part of the build. A four-page static site does not need
 * image generation in its build path, and the card changes about once a year.
 *
 * Rendered through a real browser rather than composed with sharp so the card
 * uses the actual Gabarito and Schibsted Grotesk webfonts and the real palette
 * tokens, instead of an approximation of them.
 */
const card = pathToFileURL(resolve('scripts/og-card.html')).href;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.goto(card);
// Webfonts load over file:// asynchronously; screenshotting before they land
// silently produces a card set in the fallback sans. Resolve to a boolean,
// not to document.fonts.ready itself, because Playwright serialises the return
// value, and a FontFaceSet does not survive that.
await page.evaluate(() => document.fonts.ready.then(() => true));

await page.screenshot({ path: 'public/og.png' });
await browser.close();

console.log('Wrote public/og.png (1200x630)');
