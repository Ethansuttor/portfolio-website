export type ProjectImage = { src: string; alt: string; caption: string };
export type TechChip = { label: string; category: string };
export type TechDetail = { label: string; detail: string };

export type Project = {
  slug: string;
  featured: boolean;
  featuredIndex?: number;
  title: string;
  tag: string;
  subtitle?: string;
  techStack: TechChip[];
  summary: string;
  description: string;
  technicalDetails?: TechDetail[];
  objective?: string;
  architecture?: string;
  iteration?: string | null;
  images: ProjectImage[];
  githubHref: string;
};

export const allProjects: Project[] = [
  {
    slug: "custom-drone-flight-controller",
    featured: true,
    featuredIndex: 1,
    title: "Custom Drone Flight Controller PCB",
    tag: "Personal Project — PCB Design",
    subtitle: "Personal Project — PCB Design",
    techStack: [
      { label: "STM32F405", category: "MCU" },
      { label: "KiCad", category: "EDA" },
      { label: "Betaflight", category: "FIRMWARE" },
      { label: "Bosch BMI270", category: "IMU" },
      { label: "TPS5450", category: "POWER" },
    ],
    summary:
      "Custom-designed STM32-based flight controller PCB for FPV drones — dual-LDO power architecture (AP2112K + TLV733P), onboard TPS5450 buck converter from raw LiPo, Bosch BMI270 IMU, and custom Betaflight target (ETHANF405). Designed with staged power isolation for self-reflow assembly.",
    description:
      "Designed a custom STM32F405-based flight controller PCB for FPV drones running Betaflight firmware with a custom target configuration (ETHANF405). Engineered a dual-LDO power architecture (AP2112K-3.3 for logic/VDDIO and TLV733P-3.3 for IMU VDD) to strictly isolate noisy logic rails from the sensitive IMU power rail. When supply chain constraints rendered the original 426xx IMU family unavailable, this dedicated rail isolation allowed a seamless migration to the Bosch BMI270 gyro with only footprint and decoupling changes and zero power redesign. An onboard TPS5450 buck converter steps down raw 4S LiPo voltage to 5V/5A, compensating for the lack of a BEC on the mating Flycolor Raptor BLS-04 4-in-1 ESC. Features 16MB SPI NOR Flash (BY25Q128ES) for blackbox logging, FlySky FS-iA6B i-BUS receiver interface, and staged-jumper power isolation for safe bench bring-up.",
    technicalDetails: [
      { label: "MCU", detail: "STM32F405RGT6 (168MHz Cortex-M4 with FPU), running custom Betaflight target ETHANF405 with motor 4 remapped to PB5 (TIM3_CH2) to prevent DMA1 Stream 3 collisions" },
      { label: "Power Tree", detail: "TPS5450DDAR buck converter (VBAT to 5V/5A) with Panasonic POSCAP 220µF ESR-matched output cap; dual-LDO architecture (AP2112K for logic/VDDIO, TLV733P for dedicated quiet IMU VDD)" },
      { label: "IMU", detail: "Bosch BMI270 6-axis MEMS gyro/accelerometer on isolated 3.3V sensor rail, mounted dead-center for optimal flight dynamics" },
      { label: "Blackbox", detail: "BOYAMICRO BY25Q128ES 16MB SPI NOR Flash for high-rate flight telemetry and PID tuning log capture" },
      { label: "Bring-Up", detail: "Normally-open solder jumpers split the power tree across 4 stages for current-limited bench testing; test points on all rails and scope ground loops" },
      { label: "PCB & Fab", detail: "~60×60mm 4-layer stackup (ENIG finish for LGA gyro) with single-sided SMD layout for hotplate reflow; mated to Flycolor Raptor BLS-04 ESC via 10-pin JST SH1.0 harness" },
    ],
    images: [
      { src: "/assets/3D-angled.png", alt: "Custom Drone Flight Controller PCB 3D Angled View", caption: "3D Board Render" },
      { src: "/assets/STM32.png", alt: "STM32 MCU Schematic & Signal Routing", caption: "MCU & Core Logic" },
      { src: "/assets/3d-viewer-PDB.png", alt: "Power Architecture & TPS5450 Buck Converter", caption: "Power Tree & Buck Converter" },
      { src: "/assets/PCB-Back.png", alt: "Flight Controller PCB Bottom Layer", caption: "PCB Bottom Layer" },
    ],
    githubHref: "https://github.com/Ethansuttor/drone_PCB",
  },
  {
    slug: "dual-factor-hardware-security",
    featured: true,
    featuredIndex: 2,
    title: "Dual-Factor Hardware Security System",
    tag: "Academic Project — Microcontrollers",
    subtitle: "Academic Project — Microcontrollers",
    techStack: [
      { label: "ATmega328PB", category: "MCU" },
      { label: "Bare-Metal C", category: "LANGUAGE" },
      { label: "AVR-GCC", category: "TOOLCHAIN" },
      { label: "UART + PWM", category: "INTERFACE" },
    ],
    summary:
      "Two-factor authentication lock in bare-metal C on an ATmega328PB. Keypad entry, UART second factor, and servo actuation via Timer1 Fast PWM.",
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
    githubHref: "https://github.com/Ethansuttor/ECE-412-Microcontrollers",
  },
  {
    slug: "fpga-hierarchical-alu",
    featured: true,
    featuredIndex: 3,
    title: "FPGA Hierarchical ALU & 7-Segment Display Controller",
    tag: "Academic Capstone — Digital Design",
    subtitle: "Academic Capstone — Digital Design",
    techStack: [
      { label: "Artix-7 Basys3", category: "BOARD" },
      { label: "VHDL", category: "LANGUAGE" },
      { label: "Xilinx Vivado 2024.2", category: "TOOLCHAIN" },
      { label: "ILA", category: "DEBUG" },
    ],
    summary:
      "10-bit synchronous up/down counter in VHDL on an Artix-7 Basys3 — four modular subcomponents, BCD conversion, TDM 7-segment display. 117 of 20,800 logic slices utilized.",
    description:
      "Designed and implemented a 10-bit synchronous up/down counter in VHDL on an Artix-7 Basys3, integrating four modular subcomponents into a synthesized top-level architecture. The counter operates over a 0-to-1000 range, with each clock pulse triggered manually via the debounced center push button (BTNC). Direction (SW13), synchronous preset from SW0–SW9 (SW14), and asynchronous reset (SW15) are all switch-controlled. The binary output is converted to four-digit BCD by a standalone converter, then displayed on the 7-segment array via time-division multiplexing.",
    technicalDetails: [
      { label: "Debouncer", detail: "16-bit shift register clocked at 100MHz; output changes state only on all-high or all-low shift register, suppressing contact bounce on BTNC" },
      { label: "Counter", detail: "10-bit synchronous design with async reset priority, synchronous preset with overflow clamping to 1000, and up/down wraparound logic" },
      { label: "BCD Converter", detail: "Integer division and modulo on CONV_INTEGER output; results packed into 16-bit BCD vector" },
      { label: "SSD Driver", detail: "20-bit free-running counter; top 2 bits select active digit and anode; 100MHz refresh" },
      { label: "Verification", detail: "Each submodule verified with dedicated testbenches (signal assertions, waveform inspection) before top-level integration in Vivado" },
      { label: "Footprint", detail: "117 / 20,800 Artix-7 logic slices utilized post-synthesis" },
    ],
    images: [
      { src: "/assets/basys3jpg.jpg", alt: "Basys3 FPGA Production Board", caption: "Hardware — Basys3 FPGA" },
      { src: "/assets/counter_schematic.png", alt: "Synthesized Schematic", caption: "Synthesized Schematic" },
      { src: "/assets/counter_device_layout.png", alt: "FPGA Device Utilization Layout", caption: "Device Layout — Artix-7" },
    ],
    githubHref: "https://github.com/Ethansuttor/ECE-510-511-FPGA",
  },
  {
    slug: "cmos-vlsi-physical-layout",
    featured: false,
    title: "CMOS VLSI Physical Layout & Delay Analysis",
    tag: "Academic Project — Integrated Circuits",
    techStack: [
      { label: "Tanner L-Edit", category: "TOOL" },
      { label: "T-Spice", category: "SIM" },
      { label: "DRC/LVS", category: "VERIFY" },
      { label: "250nm Process", category: "PROCESS" },
    ],
    summary:
      "Full CMOS cell library designed in Tanner EDA targeting a 250nm process — from manual inverter layout through a 2-bit parallel adder placed in a pad frame, verified with DRC/LVS.",
    description:
      "Designed and verified a complete CMOS cell library from scratch in Tanner EDA, targeting a 250nm process (Generic_250nm_Devices, W/L = 1.5μm/250nm), progressing from individual transistor layouts up to a 2-bit parallel adder placed within a full pad frame.",
    objective:
      "Designed and verified a complete CMOS cell library from scratch in Tanner EDA, targeting a 250nm process (Generic_250nm_Devices, W/L = 1.5μm/250nm), progressing from individual transistor layouts up to a 2-bit parallel adder placed within a full pad frame.",
    architecture:
      "The CMOS inverter cell was laid out manually at 21.3 × 12.5 μm, confirmed with DRC, then re-generated via Schematic Driven Layout (SDL) from a T-Spice netlist export to cross-validate both flows. DC sweep produced a VTC with a switching threshold near 1.7V — below the ideal 2.5V midpoint due to the NMOS electron mobility advantage over the matched-width PMOS. Transient simulation at 50 MHz (20ns period, 1ns rise/fall) confirmed clean inversion. Subsequent labs added NAND/NOR, transmission gate, and D flip-flop cells, all reused as subcomponents in the final design: a 2-bit parallel adder (2 FA, 8 DFF, 3 TG, 1 inverter) placed within a pad frame, with a WRITE-controlled transmission gate output buffer and synchronous CK/_CK control interface.",
    iteration: null,
    images: [
      { src: "/assets/tanner_ledit_inverter.png", alt: "CMOS Inverter Physical Layout in Tanner L-Edit", caption: "Inverter Physical Layout" },
    ],
    githubHref: "https://github.com/Ethansuttor/ECE-515-VLSI",
  },
  {
    slug: "autonomous-vision-guided-robotics",
    featured: false,
    title: "Autonomous Vision-Guided Robotics Platform",
    tag: "Competition Build — Autonomous Systems",
    techStack: [
      { label: "C / kipr", category: "LANGUAGE" },
      { label: "PID Control", category: "ALGO" },
      { label: "OpenCV", category: "VISION" },
      { label: "MATLAB", category: "ANALYSIS" },
    ],
    summary:
      "1st place — C-based firmware for an autonomous mobile robot using Braitenberg light-following, PID wall-following, and QR-guided cube collection on a 4×6 ft competition arena.",
    description:
      "Wrote the C-based control firmware for an autonomous mobile robot on a Wallaby controller (kipr/wombat.h) with touch sensors, IR reflectance, CdS photoresistors, an E.T. distance sensor, and a USB camera.",
    objective:
      "Wrote the C-based control firmware for an autonomous mobile robot on a Wallaby controller (kipr/wombat.h) with touch sensors, IR reflectance, CdS photoresistors, an E.T. distance sensor, and a USB camera.",
    architecture:
      "Labs built up through reactive, Braitenberg, and closed-loop control paradigms. Lab 3 fused touch-sensor obstacle avoidance with IR-based line following into a single behavior-priority loop. Lab 4 implemented a Braitenberg light-follower: raw CdS readings (100–4000 range) normalized to 0–100% motor power, with a meta-sensing counter that detected repetitive bump cycles within a fixed time window and injected a random escape maneuver to break the loop. Lab 5 added a PID wall-following controller using the E.T./IR sensor, with data logged to arrays and plotted in MATLAB to compare P-gain values.",
    iteration:
      "Final competition: the robot autonomously collected color-coded cubes on a 4×6 ft arena, reading QR codes at the arena corners to determine the target cube color, and used a floor luminosity gradient to identify the home zone. 2-minute autonomous collection window. 1st place finish.",
    images: [
      { src: "/assets/robot1.jpeg", alt: "Final Robot — Side Profile", caption: "Final Competition Chassis" },
      { src: "/assets/robot2.jpeg", alt: "Final Robot — Front View", caption: "Front Assembly" },
      { src: "/assets/robot3.jpeg", alt: "Final Robot — Internals", caption: "Control Board & Power Distribution" },
    ],
    githubHref: "https://github.com/Ethansuttor/ECE-565",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}
