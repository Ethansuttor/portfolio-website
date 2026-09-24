import Image from "next/image";

export function AboutMe() {
  return (
    <section id="about" className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-16 border-y border-outline-variant">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <figure className="lg:col-span-4 max-w-[18rem]">
          <div className="relative aspect-square rounded-full overflow-hidden border-2 border-outline-variant">
            <Image
              src="/assets/hero-photo.jpg"
              alt="Ethan Suttor"
              fill
              sizes="(max-width: 1024px) 384px, 30vw"
              className="object-cover scale-[1.12] origin-[42%_35%]"
            />
          </div>
          <figcaption className="text-sm text-on-surface-variant mt-3">Senior at UofL&apos;s J.B. Speed School of Engineering</figcaption>
        </figure>

        <div className="lg:col-span-8">
          <h2 className="display text-on-surface text-[clamp(2.2rem,5vw,4rem)] mb-10">About me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-on-surface-variant text-base md:text-lg leading-relaxed">
            <p>
              I&apos;m a senior electrical engineering student at the University of Louisville&apos;s Speed School, where most of
              my coursework has pulled me toward the hardware side: embedded systems, FPGA design, and VLSI physical layout.
            </p>
            <p>
              The flight controller started as a test: could I take an embedded system from a blank schematic to something
              that actually flies? It doesn&apos;t fly yet. The build log has everything that went wrong along the way,
              including the parts that make me look bad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
