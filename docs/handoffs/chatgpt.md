# ChatGPT design handoff

Branch: `design/chatgpt`. Worktree: `.claude/worktrees/chatgpt-design`.

## Completed items

- **1.3:** Contact inputs use `border-outline` and 70% placeholders; the optional hint uses full `text-on-surface-variant`. Blog jump-list dates, entry dates and media captions use the full text color.
- **1.5:** Removed the six-second result timer. Server errors and success confirmations persist until a field is edited. Kept the two-second copy confirmation.
- **2.4:** Required fields validate on blur and submit through the shared validator in `src/lib/contact.ts`, including trimmed values and `EMAIL_PATTERN`. Each error appears under its field with `aria-invalid` and `aria-describedby`. Invalid submissions focus the first invalid field. Editing clears that field's error. The live region contains only send results. Network/server failures offer “Couldn't send. Email me at {EMAIL} instead.” with a mailto link; useful 4xx server explanations are retained before that fallback.
- **1.2:** Gallery caption badges use `text-[0.6875rem]` (11px).
- **4.6:** Added optional `aspect: "portrait" | "landscape"` to project images and log media. Checked asset dimensions and marked portrait photos, diagrams and the portrait motor clip. Portrait frames use `aspect-[3/4] max-h-[70vh]`; `max-w-[52.5vh]` preserves that ratio when the height cap applies. Portrait log media stacks above full-width prose, with the figure capped at `max-w-sm`, rather than occupying a narrow column.
- **4.2:** Replaced every `7-Segment` / `7-segment` occurrence in `projects.ts` with the non-breaking hyphen U+2011, preserving capitalization.
- **4.5:** Added `{ label: "GD25Q16E", category: "FLASH" }` as the sixth drone tech chip, matching the existing shape and category style.
- **4.1:** Blog navigation uses “The project” and “All projects”.
- **4.4 / 4.7:** Added `display-title` to the blog h1 and entry h2s. Entry h2s use the body font, semibold, at `text-lg md:text-xl`.
- **4.8:** Capped the blog stats band at `max-w-3xl`, matching the intro text.

## Verification

- Read `AGENTS.md`, the design plan, and the installed Next.js guides for client/server components, images (`fill` / `sizes`) and CLI commands before implementation.
- **`npm run lint`: passed, exit 0**, in this isolated worktree, without extra flags.
- **`npm run build`: passed, exit 0**, in this isolated worktree using installed Next.js **16.4.0**. Existing installed dependencies were copied locally; no dependency manifests were edited.
- Ran **`npm run dev -- -p 3102`** from this worktree. Checked the contact form, project gallery and build log at **375 × 812** and **1440 × 900**. No horizontal overflow was observed on those routes at normal text size.
- Keyboard: Name → Email → Subject → Message → Send; required errors appear on blur, focus stays visible, and blank submit returns focus to Name. Malformed email uses the specified corrective message. Field validation leaves the server-result live region empty. Gallery keyboard opening, focus trapping, Escape dismissal and focus restoration passed.
- Gallery caption measured **11px**. Portrait and landscape frames measured **3:4** and **4:3** respectively. At a 1440 × 600 viewport the portrait frame measured **315 × 420**, exactly 70vh tall. Portrait blog prose follows the media rather than leaving an empty adjacent column. Desktop stats and intro text both measured **768px** wide. Entry titles use Hanken Grotesk at weight **600**.
- A temporary local proxy intercepted contact POSTs against a production build. Simulated a disconnected socket, HTTP 502 and success. Failure retained field contents, showed the mailto fallback, remained visible after 34 seconds, and cleared on edit. Success cleared the form, remained visible after 133 seconds, and cleared on reuse. The copy label appeared and reverted. **No test email was sent.**
- Validator checks passed for blank/whitespace fields, malformed email and valid trimmed inputs. `git diff --check` passed for the owned files.
- Recomputed contrast from the default color tokens and the input's blended background: input border **3.53:1** against the input / **3.34:1** against its surround; placeholder **4.72:1**; optional hint **7.85:1**; blog dates/captions **8.47:1**.

## Integration and remaining checks

- **Gemini / `src/app/globals.css`:** this branch intentionally only uses `display-title`; merge Gemini's definition from item 4.4 before judging final wrapped-title line height. It is absent from this branch's baseline stylesheet.
- **Unowned `eslint.config.mjs`:** plain lint in the original checkout scanned generated files inside `.claude/worktrees` and failed with 812 errors. Adding `.claude/**` to `globalIgnores`, or keeping worktrees outside that checkout, fixes that environment issue. Lint with `--ignore-pattern '.claude/**'` passed there; plain lint passed in this isolated worktree.
- The supplied checkout was actually shared: another agent switched it to `design/gemini` and replaced the dev server while work was in progress. The isolated worktree prevents further server/index collisions. Only the six assigned source files and this handoff belong in these commits.
- Live Resend delivery and actual screen-reader speech were not tested; send-result behavior used simulated responses, and accessibility checks verified DOM relationships and keyboard behavior.
- Full merged-site verification at 200% text size, reduced motion and increased contrast remains for the integration pass. No unowned source files or dependency manifests were changed by this patch.
