# Claude handoff (design/claude)

Branch `design/claude`, cut from `main` at `3fd6e2e`. Item numbers refer to
`docs/design-fix-plan.md`.

## Setup notes

- The plan and the Next 16.4 bump were never committed to `main`, so this branch starts at 16.3.6
  in `package.json`. To test against 16.4 without touching the package files, I ran `npm ci`, then
  `npm i next@16.4.0 eslint-config-next@16.4.0 --no-save`. `package.json` and
  `package-lock.json` are unchanged.
- `next dev` 16.4 rewrites the block in `AGENTS.md` every time it starts. I left that change out
  of every commit. Whoever owns repo config should either commit the regenerated block once or set
  `agentRules: false` in `next.config.ts`.

## What I did

| Item | Files | Change |
|---|---|---|
| 1.1 | `Hero.tsx` | `h1` → `text-[min(12.4vw,7rem)]`. Callout boxes: removed `whitespace-nowrap`, now `w-max max-w-[min(11rem,42cqw)]` (the photo is an `@container`, so labels are also capped by the photo's width). |
| 1.1 | `Hero.tsx` | Callouts sit in a wrapper with `@max-[17rem]:hidden`. The query is in rem, so the callouts drop out once text is scaled to about 125% on a 375px phone, where they would otherwise cover the board and clip at its edges. At normal text size they still show down to 320px phones. |
| 1.1 | `Header.tsx` | `min-w-0` on the logo link, `shrink-0` on the hamburger. |
| 1.1 | `CaseStudies.tsx` | "Other projects" rows use `minmax(0,1fr)`. Titles there and on both card types get `wrap-break-word`, so long words ("Hierarchical", "Vision-Guided") break inside the card at 200% instead of being clipped. |
| 1.1 | `projects/page.tsx` | `h1` → `text-[min(11vw,4.5rem)] sm:text-[clamp(2.4rem,6vw,4.5rem)]` (the `2.4rem` floor overflowed at 200%). |
| 1.2 | `Hero.tsx` | Callout labels are 11px (`text-[0.6875rem]`) at every width. J2 and U3 have `mobile: false` and are hidden below `sm`, since five labels at 11px covered most of the board at 375px. |
| 1.2 | `PcbGlbCanvas.tsx` | The 3D loader label (0.65rem) and the PAUSE button (0.6rem) are now 11px too. |
| 1.6 | `app/page.tsx` | `footerLinkClass` gets `inline-block py-3` (links are 44px tall). Nav is `flex-wrap justify-center gap-x-6`, so it wraps instead of overflowing at large text sizes. |
| 2.1 | `PcbGlbCanvas.tsx` | Container `touchAction: 'pan-y'`. `OrbitControls` sets an inline `touch-action: none` on the Canvas element, so the Canvas also has `[touch-action:pan-y]!` to override it (computed value checked: `pan-y`). `enableZoom={false}`. New `+` / `−` buttons call `dollyIn` / `dollyOut(0.8)` through a ref, and share one 32×32, 11px `silk` style with PAUSE. Hint text: "Drag to rotate, use + and − to zoom". |
| 2.2 | `InViewVideo.tsx`, `CaseStudies.tsx` | Pause/Play button (`aria-label` "Pause video" / "Play video", 32px tall). While paused, the `IntersectionObserver` is disconnected. The reduced-motion preference is read with `useSyncExternalStore`, so those visitors start paused on the poster and the button says "Play video". The button is `z-10` so it sits above the card's stretched link. Placed top-right via the `controlClassName` prop. |
| 3.1 | `app/page.tsx`, `Header.tsx` | Order: Hero, About, Projects, Experience, Skills, Build log, Contact. `sectionItems` now lists all six in page order (Build log carries `href: BUILD_LOG_HREF`), and `trackedIds` is derived from it so the two can't drift apart. The mobile menu now highlights Build log too. |
| 3.3 | `CaseStudies.tsx`, `projects/page.tsx` | `ProjectCard` is exported, with optional `id` and `headingLevel` props. /projects is a 2-column grid of cards (`h2`, `id={slug}`, `scroll-mt-20`), and `ProjectScrollHandler` is kept. Header and grid both use `px-5 sm:px-8 lg:px-16` around `mx-auto max-w-[1400px]`. |
| 4.1 | `projects/page.tsx` | "All Projects" → "All projects", "Back to Home" → "Back to home". Intro copy now says cards rather than write-ups. |
| 4.3 | `Hero.tsx` | The two gutter traces start at y=96 with a pad. They sit in their own `xMidYMin slice` layer, because with the centred crop y=96 lands at 8–68px on 1920-wide windows, which is under the nav. |
| 4.4 | `CaseStudies.tsx` | `display-title` added to the featured `h3` and the card heading. I removed `leading-[0.98]` from the card title so `.display-title` controls its line height. |
| 4.8 | `Header.tsx` | Hamburger `p-2` → `p-3` (now 44×40). |

`ProjectScrollHandler.tsx` and `Pcb3DViewer.tsx` needed no changes.

## Checked

- `npm run lint` and `npm run build` pass.
- 375px, 100% text: no text under 11px. Footer links are 44px tall, and the hamburger is 44×40.
- 375px, 200% text, home page: the remaining overflow is all in files I don't own (see Handoffs).
  With those three fixes injected as page CSS, `scrollWidth === innerWidth` (375) and the menu
  button is at x 247–335. /projects passes at 200% as it stands.
- 1440: nav order and active highlight match page order for all six sections.
- 4.3: measured the start pads at 1024×768 → y 86, 1280×800 → 85, 1440×900 → 96 and
  1920×1080 → 127 (nav is 72px). The vertical runs stay in the gutter between the text column and
  the photo.
- 2.1: synthetic wheel event on the canvas is not `preventDefault`ed. `+` from the keyboard
  (Enter) and `−` from the mouse visibly zoom in and out.
- 2.2: pause → scroll away and back → still paused; play resumes it.
- `/projects#old#slug` on a fresh load cleans the hash and scrolls to the card.

## Not verified

- **A real touch swipe on the 3D canvas.** I confirmed the computed `touch-action` is `pan-y`,
  but there was no touch device to swipe on.
- **Reduced motion in the browser.** The pane can't emulate `prefers-reduced-motion`. The logic
  is: no choice yet means paused if reduced motion is on, so the poster shows and the button reads
  "Play video".
- **Hero traces by eye at 1024–1920.** The pane renders desktop sizes too small to judge, so 4.3
  is checked by geometry only.
- **/projects height.** It's 2,944px at 1440, against the plan's "under ~2,500". Five cards in
  two columns make three rows of about 790px each. Getting under 2,500 would mean three columns at
  `xl` or a shorter card, both of which go beyond "a 2-column grid of `ProjectCard`". Decide at
  integration.

## Handoffs (fixes needed in files I don't own)

1. **`src/components/SectionHeading.tsx` (unassigned).** `text-[clamp(2.2rem,5vw,4rem)]`
   pushes "Experience" to 512px at 200% / 375px. This is now the main cause of sideways scroll on
   the home page. Fix (simulated, works):
   `text-[min(10vw,4rem)] sm:text-[clamp(2.2rem,5vw,4rem)]`.
2. **Gemini, `src/components/ExperienceTimeline.tsx`.** The entry grid
   `grid-cols-[1.75rem_1fr]` lets long words widen the column, up to 104px past the edge at
   200%. Use `grid-cols-[1.75rem_minmax(0,1fr)]` (or `min-w-0` on the content `div`) and add
   `wrap-break-word` to the role `h3`.
3. **ChatGPT, `src/components/Contact.tsx`.** In `Field`, `{label}{hint && <span …>}` has no
   space between the label and the hint, so "Subject(optional)" can't wrap and overflows by 29px at
   200%. Add `{" "}` before the span.
4. **ChatGPT, `src/components/Contact.tsx` (minor).** The honeypot `<input name="contact_ref">`
   shows up in both the plan's overflow script and its tap-target script. It's clipped in a 1px
   wrapper, so it's a false positive. Adding `w-px` to the input would quiet both scripts.
5. **Gemini, `src/app/globals.css`.** Define `.display-title` inside `@layer components`
   after `.display`, so it overrides `.display`'s `line-height: 0.88`. The card titles in
   `CaseStudies.tsx` rely on it now that `leading-[0.98]` is gone.

## Tip for the integration pass

In Chrome's mobile emulation, once the 200% script widens the layout viewport, `innerWidth`
stays wide until a reload, even after the cause is fixed. Re-run the 1.1 check from a fresh load.
