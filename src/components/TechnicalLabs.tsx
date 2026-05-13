"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

/* ────────────────────────────────────────────────────
   LAB DATA
   ──────────────────────────────────────────────────── */

const counterPhotos = [
  { src: "/assets/basys3jpg.jpg", alt: "Basys3 Production Board", caption: "Hardware Implementation — Basys3 FPGA" },
  { src: "/assets/counter_schematic.png", alt: "Synthesized Schematic — 10-bit Counter", caption: "Synthesized Schematic" },
  { src: "/assets/counter_device_layout.png", alt: "FPGA Device Utilization Layout", caption: "Device Layout — Artix-7" },
];

const cmosPhotos = [
  { src: "/assets/tanner_ledit_inverter.png", alt: "CMOS Inverter Physical Layout", caption: "Inverter Physical Layout" },
];

const finishedRobotPhotos = [
  { src: "/assets/robot1.jpeg", alt: "Final Robot — Side Profile", caption: "Final Competition Chassis" },
  { src: "/assets/robot2.jpeg", alt: "Final Robot — Front View", caption: "Front Assembly — Deployment Ready" },
  { src: "/assets/robot3.jpeg", alt: "Final Robot — Internals", caption: "Control Board & Power Distribution" },
];

/* ────────────────────────────────────────────────────
   TECHNICAL LABS COMPONENT
   ──────────────────────────────────────────────────── */

export function TechnicalLabs() {
  const [activeCounterPhoto, setActiveCounterPhoto] = useState(0);
  const [activeRobotPhoto, setActiveRobotPhoto] = useState(0);

  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface" id="labs">
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-on-surface whitespace-nowrap">
            Technical Labs
          </h2>
          <div className="flex-1 h-[1px] bg-outline-variant/40"></div>
        </div>
        <p className="text-sm text-on-surface-variant mb-16">
          Specialized Systems & Robotics
        </p>
      </ScrollReveal>

      {/* ── Lab 01: 10-Bit Synchronous Up/Down Counter (Featured) ── */}
      <ScrollReveal delay={100}>
        <div className="group bg-surface-container-high border border-primary-container/30 hover:border-primary-container hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 mb-16">
          <div className="bg-primary-container/10 px-6 md:px-10 py-3 flex items-center justify-between border-b border-primary-container/20">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-primary-container rounded-full animate-pulse"></span>
              <span className="font-sans text-[0.65rem] font-bold text-on-primary-container uppercase tracking-[0.2em]">
                ECE 510/511 — VHDL FPGA — 10-Bit Counter
              </span>
            </div>
            <span className="font-sans text-[0.65rem] text-on-surface-variant/50 uppercase tracking-[0.2em] hidden sm:block">
              ECE 510/511 — Final Project
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 md:p-10 flex flex-col gap-6 ">
              <h3 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">
                FPGA Synchronous Data Pipeline & Display Controller
              </h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Implemented in VHDL across four independently-verified modules integrated at a top level. The debouncer uses a 16-bit shift register requiring all samples to match before asserting output. Binary output is converted to BCD via combinational integer division and driven to the 7-segment display.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 bg-background border-l-2 border-primary-container/20">
                    <span className="block text-[0.65rem] font-black text-primary uppercase tracking-widest mb-1">Debouncer</span>
                    <p className="text-on-surface-variant text-[0.7rem] italic">16-bit Shift Register Logic</p>
                 </div>
                 <div className="p-4 bg-background border-l-2 border-primary-container/20">
                    <span className="block text-[0.65rem] font-black text-primary uppercase tracking-widest mb-1">Utilization</span>
                    <p className="text-on-surface-variant text-[0.7rem] italic">117 / 20,800 Artix-7 Slices</p>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-4 md:p-6 bg-background/30">
              <div className="flex flex-col gap-3">
                <div className="relative w-full aspect-[4/3] border border-outline-variant/20 hover:border-primary-container/40 transition-colors duration-500 overflow-hidden bg-background">
                  <Image
                    src={counterPhotos[activeCounterPhoto].src}
                    alt={counterPhotos[activeCounterPhoto].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
                  <span className="absolute bottom-3 left-3 text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-background/80 px-2 py-1">
                    {counterPhotos[activeCounterPhoto].caption}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {counterPhotos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCounterPhoto(i)}
                      className={`relative aspect-[4/3] border overflow-hidden transition-all duration-300 cursor-pointer bg-transparent p-0 ${
                        i === activeCounterPhoto ? "border-primary-container ring-1 ring-primary-container" : "border-outline-variant/20 opacity-50"
                      }`}
                    >
                      <Image src={photo.src} alt={photo.alt} fill sizes="120px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Lab 02: CMOS VLSI Layout ── */}
      <ScrollReveal delay={200}>
        <div className="bg-surface-container-high border-t border-b border-outline-variant/10 p-8 md:p-12 mb-16 hover:bg-surface-container-highest/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-1 flex items-start justify-center">
              <span className="font-sans text-4xl font-black text-primary-container">02</span>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-primary font-sans text-[0.6rem] tracking-[0.2em] font-bold uppercase">Physical Design — Tanner EDA</span>
                <h3 className="text-2xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">CMOS VLSI Layout & Delay Analysis</h3>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-sm italic">
                Captured schematics and designed physical layouts for foundational CMOS logic gates in Tanner L-Edit. Conducted T-Spice transient simulations to measure propagation delay across varying capacitive loads.
              </p>
              <div className="flex flex-wrap gap-4">
                 {["L-Edit", "T-Spice", "DRC Verification", "tpHL/tpLH"].map(tag => (
                   <span key={tag} className="text-[0.6rem] font-black text-primary/40 uppercase tracking-tighter tabular-nums">{tag}</span>
                 ))}
              </div>
            </div>
            <div className="lg:col-span-4 relative aspect-video border border-outline-variant/20 overflow-hidden">
               <Image src={cmosPhotos[0].src} alt={cmosPhotos[0].alt} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-x-0 bottom-0 bg-background/80 p-2 text-[0.65rem] font-sans text-primary text-center uppercase tracking-widest">{cmosPhotos[0].caption}</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Lab 03: ECE 565 Final Competition ── */}
      <ScrollReveal delay={200}>
        <div className="group bg-surface-container-high border border-primary-container/10 hover:border-primary-container/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 mb-20">
          <div className="bg-surface-container-highest/20 px-6 md:px-10 py-3 flex items-center justify-between border-b border-outline-variant/10 font-sans text-[0.65rem] text-on-surface-variant/40 tracking-[0.2em] uppercase">
            ECE 565 — Final Competition
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 md:p-10 flex flex-col gap-6 ">
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors tracking-tight duration-300">
                Autonomous Robot Final Competition
              </h3>
              <p className="text-on-surface-variant leading-relaxed text-sm max-w-2xl mb-6">
                The performance phase of the platform, executing the finalized PID-based navigation and obstacle avoidance logic (weighted as 25% algorithm / 25% design). Successfully navigated the high-stakes competition track by modulating continuous wheel speed differentials to handle variable trajectories while accounting for ambient light fluctuations, tire friction losses, and potential opponent collisions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-4 bg-background border-l-2 border-primary-container/20">
                    <span className="block text-[0.65rem] font-black text-primary uppercase tracking-widest mb-1">Kinematics</span>
                    <p className="text-on-surface-variant text-[0.7rem] italic">Differential-Drive Tracking</p>
                 </div>
                 <div className="p-4 bg-background border-l-2 border-primary-container/20">
                    <span className="block text-[0.65rem] font-black text-primary uppercase tracking-widest mb-1">Logic</span>
                    <p className="text-on-surface-variant text-[0.7rem] italic">Continuous Speed Differential</p>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-4 md:p-6 bg-background/30">
              <div className="flex flex-col gap-3">
                <div className="relative w-full aspect-[4/3] border border-outline-variant/20 hover:border-primary-container/40 transition-colors duration-500 overflow-hidden bg-background">
                  {finishedRobotPhotos[activeRobotPhoto] ? (
                    <>
                      <Image
                        src={finishedRobotPhotos[activeRobotPhoto].src}
                        alt={finishedRobotPhotos[activeRobotPhoto].alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
                      <span className="absolute bottom-3 left-3 text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-background/80 px-2 py-1">
                        {finishedRobotPhotos[activeRobotPhoto].caption}
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-sans text-[0.6rem] text-primary/40">
                      No image available
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {finishedRobotPhotos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveRobotPhoto(i)}
                      className={`relative aspect-[4/3] border overflow-hidden transition-all duration-300 cursor-pointer bg-transparent p-0 ${
                        i === activeRobotPhoto ? "border-primary-container ring-1 ring-primary-container" : "border-outline-variant/20 opacity-50"
                      }`}
                    >
                      <Image src={photo.src} alt={photo.alt} fill sizes="120px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Lab 04: POSIX Multi-threading ── */}
      <ScrollReveal delay={300}>
        <div className="bg-surface-container-low p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start hover:bg-surface-container-high hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group border border-outline-variant/10">
          <div className="w-full md:w-1/4">
            <span className="text-primary font-sans text-[0.65rem] font-bold tracking-[0.2em] block mb-2">CSE 420</span>
            <h4 className="text-sm font-bold text-on-surface/80 uppercase tracking-widest underline decoration-primary/30 underline-offset-8">Lab Entry 04</h4>
          </div>

          <div className="w-full md:w-3/4">
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors tracking-tight duration-300">POSIX Multi-threading & IPC</h3>
            <div className="p-6 bg-background border-l-2 border-primary-container/40 hover:border-primary transition-colors duration-300 font-mono text-sm leading-relaxed text-on-surface-variant italic">
               Engineered a Linux keyword search server in C. Spawned per-client child processes and pthread workers, utilizing System V message queues for IPC and custom word-boundary parsing for high-throughput, concurrent file searching.
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
               {["pthreads", "System V Queues", "C / Linux", "Concurrency"].map(t => (
                 <span key={t} className="text-[0.6rem] font-black text-primary/40 uppercase tracking-tighter">{t}</span>
               ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
