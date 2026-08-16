import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * `vercel.json`'s redirects are the live URLs of the site this project
 * replaces, already shared publicly (/my-work, /contact-me). They are not
 * exercised by the e2e suite: Playwright runs against `astro preview`, which
 * does not apply Vercel's `redirects` config, so nothing in CI actually
 * proves these entries exist or are correct. This test can't prove Vercel
 * honours them (only a real preview deploy can — that's a manual checklist
 * item), but it stops a later edit from silently dropping or mistyping them.
 */
interface VercelRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

const vercelJsonPath = fileURLToPath(new URL('../../vercel.json', import.meta.url));
const vercelConfig = JSON.parse(readFileSync(vercelJsonPath, 'utf8')) as {
  redirects: VercelRedirect[];
};

function findRedirect(source: string): VercelRedirect | undefined {
  return vercelConfig.redirects.find((r) => r.source === source);
}

describe('vercel.json redirects', () => {
  it('redirects /my-work to /work permanently', () => {
    expect(findRedirect('/my-work')).toEqual({
      source: '/my-work',
      destination: '/work',
      permanent: true,
    });
  });

  it('redirects /contact-me to /about permanently', () => {
    expect(findRedirect('/contact-me')).toEqual({
      source: '/contact-me',
      destination: '/about',
      permanent: true,
    });
  });

  it('defines exactly these two redirects', () => {
    expect(vercelConfig.redirects).toHaveLength(2);
  });
});
