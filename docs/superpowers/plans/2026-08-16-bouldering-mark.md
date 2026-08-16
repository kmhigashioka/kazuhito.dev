# Bouldering Mark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three decorative circles on `/` and `/404` with a single shared bouldering mark, and ship it as an SVG favicon.

**Architecture:** One `Mark.astro` component owns the geometry so both pages cannot drift apart. It fills from the existing `@theme` colour variables rather than hardcoded hex, so the mark follows the palette. A separate `public/favicon.svg` carries a reduced two-facet version, because the hold is illegible at 16px.

**Tech Stack:** Astro 7, Tailwind 4 (CSS-first `@theme`), Playwright, Vitest.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-16-bouldering-mark-design.md`
- Mark viewBox is exactly `0 0 102 96`. Do not re-fit or re-centre it.
- Facet offsets `translate(-6 3)` and `translate(5 -2)` are the treatment itself, not padding. Do not "tidy" them to zero.
- The mark is decorative: always `aria-hidden="true"`, never given an accessible name, title or `role="img"`.
- Colours come from `var(--color-sun)`, `var(--color-accent)`, `var(--color-counter)` in components. Only `public/favicon.svg` hardcodes hex, because a standalone file has no access to the theme variables.
- No motion on the mark. Do not add transitions, transforms or hover states.
- The e2e suite asserts `/work` has exactly 10 `<article>` elements. Do not add `<article>` anywhere.
- Never skip hooks or use `--no-verify`.

---

### Task 1: Mark component, used on the homepage

**Files:**
- Create: `src/components/Mark.astro`
- Modify: `src/pages/index.astro:65-73` (the circle mark block)
- Test: `tests/e2e/site.spec.ts`

**Interfaces:**
- Produces: `Mark.astro` with `interface Props { size?: number; class?: string }`, default `size = 150`. Renders a single `<svg data-mark …>`. Task 2 imports this same component; do not create a second one.

- [ ] **Step 1: Write the failing test**

Add to `tests/e2e/site.spec.ts`, after the `work page lists all ten projects` test:

```ts
test('the mark is decorative and appears once per page that uses it', async ({ page }) => {
  await page.goto('/');
  const mark = page.locator('[data-mark]');
  await expect(mark).toHaveCount(1);
  await expect(mark).toHaveAttribute('aria-hidden', 'true');

  // The mark carries no information the copy does not already give, so it
  // must contribute no accessible name.
  expect(await mark.evaluate((el) => el.textContent?.trim())).toBe('');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test -g "the mark is decorative"`
Expected: FAIL — `Expected: 1, Received: 0`.

- [ ] **Step 3: Create the component**

Create `src/components/Mark.astro`:

```astro
---
/**
 * The bouldering mark: a climbing volume in two facets with a hold on it.
 *
 * The two facets are offset apart rather than meeting on a shared edge —
 * that separation is the whole treatment. Butted together they collapse
 * into a plain two-tone triangle.
 */
interface Props {
  size?: number;
  class?: string;
}

const { size = 150, class: className } = Astro.props;
---

<svg
  data-mark
  width={size}
  height={size}
  viewBox="0 0 102 96"
  aria-hidden="true"
  focusable="false"
  class={className}
>
  <path d="M12 86L50 10L90 60Z" fill="var(--color-sun)" transform="translate(-6 3)" />
  <path d="M50 10L90 60L62 86Z" fill="var(--color-accent)" transform="translate(5 -2)" />
  <path
    d="M18 78c0-16 12-24 32-24s32 8 32 24c0 6-4 8-10 8H28c-6 0-10-2-10-8Z"
    fill="var(--color-counter)"
    transform="translate(30 53) scale(.34)"
  />
</svg>
```

- [ ] **Step 4: Use it on the homepage**

In `src/pages/index.astro`, add to the frontmatter imports:

```astro
import Mark from '../components/Mark.astro';
```

Then replace lines 65–73 entirely — the whole `<div class="flex flex-1 justify-center">` block including its three nested circle divs — with:

```astro
    <div class="flex flex-1 justify-center">
      <Mark />
    </div>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx playwright test -g "the mark is decorative"`
Expected: PASS.

- [ ] **Step 6: Confirm nothing else broke**

Run: `npm run test:e2e`
Expected: all tests pass, including the axe accessibility pass on `/`.

- [ ] **Step 7: Commit**

```bash
git add src/components/Mark.astro src/pages/index.astro tests/e2e/site.spec.ts
git commit -m "feat: replace the homepage circles with the bouldering mark"
```

---

### Task 2: The 404 page uses the same mark, and the orphaned shadow token goes

**Files:**
- Modify: `src/pages/404.astro:59-65` (the broken-circle mark block)
- Modify: `src/styles/theme.css:48` (remove `--shadow-mark`)
- Test: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: `Mark.astro` from Task 1, default `size = 150`.

The `--shadow-mark` token exists only to put a warm shadow under the circles. Once both pages stop using circles it has no consumers, and a box-shadow would be wrong on the new mark anyway — it would draw a rectangle around the SVG's bounding box, not the shape. The spec also explicitly rejected dimensional rendering for this mark, so a cast shadow would contradict the design.

- [ ] **Step 1: Extend the test to cover `/404`**

In `tests/e2e/site.spec.ts`, replace the test added in Task 1 with:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test -g "the mark is decorative"`
Expected: FAIL on the `/404` iteration — `Expected: 1, Received: 0`.

- [ ] **Step 3: Use the component on the 404 page**

In `src/pages/404.astro`, add to the frontmatter imports:

```astro
import Mark from '../components/Mark.astro';
```

Replace lines 59–65 — the `<div class="relative h-[150px] w-[150px]" aria-hidden="true">` block and its three nested divs — with:

```astro
      <Mark />
```

Delete the comment directly above it that reads `The homepage mark, broken apart — the same shapes, no longer lining up.` It describes circles that no longer exist.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx playwright test -g "the mark is decorative"`
Expected: PASS for both `/` and `/404`.

- [ ] **Step 5: Remove the now-orphaned shadow token**

Confirm it has no remaining consumers:

Run: `grep -rn "shadow-mark" src/`
Expected: exactly one hit, the definition in `src/styles/theme.css`.

Then delete these two lines from the `@theme` block in `src/styles/theme.css`:

```css
  --shadow-mark: 0 12px 32px -12px rgb(74 52 28 / 0.28);
```

and narrow the comment above it, which currently covers both shadows, so it reads:

```css
  /* Shadows carry the hue of the surface they fall on. Pure black at low
     opacity on a cream page reads as grey dirt. */
  --shadow-lift: 0 1px 2px rgb(74 52 28 / 0.05), 0 10px 28px -10px rgb(74 52 28 / 0.16);
```

- [ ] **Step 6: Verify the removal broke nothing**

Run: `npm run test:e2e && npm run check`
Expected: all e2e tests pass; `astro check` reports 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/404.astro src/styles/theme.css tests/e2e/site.spec.ts
git commit -m "feat: use the bouldering mark on the 404 page"
```

---

### Task 3: SVG favicon

**Files:**
- Create: `public/favicon.svg`
- Modify: `src/layouts/Base.astro:31` (the icon link)
- Modify: `scripts/verify-build.mjs:53-55` (favicon existence check)

**Interfaces:**
- Consumes: nothing from earlier tasks. `public/favicon.svg` is standalone and hardcodes hex, because a file outside the Astro pipeline cannot read the `@theme` variables.

The favicon drops the hold and keeps the two facets. At 16px the hold is roughly two pixels tall and closes into a smudge that reads as damage rather than as a hold.

- [ ] **Step 1: Add the failing build check**

In `scripts/verify-build.mjs`, replace lines 53–55:

```js
if (!existsSync('dist/favicon.ico')) {
  failures.push('dist/favicon.ico is missing');
}
```

with:

```js
for (const icon of ['dist/favicon.ico', 'dist/favicon.svg']) {
  if (!existsSync(icon)) {
    failures.push(`${icon} is missing`);
  }
}
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `node scripts/verify-build.mjs`
Expected: FAIL, printing `- dist/favicon.svg is missing`, exit code 1.

(If `dist/` does not exist yet, run `npm run build` first, then re-run the check.)

- [ ] **Step 3: Create the favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 96">
  <path d="M12 86L50 10L90 60Z" fill="#F7C948" transform="translate(-6 3)"/>
  <path d="M50 10L90 60L62 86Z" fill="#EE6C1F" transform="translate(5 -2)"/>
</svg>
```

- [ ] **Step 4: Link it**

In `src/layouts/Base.astro`, replace line 31:

```astro
    <link rel="icon" href="/favicon.ico" sizes="any" />
```

with:

```astro
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

Browsers that support SVG icons prefer the SVG; the rest fall back to the `.ico`.

- [ ] **Step 5: Run the build and the check**

Run: `npm run build && node scripts/verify-build.mjs`
Expected: `Build verification passed`, exit code 0.

- [ ] **Step 6: Confirm the favicon is actually served**

Run: `npm run test:e2e`
Expected: all tests pass, including `no console errors on any page` — a 404 on a linked icon would surface there.

- [ ] **Step 7: Commit**

```bash
git add public/favicon.svg src/layouts/Base.astro scripts/verify-build.mjs
git commit -m "feat: add an SVG favicon built from the mark"
```

---

### Task 4: Full verification

**Files:** none modified.

- [ ] **Step 1: Run the whole suite**

Run: `npm test && npm run check && npm run test:e2e`
Expected: 31 unit tests pass, `astro check` reports 0 errors, 16 e2e tests pass (15 existing plus the new mark test).

- [ ] **Step 2: Confirm no circle mark survives anywhere**

Run: `grep -rn "clip-path:inset" src/`
Expected: no matches. It was used only by the circle marks.

Run: `grep -rn "bg-counter" src/`
Expected: exactly one hit — `src/pages/about.astro`, in the `accents` array. That is the hobby-card accent chip, which is unrelated to the mark. Leave it.

- [ ] **Step 3: Look at the result**

Run: `npm run build && npm run preview`, then open `http://localhost:4321/` and `http://localhost:4321/404`.
Confirm by eye: the mark renders at 150px on both pages, the two facets are visibly offset with paper showing through the seam, and the teal hold sits on the lower-left facet.

Stop the preview server when done.

---

## Notes for the implementer

**Do not "fix" the offsets.** The facets are supposed to look pulled apart. Several rounds of design iteration landed here deliberately; butting them together produces a shape that was explicitly rejected.

**Do not add a bolt hole to the hold.** It was built, evaluated, and cut. The spec records why.

**If the mark looks wrong**, check the viewBox first. It is `0 0 102 96`, not square — the geometry is fitted to it, and forcing `0 0 100 100` will clip the right facet.
