# kazuhito.dev — backlog

Open items as of 2026-08-16, after the redesign and the bouldering mark.

Ordered so the first item unblocks the value of everything below it. Each entry says
where it lives and how to check it, so none of them need this conversation for context.

Decided-and-closed items are at the bottom — they are recorded so they don't get
re-opened by accident, not because anything is pending.

---

## 1. Ship it

- [ ] **Merge `redesign` into `main`.**
      32 commits — the whole rebuild, not just the mark. Everything below is polish on a
      site that is not yet serving anyone. Shipping also answers questions a preview
      cannot: whether the sticky translucent nav feels right on a real phone, and whether
      `backdrop-filter` performs acceptably on mid-range Android.
      Verify first: `npm test && npm run check && npm run test:e2e` — expect 31 unit,
      0 errors, 16 e2e.
- [ ] **Check the Vercel preview on a phone before merging.** Specifically `/work` and
      `/writing`, which are long enough to scroll content under the nav.

## 2. Decisions only you can make

- [ ] **LinkedIn — include it or not.**
      `src/content/profile.ts:19-21` currently lists GitHub, dev.to, Email. Adding it is
      one line, and it appears in the hero row, the footer, and the `/about` contact block
      automatically. The original spec has been carrying this as an open question since
      the redesign started.
- [ ] **The homepage sentence.**
      `src/content/profile.ts:6`. Still the draft wording. The spec singles it out: the
      homepage is deliberately a front door, so this one sentence carries more weight than
      anything else on the site. Worth real attention rather than a tweak.
- [ ] **The `/about` portrait slot.**
      `src/pages/about.astro:23` is still a placeholder gradient square. This is now
      *inconsistent* rather than merely unfinished — the homepage has a real mark and this
      does not. Three ways out: a real photo, the mark reused at a larger size, or a
      deliberately designed shape. Any is fine; leaving a gradient block is the one option
      that reads as unfinished.

## 3. Missing for real visitors

- [ ] **`og:image`.**
      `src/layouts/Base.astro` has `og:title`, `og:description`, `og:type`, `og:url` and
      `twitter:card`, but no image — links unfurl bare in Slack, LinkedIn and iMessage.
      Deliberately omitted so far because a tag pointing at nothing is worse than no tag.
      Needs a decision about what the card shows; the mark alone is probably too sparse
      for a 1200x630 frame.
      Verify: `grep -rn "og:image" src/` should stop returning nothing.

## 4. Polish

- [ ] **Mark size on the homepage.**
      `src/pages/index.astro:67` renders `<Mark />` at the specced 150px, but the geometry
      does not fill its box the way the old circles did, so it reads lighter beside the
      headline. `size={175}` restores the previous presence. Taste call — the spec's 150
      is not wrong, it just measures differently than it looks.
- [ ] **Single-project employer rows on `/work`.**
      `src/pages/work.astro:27` is a two-column grid, so Infor PSSC's lone project leaves
      a visible hole. Either let solo rows go full-width, or accept it. Pre-existing, not
      introduced by the redesign.
- [ ] **`ProjectCard` image fallback.**
      `src/components/ProjectCard.astro:33` draws a `from-sun/40 to-accent/25` gradient for
      projects with no image. Works, but it is the same placeholder gesture as the `/about`
      square. Worth revisiting together with that decision so they resolve consistently.
- [ ] **Hobby card accent chips.**
      `src/pages/about.astro:6` — three flat colour squares. Fine as-is. Listed only
      because they are the third instance of "coloured shape standing in for artwork", and
      whatever resolves the other two probably has an opinion here.

---

## Closed — do not reopen without a reason

Recorded in the specs as considered and deliberately excluded:

- **Dark mode.** The palette is built on warm cream; a dark variant needs a second palette
  designed from scratch.
- **Blog hosting, markdown/MDX pipeline, RSS.** Writing lives on dev.to and is pulled in
  at build time.
- **Per-project detail pages.** Ten projects as cards, no deeper level.
- **Contact form.** Removed rather than modernised — email and social links instead.
- **Analytics, a "now" page, a uses page.**
- **Bolt holes and multi-hold arrangements on the mark.** Built, evaluated, cut. Both
  read as noise at the sizes the mark actually renders at.
- **Scattered-holds mark direction.** Comped, then cut for being too close to its
  reference. The volume mark is what ships.
