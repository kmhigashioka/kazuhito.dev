# kazuhito.dev — Personal Website Redesign

**Date:** 2026-08-15
**Status:** Approved design, ready for implementation planning

## Summary

Replace the existing Remix site with a static Astro site: a front-door homepage plus three pages (`/work`, `/writing`, `/about`). Content lives in typed data files in the repo. Writing stays on dev.to and is pulled in at build time. No database, no CMS, no server, no environment variables.

## Why

The current site is five years old on every axis at once. Remix 1.0, React 17 and Tailwind 2 date from late 2021. The content stops at 2021 and understates experience by four years. The visual design leans entirely on one violet accent and decorative circles. And the three-page structure has nowhere to put writing, project detail, or anything personal.

The site's job is to be a personal home base — a place that belongs to Kazu — rather than a conversion funnel for recruiters or clients. That decision drives everything below: personality is prioritised over lead capture, and the contact form is removed rather than modernised.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Astro 7.2.x | Content site that ships zero JS by default. React available for islands if ever needed. |
| Styling | Tailwind 4.3.x | CSS-first config; design tokens live in an `@theme` block. No `tailwind.config.js`. |
| Output | Fully static | No server, no secrets, no runtime cost, nothing to break unattended. |
| Content source | Typed data files in repo | Projects and profile copy as TypeScript. Edit, commit, deploy. |
| Writing | Link out to dev.to | Posts are not mirrored. The site lists them and links to dev.to. |
| Contact | Email and social links | Contact form, Supabase and email sending are removed entirely. |
| Dark mode | Not built | The palette is built on warm cream; a dark variant needs a second palette designed from scratch. |
| Deployment | Branch first, same repo | `redesign` branch with Vercel previews, merged to `main` when approved. |

## Structure

| Route | Contents |
|---|---|
| `/` | Front door. Name, one-sentence intro, photo/mark, three page links, social row. One screen, no scrolling. |
| `/work` | Ten projects as rich cards, grouped by employer with role and dates. No per-project pages. |
| `/writing` | dev.to posts as wide horizontal cards. Each links to dev.to. |
| `/about` | Story, three hobby cards, contact and socials. |

`/about` is the longest and most personal page. Because the homepage is deliberately a front door, `/about` carries the personality the homepage does not.

`/writing` is designed to look intentional with only two posts: wide horizontal cards that fill the row. A vertical grid would leave a visible hole. The page grows correctly as posts are added, because it renders whatever the API returns.

### Redirects

The current live URLs must not break:

- `/my-work` → `/work` (permanent)
- `/contact-me` → `/about` (permanent)

These are configured in `vercel.json`, which is therefore rewritten rather than deleted. A static Astro build has no adapter, and Astro's own `redirects` option emits meta-refresh HTML pages rather than real 301s, so the redirect belongs at the platform layer.

## Visual design

Direction: warm and playful, executed with restraint. Personality comes from typeface and colour so the layout can stay calm.

### Type

- **Display and headings:** Gabarito (600 / 800 / 900)
- **Body and UI:** Schibsted Grotesk (400 / 500 / 700)

Both self-hosted at build time. No third-party font request at runtime.

### Colour — "Citrus"

| Token | Value | Use |
|---|---|---|
| `paper` | `#FFFBF2` | Page background |
| `surface` | `#FFFFFF` | Cards |
| `ink` | `#191410` | Primary text |
| `ink-muted` | `#6B6058` | Secondary text |
| `border` | `#E5D9C7` | Hairlines, card edges |
| `accent` | `#EE6C1F` | Large display type, fills, shapes |
| `accent-deep` | `#B4470A` | Links and small accent text |
| `counter` | `#2E7D6E` | Second note, used sparingly |
| `sun` | `#F7C948` | Warm highlight, shapes only |

**Two tangerines is deliberate.** `#EE6C1F` on `paper` measures roughly 3.0:1 — sufficient for large bold display type, insufficient for body copy and links. Small accent text and links use `#B4470A` at roughly 5.4:1. Same colour family, no visible seam, readable throughout. The accessibility test suite verifies this rather than trusting it.

### Other tokens

- Spacing: 4px base, 8-point rhythm
- Radius: 14px cards, full pills on buttons, 12px images
- Elevation: borders preferred over shadows; one soft shadow, used rarely
- Widths: 68rem max content, 44rem max prose
- Motion: minimal, and respects `prefers-reduced-motion`

The decorative circles from the old site survive as a single mark on the homepage rather than four shapes scattered across the viewport.

## Content model

Content is typed data, not markdown and not a CMS.

**`src/content/projects.ts`**

```ts
interface Project {
  title: string
  blurb: string
  employer: string
  year: string
  tech: string[]
  image?: string
  link?: string
}
```

Ten projects across four employers:

- **EngageRocket** (Senior Software Developer, 2021–now): PerformAI, Nebula, Frontend Development, Rocket Surgeon
- **Infor PSSC** (Software Engineer, Senior): FPLM
- **Samsung R&D Institute Philippines** (Engineer): Cognitiv Analytics UI Components, Frontend Development
- **BizBox** (Full Stack Developer / Team Lead): Beacon / PhilHealth E-Claims, QMeUp, EHR

PerformAI links to https://www.engagerocket.co/performai-performance-management

**`src/content/profile.ts`** holds the intro sentence, about copy, hobbies (Bouldering, Running, Strength training) and links.

**Links:** GitHub (`kmhigashioka`), dev.to (`kmhigashioka`), email (`kmhigashioka@gmail.com`).

## dev.to integration

Source: `https://dev.to/api/articles?username=kmhigashioka`, fetched at build time.

Per post the page renders: title, description, published date, reading time, tags, cover image, and a link to the dev.to URL.

Two requirements, both non-negotiable for a site that should never need attention:

1. **Snapshot fallback.** A committed `src/content/devto-snapshot.json` holds the last known-good post list. If the API is down, rate-limits, times out, or returns something malformed, the build uses the snapshot. The build must never fail and must never ship an empty writing page because of a third-party outage.
2. **Scheduled rebuild.** Build-time fetching means new posts do not appear until the site rebuilds. A daily Vercel cron calls a deploy hook so new writing appears without manual action.

As of 2026-08-15 the API returns two published posts, both from January 2024.

## Repository

```
src/
  content/     projects.ts, profile.ts, devto-snapshot.json
  lib/         devto.ts
  components/  Nav, Footer, ProjectCard, PostCard, HobbyCard
  layouts/     Base.astro
  pages/       index.astro, work.astro, writing.astro, about.astro
  styles/      theme.css
```

Components stay small and single-purpose: each takes typed props, renders one thing, and can be understood without reading its siblings.

### Removed

`app/`, `api/`, `remix.config.js`, `remix.env.d.ts`, `tailwind.config.js`, `tailwindcss/`, the Supabase client, the email utility, `.env.example`, and the leftover Remix demo routes under `app/routes/demos/`.

`vercel.json` is rewritten, not removed — it carries the redirects above.

All of it remains in git history.

## Testing

Testing is scaled to real risk. Most of this site is static markup that either renders or does not, and exhaustively asserting on it would be theatre. Two areas carry genuine risk:

**Unit tests (Vitest) — `lib/devto.ts`.** The only module with real logic:

- API returns valid posts → posts are used
- API returns 500 → snapshot is used
- Network times out → snapshot is used
- Response is malformed → snapshot is used
- Response is an empty array → snapshot is used
- Fetch never throws out of the module

**End-to-end (Playwright).** One smoke run:

- All four pages render with expected headings
- Navigation reaches every page
- `/my-work` and `/contact-me` redirect correctly
- External links point at the expected URLs
- No console errors
- An axe accessibility pass on each page, which verifies the contrast decisions above

## Deployment

1. Work on a `redesign` branch.
2. Vercel builds a preview on every push.
3. Merge to `main` once approved; the existing domain and Vercel project are reused.
4. Add a Vercel cron that calls a deploy hook daily to refresh dev.to posts.

The current site stays live throughout.

## Open questions

- **LinkedIn.** Not currently included. Adding it is a one-line change to `profile.ts`; awaiting a decision.
- **Copy.** All body copy in the mockups is draft, including the homepage sentence and the hobby taglines. Final wording is to be confirmed during implementation. The homepage sentence carries disproportionate weight given the front-door structure and deserves real attention.
- **Photography.** The mockups use coloured shapes where a photo of Kazu would sit on `/` and `/about`. A real photo is needed, or the shapes become the permanent choice.

## Out of scope

Blog hosting, markdown or MDX pipeline, per-project detail pages, contact form, dark mode, a "now" page, a uses page, RSS, and analytics. Each was considered and deliberately excluded.
