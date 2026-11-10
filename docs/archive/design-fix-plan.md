# Design fix plan

Source: the design audit and the `/apple-design` review (October 2026). Each item lists the
files, the exact change, and how to check it. Line numbers are from `main` at `3fd6e2e` and will
drift as you edit, so search for the quoted snippet if a line has moved.

The work is split into five PRs, ordered by severity. Each PR is small enough to review in one
sitting and leaves the site shippable.

| PR | Theme | Items | Rough size |
|---|---|---|---|
| 0 | Housekeeping | Restart dev server, commit the Next bump | 5 min |
| 1 | Accessibility failures (Critical) | 1.1 – 1.6 | ~1 hr |
| 2 | Interaction fixes (High) | 2.1 – 2.4 | ~1.5 hr |
| 3 | Information architecture | 3.1 – 3.5 | ~3 hr |
| 4 | Consistency and craft | 4.1 – 4.9 | ~2 hr |

---

## Decisions needed before starting

These change what gets built. My recommendation is first in each.

1. **Home page section order (PR 3.1).** Recommended: Hero → About → Projects → Experience →
   Skills → Build log → Contact. Alternative: keep the order and only move About up.
2. **/projects page (PR 3.3).** Recommended: turn it into an index of cards that link to
   `/projects/[slug]`. Alternative: keep full write-ups but add a jump list at the top.
3. **Display font on small titles (PR 4.7).** Recommended: switch job titles and log entry titles
   to the body face (Hanken Grotesk semibold). Alternative: keep Archivo but drop the stretch to
   100% on those titles.
4. **Gold on non-interactive text (PR 2.3).** Recommended: take gold off company names and
   bullet squares, but keep it on the small mono "silkscreen" labels, as a deliberate exception
   to the brand. Alternative: take it off everything that isn't a link or button.
5. **Contact email (PR 4.9).** The `louisville.edu` address may stop working after graduation.
   Do you have a personal or own-domain address to use instead?

---

## PR 0: Housekeeping

- [ ] **0.1 Restart the dev server.** The `next dev` on :3000 (PID 46320) was started before the
  16.3.6 → 16.4.0 bump and serves mismatched React builds, so the page renders blank. Stop it and
  run `npm run dev`. If it's still blank, delete `.next/dev` and restart.
- [ ] **0.2 Commit the uncommitted `package.json` / `package-lock.json` change** on its own, so
  later PRs don't carry it.

---

## PR 1: Accessibility failures (Critical)

Branch: `fix/a11y-critical`

### 1.1 Survive 200% text size on mobile

At 375px wide with the root font size at 200%, the page grows to 512px wide and scrolls
sideways. The menu button lands at x = 400–472 (off screen), "SUTTOR" clips to "SUTTO", and the
hero callouts overflow.

- [ ] **Hero `<h1>`** — `src/components/Hero.tsx:134`
  - Now: `text-[clamp(2.4rem,12.4vw,7rem)] lg:text-[min(6.6vw,7rem)]`
  - Change to: `text-[min(12.4vw,7rem)] lg:text-[min(6.6vw,7rem)]`
  - Why: the `2.4rem` floor doubles to 76.8px at 200% and no longer fits. A `vw` cap
    always fits the viewport. The name is display text, so letting it stay viewport-sized is
    fine; the body copy below it still scales.
- [ ] **Hero callouts** — `src/components/Hero.tsx:97`
  - Remove `whitespace-nowrap` from the callout box, and add `max-w-[11rem]` so long notes wrap
    instead of pushing past the photo edge.
- [ ] **Nav** — `src/components/Header.tsx:122`
  - Add `min-w-0` to the logo link and `shrink-0` to the hamburger button so the button can never
    be pushed off screen.
- [ ] **Find any other overflow.** With the site running at 375px, paste this into the console:

  ```js
  document.documentElement.style.fontSize = '200%';
  setTimeout(() => console.table(
    [...document.querySelectorAll('main *')]
      .filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('svg, #mobile-menu'))
      .map(e => ({ tag: e.tagName, cls: String(e.className).slice(0, 60), text: e.textContent.trim().slice(0, 30) }))
  ), 300);
  ```

  Fix anything it lists, then repeat until it prints an empty table.

**Check:** `document.documentElement.scrollWidth === innerWidth` at 200%, and the menu button is
fully visible.

### 1.2 Hero callout text below 11px

Callout labels are 8.8px on mobile (`text-[0.55rem]`).

- [ ] `src/components/Hero.tsx:98` — change `text-[0.55rem] sm:text-[0.625rem]` to
  `text-[0.6875rem]` (11px at every width).
- [ ] If five callouts now crowd the photo at 375px, hide two on mobile: add a `mobile: false`
  flag to the `J2` and `U3` entries in `callouts` and render them with `hidden sm:block`.
- [ ] Also: gallery caption badge — `src/components/ProjectDetailGallery.tsx` (the
  `text-[0.6rem]` span after the main image) → `text-[0.6875rem]`.

**Check:** in the console, no text node under 11px:
`[...document.querySelectorAll('body *')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 11 && e.textContent.trim()).length === 0`

### 1.3 Contrast failures

Ratios are against `--background` `#0a1c14` or `--surface-container-low` `#0d2419`.

| Element | Now | Change to | New ratio |
|---|---|---|---|
| Form input borders | `border-outline-variant` (1.71:1) | `border-outline` | 3.34:1 |
| Input placeholders | `placeholder:text-on-surface-variant/40` (2.42:1) | `placeholder:text-on-surface-variant/70` | 4.78:1 |
| "(optional)" hint | `text-on-surface-variant/50` (2.99:1) | `text-on-surface-variant` | 7.85:1 |
| Build log jump-list dates | `text-on-surface-variant/50` (3.07:1) | `text-on-surface-variant` | 8.47:1 |
| Build log entry dates | `text-on-surface-variant/60` (3.85:1) | `text-on-surface-variant` | 8.47:1 |
| Build log media captions | `text-on-surface-variant/70` | `text-on-surface-variant` | 8.47:1 |

- [ ] `src/components/Contact.tsx:14` (`controlClass`) — borders and placeholder.
- [ ] `src/components/Contact.tsx:32` — hint.
- [ ] `src/app/blog/drone-flight-controller/page.tsx:196, 218, 104` — dates and captions.
- [ ] All the ratios in the table were computed from the hex values. Re-check any you adjust.

### 1.4 Increased-contrast fallback

There is no `prefers-contrast` handling. Add one block to `src/app/globals.css`, after `:root`:

```css
@media (prefers-contrast: more) {
  :root {
    --on-surface-variant: #c9d8cd; /* 11.93:1 */
    --outline: #7fa891;            /* 6.65:1 */
    --outline-variant: #4f7a62;    /* 3.34:1, so hairlines pass the 3:1 border rule */
  }
}
```

**Check:** in Chrome DevTools → Rendering → "Emulate CSS media feature prefers-contrast: more".
Card borders and hairlines should be clearly visible.

### 1.5 Contact form messages that disappear on a timer

`src/components/Contact.tsx:112–116` clears `success` and `error` after 6 seconds.

- [ ] Delete that `useEffect`.
- [ ] Clear an error when the person edits: in `setField`, add
  `if (status === "error") setStatus("idle");`
- [ ] Keep the success state until the form is used again. The form is already cleared, so
  typing into it should reset to `idle` by the same rule.
- [ ] Keep the 2-second "Copied" revert on the copy button. It confirms an action rather than
  carrying information, so it's fine.

**Check:** submit an empty form, wait 10 seconds, and the error is still there. Type a
character and it goes away.

### 1.6 Footer tap targets

Footer links are 20px tall (minimum 28).

- [ ] `src/app/page.tsx:17` — add `py-3 inline-block` to `footerLinkClass`, and reduce the nav
  `gap-8` to `gap-6` so the row still fits at 375px.
- [ ] Same for the "↑ Top" link in `SubpageFooter` (`src/components/SubpageNav.tsx`).

**Check:** run the tap-target script below. No links in the footer should be under 28px tall.

---

## PR 2: Interaction fixes (High)

Branch: `fix/interaction`

### 2.1 Stop the 3D viewer from hijacking scroll

`src/components/PcbGlbCanvas.tsx`

- [ ] Line 164: `style={{ touchAction: 'none' }}` → `style={{ touchAction: 'pan-y' }}`, so a
  vertical swipe scrolls the page and a horizontal drag rotates the board.
- [ ] Line 192 `<OrbitControls>`: add `enableZoom={false}`. Wheel scrolling then always scrolls
  the page.
- [ ] Keep zoom as an option: add `+` / `−` buttons next to PAUSE that call
  `controls.dollyIn/dollyOut` (via a `ref` on `OrbitControls`), or allow zoom only with
  ctrl/⌘ + wheel. Buttons are better because they also work on touch and for keyboard users.
- [ ] Update the hint text "Drag to rotate, scroll or pinch to zoom" to match what's left.

**Check:** on the case-study page at 375px, swipe up starting on the canvas and the page
scrolls. On desktop, scroll the wheel over the canvas and the page scrolls.

### 2.2 Pause control for the looping video

`src/components/InViewVideo.tsx` loops the motor clip with no control.

- [ ] Add a `paused` state and a small button in the corner (same style as the 3D viewer's
  PAUSE button: `silk`, `border-outline-variant`, 11px, at least 28×28 hit area).
- [ ] When paused, disconnect the `IntersectionObserver` so scrolling past doesn't restart it.
- [ ] `aria-label` toggles between "Pause video" and "Play video".
- [ ] `src/components/CaseStudies.tsx:44` — the figcaption overlays the bottom of the figure, so
  put the button top-right.

**Check:** the video can be stopped and stays stopped while scrolling. With reduced motion on,
it shows the poster and the button says "Play video".

### 2.3 Gold only for things you can act on

Gold currently marks links and buttons, and also company names, bullets and labels.

- [ ] `src/components/ExperienceTimeline.tsx:119` — company name `text-primary font-medium` →
  `text-on-surface font-semibold`.
- [ ] `src/components/ExperienceTimeline.tsx:130` — bullet squares `bg-primary` → `bg-outline`.
- [ ] `src/components/ProjectArticle.tsx:172` — `font-semibold text-primary` label →
  `text-on-surface`.
- [ ] Per decision 4: leave the 11px mono `silk` labels gold (chip categories, spec-card labels,
  build-log phase tags), as the one documented exception. Add a comment above `.silk` in
  `globals.css` saying so.
- [ ] Keep the gold "current role" dot. It's the status indicator Apple's branding guidance
  explicitly allows ("primary actions or status indicators").

**Check:** on the home page, every gold word you can see is a link, a button, a status dot or a
mono label.

### 2.4 Contact form validation at the field

`src/components/Contact.tsx`

- [ ] Add `errors` state: `{ name?: string; email?: string; message?: string }`.
- [ ] Validate on `onBlur` for each required field (email uses `EMAIL_PATTERN`), and again on
  submit.
- [ ] Render the message directly under the field:
  `<p id="contact-email-error" className="mt-2 text-sm text-tertiary">…</p>`, and set
  `aria-invalid` and `aria-describedby` on the input.
- [ ] Messages say how to fix it: "Enter your name", "Enter an email like name@example.com",
  "Write a message".
- [ ] Network failure fallback (currently "Something went wrong."): "Couldn't send. Email me at
  {EMAIL} instead." The address should be a `mailto:` link.
- [ ] Keep the existing `aria-live` region for the server result only.

**Check:** tab through the empty form. Each required field shows its own message as you leave
it. A screen reader announces the message when the field is focused again.

---

## PR 3: Information architecture

Branch: `feat/ia-reorder`. Depends on decisions 1 and 2.

### 3.1 Reorder the home page

`src/app/page.tsx:43–49`

- [ ] New order (decision 1): `Hero, AboutMe, CaseStudies, ExperienceTimeline, TechnicalMatrix,
  BuildLogPreview, Contact`.
- [ ] `src/components/Header.tsx` — update `sectionItems` to match the new order and add
  "About". Update `trackedIds` to the same order; it drives the active-link highlight and must
  match page order.
- [ ] Section backgrounds alternate `bg-background` / `bg-surface-container-low`. After
  reordering, re-check that no two neighbours share a background without a border between them.
  Expected pattern: Hero (bg) → About (low) → Projects (bg) → Experience (low) → Skills (bg) →
  Build log (low) → Contact (bg).

### 3.2 Tighten the About section

`src/components/AboutMe.tsx`

- [ ] Line 5: `py-28 md:py-36` → `py-20 md:py-28` (the section has two short paragraphs).
- [ ] Mobile order: heading first, then photo. Move the `<h2>` out of the right column into a
  wrapper above the grid on mobile, or use `order-first lg:order-none` on the text column and
  shrink the photo to `max-w-[10rem]` below `lg`.
- [ ] Use `SectionHeading` for the title, matching other sections.

### 3.3 /projects as an index

`src/app/projects/page.tsx` (decision 2)

- [ ] Replace the full `ProjectArticle` per project with a 2-column grid of the existing
  `ProjectCard` from `CaseStudies.tsx` (export it), each linking to `/projects/[slug]`.
- [ ] Keep `id={project.slug}` on each card so any old `/projects#slug` links still land on the
  right card. Keep `ProjectScrollHandler` for that reason.
- [ ] Fix the left-edge alignment while here: the header uses `max-w-7xl` + `px-5 sm:px-8 lg:px-16`;
  the list uses `px-4 sm:px-8 max-w-7xl`. Give both the same wrapper:
  `px-5 sm:px-8 lg:px-16` around `mx-auto max-w-[1400px]`, matching the home page.

**Check:** /projects is under ~2,500px at desktop and every title links to its own page.

### 3.4 Skills as chips

`src/components/TechnicalMatrix.tsx`

- [ ] Replace each `<ul>` of bordered rows with a wrapping chip list:
  `flex flex-wrap gap-2`, chips `rounded-sm border border-outline-variant px-3 py-1.5 text-sm`.
- [ ] Keep the three category headings.
- [ ] Add a `note` to the `SectionHeading` such as "Tools I've used on the projects above," so
  the section isn't the only one without one.

**Check:** the Skills section is under ~500px tall on a 390px-wide phone (currently ~1,100px).

### 3.5 Résumé and contact on inner pages

`src/components/SubpageNav.tsx`

- [ ] In `SubpageNav`, replace the right-side `label` span with the Résumé button from
  `Header.tsx` (`btn-gold px-5 py-2.5 text-sm`, `download`, `RESUME_HREF`). Keep `label` but
  move it into `aria-label` on the `<nav>`.
- [ ] In `SubpageFooter`, add an "Email me" `mailto:` link between the back link and "↑ Top".

---

## PR 4: Consistency and craft

Branch: `polish/consistency`

### 4.1 Sentence case everywhere

| File | Now | Change to |
|---|---|---|
| `components/ProjectArticle.tsx:116` | System Implementation | System implementation |
| `components/ProjectArticle.tsx:147` | Hardware & Telemetry | Hardware and telemetry |
| `components/ProjectArticle.tsx:189` | View Code on GitHub | View the code on GitHub |
| `components/ProjectArticle.tsx:205` | Read Build Blog | Read the build log |
| `app/projects/page.tsx:19` | All Projects | All projects |
| `app/projects/page.tsx:43` | Back to Home | Back to home |
| `app/projects/[slug]/page.tsx:83, 89` | All Projects / Back to All Projects | All projects / Back to all projects |
| `app/blog/drone-flight-controller/page.tsx:138` | The Project | The project |
| `app/blog/drone-flight-controller/page.tsx:278` | All Projects | All projects |
| `app/not-found.tsx:11` | All Projects | All projects |

- [ ] Then grep for any stragglers: `rg '"[A-Z][a-z]+ [A-Z][a-z]+' src/components src/app`.
- [ ] Project titles in `lib/projects.ts` stay Title Case. They're proper names, which is fine.

### 4.2 Non-breaking hyphen in "7-Segment"

- [ ] `src/lib/projects.ts:113` — replace `7-Segment` with `7‑Segment` (non-breaking
  hyphen) in `title`. Also search the summary and alt text for the same string.

### 4.3 Hero trace crossing the nav

`src/components/Hero.tsx:29–30`

- [ ] `M712 -10 V380 …` → start at `M712 96 V380 …`; `M738 -10 V300` → `M738 96 V300`. Add a
  small pad at the new start points so they read as terminating vias rather than cut lines.
- [ ] Check at 1024, 1280, 1440 and 1920 widths. The SVG uses `slice`, so x positions shift with
  the aspect ratio.

### 4.4 Line height for wrapped display titles

- [ ] `src/app/globals.css` — after `.display`, add:

  ```css
  .display-title { line-height: 1; letter-spacing: -0.025em; }
  ```

- [ ] Add `display-title` to multi-line titles: `CaseStudies.tsx:56` and `:109`,
  `ProjectArticle.tsx` (project `h1`/`h2`), blog `h1` and entry `h2`s. Leave the hero `h1` and
  section `h2`s at 0.88.

### 4.5 Featured card's empty grid cell

`src/components/CaseStudies.tsx:61`

- [ ] Five parts in a 3-column grid leaves one cell empty (and one in the 2-column mobile grid).
  Either add a sixth `techStack` entry to the drone project in `lib/projects.ts` (e.g.
  `{ category: "Flash", label: "GD25Q16E" }`), or make the last item span the remainder:
  `last:col-span-full sm:last:col-span-1` won't work for 3 columns, so the sixth entry is the
  simpler fix.

### 4.6 Portrait photos in landscape frames

- [ ] `src/components/ProjectDetailGallery.tsx` main frame (`aspect-[4/3]`): add an optional
  `aspect` field to project images in `lib/projects.ts` (`"portrait" | "landscape"`), and use
  `aspect-[3/4] max-h-[70vh]` for portrait ones.
- [ ] `src/app/blog/drone-flight-controller/page.tsx` `Media` (line ~83): same treatment. For
  portrait media, let the figure span the full content width at `max-w-sm` so it's not a 170px
  postage stamp beside an empty column.

### 4.7 Restrain the display face

Decision 3. Archivo 125% is on every heading, so the name loses its weight.

- [ ] `ExperienceTimeline.tsx:118` role titles: `display text-[clamp(1.4rem,2.6vw,2rem)]` →
  `font-semibold text-on-surface text-xl md:text-2xl leading-tight`.
- [ ] `BuildLogPreview.tsx:40` entry titles: same change at `text-lg md:text-xl`.
- [ ] Blog entry `h2`s: same.
- [ ] Keep `display` on: hero name, section `h2`s, project titles, the 404 heading.

### 4.8 Small removals

- [ ] `ExperienceTimeline.tsx:147` — drop `note="Gold dots are roles I still hold."` Each entry
  already says "to now".
- [ ] Blog stats box (`page.tsx:161`) is `max-w-5xl` wide while the text above is `max-w-3xl`.
  Wrap it in `max-w-3xl` too.
- [ ] Header hamburger (`Header.tsx:174`): `p-2` → `p-3` (36×32 → 44×40).

### 4.9 Contact email

Decision 5. Update `EMAIL` in `src/lib/site.ts:16`. It feeds the contact cards, the JSON-LD and
the mailto links, so one change covers all of them. The form's delivery inbox is separate
(`CONTACT_INBOX` in `site.ts`, overridable with the `CONTACT_TO_EMAIL` env var in
`src/app/api/contact/route.ts:35`). Change that too if it points at the school address, including
the env var on Vercel.

---

## Verification after each PR

Run on a production build (`npm run build && npx next start -p 3123`) so the result matches what
ships.

1. `npm run lint` and `npm run build` pass.
2. **Overflow at 200% text**, at 375px: the console script in 1.1 prints nothing.
3. **Text sizes**: the console check in 1.2 returns `true`.
4. **Tap targets** at 375px:

   ```js
   [...document.querySelectorAll('a,button,input,textarea')]
     .filter(el => !el.closest('[inert]') && !el.closest('p'))   // skip inline links in prose
     .map(el => ({ el, r: el.getBoundingClientRect() }))
     .filter(({ r }) => r.width && (r.width < 28 || r.height < 28))
     .map(({ el, r }) => [el.textContent.trim().slice(0, 30), Math.round(r.width), Math.round(r.height)]);
   ```

   Expect an empty array.
5. **Contrast**: for any color you changed, compute the ratio against its background (WebAIM's
   contrast checker, or the Python snippet from the audit). Text needs 4.5:1, borders and icons
   3:1.
6. **Keyboard**: tab through the home page, the mobile menu, the contact form and a case-study
   page. Focus is always visible and nothing gets stuck.
7. **Reduced motion and increased contrast**: emulate both in DevTools → Rendering and look over
   every page.
8. **Screenshots**: desktop 1440 and mobile 390 of home, /projects, one case study, the build log
   and the 404. Compare against the audit screenshots.

---

## Running three agents in parallel

The items are split so that **no two agents edit the same file**. Each agent works in its own git
worktree on its own branch, so builds, dev servers and commits can't collide. The prompts assume
my recommended answer to decisions 1–4. Item 4.9 (contact email) waits for decision 5 and isn't
assigned.

### Who does what

| Agent | Items | Owns these files (and only these) |
|---|---|---|
| **Claude** (most complex: cross-cutting layout, 3D, refactors, final integration) | 1.1, 1.2 (hero), 1.6 (home footer), 2.1, 2.2, 3.1, 3.3, 4.1 (`projects/page.tsx`), 4.3, 4.4 (`CaseStudies.tsx`), 4.8 (hamburger) | `src/components/Hero.tsx`, `src/components/Header.tsx`, `src/components/PcbGlbCanvas.tsx`, `src/components/Pcb3DViewer.tsx`, `src/components/InViewVideo.tsx`, `src/components/CaseStudies.tsx`, `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/components/ProjectScrollHandler.tsx` |
| **ChatGPT** (medium: contained component logic and data) | 1.2 (gallery badge), 1.3, 1.5, 2.4, 4.1 (blog page), 4.2, 4.4 (blog), 4.5, 4.6, 4.7 (blog), 4.8 (blog stats) | `src/components/Contact.tsx`, `src/lib/contact.ts`, `src/components/ProjectDetailGallery.tsx`, `src/app/blog/drone-flight-controller/page.tsx`, `src/lib/projects.ts`, `src/lib/buildLog.ts` |
| **Gemini** (well-specified styling and copy edits) | 1.4, 1.6 (subpage footer), 2.3, 3.2, 3.4, 3.5, 4.1 (remaining strings), 4.4 (CSS + `ProjectArticle`), 4.7 (timeline, build log preview), 4.8 (legend) | `src/app/globals.css`, `src/components/ExperienceTimeline.tsx`, `src/components/BuildLogPreview.tsx`, `src/components/AboutMe.tsx`, `src/components/TechnicalMatrix.tsx`, `src/components/SubpageNav.tsx`, `src/components/ProjectArticle.tsx`, `src/app/projects/[slug]/page.tsx`, `src/app/not-found.tsx` |

Cross-agent dependencies are handled by agreement, not by editing each other's files:

- Gemini defines `.display-title` in `globals.css`. Claude and ChatGPT add the class name to
  their own files. An undefined class is harmless until Gemini's branch is merged.
- Claude moves About to second place on the home page (3.1). Gemini gives `AboutMe` the
  `bg-surface-container-low` background that the new order needs (3.2).
- Claude exports `ProjectCard` from `CaseStudies.tsx` for the new /projects index. Nobody else
  touches that file.

### Setup (run once, before starting any agent)

From the repo root, on `main`:

1. Commit the pending dependency bump and this plan, so every branch starts from the same base:
   `git add package.json package-lock.json docs/design-fix-plan.md` then
   `git commit -m "Bump Next to 16.4 and add design fix plan"`.
2. Create one worktree per agent, next to the repo:
   - `git worktree add ../portfolio-claude -b design/claude`
   - `git worktree add ../portfolio-chatgpt -b design/chatgpt`
   - `git worktree add ../portfolio-gemini -b design/gemini`
3. In each worktree, run `npm ci`. The `.env.local` file is gitignored, so copy it in by hand if
   the contact form needs it.
4. Point each tool at its own folder: Claude Code at `portfolio-claude`, Codex at
   `portfolio-chatgpt`, Gemini (Antigravity or Gemini CLI) at `portfolio-gemini`.

### Merging

Merge in this order: **Gemini → ChatGPT → Claude**. Because file ownership doesn't overlap, the
merges should be conflict-free. Claude goes last and does the integration pass: it re-runs the
200% overflow check and the full verification list on the combined code, and picks up any items
the other agents listed under "Handoffs".

Afterwards, remove the worktrees with `git worktree remove ../portfolio-<name>`.
