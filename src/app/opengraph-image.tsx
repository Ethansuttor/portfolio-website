import { ImageResponse } from "next/og";

/**
 * Social card for the home page.
 *
 * Replaces the old hardcoded hero-photo.jpg, which was a 400x400 square being
 * declared as 1200x630 — LinkedIn rejects large cards under 1200x627, so the
 * preview was either dropped or stretched.
 *
 * Rendered by Satori, which supports only a subset of CSS: flexbox only, and
 * any element with more than one child needs an explicit `display: flex`.
 */

export const alt = "Ethan Suttor — Electrical Engineering Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#111111",
          color: "#ededed",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Accent spine, echoing the border-l-4 cards on the site */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            background: "#991b1b",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#fc8181",
              fontWeight: 700,
              marginBottom: 28,
            }}
          >
            Electrical Engineering Portfolio
          </div>

          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            Ethan Suttor
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 700,
              color: "#fca5a5",
              marginTop: 18,
              letterSpacing: -1,
            }}
          >
            University of Louisville
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#a0a0a0",
              marginTop: 32,
              lineHeight: 1.4,
            }}
          >
            FPGA architecture · Embedded systems · Hardware/software co-design
          </div>
        </div>
      </div>
    ),
    size,
  );
}
