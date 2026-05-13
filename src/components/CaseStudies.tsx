'use client';

import { useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

/* ────────────────────────────────────────────────────
   FEATURED PROJECTS
   ──────────────────────────────────────────────────── */

const featuredProjects = [
  {
    title: "Dual-Factor Hardware Security System",
    subtitle: "Academic Project — Microcontrollers",
    tag: "Academic Project — Microcontrollers",
    techStack: [
      { label: "ATmega328PB", category: "MCU" },
      { label: "Bare-Metal C", category: "LANGUAGE" },
      { label: "AVR-GCC", category: "TOOLCHAIN" },
      { label: "UART + PWM", category: "INTERFACE" },
    ],
    description:
      "Implemented a two-factor authentication lock in bare-metal C on an ATmega328PB Xplained Mini. A 4x4 membrane switch keypad feeds a 30ms software debouncer that filters contact bounce on each keypress. A strcmp() call checks the entered 4-digit code, and on match, the firmware sends a prompt over UART to a connected terminal for a second password. A correct password triggers Timer1 in Fast PWM mode to output a 2.0ms duty-cycle pulse, actuating a Datan B1122 servo to unlock for 5 seconds. State transitions are managed entirely through ISRs.",
    technicalDetails: [
      { label: "Debouncer", detail: "30ms software debounce loop per keypress on 4x4 membrane matrix" },
      { label: "Code Match", detail: "strcmp() against stored 4-digit entry; immediate retry on mismatch" },
      { label: "UART", detail: "uart_putstr() prompt for second factor; password verified before actuating servo" },
      { label: "Actuation", detail: "Timer1 Fast PWM, 2.0ms pulse to Datan B1122 servo, 5-second unlock window" },
    ],
    images: [
      { src: "/assets/doorlock_hardware.jpeg", alt: "ATmega328PB Door Lock Hardware Prototype", caption: "Hardware Prototype" },
      { src: "/assets/doorlock_schematic.png", alt: "ATmega328PB Wiring Schematic", caption: "Wiring Schematic" },
      { src: "/assets/doorlock_flowchart.png", alt: "Program Flow Chart", caption: "Program Flow" },
    ],
    code: null as string | null,
    codeLabel: null as string | null,
    codeFile: null as string | null,
    githubHref: "https://github.com/Ethansuttor/ECE-412-Microcontrollers",
  },
  {
    title: "FPGA Hierarchical ALU & 7-Segment Display Controller",
    subtitle: "Academic Capstone — Digital Design",
    tag: "Academic Capstone — Digital Design",
    techStack: [
      { label: "Artix-7 Basys3", category: "BOARD" },
      { label: "VHDL", category: "LANGUAGE" },
      { label: "Xilinx Vivado 2024.2", category: "TOOLCHAIN" },
      { label: "ILA", category: "DEBUG" },
    ],
    description:
      "Built a hierarchical VHDL digital system in Xilinx Vivado on an Artix-7 Basys3, progressing from combinational primitives through clocked sequential logic to a top-level synthesized design. The final architecture instantiates a 2-bit adder (M1), a 2-bit subtractor (M2), and a 2:1 MUX (M3) forming a small ALU, with a select-driven output routed into a time-division multiplexed 7-segment display driver running off a 100MHz system clock. Each submodule was independently simulated with Vivado's Integrated Logic Analyzer before integration. Earlier labs established the component library: XOR2 and 4×8 MUX from gate primitives, a D flip-flop with synchronous enable and reset, and a 6-bit synchronous counter with terminal count output. The synthesized design used 117 of 20,800 available Artix-7 logic slices.",
    technicalDetails: [
      { label: "ALU", detail: "2-bit adder and subtractor instantiated as submodules, output selected by single-bit S signal" },
      { label: "Display", detail: "sev_seg TDM driver with 100MHz clock input, seg_out and seg_sel outputs; refresh rate tuned by counter bit selection" },
      { label: "Verification", detail: "ILA and behavioral simulation used independently per submodule before top-level integration" },
      { label: "Footprint", detail: "117 / 20,800 Artix-7 logic slices utilized post-synthesis" },
    ],
    images: [
      { src: "/assets/basys3jpg.jpg", alt: "Basys3 FPGA Production Board", caption: "Hardware — Basys3 FPGA" },
      { src: "/assets/counter_schematic.png", alt: "Synthesized Schematic", caption: "Synthesized Schematic" },
      { src: "/assets/counter_device_layout.png", alt: "FPGA Device Utilization Layout", caption: "Device Layout — Artix-7" },
    ],
    code: null as string | null,
    codeLabel: null as string | null,
    codeFile: null as string | null,
    githubHref: "https://github.com/Ethansuttor/ECE-510-511-FPGA",
  },
];

/* ────────────────────────────────────────────────────
   OTHER PROJECTS
   ──────────────────────────────────────────────────── */

const projects = [
  {
    title: "CMOS VLSI Physical Layout & Delay Analysis",
    objective: "Designed and verified a complete CMOS cell library from scratch in Tanner EDA, targeting a 250nm process (Generic_250nm_Devices, W/L = 1.5μm/250nm), progressing from individual transistor layouts up to a 2-bit parallel adder placed within a full pad frame.",
    tag: "Academic Project — Integrated Circuits",
    stack: "Tanner L-Edit, S-Edit, T-Spice, DRC/LVS, Schematic Driven Layout, 250nm process",
    architecture: "The CMOS inverter cell was laid out manually at 21.3 × 12.5 μm, confirmed with DRC, then re-generated via Schematic Driven Layout (SDL) from a T-Spice netlist export to cross-validate both flows. DC sweep produced a VTC with a switching threshold near 1.7V — below the ideal 2.5V midpoint due to the NMOS electron mobility advantage over the matched-width PMOS. Transient simulation at 50 MHz (20ns period, 1ns rise/fall) confirmed clean inversion. Subsequent labs added NAND/NOR, transmission gate, and D flip-flop cells, all reused as subcomponents in the final design: a 2-bit parallel adder (2 FA, 8 DFF, 3 TG, 1 inverter) placed within a pad frame, with a WRITE-controlled transmission gate output buffer and synchronous CK/_CK control interface.",
    iteration: null as string | null,
    image: "/assets/tanner_ledit_inverter.png",
    images: [
      { src: "/assets/tanner_ledit_inverter.png", alt: "CMOS Inverter Physical Layout in Tanner L-Edit", caption: "Inverter Physical Layout" },
    ],
    code: null as string | null,
    codeLabel: null as string | null,
    codeFile: null as string | null,
    githubHref: "https://github.com/Ethansuttor/ECE-515-VLSI",
  },
  {
    title: "Autonomous Vision-Guided Robotics Platform",
    objective: "Wrote the C-based control firmware for an autonomous mobile robot on a Wallaby controller (kipr/wombat.h), built over a LEGO Mindstorm chassis with touch sensors, IR reflectance, CdS photoresistors, an E.T. distance sensor, and a USB camera.",
    tag: "Competition Build — Autonomous Systems",
    stack: "C, kipr/wombat.h, Braitenberg & PID control, IR/CdS/E.T. sensors, USB camera, MATLAB",
    architecture: "Labs built up through reactive, Braitenberg, and closed-loop control paradigms. Lab 3 fused touch-sensor obstacle avoidance with IR-based line following into a single behavior-priority loop. Lab 4 implemented a Braitenberg light-follower: raw CdS readings (100–4000 range) normalized to 0–100% motor power, with a meta-sensing counter that detected repetitive bump cycles within a fixed time window and injected a random escape maneuver to break the loop. Lab 5 added a PID wall-following controller using the E.T./IR sensor, with data logged to arrays and plotted in MATLAB to compare P-gain values.",
    iteration: "Final competition: the robot autonomously collected color-coded cubes on a 4×6 ft arena, reading QR codes at the arena corners to determine the target cube color, and used a floor luminosity gradient to identify the home zone. 2-minute autonomous collection window.",
    image: "/assets/robot1.jpeg",
    images: [
      { src: "/assets/robot1.jpeg", alt: "Final Robot — Side Profile", caption: "Final Competition Chassis" },
      { src: "/assets/robot2.jpeg", alt: "Final Robot — Front View", caption: "Front Assembly" },
      { src: "/assets/robot3.jpeg", alt: "Final Robot — Internals", caption: "Control Board & Power Distribution" },
    ],
    code: null as string | null,
    codeLabel: null as string | null,
    codeFile: null as string | null,
    githubHref: "https://github.com/Ethansuttor/ECE-565",
  },
];

/* ────────────────────────────────────────────────────
   CODE VIEWER (collapsible)
   ──────────────────────────────────────────────────── */

function CodeViewer({ code, label, fileName }: { code: string; label: string; fileName: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 border border-outline-variant/20 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="code-viewer-content"
        className="w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-surface-container-high transition-colors duration-300 cursor-pointer border-none text-left"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-base transition-transform duration-300" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', fontVariationSettings: "'FILL' 1" }}>code</span>
          <span className="text-[0.65rem] font-bold text-on-surface uppercase tracking-[0.2em]">View Code</span>
          <span className="text-[0.65rem] font-mono text-primary/50 uppercase tracking-wider">{fileName}</span>
          <span className="text-[0.65rem] font-mono font-bold text-primary bg-primary-container/10 px-2 py-0.5 uppercase tracking-wider">{label}</span>
        </div>
        <span className="material-symbols-outlined text-on-surface/40 text-sm transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
      </button>

      <div
        id="code-viewer-content"
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? `${lines.length * 21 + 80}px` : '0px' }}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0d] border-t border-b border-outline-variant/10">
          <span className="text-[0.65rem] font-mono text-on-surface/30 uppercase tracking-wider">{lines.length} lines</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[0.6rem] font-mono uppercase tracking-wider text-primary/60 hover:text-primary transition-colors cursor-pointer bg-transparent border-none px-2 py-1"
          >
            <span className="material-symbols-outlined text-xs">{copied ? 'check' : 'content_copy'}</span>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="overflow-x-auto bg-[#0d0d0d] p-4">
          <pre className="font-mono text-[0.7rem] leading-[1.6] m-0">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-on-surface/15 w-8 text-right mr-4 flex-shrink-0 tabular-nums">{i + 1}</span>
                <span className="text-on-surface/70 whitespace-pre">{highlightVHDL(line)}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* Basic VHDL syntax highlighting */
function highlightVHDL(line: string): React.ReactNode {
  const commentIdx = line.indexOf('--');
  if (commentIdx >= 0) {
    const before = line.slice(0, commentIdx);
    const comment = line.slice(commentIdx);
    return <>{highlightVHDLTokens(before)}<span className="text-on-surface/25 italic">{comment}</span></>;
  }
  return highlightVHDLTokens(line);
}

function highlightVHDLTokens(text: string): React.ReactNode {
  const keywords = /\b(library|use|entity|is|port|in|out|end|architecture|signal|component|begin|port\s+map|all)\b/gi;
  const types = /\b(STD_LOGIC|STD_LOGIC_VECTOR|STD_LOGIC_1164|STD_LOGIC_ARITH|STD_LOGIC_UNSIGNED|IEEE|Behavioral)\b/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  const combined = new RegExp(`(${keywords.source})|(${types.source})`, 'gi');
  let match;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    const word = match[0];
    if (/^(library|use|entity|is|port|in|out|end|architecture|signal|component|begin)$/i.test(word)) {
      parts.push(<span key={match.index} className="text-primary font-semibold">{word}</span>);
    } else {
      parts.push(<span key={match.index} className="text-tertiary">{word}</span>);
    }
    lastIdx = match.index + word.length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return <>{parts}</>;
}

/* ────────────────────────────────────────────────────
   FEATURED IMAGE GALLERY
   ──────────────────────────────────────────────────── */

function ImageGallery({ images }: { images: typeof featuredProjects[0]['images'] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-[4/3] border border-outline-variant/20 hover:border-primary-container/40 transition-colors duration-500 overflow-hidden bg-background">
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none"></div>
        <span className="absolute bottom-3 left-3 text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-background/80 px-2 py-1">
          {images[active].caption}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View ${img.caption}`}
            aria-pressed={i === active}
            className={`relative aspect-[4/3] border overflow-hidden transition-all duration-300 cursor-pointer bg-transparent p-0 ${
              i === active
                ? 'border-primary-container ring-1 ring-primary-container/50'
                : 'border-outline-variant/20 opacity-50 hover:opacity-80'
            }`}
          >
            <Image src={img.src} alt={img.alt} fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   PROJECT IMAGE GALLERY (for other projects)
   ──────────────────────────────────────────────────── */

function ProjectImageGallery({ images }: { images: { src: string; alt: string; caption: string }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-[4/3] border border-outline-variant/20 hover:border-primary-container/40 transition-colors duration-500 overflow-hidden bg-background">
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
        <span className="absolute bottom-3 left-3 text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-background/80 px-2 py-1">
          {images[active].caption}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View ${img.caption}`}
            aria-pressed={i === active}
            className={`relative aspect-[4/3] border overflow-hidden transition-all duration-300 cursor-pointer bg-transparent p-0 ${
              i === active
                ? 'border-primary-container ring-1 ring-primary-container/50'
                : 'border-outline-variant/20 opacity-50 hover:opacity-80'
            }`}
          >
            <Image src={img.src} alt={img.alt} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   GITHUB BUTTON
   ──────────────────────────────────────────────────── */

function GitHubButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 border border-outline-variant/50 hover:border-primary text-on-surface-variant hover:text-primary bg-background hover:bg-primary-container/5 transition-all duration-300 text-[0.7rem] font-bold uppercase tracking-widest"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
      View Code on GitHub
    </a>
  );
}

/* ────────────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────────────── */

export function CaseStudies() {
  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface-container-low" id="projects">
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tighter text-on-surface">Projects</h2>
          <div className="flex-1 h-[1px] bg-outline-variant/40"></div>
        </div>
      </ScrollReveal>

      {/* ── FEATURED PROJECTS ────────────────────────── */}
      {featuredProjects.map((fp, fpIdx) => (
        <ScrollReveal key={fpIdx} className="mb-16" delay={fpIdx * 150}>
          <div className="group bg-surface-container-high border border-primary-container/30 hover:border-primary-container hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
            {/* Featured badge */}
            <div className="bg-primary-container/10 px-6 md:px-10 py-3 flex items-center justify-between border-b border-primary-container/20">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 bg-primary-container rounded-full animate-pulse"></span>
                <span className="font-sans text-[0.65rem] font-bold text-on-primary-container uppercase tracking-[0.2em]">
                  Featured Project {String(fpIdx + 1).padStart(2, '0')}
                </span>
              </div>
              <span className="font-sans text-[0.65rem] text-on-surface-variant/50 uppercase tracking-[0.2em] hidden sm:block">{fp.subtitle}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left: Content */}
              <div className="lg:col-span-7 p-6 md:p-10 flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-primary font-sans text-[0.65rem] tracking-[0.2em] font-bold uppercase">{fp.tag}</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">
                    {fp.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant/60 uppercase tracking-wider sm:hidden">{fp.subtitle}</p>
                </div>

                {/* Tech stack chips */}
                <div>
                  <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Technical Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {fp.techStack.map((chip) => (
                      <span
                        key={chip.label}
                        className="skill-pill bg-background text-on-surface/80 px-3 py-1.5 text-[0.6rem] font-sans tracking-wide border border-outline-variant/30 cursor-default flex items-center gap-2"
                      >
                        <span className="text-primary text-[0.6rem] font-black">{chip.category}</span>
                        {chip.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Overview</span>
                  <p className="text-on-surface-variant leading-relaxed text-sm">{fp.description}</p>
                </div>

                {/* Technical detail bullets */}
                <div>
                  <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Implementation</span>
                  <div className="space-y-2">
                    {fp.technicalDetails.map((item) => (
                      <div key={item.label} className="flex gap-3 items-start p-3 bg-background/60 border-l-2 border-outline-variant/20 hover:border-primary/60 transition-colors duration-300">
                        <span className="text-[0.6rem] font-black text-primary uppercase tracking-wider whitespace-nowrap min-w-[4.5rem]">{item.label}</span>
                        <span className="text-on-surface-variant text-xs leading-relaxed">{item.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code viewer if present */}
                {fp.code && fp.codeLabel && fp.codeFile && (
                  <CodeViewer code={fp.code} label={fp.codeLabel} fileName={fp.codeFile} />
                )}

                {/* GitHub Link */}
                <GitHubButton href={fp.githubHref} />
              </div>

              {/* Right: Image gallery */}
              <div className="lg:col-span-5 p-4 md:p-6 bg-background/30">
                <ImageGallery images={fp.images} />
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}

      {/* ── OTHER PROJECTS ───────────────────────────── */}
      <div className="flex flex-col gap-12">
        {projects.map((project, idx) => (
          <ScrollReveal key={idx} delay={idx * 120}>
            <div className="group bg-surface-container-high border-t border-outline-variant/20 hover:border-primary-container/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12">

                <div className="lg:col-span-1 p-6 bg-background flex items-start justify-center">
                   <span className="project-number font-sans text-4xl font-black text-primary-container">
                     {idx + featuredProjects.length + 1}
                   </span>
                </div>

                <div className="lg:col-span-7 p-6 md:p-10 flex flex-col gap-6 md:gap-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-primary font-sans text-[0.65rem] tracking-[0.2em] font-bold uppercase">{project.tag}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm">
                    <div>
                      <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Objective</span>
                      <p className="text-on-surface-variant leading-relaxed">{project.objective}</p>
                    </div>
                    <div>
                      <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Technical Stack</span>
                      <p className="text-on-surface-variant leading-relaxed">{project.stack}</p>
                    </div>
                  </div>

                  <div>
                     <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Implementation</span>
                     <p className="text-on-surface-variant leading-relaxed text-sm italic">{project.architecture}</p>
                  </div>

                  {project.iteration && (
                    <div className="p-4 bg-primary-container/5 border-l-2 border-primary-container hover:bg-primary-container/10 transition-colors duration-300">
                      <span className="block text-[0.65rem] font-black text-primary uppercase tracking-widest mb-1">Iteration Notes</span>
                      <p className="text-on-surface-variant text-xs leading-relaxed">{project.iteration}</p>
                    </div>
                  )}

                  {project.code && project.codeLabel && project.codeFile && (
                    <CodeViewer code={project.code} label={project.codeLabel} fileName={project.codeFile} />
                  )}

                  {/* GitHub Link */}
                  <GitHubButton href={project.githubHref} />
                </div>

                <div className="lg:col-span-4 relative bg-background/50 overflow-hidden p-4 md:p-6">
                  {project.images ? (
                    <ProjectImageGallery images={project.images} />
                  ) : (
                    <div className="relative w-full h-full min-h-[16rem] border border-outline-variant/20 hover:border-primary-container/40 transition-colors duration-500 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover opacity-80 hover:opacity-100 transition-all duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
