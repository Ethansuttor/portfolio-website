import { ImageResponse } from "next/og";
import { allProjects, getProjectBySlug } from "@/lib/projects";

/**
 * Per-project social card, so sharing a project link previews that project
 * rather than the generic site title. See the home card for Satori's CSS
 * limitations.
 */

export const alt = "Project — Ethan Suttor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Prerender a card for each project alongside the pages themselves. */
export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const title = project?.title ?? "Ethan Suttor";
  const category = project?.tag.split("—")[0].trim() ?? "Project";
  // Four chips is what fits on one row without wrapping at this size.
  const chips = project?.techStack.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          color: "#ededed",
          padding: "64px 80px",
          position: "relative",
        }}
      >
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

        <div style={{ display: "flex", flexDirection: "column" }}>
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
            {category}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: title.length > 42 ? 62 : 78,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {chips.map((chip) => (
              <div
                key={chip.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid #2e2e2e",
                  background: "#191919",
                  padding: "10px 18px",
                  marginRight: 14,
                  marginBottom: 14,
                  fontSize: 24,
                }}
              >
                <span style={{ color: "#fc8181", fontWeight: 800, marginRight: 10, fontSize: 19 }}>
                  {chip.category}
                </span>
                <span style={{ color: "#ededed", fontWeight: 600 }}>{chip.label}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 26,
              paddingTop: 26,
              borderTop: "2px solid #2e2e2e",
              fontSize: 28,
              color: "#a0a0a0",
            }}
          >
            <span style={{ color: "#ededed", fontWeight: 700, marginRight: 14 }}>Ethan Suttor</span>
            <span>ethansuttor.com</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
