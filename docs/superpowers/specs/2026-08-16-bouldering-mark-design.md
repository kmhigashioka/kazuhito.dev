# kazuhito.dev — Bouldering Mark

**Date:** 2026-08-16
**Status:** Approved design, ready for implementation planning

## Summary

Replace the three decorative circles on the homepage with a mark drawn from bouldering: an angular
climbing volume in two facets, with a hold on it. The same mark replaces the broken-circle mark on
the 404 page and becomes the favicon.

## Why

The site's job is to be a personal home base rather than a portfolio funnel. The circles are
generic — any site could use them, and they say nothing about whoever owns this one.

Bouldering is already in the content. `profile.ts` lists it first among the hobbies, with the
blurb *"Problems you solve with your whole body."* Bouldering routes are called **problems**, so
the connection between what Kazu does for work and what he does on a wall is already made in the
copy; the mark makes it visible rather than introducing a new theme.

It also closes an open question from the redesign spec. That document lists **Photography** as
unresolved — "a real photo is needed, or the shapes become the permanent choice." This resolves it
in the third direction: neither a photo nor the placeholder circles.

The palette needed no changes to support this. `accent` `#EE6C1F`, `sun` `#F7C948` and `counter`
`#2E7D6E` are already the colours climbing holds are moulded in.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Subject | A climbing volume with a hold | Volumes are angular, so they read as three-dimensional from flat colour alone — no gradient, shading or texture, which suits a flat site. |
| Treatment | Facets pulled apart ("exploded") | Chosen over seven alternatives on a precision-to-looseness axis. The separation keeps the mark graphic rather than illustrative. |
| Geometry | Hand-authored, sharp-cornered | Deliberate. Geometrically-exact rounded versions were built and rejected: correct perspective made them read as small 3D renders rather than as a logo. |
| Hold | Single teal dome, no bolt hole | Chosen over twenty hold treatments including bolt holes, set screws, tilted mounts and multi-hold routes. |
| Colour roles | `sun` + `accent` for facets, `counter` for the hold | Teal is reserved for holds so the volume never uses it. |
| Motion | None | The mark is decorative and non-interactive. Animating it would be the decoration-without-purpose that the redesign's spring work deliberately avoided. |
| Dark mode | Not applicable | The site has no dark mode; the palette is built on warm cream. |

## The mark

Rendered in a `0 0 102 96` viewBox, three shapes:

```svg
<!-- up-left facet, offset down-left -->
<path d="M12 86L50 10L90 60Z" fill="#F7C948" transform="translate(-6 3)"/>
<!-- right facet, offset up-right -->
<path d="M50 10L90 60L62 86Z" fill="#EE6C1F" transform="translate(5 -2)"/>
<!-- hold -->
<path d="M18 78c0-16 12-24 32-24s32 8 32 24c0 6-4 8-10 8H28c-6 0-10-2-10-8Z"
      fill="#2E7D6E" transform="translate(30 53) scale(.34)"/>
```

The two facet offsets are the whole treatment: without them the shapes meet along a shared edge and
the mark is a plain two-tone triangle. Pulling them apart lets paper show through the seam, which is
what stops it reading as a literal object.

## Where it appears

| Location | Current | Becomes |
|---|---|---|
| `/` hero | Three circles (sun, accent, counter) | The mark, 150px |
| `/404` | The circles "broken apart" | The mark, 150px |
| Favicon | Unbranded `favicon.ico` | SVG favicon, `.ico` retained as fallback |

**Not** the hobby cards on `/about`. Those are small colour chips doing a different job; putting
marks there is the full-metaphor direction that was considered and declined.

The 404 page is not optional. It currently reuses the circle mark, so leaving it would put two
different marks on one site.

## Components

**`src/components/Mark.astro`** — the geometry, in one place, used by both pages.

```ts
interface Props {
  size?: number;   // px, default 150
  class?: string;
}
```

Renders `aria-hidden="true"` with no accessible name: it is decorative and carries no information
the surrounding copy does not already give.

**`public/favicon.svg`** — a reduced variant carrying the two facets only, no hold.

This is a real constraint rather than a simplification for its own sake. At 16px the hold occupies
roughly two pixels and closes into a smudge that reads as damage. Shipping a distinct small-size
mark is ordinary practice, and both files are small enough that the duplication costs nothing.
`favicon.ico` stays as a fallback for browsers without SVG favicon support.

## Considered and rejected

Recorded because each was built and looked at, and the reasoning is not obvious from the result.

- **Literal hold silhouettes** (jug, sloper, crimp, pocket) as the whole mark. A hold in isolation
  reads as an abstract blob to anyone who does not climb.
- **Geometrically computed volumes.** A generator producing real polyhedra — rotated, projected,
  backface-culled, facets shaded by true surface normal — with rounded corners. Technically better
  and wrong for the job: the correct perspective made them read as 3D renders, not as a mark.
- **Bolt holes and set screws on the hold.** The most legible way to make a shape unmistakably a
  climbing hold, and genuinely effective. Rejected as more detail than a decorative mark needs.
- **Multi-hold "problem" arrangements.** Three holds across the volume read most clearly as
  bouldering, but disappear into confetti below about 32px.
- **A two-finger pocket.** Anatomically the most climbing-specific option. Two holes at that spacing
  read as eyes; the mark acquired a face.
- **Textured / dimensional rendering** with resin speckle and a highlight. Would have competed with
  the paper grain in `theme.css` rather than sitting with it.

## Testing

Scaled to real risk, consistent with the existing suite. The mark is static markup that either
renders or does not.

- The existing Playwright smoke run already loads `/` and `/404`; no new page-level tests.
- The axe pass on both pages covers the accessibility requirement — a decorative SVG must contribute
  no accessible name, and axe fails if `aria-hidden` is wrong.
- `scripts/verify-build.mjs` gains a check that `dist/favicon.svg` exists, matching how it already
  guards `favicon.ico` and the hashed CSS.

No unit tests. There is no logic here.

## Out of scope

Hold marks on the hobby cards, animating the mark, a dark-mode variant, an `og:image` built from the
mark, and applying it anywhere in the nav. The `og:image` remains open from the redesign spec and
needs its own decision about what a social card should contain.
