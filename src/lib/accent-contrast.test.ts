import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * `#EE6C1F` (--color-accent) measures 2.99:1 on the page background — below
 * WCAG's 3:1 floor even for large text — so it must never be used for text.
 * All accent text uses `#B4470A` (--color-accent-deep) instead. The only
 * automated enforcement of this used to be an e2e axe run, which needs a
 * network and a browser. This is a cheap, offline guard against the same
 * regression: any bare `text-accent` class (not `text-accent-deep`) in an
 * .astro file is exactly the mistake axe caught once already.
 *
 * Deliberately NOT flagged: `hover:text-accent-deep`, `bg-accent`,
 * `to-accent`, `from-accent` — those are legitimate fills/decorative uses.
 */
const srcDir = fileURLToPath(new URL('..', import.meta.url));

function findAstroFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findAstroFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      files.push(full);
    }
  }
  return files;
}

// Matches `text-accent` unless immediately followed by `-deep`.
const BARE_TEXT_ACCENT = /text-accent(?!-deep)/g;

describe('accent color text usage', () => {
  const astroFiles = findAstroFiles(srcDir);

  it('finds .astro files to check', () => {
    expect(astroFiles.length).toBeGreaterThan(0);
  });

  it('never uses text-accent (fills-only) for text; text must use text-accent-deep', () => {
    const offenders: string[] = [];

    for (const file of astroFiles) {
      const content = readFileSync(file, 'utf8');
      const matches = content.match(BARE_TEXT_ACCENT);
      if (matches) {
        offenders.push(`${path.relative(srcDir, file)} (${matches.length} occurrence(s))`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
