import { SectionHeading } from "@/components/SectionHeading";

const skillCategories = [
  {
    title: "Hardware design and analysis",
    skills: [
      "PCB design (KiCad, Altium)",
      "Power tree design",
      "System architecture",
      "Tanner EDA (L-Edit, S-Edit, T-Spice)",
      "DRC and LVS checks",
      "SolidWorks",
      "Oscilloscopes",
      "Logic analyzers",
    ]
  },
  {
    title: "Firmware and logic",
    skills: [
      "C",
      "C++",
      "VHDL",
      "STM32 (Cortex-M4)",
      "AVR (ATmega328PB)",
      "ESP32 / Arduino",
      "SPI / UART / PWM",
      "DMA and timers",
      "Interrupt handlers (ISRs)",
      "Betaflight",
    ]
  },
  {
    title: "Systems and tools",
    skills: [
      "Xilinx Vivado 2024.2",
      "Linux (POSIX, IPC)",
      "Python",
      "MATLAB",
      "OpenCV",
      "Git",
      "Soldering and SMD reflow",
    ]
  }
];

export function TechnicalMatrix() {
  return (
    <section id="skills" className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading title="Skills" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <h3 className="display text-on-surface text-[1.3rem] leading-[1] mb-5">{category.title}</h3>
              <ul className="border-t border-outline-variant">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="py-2.5 border-b border-outline-variant/70 text-on-surface/90"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
