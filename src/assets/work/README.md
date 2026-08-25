# Project screenshots

Source of record for the images on `/work`.

Seven of these were on the public Remix site until the Astro rebuild deleted
`app/assets/`. They were recovered from commit `c4265bc` — the last commit
before that deletion — where each was a Figma SVG export wrapping a single
base64 PNG.

| File | Recovered from | Project |
|---|---|---|
| `beacon.png` | `app/assets/my-work_beacon.svg` | Beacon / PhilHealth E-Claims |
| `charts.png` | `app/assets/my-work_charts.svg` | Frontend Development (EngageRocket) |
| `cs.png` | `app/assets/my-work_cs.svg` | Rocket Surgeon |
| `ehr.png` | `app/assets/my-work_ehr.svg` | EHR |
| `fplm.png` | `app/assets/my-work_fplm.svg` | FPLM |
| `nebula.png` | `app/assets/my-work_nebula.svg` | Nebula |
| `qmu.png` | `app/assets/my-work_qmu.svg` | QMeUp |

`performai.png` has no legacy asset — the project postdates the Remix site. It
is cropped from a public marketing composite on
<https://www.engagerocket.co/performai-performance-management>
(`hubfs/PerformAI track team performance.png` at `?width=1400`), extracted at
`left: 62, top: 78, width: 1222, height: 724` to remove the decorative blobs and
transparency, then flattened onto white.

It is a zoomed UI fragment and a marketing render rather than a full app view
like the other seven. That inconsistency is known and accepted; replace it if a
real full-scale capture becomes available.

The two Samsung projects have no image by design — Cognitiv Analytics is a 2019
internal tool with no public footprint and no retained captures.

## Data review

All eight were reviewed for real customer data before being committed. None
contains any. What each one actually shows:

- `beacon` — seed data. "La Casa de Papel Hospital", "Raquel Murillo": Money
  Heist characters.
- `qmu` — "Juan G. Dela Cruz", the Philippine equivalent of John Doe, booking
  with a pediatrician named Crystal Mae Gutierrez. That same pediatrician is
  the signed-in account in `ehr`, which is what a shared demo dataset looks
  like rather than a real practitioner.
- `ehr` — one diagnosis row (ICD-10 J18.92, pneumonia, dated 2020-05-26)
  against an unnamed patient. No patient identity is on screen.
- `charts` — 360 feedback results. Generic competency statements, no names.
- `fplm` — Infor PLM for Fashion showing Levi's apparel styles, several marked
  "In Concept". Product catalogue data, no personal data. Infor's fashion demos
  ship with apparel sample sets; treated as one.
- `nebula` — Storybook. Button, Radio, RichTextEditor. No data of any kind.
- `cs` — **Atlassian's own "Teams in Space" demo board**, the canonical Jira
  sample project. Not a real board, and not a product built here: Rocket
  Surgeon is a support rotation, so this illustrates the tool the rotation runs
  in. Worth revisiting if that reads as a claim of authorship.
- `performai` — marketing render. Every avatar reads "DF"; the names are
  fictional.

## Format note

`charts.png` arrived as the one asset with meaningful transparency (~8% of
pixels, fully transparent at the corners) — a composite of floating cards
rather than a flat app view. Rendered as-is it ghosted badly, reading as a
broken or disabled image beside seven opaque neighbours, so it is flattened
onto `surface` (`#FFFFFF`) — the colour of the card it sits on, so its own
ground disappears and only the floating cards read.

Match this to whatever the screenshot actually sits on. It was briefly
flattened onto `paper` instead, which was right while the images sat in a
cream well and wrong the moment they did not.

Its left-hand panel still reads soft. That is the composite's own depth effect
— the designer faded the backdrop layer — not a transparency artifact.
