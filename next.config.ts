import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * `unsafe-inline` is required in both script-src and style-src and can't be
 * dropped without reworking the page:
 *  - script: the JSON-LD block in app/page.tsx is an inline <script>, and
 *    Next's own hydration bootstrap is inline too.
 *  - style: Tailwind injects inline <style> during dev, and next/font emits an
 *    inline font-face block.
 * Nonces would fix this, but they force every route to render dynamically,
 * which would give up the static prerendering this site relies on. For a site
 * that renders no user-supplied HTML, the trade is worth it.
 */
const isDev = process.env.NODE_ENV === "development";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  // three.js decodes the .glb board model through a WebAssembly transcoder, and
  // compiling any WASM module is blocked by script-src without this. Unlike
  // 'unsafe-eval' it permits WebAssembly *only* — eval() of strings stays
  // blocked, which is the part that actually turns an injection into RCE.
  "'wasm-unsafe-eval'",
  "https://va.vercel-scripts.com",
];

// React's development build calls eval() to reconstruct callstacks. This branch
// cannot be reached by `next build`, so 'unsafe-eval' is never served in
// production — but verify with `curl -I` after changing this file.
if (isDev) scriptSrc.push("'unsafe-eval'");

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  // The r3f canvas builds the .glb into worker/blob URLs.
  "worker-src 'self' blob:",
  // blob: — GLTFLoader re-fetches embedded textures through blob URLs.
  "connect-src 'self' blob: https://va.vercel-scripts.com",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Belt-and-braces alongside frame-ancestors, for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // 2 years, preload-eligible. Vercel terminates TLS for the custom domain.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// No SVGs currently reach next/image — every entry in lib/projects.ts is a
// raster file. If you add one of the KiCad .svg exports under public/assets to a
// project gallery, re-enable images.dangerouslyAllowSVG here.
const nextConfig: NextConfig = {
  // Don't advertise the framework to bots fingerprinting for known CVEs.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
