import Image from "next/image";
import Link from "next/link";
import { BUILD_LOG_HREF, GITHUB_URL, LINKEDIN_URL, RESUME_HREF } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

/**
 * Parts called out on the hero photo. x/y are percentages of the cropped
 * hero-board.jpg, measured off the real board; `side` is which way the label
 * reaches from its probe point.
 */
const callouts = [
  { x: 48.3, y: 39.8, side: "left", dy: -30, ref: "MCU", part: "STM32F405", note: "168 MHz Cortex-M4" },
  { x: 88.7, y: 42.2, side: "left", dy: 0, ref: "J2", part: "USB-C", note: "Flashing and config" },
  { x: 18, y: 49.5, side: "right", dy: 18, ref: "U3", part: "SPI flash", note: "Blackbox logging" },
  { x: 52.7, y: 65.5, side: "right", dy: 0, ref: "IMU", part: "BMI270", note: "Its own quiet 3.3 V rail" },
  { x: 74.7, y: 78.8, side: "left", dy: 0, ref: "U5", part: "TPS5450", note: "4S LiPo to 5 V / 5 A" },
] as const;

/** Copper routed across the background at 45°, each ending on a pad. Kept to
 *  the margins and the gutter between columns so none of it runs under text. */
const traces = [
  { d: "M-10 842 H300 L340 802 H560", pad: [560, 802] },
  { d: "M-10 876 H420 L452 844 H690", pad: [690, 844] },
  { d: "M1450 300 H1418 L1398 320 V540", pad: [1398, 540] },
  { d: "M1450 866 H1190 L1150 826 H960", pad: [960, 826] },
  { d: "M1010 -10 V26 L1062 78 H1200", pad: [1200, 78] },
  { d: "M1060 -10 V10 L1098 48 H1240", pad: [1240, 48] },
  { d: "M26 -10 V150", pad: [26, 150] },
  { d: "M712 -10 V380 L690 402 V560", pad: [690, 560] },
  { d: "M738 -10 V300", pad: [738, 300] },
] as const;

function HeroTraces() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {traces.map((t, i) => (
        <g key={t.d}>
          <path
            d={t.d}
            pathLength={1}
            className="trace-route"
            stroke="var(--trace)"
            strokeWidth={3}
            strokeLinejoin="round"
            style={{ animationDelay: `${i * 90}ms` }}
          />
          <circle
            cx={t.pad[0]}
            cy={t.pad[1]}
            r={7}
            className="trace-pad"
            fill="var(--background)"
            stroke="var(--primary)"
            strokeOpacity={0.45}
            strokeWidth={3}
            style={{ animationDelay: `${1300 + i * 90}ms` }}
          />
        </g>
      ))}
    </svg>
  );
}

function BoardPhoto() {
  return (
    <figure className="relative w-full max-w-[640px] mx-auto lg:mr-0">
      <div className="relative aspect-square rounded-md overflow-hidden border border-outline-variant">
        <Image
          src="/assets/hero-board.jpg"
          alt="The STM32F405 flight controller I designed, assembled after hotplate reflow"
          fill
          priority
          sizes="(max-width: 1024px) 92vw, 640px"
          className="object-cover"
        />
        {/* Pull the photo's dark table edge into the page. */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_30px_rgba(10,28,20,0.85)]" />

        {callouts.map((c, i) => (
          <div
            key={c.ref}
            className="callout absolute"
            style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${1100 + i * 160}ms` }}
          >
            <span className="absolute -left-[6px] -top-[6px] block w-3 h-3 rounded-full border-2 border-primary bg-background" />
            <span
              className={`absolute top-0 flex items-center ${c.side === "left" ? "right-2 flex-row-reverse" : "left-2"}`}
              style={{ transform: `translateY(calc(-50% + ${c.dy}px))` }}
            >
              <span className="block w-4 sm:w-8 h-px bg-primary/80" />
              <span className="whitespace-nowrap rounded-sm border border-primary/50 bg-background px-2 py-1 sm:px-2.5 sm:py-1.5">
                <span className="silk block text-[0.55rem] sm:text-[0.625rem] text-primary leading-tight">
                  {c.ref} · {c.part}
                </span>
                <span className="hidden sm:block text-[0.72rem] text-on-surface/85 leading-tight mt-0.5">
                  {c.note}
                </span>
              </span>
            </span>
          </div>
        ))}
      </div>

      <figcaption className="mt-4 text-sm text-on-surface-variant">
        My flight controller after hotplate reflow. It&apos;s in the airframe now, and it flips the moment it lifts off.{" "}
        <Link href={BUILD_LOG_HREF} className="text-primary underline-offset-4 hover:underline">
          Read the build log
        </Link>
      </figcaption>
    </figure>
  );
}

const facts = [
  { label: "Working", value: "Project engineer (part-time), Gaylor Electric" },
  { label: "Most interested in", value: "PCB design, embedded firmware, FPGAs" },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden mask-texture pt-28 pb-20 px-5 sm:px-8 lg:px-16">
      <HeroTraces />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-12 items-center">
        <div>
          <p className="text-on-surface-variant mb-6">Electrical engineering student, University of Louisville</p>

          <h1 className="display uppercase text-on-surface text-[clamp(2.4rem,12.4vw,7rem)] lg:text-[min(6.6vw,7rem)]">
            <span className="block">Ethan</span>
            <span className="block">Suttor</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg sm:text-xl md:text-[1.35rem] leading-snug text-on-surface">
            I lay out circuit boards and write the firmware that runs on them. The board in the photo is a drone flight
            controller I designed in KiCad and soldered myself.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn-gold px-6 py-3.5 text-[0.95rem]">
              See my projects
            </a>
            <a href={RESUME_HREF} download className="btn-ghost px-6 py-3.5 text-[0.95rem]">
              Download résumé
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub" className="btn-ghost w-[50px] h-[50px]">
              <GitHubIcon className="w-5 h-5" />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn-ghost w-[50px] h-[50px]">
              <LinkedInIcon className="w-[18px] h-[18px]" />
            </a>
          </div>

          <dl className="mt-12 pt-6 border-t border-outline-variant grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-on-surface-variant mb-1">{f.label}</dt>
                <dd className="text-on-surface text-[0.95rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <BoardPhoto />
      </div>
    </section>
  );
}
