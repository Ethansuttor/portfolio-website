# Gemini Handoff Notes

## Branch & Worktree
- **Branch:** `design/gemini`
- **Worktree:** `d:\Antigravity-Projects\portfolio-website - Copy`

---

## Completed Items & Owned Files

### 1. `src/app/globals.css`
- **Item 1.4:** Added `@media (prefers-contrast: more)` override block immediately after `:root` setting `--on-surface-variant` (`#c9d8cd`), `--outline` (`#7fa891`), and `--outline-variant` (`#4f7a62`).
- **Item 4.4:** Added `.display-title { line-height: 1; letter-spacing: -0.025em; }` utility after `.display` inside `@layer components`.
- **Item 2.3:** Added a comment above `.silk` documenting that small mono `.silk` labels intentionally retain gold styling as a deliberate brand exception.

### 2. `src/components/ExperienceTimeline.tsx`
- **Item 2.3:** Company names updated to `text-on-surface font-semibold` (was `text-primary font-medium`). Bullet squares updated to `bg-outline` (was `bg-primary`). Retained gold "current role" indicator dot.
- **Item 4.7:** Role titles dropped `.display` and now use `font-semibold text-on-surface text-xl md:text-2xl leading-tight`.
- **Item 4.8:** Removed `note="Gold dots are roles I still hold."` from `SectionHeading`.

### 3. `src/components/BuildLogPreview.tsx`
- **Item 4.7:** Entry titles dropped `.display` and now use `font-semibold text-on-surface text-lg md:text-xl leading-tight`.

### 4. `src/components/AboutMe.tsx`
- **Item 3.2:**
  - Section vertical padding reduced to `py-20 md:py-28`.
  - Added background `bg-surface-container-low` (accommodating new home page order where About follows Hero).
  - Used shared `SectionHeading` component with `title="About me"`.
  - On mobile viewports, the heading precedes the photo, and photo width is constrained to `max-w-[10rem]` below `lg` (and `lg:max-w-[18rem]`).

### 5. `src/components/TechnicalMatrix.tsx`
- **Item 3.4:** Replaced bordered row lists with wrapping chip lists (`flex flex-wrap gap-2`; chips `rounded-sm border border-outline-variant px-3 py-1.5 text-sm text-on-surface`). Retained the three category headings. Added `note="Tools I've used on the projects above."` to `SectionHeading`.

### 6. `src/components/SubpageNav.tsx`
- **Item 3.5:** Replaced right-side label span with the Résumé download button (`btn-gold px-5 py-2.5 text-sm`, `download`, `RESUME_HREF` from `@/lib/site`). Moved `label` to `aria-label` on `<nav>`.
- **Item 3.5 & Item 1.6:** In `SubpageFooter`, added "Email me" `mailto:` link (`EMAIL` from `@/lib/site`) between back link and "↑ Top". Added `py-3 inline-block` to both "Email me" and "↑ Top" links to ensure >= 28px tap target height.

### 7. `src/components/ProjectArticle.tsx`
- **Item 4.4:** Added `display-title` class to the project title heading (`<Heading className="display display-title text-on-surface text-[clamp(1.9rem,4.4vw,3.6rem)] mb-6">`).
- **Item 2.3:** Line ~172 competition result label changed from `text-primary` to `text-on-surface`.
- **Item 4.1:** Updated headings and button labels to sentence case:
  - "System Implementation" → "System implementation"
  - "Hardware & Telemetry" → "Hardware and telemetry"
  - "View Code on GitHub" → "View the code on GitHub"
  - "Read Build Blog" → "Read the build log"

### 8. `src/app/projects/[slug]/page.tsx`
- **Item 4.1:** Updated back labels to sentence case:
  - "All Projects" → "All projects"
  - "Back to All Projects" → "Back to all projects"

### 9. `src/app/not-found.tsx`
- **Item 4.1:** Updated suggestions link to sentence case:
  - "All Projects" → "All projects"

---

## Verification Performed

1. **Build:** `npm run build` passes with zero errors, successfully generating all static routes (SSG/Static).
2. **Linting on `src`:** `npx eslint src` (and `npm run lint -- --ignore-pattern ".claude/**"`) passes cleanly with zero errors and zero warnings.
3. **Dev Server & Visual Inspection (Port 3103):**
   - Dev server runs on port 3103 via `npm run dev -- -p 3103`.
   - Captured and reviewed headless Chrome screenshots at 375px and 1440px viewports across:
     - Home page (`/`): Verified `AboutMe` mobile layout (heading first, photo constrained to `10rem`), `TechnicalMatrix` wrapping chips with SectionHeading note, `ExperienceTimeline` typography and color updates (company names in `text-on-surface`, bullet squares in `bg-outline`, role titles semibold non-display, note removed), and `BuildLogPreview` titles.
     - Project detail page (`/projects/custom-drone-flight-controller` and `/projects/autonomous-vision-guided-robotics`): Verified `display-title` on project title, sentence case headings and link labels, `text-on-surface` on "Competition result", and `SubpageNav` / `SubpageFooter` links (including Résumé button, `aria-label`, "Email me", and "↑ Top" tap target height).
     - 404 page (`/nonexistent-route`): Verified "All projects" sentence case button and layout.

---

## Fix Needed in a File Not Owned by Gemini

- **`eslint.config.mjs`**: Needs `".claude/**"` added to `globalIgnores` (currently lines 14–20 only ignore root `.next/**`, `out/**`, `build/**`, `next-env.d.ts`).
  - *Context:* When peer agents work in nested worktrees under `.claude/worktrees/`, Next.js builds generate `.next/types/validator.ts` inside those subdirectories. Plain `npm run lint` traverses into `.claude/` unless `".claude/**"` is ignored in `eslint.config.mjs` or passed via `--ignore-pattern ".claude/**"`.
