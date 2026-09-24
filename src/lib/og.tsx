import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

/**
 * Shared pieces for the social cards (opengraph-image.tsx files). Satori can't
 * read CSS variables, so the site palette from globals.css is repeated here.
 */
export const og = {
  background: "#0a1c14",
  panel: "#0d2419",
  text: "#eef2ea",
  muted: "#a3b9aa",
  gold: "#e8be5e",
  line: "#23473a",
  outline: "#4f7a62",
  chip: "#183b29",
};

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/** Reads an image from public/ as a data URI, since Satori can't fetch
 *  site-relative URLs at build time. `src` is the path as the site uses it. */
export async function publicImage(src: string) {
  const data = await readFile(join(process.cwd(), "public", src));
  return `data:${MIME[extname(src).toLowerCase()] ?? "image/jpeg"};base64,${data.toString("base64")}`;
}

/** The ES chip mark from the header and favicon. */
export function ChipMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <g fill={og.gold}>
        <rect x="3" y="17" width="8" height="4" rx="1" />
        <rect x="3" y="30" width="8" height="4" rx="1" />
        <rect x="3" y="43" width="8" height="4" rx="1" />
        <rect x="53" y="17" width="8" height="4" rx="1" />
        <rect x="53" y="30" width="8" height="4" rx="1" />
        <rect x="53" y="43" width="8" height="4" rx="1" />
      </g>
      <rect x="9" y="9" width="46" height="46" rx="7" fill={og.chip} stroke={og.outline} strokeWidth="2.5" />
      <g fill="none" stroke={og.gold} strokeWidth="4.6" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M28.5 21 H19 V43 H28.5 M19 32 H26.5" />
        <path d="M45.5 21 H38.5 L35 24.5 V28.5 L38.5 32 H42 L45.5 35.5 V39.5 L42 43 H34.5" />
      </g>
    </svg>
  );
}
