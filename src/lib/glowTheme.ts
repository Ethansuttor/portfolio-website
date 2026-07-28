import type { BorderGlowProps } from "@/components/BorderGlow";

/**
 * Shared BorderGlow tuning for the project cards.
 *
 * Kept out of BorderGlow.tsx so that component stays a clean copy of the
 * upstream React Bits source and can be re-synced without losing theming.
 *
 * Tuning notes:
 *  - glowIntensity   multiplies every glow-ring opacity. Lower = softer.
 *  - edgeSensitivity is the proximity threshold (0-100) before the glow shows
 *    at all, so higher = the glow only wakes up right at the border.
 *  - fillOpacity     scales the inner mesh-gradient wash across the card face.
 */
export const projectGlow = {
  glowColor: "355 85 60",
  colors: ["#ff4d4d", "#e60000", "#990000"],
  glowIntensity: 0.5,
  edgeSensitivity: 35,
  fillOpacity: 0.25,
  borderRadius: 8,
} satisfies Partial<BorderGlowProps>;
