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
- `npm audit` reports high-severity findings in `postcss` via Next's bundled
  copy, and in the eslint plugin tree. Both are build-time only and neither is
  reachable at runtime; the postcss one cannot be fixed without downgrading
  Next.js to 9.x. Re-check after each Next.js upgrade.

## Project layout

```
src/
  app/
    page.tsx              Home page — assembles the section components
    layout.tsx            Root layout, fonts, site-wide metadata
    globals.css           Design tokens + shared utility classes
    projects/
      page.tsx            All projects, one card each
      [slug]/page.tsx     Standalone page per project (statically generated)
    api/contact/route.ts  Contact form handler
    sitemap.ts robots.ts  SEO routes
  components/             Section and UI components
  lib/
    projects.ts           All project content lives here
    site.ts               Shared constants (resume path, social URLs, inbox)
    contact.ts            Field limits shared by the form and its API route
    glowTheme.ts          BorderGlow tuning for the project cards
public/assets/            Images, PDFs, and the .glb board model
assets-raw/               Unoptimized 3D source exports (git-ignored)
docs/                     Long-form source copy and the original design mockup
```

## Editing content

Project write-ups are data, not markup — edit `src/lib/projects.ts` and both the
`/projects` list and the per-project pages update together, since both render
the shared `ProjectArticle` component. `docs/CONTENT.md` and
`docs/01_Content_Master_Doc.md` hold the long-form source copy, including
material not currently published. Unused photos are still under `public/assets/`.

Adding a project: append an entry to `allProjects`. `featured: true` promotes it
to the home page; the first entry renders as the large hero card. `images` may be
empty, in which case the write-up renders full width.

## Notes

- `AGENTS.md` pins this repo to a pre-release Next.js canary. Check
  `node_modules/next/dist/docs/` before relying on framework behavior.
- That prerelease pin is also why `.npmrc` sets `legacy-peer-deps=true`. Semver
  says a prerelease never satisfies a plain range like `>= 13`, so any package
  declaring `next` as a peer fails to install with `ERESOLVE`. Vercel reads
  `.npmrc` at build time, so removing it breaks deploys, not just local installs.
- Vercel Analytics and Speed Insights mount in `layout.tsx`. Both inject their
  scripts client-side and no-op off Vercel, so the `/_vercel/*` 404s you see
  running locally are expected.
- The 3D viewer (`PcbGlbCanvas`) is loaded dynamically with `ssr: false` and
  pauses its render loop when scrolled out of view.
- The contact form carries a hidden honeypot field (`company`). A filled one gets
  a `200` with no mail sent, so bots see success and don't retry.
- `next.config.ts` no longer sets `images.dangerouslyAllowSVG`. Re-enable it if
  you add one of the KiCad `.svg` exports to a project gallery.
