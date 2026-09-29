import { ImageResponse } from "next/og";
import { allProjects, getProjectBySlug } from "@/lib/projects";
import { ChipMark, og, publicImage } from "@/lib/og";

/**
 * Per-project social card, so sharing a project link previews that project
 * rather than the generic site title: its title and main parts on the left,
 * its cover photo on the right. See the home card for Satori's CSS limits.
 */

export const alt = "Project by Ethan Suttor";
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
  // Four chips is what fits in the left column without a third row.
  const chips = project?.techStack.slice(0, 4) ?? [];
  const cover = project?.images[0];
  const photo = cover ? await publicImage(cover.poster ?? cover.src) : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: og.background, color: og.text }}>
        <div
          style={{
            width: photo ? 700 : 1200,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 56px 56px 72px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 24, color: og.muted, marginBottom: 22 }}>
              {project?.tag ?? "Project"}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: title.length > 40 ? 56 : 68,
                letterSpacing: -1.5,
                lineHeight: 1.02,
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
                    flexDirection: "column",
                    border: `2px solid ${og.line}`,
                    background: og.panel,
                    padding: "10px 16px",
                    marginRight: 12,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ color: og.muted, fontSize: 15, letterSpacing: 2 }}>{chip.category}</span>
                  <span style={{ fontSize: 24 }}>{chip.label}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 22,
                paddingTop: 22,
                borderTop: `2px solid ${og.line}`,
                fontSize: 26,
                color: og.muted,
              }}
            >
              <ChipMark size={40} />
              <span style={{ color: og.text, marginLeft: 14, marginRight: 14 }}>Ethan Suttor</span>
              <span style={{ color: og.gold }}>ethansuttor.com</span>
            </div>
          </div>
        </div>

        {photo && (
          // Satori renders plain <img>, not next/image.
          <img
            src={photo}
            alt=""
            width={500}
            height={630}
            style={{ width: 500, height: 630, objectFit: "cover", borderLeft: `2px solid ${og.line}` }}
          />
        )}
      </div>
    ),
    size,
  );
}
