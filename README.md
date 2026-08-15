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

`#EE6C1F` measures 2.99:1 on the page background — below WCAG's 3:1 floor even
for large text, so it is used for fills and decorative shapes only, never text.
All accent text and links use `#B4470A` at ~5.4:1. The axe checks in
`tests/e2e/site.spec.ts` enforce this; they caught the one place it was got
wrong.
