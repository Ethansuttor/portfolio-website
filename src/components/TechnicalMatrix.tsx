import { ScrollReveal } from "./ScrollReveal";

const skillCategories = [
  {
    icon: "memory",
    title: "Hardware Design & Analysis",
    skills: [
      "System Architecture",
      "Tanner EDA (L-Edit, S-Edit, T-Spice)",
      "PCB Design (Altium, KiCAD)",
      "Oscilloscopes",
      "Logic Analyzers",
    ]
  },
  {
    icon: "developer_board",
    title: "Firmware & Logic",
    skills: [
      "C",
      "C++",
      "VHDL",
      "ISR / Hardware-level Interrupts",
    ]
  },
  {
    icon: "settings_input_component",
    title: "Systems & Tooling",
    skills: [
      "Xilinx Vivado 2024.2",
      "Linux OS (POSIX/IPC)",
      "Python",
      "Git",
      "Soldering",
    ]
  }
];

export function TechnicalMatrix() {
  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface-container-low border-b border-outline-variant/10" id="skills">
      <ScrollReveal className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-on-surface">Skills</h2>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-primary">University of Louisville</p>
        </div>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-outline-variant/10 border border-outline-variant/10">
        {skillCategories.map((category, idx) => (
          <ScrollReveal key={category.title} delay={idx * 100} direction="scale">
            <div className="bg-surface-container-high p-10 group hover:bg-surface-container-highest transition-all duration-300 h-full card-lift">
              <span 
                className="material-symbols-outlined text-primary text-4xl mb-6 block transition-transform duration-300 group-hover:scale-110" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {category.icon}
              </span>
              <h3 className="text-xl font-bold mb-6 text-on-surface uppercase tracking-tight">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="skill-pill bg-background text-on-surface/80 px-3 py-1.5 text-[0.65rem] font-mono tracking-wider border border-outline-variant/30 uppercase cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
