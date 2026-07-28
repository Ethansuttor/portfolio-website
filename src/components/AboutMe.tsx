export function AboutMe() {
  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface" id="about">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-on-surface">About Me</h2>
        <div className="flex-1 h-[1px] bg-outline-variant/40" />
      </div>

      <div className="bg-surface-container-high border-l-4 border-primary-container p-8 md:p-12 hover:bg-surface-container-highest/50 transition-all duration-300 card-lift group shadow-lg">
        <div className="max-w-4xl text-base md:text-lg text-on-surface-variant leading-relaxed space-y-6">
          <p className="group-hover:text-on-surface transition-colors duration-300">
            I&apos;m a junior Electrical Engineering student at the University of Louisville&apos;s Speed School, where most of my coursework has pulled me toward the hardware side: embedded systems, FPGA design, and VLSI physical layout. I like knowing what the silicon is actually doing.
          </p>
          <p className="group-hover:text-on-surface transition-colors duration-300">
            Outside of class I work at the Speed Center for Innovation as an electrical engineering bench tech, helping students debug embedded systems and bring up PCBs. I also competed at SoutheastCon 2026, building a closed-loop motor controller with current sensing and IR encoder feedback for an autonomous competition platform.
          </p>
          <p className="text-primary font-medium tracking-wide">
            Currently I am working an electrical engineering co-op at Gaylor Electric in southern Indiana.
          </p>
        </div>
      </div>
    </section>
  );
}
