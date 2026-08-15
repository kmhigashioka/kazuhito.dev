# kazuhito.dev Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Remix site at kazuhito.dev with a static Astro site — a front-door homepage plus `/work`, `/writing` and `/about` — with content in typed data files and writing pulled from dev.to at build time.

**Architecture:** Fully static Astro build, no adapter and no server. Content lives in typed TypeScript modules in the repo. The only module with real logic is `src/lib/devto.ts`, which fetches posts from the dev.to API and falls back to a committed snapshot on any failure. Styling is Tailwind 4 with design tokens declared in a CSS `@theme` block. Redirects are handled at the Vercel platform layer.

**Tech Stack:** Astro 7.2.x · Tailwind 4.3.x (via `@tailwindcss/vite`) · TypeScript 5.9.x · Vitest 4.1.x · Playwright 1.62.x · Fontsource (Gabarito, Schibsted Grotesk) · Vercel

**Spec:** `docs/superpowers/specs/2026-08-15-personal-website-redesign-design.md`

## Global Constraints

- All work happens on branch `redesign`, branched from `main`. Do not commit to `main`.
- Node `>=22.12.0` and npm `>=9.6.5` (Astro 7 engine requirement).
- Output is **static**. No Astro adapter, no server endpoints, no environment variables, no runtime secrets.
- TypeScript is pinned to `^5.9.3`. Do **not** install TypeScript 7 — `@astrojs/check@0.9.10` predates it and compatibility is unverified.
- Fonts are self-hosted via Fontsource. No runtime request to Google Fonts or any third-party host.
- Colour tokens are exact and must not be adjusted: `paper #FFFBF2`, `surface #FFFFFF`, `ink #191410`, `ink-muted #6B6058`, `border-warm #E5D9C7`, `accent #EE6C1F`, `accent-deep #B4470A`, `counter #2E7D6E`, `sun #F7C948`.
- **`#EE6C1F` may only be used for display type at 24px+ bold, fills, and decorative shapes. Links and any text below 24px use `#B4470A`.** This is a contrast requirement (3.0:1 vs 5.4:1 on paper), verified by the axe pass in Task 9.
- Typefaces: Gabarito for display and headings; Schibsted Grotesk for body and UI.
- Max widths: 68rem for content, 44rem for prose.
- All motion respects `prefers-reduced-motion`.
- The build must never fail because dev.to is unreachable.
- Commit after every task. Use conventional commit prefixes (`feat:`, `test:`, `chore:`, `refactor:`).

---

## File Structure

| Path | Responsibility |
|---|---|
| `astro.config.mjs` | Astro + Tailwind Vite plugin config, site URL |
| `package.json` | Scripts and dependencies (replaces the Remix one) |
| `tsconfig.json` | Astro strict TS config |
| `vercel.json` | Redirects only |
| `vitest.config.ts` | Unit test config |
| `playwright.config.ts` | E2E config, builds and previews the site |
| `src/styles/theme.css` | Tailwind import + `@theme` design tokens + font imports |
| `src/lib/devto.ts` | Fetch dev.to posts, normalise, fall back to snapshot |
| `src/lib/devto.test.ts` | Unit tests for the above |
| `src/content/types.ts` | `Project`, `Employer`, `Hobby`, `SocialLink` interfaces |
| `src/content/projects.ts` | Ten projects grouped under four employers |
| `src/content/profile.ts` | Name, intro sentence, about copy, hobbies, links |
| `src/content/devto-snapshot.json` | Last known-good post list |
| `src/layouts/Base.astro` | HTML shell, head, fonts, nav, footer |
| `src/components/Nav.astro` | Site navigation |
| `src/components/Footer.astro` | Footer with social links |
| `src/components/ProjectCard.astro` | One project |
| `src/components/PostCard.astro` | One dev.to post |
| `src/components/HobbyCard.astro` | One hobby |
| `src/pages/index.astro` | Front door |
| `src/pages/work.astro` | Projects grouped by employer |
| `src/pages/writing.astro` | dev.to posts |
| `src/pages/about.astro` | Story, hobbies, contact |
| `tests/e2e/site.spec.ts` | Playwright smoke + axe accessibility |
| `.github/workflows/refresh.yml` | Daily deploy-hook trigger |

---

## Task 1: Branch, strip Remix, scaffold Astro

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/theme.css`, `src/pages/index.astro`, `.gitignore` (modify)
- Delete: `app/`, `api/`, `remix.config.js`, `remix.env.d.ts`, `tailwind.config.js`, `tailwindcss/`, `.env.example`, `package-lock.json`

**Interfaces:**
- Consumes: nothing
- Produces: a building static Astro site; the `--color-*` and `--font-*` tokens every later task uses

> **Note:** Do not run `npm create astro@latest`. It is interactive and will hang. All files are written by hand below.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b redesign
```

- [ ] **Step 2: Remove the Remix application**

```bash
git rm -r --quiet app api tailwindcss
git rm --quiet remix.config.js remix.env.d.ts tailwind.config.js .env.example package-lock.json
```

`vercel.json` is deliberately **not** deleted — Task 4 rewrites it with redirects.

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "kazuhito-dev",
  "type": "module",
  "private": true,
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "astro": "^7.2.2",
    "@fontsource-variable/gabarito": "^5.3.0",
    "@fontsource-variable/schibsted-grotesk": "^5.3.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "@axe-core/playwright": "^4.13.0",
    "@playwright/test": "^1.62.1",
    "@tailwindcss/vite": "^4.3.3",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.9.3",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 4: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kazuhito.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: Write `src/styles/theme.css`**

Note `--color-border-warm` rather than `--color-border`: Tailwind 4 would otherwise collide the token with its own `border` utility.

```css
@import "tailwindcss";

@import "@fontsource-variable/gabarito";
@import "@fontsource-variable/schibsted-grotesk";

@theme {
  --color-paper: #FFFBF2;
  --color-surface: #FFFFFF;
  --color-ink: #191410;
  --color-ink-muted: #6B6058;
  --color-border-warm: #E5D9C7;
  --color-accent: #EE6C1F;
  --color-accent-deep: #B4470A;
  --color-counter: #2E7D6E;
  --color-sun: #F7C948;

  --font-display: "Gabarito Variable", system-ui, sans-serif;
  --font-body: "Schibsted Grotesk Variable", system-ui, sans-serif;

  --radius-card: 14px;

  --spacing-prose: 44rem;
  --spacing-content: 68rem;
}

@layer base {
  html {
    background-color: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  a {
    color: var(--color-accent-deep);
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 7: Write a placeholder `src/pages/index.astro`**

```astro
---
import '../styles/theme.css';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Kazuhito Higashioka</title>
  </head>
  <body>
    <h1 class="text-ink">Scaffold works</h1>
  </body>
</html>
```

- [ ] **Step 8: Replace `.gitignore`**

```
node_modules
dist
.astro
.vercel
.superpowers
test-results
playwright-report
```

- [ ] **Step 9: Install and build**

Run: `npm install && npm run build`
Expected: `npm install` completes, `npm run build` reports "Complete!" and creates `dist/index.html`.

- [ ] **Step 10: Verify the built page is real**

Run: `node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); if(!h.includes('Scaffold works')) throw new Error('missing content'); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: replace Remix app with Astro 7 + Tailwind 4 scaffold"
```

---

## Task 2: Content types and data

**Files:**
- Create: `src/content/types.ts`, `src/content/projects.ts`, `src/content/profile.ts`, `src/content/content.test.ts`, `vitest.config.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `interface Project { title: string; blurb: string; tech: string[]; link?: string; image?: string }`
  - `interface Employer { name: string; role: string; period: string; projects: Project[] }`

> **Refinement of the spec.** The spec put `employer` and `year` on `Project`. Grouping projects under an `Employer` instead removes the repetition (ten projects would otherwise repeat four employer names and roles) and makes the grouped rendering on `/work` fall out naturally rather than requiring a group-by at render time. Same data, better shape.
  - `interface Hobby { name: string; blurb: string }`
  - `interface SocialLink { label: string; href: string }`
  - `employers: Employer[]` from `projects.ts`
  - `profile: Profile` from `profile.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 2: Write the failing test `src/content/content.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { employers } from './projects';
import { profile } from './profile';

describe('projects', () => {
  it('has four employers', () => {
    expect(employers).toHaveLength(4);
  });

  it('has ten projects in total', () => {
    const count = employers.reduce((n, e) => n + e.projects.length, 0);
    expect(count).toBe(10);
  });

  it('gives every project a title, blurb and at least one tech tag', () => {
    for (const employer of employers) {
      for (const project of employer.projects) {
        expect(project.title.length).toBeGreaterThan(0);
        expect(project.blurb.length).toBeGreaterThan(0);
        expect(project.tech.length).toBeGreaterThan(0);
      }
    }
  });

  it('lists EngageRocket first', () => {
    expect(employers[0].name).toBe('EngageRocket');
  });

  it('uses absolute URLs for any project link', () => {
    for (const employer of employers) {
      for (const project of employer.projects) {
        if (project.link) expect(project.link).toMatch(/^https:\/\//);
      }
    }
  });
});

describe('profile', () => {
  it('has three hobbies', () => {
    expect(profile.hobbies).toHaveLength(3);
  });

  it('exposes github, dev.to and email links', () => {
    const labels = profile.links.map((l) => l.label);
    expect(labels).toEqual(expect.arrayContaining(['GitHub', 'dev.to', 'Email']));
  });

  it('uses a mailto: href for email', () => {
    const email = profile.links.find((l) => l.label === 'Email');
    expect(email?.href).toBe('mailto:kmhigashioka@gmail.com');
  });

  it('has at least two paragraphs of about copy', () => {
    expect(profile.about.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./projects` or `./profile`

- [ ] **Step 4: Write `src/content/types.ts`**

```ts
export interface Project {
  title: string;
  blurb: string;
  tech: string[];
  link?: string;
  /** Optional screenshot. Cards fall back to a decorative gradient when absent. */
  image?: string;
}

export interface Employer {
  name: string;
  role: string;
  period: string;
  projects: Project[];
}

export interface Hobby {
  name: string;
  blurb: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  tagline: string;
  about: string[];
  hobbies: Hobby[];
  links: SocialLink[];
  email: string;
}
```

- [ ] **Step 5: Write `src/content/projects.ts`**

```ts
import type { Employer } from './types';

export const employers: Employer[] = [
  {
    name: 'EngageRocket',
    role: 'Senior Software Developer',
    period: '2021 — now',
    projects: [
      {
        title: 'PerformAI',
        blurb: 'AI-assisted performance management — turning review cycles into something managers actually finish.',
        tech: ['React', 'TypeScript'],
        link: 'https://www.engagerocket.co/performai-performance-management',
      },
      {
        title: 'Nebula',
        blurb: "The design language system every EngageRocket app is built from. Components, documentation, Storybook.",
        tech: ['React', 'TypeScript', 'Storybook'],
      },
      {
        title: 'Frontend Development',
        blurb: 'Application and feature work across the analytics platform that helps leaders make people decisions from real-time data.',
        tech: ['React', 'TypeScript'],
      },
      {
        title: 'Rocket Surgeon',
        blurb: 'Resolving customer issues in production — the rotation where you find out what your abstractions really cost.',
        tech: ['React', 'Jira'],
      },
    ],
  },
  {
    name: 'Infor PSSC',
    role: 'Software Engineer, Senior',
    period: '2020 — 2021',
    projects: [
      {
        title: 'FPLM',
        blurb: 'Fashion product lifecycle management — frontend and backend work on tooling for the fashion supply chain.',
        tech: ['React', 'C#', '.NET Core', 'SQL Server'],
      },
    ],
  },
  {
    name: 'Samsung R&D Institute Philippines',
    role: 'Engineer',
    period: '2019 — 2020',
    projects: [
      {
        title: 'Cognitiv Analytics UI Components',
        blurb: 'The shared component library behind the Cognitiv Analytics application.',
        tech: ['React'],
      },
      {
        title: 'Frontend Development',
        blurb: 'Application and feature development on a data analytics tool.',
        tech: ['React'],
      },
    ],
  },
  {
    name: 'BizBox',
    role: 'Full Stack Developer / Team Lead',
    period: '2015 — 2019',
    projects: [
      {
        title: 'Beacon / PhilHealth E-Claims',
        blurb: 'A claims portal used by Philippine hospitals to file with PhilHealth — the kind of software where a bug is somebody’s hospital bill.',
        tech: ['AngularJS', 'C#', '.NET', 'SQL Server'],
      },
      {
        title: 'QMeUp',
        blurb: 'Queue management for clinics and hospitals.',
        tech: ['React', 'Meteor', 'Node', 'MongoDB'],
      },
      {
        title: 'EHR',
        blurb: 'Electronic health records — patient data, built to be read quickly by people who are in a hurry.',
        tech: ['AngularJS', 'C#', '.NET', 'SQL Server'],
      },
    ],
  },
];
```

- [ ] **Step 6: Write `src/content/profile.ts`**

```ts
import type { Profile } from './types';

export const profile: Profile = {
  name: 'Kazuhito Higashioka',
  shortName: 'Kazu',
  tagline:
    'Senior software developer at EngageRocket, eleven years in, based in the Philippines. I care about the details nobody asked for.',
  about: [
    "I'm Kazu — a software developer from the Philippines. I've been doing this for eleven years, across healthcare claims portals, fashion supply chains, and now people analytics at EngageRocket.",
    'Mostly I build frontends, and mostly I care about the boring parts — the design system nobody notices, the test setup that stops a bug reaching someone’s Monday morning.',
  ],
  hobbies: [
    { name: 'Bouldering', blurb: 'Problems you solve with your whole body.' },
    { name: 'Running', blurb: 'Where most of my debugging actually happens.' },
    { name: 'Strength training', blurb: 'Slow, measurable progress. Very much my thing.' },
  ],
  email: 'kmhigashioka@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/kmhigashioka' },
    { label: 'dev.to', href: 'https://dev.to/kmhigashioka' },
    { label: 'Email', href: 'mailto:kmhigashioka@gmail.com' },
  ],
};
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 9 tests

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add typed project and profile content"
```

---

## Task 3: dev.to fetch with snapshot fallback

**Files:**
- Create: `src/lib/devto.ts`, `src/lib/devto.test.ts`, `src/content/devto-snapshot.json`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `interface Post { id: number; title: string; description: string; url: string; publishedAt: string; readingTimeMinutes: number; tags: string[]; coverImage: string | null }`
  - `fetchPosts(fetchImpl?: typeof fetch): Promise<Post[]>` — never throws, never returns an empty array

This is the only module in the site with real logic, and the only one that can break the build. It gets the most testing.

- [ ] **Step 1: Write the snapshot `src/content/devto-snapshot.json`**

Last known-good response, captured 2026-08-15.

```json
[
  {
    "id": 1746009,
    "title": "Streamlining development with mock API in React",
    "description": "Background   As a Frontend developer, before working on a new feature, it is important to...",
    "url": "https://dev.to/kmhigashioka/streamlining-development-with-mock-api-in-react-27m7",
    "publishedAt": "2024-01-30T13:51:20Z",
    "readingTimeMinutes": 7,
    "tags": ["react", "testing", "unittest", "vitest"],
    "coverImage": "https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fkj6e9etc7ys39nbqylsk.png"
  },
  {
    "id": 1731483,
    "title": "Unlocking Test Data Efficiency in React",
    "description": "When I was writing tests in previous React projects, I often faced this problem where \"test data\" was...",
    "url": "https://dev.to/kmhigashioka/unlocking-test-data-efficiency-in-react-422f",
    "publishedAt": "2024-01-16T16:49:43Z",
    "readingTimeMinutes": 4,
    "tags": ["react", "javascript", "jest", "unittest"],
    "coverImage": "https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F1274ouf2r48x7d8rux6f.png"
  }
]
```

- [ ] **Step 2: Write the failing test `src/lib/devto.test.ts`**

```ts
import { describe, expect, it, vi } from 'vitest';
import { fetchPosts } from './devto';
import snapshot from '../content/devto-snapshot.json';

const validApiPost = {
  id: 999,
  title: 'A Fresh Post',
  description: 'Something new.',
  url: 'https://dev.to/kmhigashioka/a-fresh-post',
  published_at: '2026-05-01T10:00:00Z',
  reading_time_minutes: 3,
  tag_list: ['astro', 'testing'],
  social_image: 'https://example.com/cover.png',
};

function respondWith(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as unknown as Response);
}

describe('fetchPosts', () => {
  it('maps a valid API response into Post objects', async () => {
    const posts = await fetchPosts(respondWith([validApiPost]) as unknown as typeof fetch);

    expect(posts).toHaveLength(1);
    expect(posts[0]).toEqual({
      id: 999,
      title: 'A Fresh Post',
      description: 'Something new.',
      url: 'https://dev.to/kmhigashioka/a-fresh-post',
      publishedAt: '2026-05-01T10:00:00Z',
      readingTimeMinutes: 3,
      tags: ['astro', 'testing'],
      coverImage: 'https://example.com/cover.png',
    });
  });

  it('falls back to the snapshot when the API returns 500', async () => {
    const posts = await fetchPosts(respondWith(null, false, 500) as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when the request throws', async () => {
    const failing = vi.fn().mockRejectedValue(new Error('network down'));
    const posts = await fetchPosts(failing as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when the response is not an array', async () => {
    const posts = await fetchPosts(respondWith({ error: 'nope' }) as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when the response is an empty array', async () => {
    const posts = await fetchPosts(respondWith([]) as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when a post is missing required fields', async () => {
    const posts = await fetchPosts(
      respondWith([{ id: 1, description: 'no title or url' }]) as unknown as typeof fetch,
    );
    expect(posts).toEqual(snapshot);
  });

  it('falls back to the snapshot when json parsing throws', async () => {
    const broken = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('unexpected token');
      },
    } as unknown as Response);
    const posts = await fetchPosts(broken as unknown as typeof fetch);
    expect(posts).toEqual(snapshot);
  });

  it('tolerates missing optional fields without falling back', async () => {
    const minimal = { id: 5, title: 'Minimal', url: 'https://dev.to/x/minimal' };
    const posts = await fetchPosts(respondWith([minimal]) as unknown as typeof fetch);

    expect(posts).toHaveLength(1);
    expect(posts[0].description).toBe('');
    expect(posts[0].tags).toEqual([]);
    expect(posts[0].coverImage).toBeNull();
    expect(posts[0].readingTimeMinutes).toBe(1);
  });

  it('never returns an empty array', async () => {
    const posts = await fetchPosts(respondWith([]) as unknown as typeof fetch);
    expect(posts.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./devto`

- [ ] **Step 4: Write `src/lib/devto.ts`**

```ts
import snapshot from '../content/devto-snapshot.json';

export interface Post {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  readingTimeMinutes: number;
  tags: string[];
  coverImage: string | null;
}

const ENDPOINT = 'https://dev.to/api/articles?username=kmhigashioka&per_page=30';
const TIMEOUT_MS = 5000;

const FALLBACK: Post[] = snapshot as Post[];

function toPost(raw: unknown): Post | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const a = raw as Record<string, unknown>;

  if (typeof a.id !== 'number') return null;
  if (typeof a.title !== 'string' || a.title.length === 0) return null;
  if (typeof a.url !== 'string' || a.url.length === 0) return null;

  return {
    id: a.id,
    title: a.title,
    description: typeof a.description === 'string' ? a.description : '',
    url: a.url,
    publishedAt: typeof a.published_at === 'string' ? a.published_at : '',
    readingTimeMinutes:
      typeof a.reading_time_minutes === 'number' ? a.reading_time_minutes : 1,
    tags: Array.isArray(a.tag_list)
      ? a.tag_list.filter((t): t is string => typeof t === 'string')
      : [],
    coverImage: typeof a.social_image === 'string' ? a.social_image : null,
  };
}

function normalise(raw: unknown): Post[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const posts: Post[] = [];
  for (const item of raw) {
    const post = toPost(item);
    if (post === null) return null;
    posts.push(post);
  }
  return posts;
}

/**
 * Fetches published dev.to posts at build time.
 *
 * Never throws and never returns an empty array. Any failure — non-OK status,
 * network error, timeout, malformed body, empty list — falls back to the
 * committed snapshot so the build cannot be broken by a third-party outage.
 */
export async function fetchPosts(fetchImpl: typeof fetch = fetch): Promise<Post[]> {
  try {
    const response = await fetchImpl(ENDPOINT, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return FALLBACK;

    return normalise(await response.json()) ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all 9 `fetchPosts` tests plus the 9 content tests from Task 2

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: fetch dev.to posts with snapshot fallback"
```

---

## Task 4: Base layout, nav, footer, redirects

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`
- Modify: `vercel.json`, `src/pages/index.astro`

**Interfaces:**
- Consumes: `profile` from `src/content/profile.ts`; tokens from `theme.css`
- Produces: `Base.astro` accepting props `{ title: string; description: string; wide?: boolean }`, rendering `<slot />` inside `<main>`

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
import { profile } from '../content/profile';

const { pathname } = Astro.url;
const links = [
  { href: '/work', label: 'work' },
  { href: '/writing', label: 'writing' },
  { href: '/about', label: 'about' },
];
---

<nav aria-label="Main" class="flex items-center justify-between py-8">
  <a href="/" class="font-display text-lg font-black tracking-tight text-ink no-underline">
    {profile.shortName.toLowerCase()}
  </a>
  <ul class="flex list-none gap-5 p-0 text-sm">
    {links.map(({ href, label }) => (
      <li>
        <a
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          class:list={[
            'no-underline',
            pathname === href ? 'font-bold text-ink' : 'font-medium text-ink-muted',
          ]}
        >
          {label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

```astro
---
import { profile } from '../content/profile';
---

<footer class="mt-20 border-t border-border-warm py-8 text-sm text-ink-muted">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <p class="m-0">&copy; {new Date().getFullYear()} {profile.name}</p>
    <ul class="flex list-none gap-4 p-0">
      {profile.links.map(({ label, href }) => (
        <li>
          <a href={href} class="font-semibold text-accent-deep no-underline">{label}</a>
        </li>
      ))}
    </ul>
  </div>
</footer>
```

- [ ] **Step 3: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/theme.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
    <link rel="icon" href="/favicon.ico" sizes="any" />
  </head>
  <body class="bg-paper text-ink">
    <div class="mx-auto w-full max-w-(--spacing-content) px-6">
      <Nav />
      <main><slot /></main>
      <Footer />
    </div>
  </body>
</html>
```

- [ ] **Step 4: Rewrite `src/pages/index.astro` to use the layout**

```astro
---
import Base from '../layouts/Base.astro';
import { profile } from '../content/profile';
---

<Base title={profile.name} description={profile.tagline}>
  <h1 class="text-4xl">{profile.name}</h1>
</Base>
```

- [ ] **Step 5: Rewrite `vercel.json` with the redirects**

The old `/my-work` and `/contact-me` URLs are already in the world and must not 404.

```json
{
  "redirects": [
    { "source": "/my-work", "destination": "/work", "permanent": true },
    { "source": "/contact-me", "destination": "/about", "permanent": true }
  ]
}
```

- [ ] **Step 6: Copy the favicon into place**

The Remix `public/favicon.ico` survives the strip in Task 1 because `public/` was not deleted. Confirm it is there.

Run: `ls public/favicon.ico`
Expected: the path prints

- [ ] **Step 7: Build and verify the shell renders**

Run: `npm run build && node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); for(const s of ['Kazuhito Higashioka','href=\"/work\"','href=\"/writing\"','href=\"/about\"','github.com/kmhigashioka']) if(!h.includes(s)) throw new Error('missing: '+s); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add base layout, nav, footer and legacy redirects"
```

---

## Task 5: Home page — the front door

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Base.astro`, `profile`
- Produces: nothing consumed by later tasks

The homepage is one screen with no scrolling: name, one sentence, mark, three page links, social row. The `#EE6C1F` accent appears only on the large `h1` fragment and the decorative mark; the social links use `#B4470A`.

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { profile } from '../content/profile';

const pages = [
  { href: '/work', label: 'See my work', primary: true },
  { href: '/writing', label: 'Writing', primary: false },
  { href: '/about', label: 'About me', primary: false },
];
---

<Base title={profile.name} description={profile.tagline}>
  <div class="flex flex-col items-start gap-10 py-10 md:flex-row md:items-center md:gap-14 md:py-16">
    <div class="flex-[1.7]">
      <h1 class="text-4xl leading-[1.03] sm:text-5xl">
        Hi, I'm {profile.shortName}.<br />
        I build software<br />
        <span class="text-accent">for humans.</span>
      </h1>

      <p class="mt-5 max-w-(--spacing-prose) text-base leading-relaxed text-ink-muted">
        {profile.tagline}
      </p>

      <div class="mt-8 flex flex-wrap gap-2.5">
        {pages.map(({ href, label, primary }) => (
          <a
            href={href}
            class:list={[
              'rounded-full px-5 py-3 text-sm font-bold no-underline',
              primary
                ? 'bg-ink text-paper'
                : 'border-[1.5px] border-border-warm text-ink',
            ]}
          >
            {label}
          </a>
        ))}
      </div>

      <ul class="mt-6 flex list-none flex-wrap gap-4 p-0 text-sm">
        {profile.links.map(({ label, href }) => (
          <li>
            <a href={href} class="font-semibold text-accent-deep no-underline">{label}</a>
          </li>
        ))}
      </ul>
    </div>

    <div class="flex flex-1 justify-center">
      <div class="relative h-[150px] w-[150px] rounded-full bg-sun" aria-hidden="true">
        <div class="absolute inset-0 rounded-full bg-accent [clip-path:inset(0_0_0_50%)]"></div>
        <div class="absolute -bottom-3.5 -left-5 h-[60px] w-[60px] rounded-full bg-counter"></div>
      </div>
    </div>
  </div>
</Base>
```

- [ ] **Step 2: Build and verify the content is present**

Run: `npm run build && node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); for(const s of ['I build software','for humans','See my work','mailto:kmhigashioka@gmail.com']) if(!h.includes(s)) throw new Error('missing: '+s); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 3: Verify social links use the accessible accent**

Run: `node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); if(!h.includes('text-accent-deep')) throw new Error('social links must use accent-deep'); console.log('ok')"`
Expected: prints `ok`

Contrast itself is verified properly by the axe pass in Task 9. This step only catches the obvious mistake of styling the small social links with `text-accent`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add front-door homepage"
```

---

## Task 6: Work page

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/pages/work.astro`

**Interfaces:**
- Consumes: `employers` from `src/content/projects.ts`; `Project` type from `src/content/types.ts`
- Produces: `ProjectCard.astro` accepting props `{ project: Project }`

- [ ] **Step 1: Write `src/components/ProjectCard.astro`**

```astro
---
import type { Project } from '../content/types';

interface Props {
  project: Project;
}

const { project } = Astro.props;
---

<article class="rounded-(--radius-card) border border-border-warm bg-surface p-5">
  {project.image ? (
    <img
      src={project.image}
      alt=""
      loading="lazy"
      width="400"
      height="112"
      class="mb-3 h-14 w-full rounded-lg object-cover"
    />
  ) : (
    <div
      class="mb-3 h-14 w-full rounded-lg bg-linear-to-br from-sun/40 to-accent/25"
      aria-hidden="true"
    ></div>
  )}

  <h3 class="text-lg">
    {project.link ? (
      <a href={project.link} class="text-ink no-underline hover:text-accent-deep">
        {project.title}
      </a>
    ) : (
      project.title
    )}
  </h3>

  <p class="mt-1.5 text-sm leading-relaxed text-ink-muted">{project.blurb}</p>

  <ul class="mt-3 flex list-none flex-wrap gap-1.5 p-0">
    {project.tech.map((tech) => (
      <li class="rounded-full border border-border-warm px-2.5 py-1 text-xs font-semibold text-ink-muted">
        {tech}
      </li>
    ))}
  </ul>
</article>
```

- [ ] **Step 2: Write `src/pages/work.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { employers } from '../content/projects';

const total = employers.reduce((n, e) => n + e.projects.length, 0);
---

<Base
  title="Work — Kazuhito Higashioka"
  description="Ten projects across four companies and eleven years of software development."
>
  <header class="py-8">
    <h1 class="text-3xl sm:text-4xl">Things I've built</h1>
    <p class="mt-2 text-base text-ink-muted">
      {total} projects, {employers.length} companies, eleven years.
    </p>
  </header>

  {employers.map((employer) => (
    <section class="mt-10">
      <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 class="text-xl">{employer.name}</h2>
        <p class="m-0 text-sm text-ink-muted">{employer.role} · {employer.period}</p>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        {employer.projects.map((project) => <ProjectCard project={project} />)}
      </div>
    </section>
  ))}
</Base>
```

- [ ] **Step 3: Build and verify every project rendered**

Run: `npm run build && node -e "const h=require('fs').readFileSync('dist/work/index.html','utf8'); for(const s of ['PerformAI','Nebula','Rocket Surgeon','FPLM','Cognitiv Analytics UI Components','Beacon / PhilHealth E-Claims','QMeUp','EHR','10 projects','engagerocket.co/performai']) if(!h.includes(s)) throw new Error('missing: '+s); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add work page with project cards"
```

---

## Task 7: Writing page

**Files:**
- Create: `src/components/PostCard.astro`, `src/pages/writing.astro`

**Interfaces:**
- Consumes: `fetchPosts` and `Post` from `src/lib/devto.ts`
- Produces: `PostCard.astro` accepting props `{ post: Post }`

Cards are **wide and horizontal**, not a vertical grid. With two posts a grid leaves a visible hole; horizontal cards fill the row and look deliberate. This is a spec requirement, not a preference.

- [ ] **Step 1: Write `src/components/PostCard.astro`**

```astro
---
import type { Post } from '../lib/devto';

interface Props {
  post: Post;
}

const { post } = Astro.props;

const published = post.publishedAt
  ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  : null;
---

<article class="flex flex-col gap-4 rounded-(--radius-card) border border-border-warm bg-surface p-5 sm:flex-row sm:items-center">
  <div class="flex-1">
    <p class="m-0 text-xs font-semibold text-ink-muted">
      {published && <span>{published}</span>}
      {published && <span aria-hidden="true"> · </span>}
      <span>{post.readingTimeMinutes} min read</span>
    </p>

    <h2 class="mt-1.5 text-xl">
      <a href={post.url} class="text-ink no-underline hover:text-accent-deep">
        {post.title}
      </a>
    </h2>

    {post.description && (
      <p class="mt-1.5 text-sm leading-relaxed text-ink-muted">{post.description}</p>
    )}

    {post.tags.length > 0 && (
      <ul class="mt-3 flex list-none flex-wrap gap-1.5 p-0">
        {post.tags.map((tag) => (
          <li class="rounded-full border border-border-warm px-2.5 py-1 text-xs font-semibold text-ink-muted">
            {tag}
          </li>
        ))}
      </ul>
    )}
  </div>

  {post.coverImage && (
    <img
      src={post.coverImage}
      alt=""
      loading="lazy"
      width="200"
      height="118"
      class="h-[118px] w-full shrink-0 rounded-lg object-cover sm:w-[200px]"
    />
  )}
</article>
```

- [ ] **Step 2: Write `src/pages/writing.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import PostCard from '../components/PostCard.astro';
import { fetchPosts } from '../lib/devto';
import { profile } from '../content/profile';

const posts = await fetchPosts();
const devtoUrl = profile.links.find((l) => l.label === 'dev.to')!.href;
---

<Base
  title="Writing — Kazuhito Higashioka"
  description="Posts about React, testing, and the parts of frontend development that bite."
>
  <header class="py-8">
    <h1 class="text-3xl sm:text-4xl">Writing</h1>
    <p class="mt-2 max-w-(--spacing-prose) text-base text-ink-muted">
      I write on dev.to, mostly about testing and the parts of React that bite.
      These open there.
    </p>
  </header>

  <div class="grid gap-3">
    {posts.map((post) => <PostCard post={post} />)}
  </div>

  <p class="mt-6">
    <a href={devtoUrl} class="text-sm font-semibold text-accent-deep no-underline">
      All posts on dev.to →
    </a>
  </p>
</Base>
```

- [ ] **Step 3: Build and verify posts rendered**

Run: `npm run build && node -e "const h=require('fs').readFileSync('dist/writing/index.html','utf8'); for(const s of ['Streamlining development with mock API in React','Unlocking Test Data Efficiency in React','min read','dev.to/kmhigashioka']) if(!h.includes(s)) throw new Error('missing: '+s); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 4: Verify the build survives dev.to being unreachable — MANUAL**

The fallback logic itself is covered by the seven failure-path unit tests in Task 3. What those cannot prove is that a real `npm run build` survives a real outage, and there is no reliable cross-platform way to fake a DNS blackhole from inside a build script. So this step is manual and must actually be performed:

1. Disconnect the machine from the network (turn off Wi-Fi).
2. Run `npm run build`.
3. Confirm the build **succeeds** rather than hanging or erroring.
4. Confirm `dist/writing/index.html` still lists both snapshot posts.
5. Reconnect.

Expected: build completes, `/writing` shows "Streamlining development with mock API in React" and "Unlocking Test Data Efficiency in React".

> Do not skip this and do not substitute a fake command for it. A green unit suite with a build that hangs for five seconds and then dies on a plane is exactly the failure this design exists to prevent.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add writing page backed by dev.to"
```

---

## Task 8: About page

**Files:**
- Create: `src/components/HobbyCard.astro`, `src/pages/about.astro`

**Interfaces:**
- Consumes: `profile`, `Hobby` type
- Produces: `HobbyCard.astro` accepting props `{ hobby: Hobby; accent: string }`, where `accent` is a Tailwind background class applied to the card's decorative swatch

`/about` is the longest page and carries the personality the front-door homepage deliberately omits.

- [ ] **Step 1: Write `src/components/HobbyCard.astro`**

```astro
---
import type { Hobby } from '../content/types';

interface Props {
  hobby: Hobby;
  accent: string;
}

const { hobby, accent } = Astro.props;
---

<article class="rounded-(--radius-card) border border-border-warm bg-surface p-5">
  <div class={`mb-3 h-8 w-8 rounded-lg ${accent}`} aria-hidden="true"></div>
  <h3 class="text-base">{hobby.name}</h3>
  <p class="mt-1 text-sm leading-relaxed text-ink-muted">{hobby.blurb}</p>
</article>
```

- [ ] **Step 2: Write `src/pages/about.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import HobbyCard from '../components/HobbyCard.astro';
import { profile } from '../content/profile';

const accents = ['bg-sun/30', 'bg-counter/20', 'bg-accent/20'];
---

<Base
  title="About — Kazuhito Higashioka"
  description="A software developer from the Philippines, eleven years in."
>
  <div class="flex flex-col gap-8 py-8 md:flex-row md:gap-12">
    <div class="flex-[1.6]">
      <h1 class="text-3xl sm:text-4xl">About me</h1>
      {profile.about.map((paragraph) => (
        <p class="mt-4 max-w-(--spacing-prose) text-base leading-loose">{paragraph}</p>
      ))}
    </div>

    <div class="flex-1">
      <div
        class="aspect-square w-full rounded-2xl bg-linear-to-br from-sun to-accent"
        aria-hidden="true"
      ></div>
    </div>
  </div>

  <section class="mt-10 border-t border-border-warm pt-8">
    <h2 class="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
      Away from the keyboard
    </h2>
    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      {profile.hobbies.map((hobby, i) => (
        <HobbyCard hobby={hobby} accent={accents[i % accents.length]} />
      ))}
    </div>
  </section>

  <section class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-warm pt-8">
    <div>
      <h2 class="text-lg">Say hi</h2>
      <p class="mt-1 text-sm text-ink-muted">{profile.email}</p>
    </div>
    <ul class="flex list-none flex-wrap gap-2.5 p-0">
      {profile.links.map(({ label, href }) => (
        <li>
          <a
            href={href}
            class="rounded-full border-[1.5px] border-border-warm px-4 py-2.5 text-sm font-bold text-ink no-underline"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </section>
</Base>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && node -e "const h=require('fs').readFileSync('dist/about/index.html','utf8'); for(const s of ['About me','Bouldering','Running','Strength training','Away from the keyboard','kmhigashioka@gmail.com']) if(!h.includes(s)) throw new Error('missing: '+s); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 4: Run type checking across the whole site**

Run: `npm run check`
Expected: 0 errors. Warnings about unused CSS are acceptable; type errors are not.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add about page with hobbies and contact"
```

---

## Task 9: End-to-end smoke tests and accessibility

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: the built site
- Produces: nothing consumed by later tasks

This is where the two-tangerine contrast decision gets verified rather than trusted.

- [ ] **Step 1: Install the Playwright browser**

Run: `npx playwright install chromium`
Expected: chromium downloads successfully

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Write the failing test `tests/e2e/site.spec.ts`**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', heading: /I build software/ },
  { path: '/work', heading: /Things I've built/ },
  { path: '/writing', heading: /^Writing$/ },
  { path: '/about', heading: /About me/ },
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
```

- [ ] **Step 4: Run the E2E suite**

Run: `npm run test:e2e`
Expected: all tests PASS.

> If the colour-contrast rule fails, **fix the colour, not the test.** Any text below 24px using `#EE6C1F` must move to `#B4470A`. That is the entire reason two tangerines exist.

- [ ] **Step 5: Run the full test suite**

Run: `npm test && npm run test:e2e`
Expected: 18 unit tests PASS, all E2E tests PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: add e2e smoke tests and axe accessibility checks"
```

---

## Task 10: Scheduled refresh, README, and final verification

**Files:**
- Create: `.github/workflows/refresh.yml`, `README.md` (overwrite)

**Interfaces:**
- Consumes: everything
- Produces: nothing

> **Deviation from the spec, deliberate.** The spec says "a daily Vercel cron calls a deploy hook." Vercel Cron Jobs require a serverless function endpoint to invoke, and this site is fully static with no functions — so Vercel Cron cannot be used without reintroducing a server. A scheduled GitHub Actions workflow calling the Vercel Deploy Hook achieves the identical outcome with no server. The spec's intent is preserved; the mechanism differs.

- [ ] **Step 1: Write `.github/workflows/refresh.yml`**

```yaml
name: Refresh site

on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel deploy hook
        env:
          HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK }}
        run: |
          if [ -z "$HOOK" ]; then
            echo "VERCEL_DEPLOY_HOOK secret is not set" >&2
            exit 1
          fi
          curl --fail --silent --show-error -X POST "$HOOK"
```

- [ ] **Step 2: Overwrite `README.md`**

````markdown
# kazuhito.dev

Personal site. Static [Astro](https://astro.build) build, deployed on Vercel.

## Develop

```sh
npm install
npm run dev
```

## Test

```sh
npm test          # unit tests (Vitest)
npm run test:e2e  # smoke + accessibility (Playwright)
npm run check     # TypeScript
```

## Content

Everything editable lives in `src/content/`:

- `projects.ts` — work history and projects
- `profile.ts` — intro, about copy, hobbies, links

Edit, commit, push. Vercel rebuilds.

## Writing

Posts are fetched from the dev.to API at build time. They are **not** stored here.

`src/content/devto-snapshot.json` is a committed fallback used whenever the API
is unreachable, so a dev.to outage can never break a build or empty the writing
page. Refresh it occasionally by copying a good API response.

A daily GitHub Actions workflow calls a Vercel deploy hook so new dev.to posts
appear without manual action. It needs a `VERCEL_DEPLOY_HOOK` repository secret.

## Colour

`#EE6C1F` measures ~3.0:1 on the page background — large bold display type only.
Links and any text under 24px use `#B4470A` at ~5.4:1. The axe checks in
`tests/e2e/site.spec.ts` enforce this.
````

- [ ] **Step 3: Confirm no Remix or Supabase remnants survive**

Run: `grep -rIl --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=docs -e remix -e supabase . || echo "clean"`
Expected: prints `clean`

- [ ] **Step 4: Run everything one final time**

Run: `npm run check && npm test && npm run build && npm run test:e2e`
Expected: all pass

- [ ] **Step 5: Commit and push the branch**

```bash
git add -A
git commit -m "chore: add scheduled refresh workflow and README"
git push -u origin redesign
```

- [ ] **Step 6: Manual verification before merge**

These cannot be automated and must be done by a human:

1. Open the Vercel preview URL on a phone. Confirm the homepage fits one screen without scrolling and nothing overflows horizontally.
2. Visit `/my-work` and `/contact-me` on the preview. Both must redirect, not 404.
3. Create the Vercel Deploy Hook and add it as the `VERCEL_DEPLOY_HOOK` repository secret, then run the workflow manually via `workflow_dispatch` and confirm a deploy is triggered.
4. Disconnect from the network and run `npm run build`. It must succeed with both snapshot posts on `/writing`.
5. Confirm the three open questions from the spec are resolved or consciously deferred: LinkedIn, final copy, and a real photograph in place of the gradient blocks on `/` and `/about`.

---

## Open items carried from the spec

These are **not** blockers for implementation, but the site ships incomplete without a decision:

- **LinkedIn** — not currently in `profile.ts`. Adding it is one entry in the `links` array.
- **Copy** — the homepage sentence, tagline, project blurbs and hobby taglines in Task 2 are drafted, not final. They are all in `src/content/`, so revising them touches no markup.
- **Photography** — `/` uses a decorative circle mark and `/about` uses a gradient block where a photograph belongs. Either supply images or accept the shapes as permanent.
