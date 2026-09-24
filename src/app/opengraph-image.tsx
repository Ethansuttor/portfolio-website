import { ImageResponse } from "next/og";
import { ChipMark, og, publicImage } from "@/lib/og";

/**
 * Social card for the home page: the name and one line on the left, the board
 * photo from the hero on the right.
 *
 * Rendered by Satori, which supports only a subset of CSS: flexbox only, and
 * any element with more than one child needs an explicit `display: flex`.
 */

export const alt = "Ethan Suttor, electrical engineering portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const board = await publicImage("/assets/hero-board.jpg");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: og.background, color: og.text }}>
        <div
          style={{
            width: 640,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 60px 72px",
          }}
        >
          <ChipMark size={56} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, color: og.muted, marginBottom: 18 }}>
              Electrical engineering, University of Louisville
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 100,
                letterSpacing: -3,
                lineHeight: 0.92,
                textTransform: "uppercase",
              }}
            >
              <span>Ethan</span>
              <span>Suttor</span>
            </div>
            <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, marginTop: 24, maxWidth: 500, color: og.muted }}>
              I lay out circuit boards and write the firmware that runs on them.
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 26, color: og.gold }}>ethansuttor.com</div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>, not next/image */}
        <img
          src={board}
          alt=""
          width={560}
          height={630}
          style={{ width: 560, height: 630, objectFit: "cover", borderLeft: `2px solid ${og.line}` }}
        />
      </div>
    ),
    size,
  );
}
