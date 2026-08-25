# kazuhito.dev

Personal site. Static [Astro](https://astro.build) build, deployed on Vercel.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

This runs `scripts/build.mjs`, not `astro build` directly. Do not replace it
with plain `astro build`. It's load-bearing, not indirection:

- It removes `dist/` before every build, so a failed build can never leave
  stale output behind.
- On Windows, `astro build` writes correct output and then crashes on
  process exit with a libuv assertion (`src\win\async.c`) and a non-zero
  exit code, a Node bug (confirmed on Node 24.15.0 and 24.19.0) triggered
  by Astro's CLI calling `process.exit()` after the build-time dev.to fetch,
  not a project defect. On that platform only, a non-zero exit hands off to
  `scripts/verify-build.mjs`, which passes only if all four pages exist, are
  non-empty, and contain expected content markers. On Linux, including
  Vercel, `astro build`'s exit code is trusted unconditionally.

Adding a new page means adding it to the `EXPECTED` list in
`scripts/verify-build.mjs`, or the guard silently stops covering it.

`vercel.json` pins `framework`, `buildCommand` and `outputDirectory`. That is
deliberate: this Vercel project was created in 2021 for a Remix app, and its
dashboard Framework Preset was still set to Remix, so the first deploy of this
rewrite failed with `Failed to resolve "@remix-run/dev"`, building the wrong
framework entirely. Settings in `vercel.json` override the dashboard, so the
repo now decides how it is built. Don't remove them expecting auto-detection to
cover it.

## Test

```sh
npm test          # unit tests (Vitest)
npm run test:e2e  # smoke + accessibility (Playwright)
npm run check     # TypeScript
```

## Content

Everything editable lives in `src/content/`:

- `projects.ts`: work history and projects
- `profile.ts`: intro, about copy, hobbies, links

Edit, commit, push. Vercel rebuilds.

## Writing

Posts are fetched from the dev.to API at build time. They are **not** stored here.

`src/content/devto-snapshot.json` is a committed fallback used whenever the API
is unreachable, so a dev.to outage can never break a build or empty the writing
page. It holds the **normalised `Post` shape** used throughout the app
(`id`, `title`, `description`, `url`, `publishedAt`, `readingTimeMinutes`,
`tags`, `coverImage`), **not** a raw copy of a dev.to API response. The API's
field names differ (`published_at`, `reading_time_minutes`, `tag_list`,
`social_image`), so refreshing the snapshot means updating it with the
*normalised* fields, not pasting the API response verbatim. A unit test in
`src/lib/devto.test.ts` checks every snapshot entry against the `Post` shape;
run `npm test` after editing it.

A daily GitHub Actions workflow calls a Vercel deploy hook so new dev.to posts
appear without manual action. It needs a `VERCEL_DEPLOY_HOOK` repository secret.

## Colour

`#EE6C1F` measures 2.99:1 on the page background, below WCAG's 3:1 floor even
for large text, so it is used for fills and decorative shapes only, never text.
All accent text and links use `#B4470A` at ~5.4:1. The axe checks in
`tests/e2e/site.spec.ts` enforce this, and caught the one place the rule was
broken.
