# ethansuttor.com

Personal engineering portfolio for Ethan Suttor — Electrical Engineering student
at the University of Louisville. Built with Next.js (App Router), React 19,
Tailwind CSS v4, and react-three-fiber for the interactive 3D PCB viewer.

## Getting started

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Environment

Copy `.env.example` to `.env.local` (git-ignored) and fill it in.

The contact form posts to `/api/contact`, which sends mail through
[Resend](https://resend.com) over plain HTTPS. `RESEND_API_KEY` is required;
without it the route returns a 500 and the form surfaces "Email service not
configured."

`CONTACT_FROM_EMAIL` is optional. Resend only accepts a sender on a domain you
have verified, so leave it unset until ethansuttor.com is verified — the route
falls back to Resend's shared `onboarding@resend.dev` sender.

Note the fallback sender's limitation if you ever revert to it: **it delivers
only to the address that owns the API key**, rejecting every other recipient
with a `403 validation_error`. A verified domain removes that restriction.

Mail is addressed to `CONTACT_TO_EMAIL` — a comma-separated list, so it can go
to several inboxes at once — falling back to `CONTACT_INBOX` in
`src/lib/site.ts`. `replyTo` is set to whatever address the visitor typed, so
replying in your mail client reaches them rather than yourself.

## Security

- `next.config.ts` sets CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy` and `Permissions-Policy` on every route, and disables
  `x-powered-by`. The CSP needs `'unsafe-inline'` for scripts and styles — see
  the comment in that file for why, and what it would cost to remove.
- The CSP includes `'wasm-unsafe-eval'` because the 3D viewer decodes the `.glb`
  through a WebAssembly transcoder; without it the model fails to load with a
  `CompileError`. It is **not** `'unsafe-eval'` — `eval()` of strings stays
  blocked in production. `'unsafe-eval'` is added in development only, because
  React's dev build needs it. After editing the CSP, check both:

  ```bash
  curl -sI http://localhost:3000/projects | grep -io "script-src[^;]*"
  ```
- `/api/contact` is rate limited to 5 submissions per IP per 10 minutes
  (`src/lib/rateLimit.ts`), rejects bodies over 16 KB, and carries a honeypot
  field. The limiter is instance-local, so it throttles a single abusive client
  but is not authoritative across a distributed flood; swap in Vercel KV or
  Upstash Redis if that ever matters.
- `npm audit` is clean as of Next.js 16.3.6. Re-check after each upgrade.
- Everything under `public/` is downloadable by anyone who guesses the URL, so
  keep unpublished files in `assets-raw/` instead. The public resume has the
  street address and phone number removed. Re-export it the same way when you
  update it.

## Project layout

```
src/
  app/
    page.tsx              Home page — assembles the section components
    layout.tsx            Root layout, fonts, site-wide metadata
    not-found.tsx         Branded 404 page
    globals.css           Design tokens + shared utility classes
    projects/
      page.tsx            All projects, one card each
      [slug]/page.tsx     Standalone page per project (statically generated)
    blog/drone-flight-controller/
      page.tsx            Flight controller build log (content in lib/buildLog.ts)
    api/contact/route.ts  Contact form handler
    sitemap.ts robots.ts  SEO routes
  components/             Section and UI components
  lib/
    projects.ts           All project content lives here
    site.ts               Shared constants (resume path, social URLs, inbox)
    contact.ts            Field limits shared by the form and its API route
    glowTheme.ts          BorderGlow tuning for the project cards
public/assets/            Images, PDFs, and the .glb board model
assets-raw/               Unoptimized 3D exports and unpublished photos (git-ignored)
docs/                     Long-form source copy and the original design mockup
```

## Editing content

Project write-ups are data, not markup — edit `src/lib/projects.ts` and both the
`/projects` list and the per-project pages update together, since both render
the shared `ProjectArticle` component. `docs/CONTENT.md` and
`docs/01_Content_Master_Doc.md` hold the long-form source copy, including
material not currently published. Unused photos live in `assets-raw/unpublished/`
(git-ignored) rather than `public/`, since everything under `public/` is served
to anyone who guesses the URL. Before moving a phone photo into `public/`, strip
its EXIF (GPS included) and resize it — see commit `70d83bd` for the settings.

Adding a project: append an entry to `allProjects`. `featured: true` promotes it
to the home page; the first entry renders as the large hero card. `images` may be
empty, in which case the write-up renders full width.

## Notes

- Next.js 16 changed enough that `AGENTS.md` asks agents to read
  `node_modules/next/dist/docs/` before relying on framework behavior.
- The site is on stable Next.js (16.3.x). It used to run a prerelease, which
  needed `legacy-peer-deps=true` in an `.npmrc` because packages declaring
  `next` as a peer rejected prerelease versions. On a stable release that file
  is no longer needed, so it's gone. Don't add it back when upgrading.
- `.github/workflows/ci.yml` runs lint (zero warnings allowed), `tsc` and a full
  build on every PR and push to `main`.
- Vercel Analytics and Speed Insights mount in `layout.tsx`. Both inject their
  scripts client-side and no-op off Vercel, so the `/_vercel/*` 404s you see
  running locally are expected.
- The 3D viewer (`PcbGlbCanvas`) is loaded dynamically with `ssr: false` and
  pauses its render loop when scrolled out of view.
- The contact form carries a hidden honeypot field (`company`). A filled one gets
  a `200` with no mail sent, so bots see success and don't retry.
- `next.config.ts` no longer sets `images.dangerouslyAllowSVG`. Re-enable it if
  you add one of the KiCad `.svg` exports to a project gallery.
