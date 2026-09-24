export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
  /** Set when the slot holds a clip instead of a still. */
  video?: boolean;
  /** Still frame for a clip — used by thumbnails and before the video loads. */
  poster?: string;
};
export type TechChip = { label: string; category: string };
export type TechDetail = { label: string; detail: string };

export type Project = {
  slug: string;
  featured: boolean;
  title: string;
  tag: string;
  techStack: TechChip[];
  summary: string;
  description: string;
  technicalDetails?: TechDetail[];
  /** Long-form prose sections. Each renders only when present. */
  objective?: string;
  architecture?: string;
  iteration?: string;
  images: ProjectImage[];
  githubHref: string;
  /** Set when the project has a dated build log to link out to. */
  blogHref?: string;
};

export const allProjects: Project[] = [
  {
    slug: "custom-drone-flight-controller",
    featured: true,
    title: "Custom Drone Flight Controller PCB",
    tag: "Personal project · PCB design",
    techStack: [
      { label: "STM32F405", category: "MCU" },
      { label: "KiCad", category: "EDA" },
      { label: "Betaflight", category: "FIRMWARE" },
      { label: "Bosch BMI270", category: "IMU" },
      { label: "TPS5450", category: "POWER" },
    ],
    summary:
      "An STM32F405 flight controller for a 4S FPV quad, running Betaflight on a target I wrote (ETHANF405). The gyro gets its own LDO so logic noise stays off its rail, and a TPS5450 buck makes 5 V straight from the pack. Solder jumpers split the power tree, so I could bring the board up one stage at a time.",
    description:
      "A flight controller for an FPV quad, built around an STM32F405 and running Betaflight on a custom target (ETHANF405). There are two 3.3 V LDOs: an AP2112K for the logic and a TLV733P that feeds only the IMU, so switching noise from the MCU never reaches the gyro. That split paid off when the 426xx IMU I designed around went out of stock. Swapping to a Bosch BMI270 meant a new footprint and new decoupling caps, and nothing in the power tree had to change. The ESC I paired it with (a Flycolor Raptor BLS-04) has no BEC, so the board makes its own 5 V at up to 5 A from the 4S pack with a TPS5450 buck. It also has SPI flash for blackbox logs, an i-BUS input for a FlySky FS-iA6B receiver, and solder jumpers that keep each power stage disconnected until I close them on the bench.",
    technicalDetails: [
      { label: "MCU", detail: "STM32F405RGT6 (168MHz Cortex-M4 with FPU), running custom Betaflight target ETHANF405 with motor 4 remapped to PB5 (TIM3_CH2) to prevent DMA1 Stream 3 collisions" },
      { label: "Power Tree", detail: "TPS5450DDAR buck converter (VBAT to 5V/5A) with Panasonic POSCAP 220µF ESR-matched output cap; dual-LDO architecture (AP2112K for logic/VDDIO, TLV733P for dedicated quiet IMU VDD)" },
      { label: "IMU", detail: "Bosch BMI270 6-axis MEMS gyro/accelerometer on isolated 3.3V sensor rail, mounted at the center of the board" },
      { label: "Blackbox", detail: "BOYAMICRO BY25Q128ES 16MB SPI NOR Flash for high-rate flight telemetry and PID tuning log capture" },
      { label: "Bring-Up", detail: "Normally-open solder jumpers split the power tree across 4 stages for current-limited bench testing; test points on all rails and scope ground loops" },
      { label: "PCB & Fab", detail: "~60×60mm 4-layer stackup (ENIG finish for LGA gyro) with single-sided SMD layout for hotplate reflow; mated to Flycolor Raptor BLS-04 ESC via 10-pin JST SH1.0 harness" },
    ],
    images: [
      { src: "/assets/drone-pcb-assembled.jpeg", alt: "Assembled STM32F405 flight controller PCB after hotplate reflow", caption: "Assembled Board" },
      { src: "/assets/STM32.png", alt: "STM32 MCU Schematic & Signal Routing", caption: "MCU & Core Logic" },
      {
        src: "/assets/drone-motor-spin.mp4",
        alt: "Bench test: the flight controller spins a brushless motor from FlySky transmitter throttle input",
        caption: "Motor Spin-Up Test",
        video: true,
        poster: "/assets/drone-motor-spin-poster.jpg",
      },
      { src: "/assets/PCB-Back.png", alt: "Flight Controller PCB Bottom Layer", caption: "PCB Bottom Layer" },
      {
        src: "/assets/drone-airframe-bench.jpg",
        alt: "Flight controller board mounted to the quadcopter frame on the bench, motors and receiver wired in",
        caption: "Airframe Wiring",
      },
      {
        src: "/assets/drone-airframe-assembled.jpg",
        alt: "Completed quadcopter with the custom flight controller, props and LiPo pack fitted, sitting on a tripod",
        caption: "Assembled Quadcopter",
      },
    ],
    githubHref: "https://github.com/Ethansuttor/drone_PCB",
    blogHref: "/blog/drone-flight-controller",
  },
  {
    slug: "dual-factor-hardware-security",
    featured: true,
    title: "Dual-Factor Hardware Security System",
    tag: "Class project · Microcontrollers",
    techStack: [
      { label: "ATmega328PB", category: "MCU" },
      { label: "Bare-Metal C", category: "LANGUAGE" },
      { label: "AVR-GCC", category: "TOOLCHAIN" },
      { label: "UART + PWM", category: "INTERFACE" },
    ],
    summary:
      "A door lock that asks for two things: a 4-digit code on a keypad, then a password over UART. Bare-metal C on an ATmega328PB, with Timer1 PWM driving the servo.",
    description:
      "A two-factor door lock written in bare-metal C for an ATmega328PB Xplained Mini. A 4x4 membrane switch keypad feeds a 30ms software debouncer that filters contact bounce on each keypress. A strcmp() checks the 4-digit code. If it matches, the firmware sends a prompt over UART to a connected terminal for a second password. A correct password triggers Timer1 in Fast PWM mode to output a 2.0ms duty-cycle pulse, actuating a Datan B1122 servo to unlock for 5 seconds. State transitions are managed entirely through ISRs.",
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
    title: "FPGA Hierarchical ALU & 7-Segment Display Controller",
    tag: "Class capstone · Digital design",
    techStack: [
      { label: "Artix-7 Basys3", category: "BOARD" },
      { label: "VHDL", category: "LANGUAGE" },
      { label: "Xilinx Vivado 2024.2", category: "TOOLCHAIN" },
      { label: "ILA", category: "DEBUG" },
    ],
    summary:
      "A 0 to 1000 up/down counter in VHDL on a Basys3. The debouncer, counter, BCD converter and 7-segment driver each got their own testbench before I wired them together. The whole thing fits in 117 of the Artix-7's 20,800 slices.",
    description:
      "A 10-bit synchronous up/down counter in VHDL for the Artix-7 on a Basys3 board, built from four submodules under one top-level design. It counts from 0 to 1000, one step per press of the debounced center button (BTNC). Direction (SW13), synchronous preset from SW0–SW9 (SW14), and asynchronous reset (SW15) are all switch-controlled. The binary output is converted to four-digit BCD by a standalone converter, then displayed on the 7-segment array via time-division multiplexing.",
    technicalDetails: [
      { label: "Debouncer", detail: "16-bit shift register clocked at 100MHz; output changes state only on all-high or all-low shift register, suppressing contact bounce on BTNC" },
      { label: "Counter", detail: "10-bit synchronous design with async reset priority, synchronous preset with overflow clamping to 1000, and up/down wraparound logic" },
      { label: "BCD Converter", detail: "Integer division and modulo on CONV_INTEGER output; results packed into 16-bit BCD vector" },
      { label: "SSD Driver", detail: "20-bit free-running counter; top 2 bits select active digit and anode; 100MHz refresh" },
      { label: "Verification", detail: "Each submodule verified with dedicated testbenches (signal assertions, waveform inspection) before top-level integration in Vivado" },
      { label: "Footprint", detail: "117 / 20,800 Artix-7 logic slices utilized post-synthesis" },
    ],
    images: [
      { src: "/assets/basys3jpg.jpg", alt: "Basys3 FPGA Production Board", caption: "Basys3 board" },
      { src: "/assets/counter_schematic.png", alt: "Synthesized Schematic", caption: "Synthesized Schematic" },
      { src: "/assets/counter_device_layout.png", alt: "FPGA Device Utilization Layout", caption: "Artix-7 device layout" },
    ],
    githubHref: "https://github.com/Ethansuttor/ECE-510-511-FPGA",
  },
  {
    slug: "cmos-vlsi-physical-layout",
    featured: false,
    title: "CMOS VLSI Physical Layout & Delay Analysis",
    tag: "Class project · Integrated circuits",
    techStack: [
      { label: "Tanner L-Edit", category: "TOOL" },
      { label: "T-Spice", category: "SIM" },
      { label: "DRC/LVS", category: "VERIFY" },
      { label: "250nm Process", category: "PROCESS" },
    ],
    summary:
      "A CMOS cell library in Tanner EDA on a 250 nm process. It started with a hand-drawn inverter and ended with a 2-bit parallel adder in a pad frame, all checked with DRC and LVS.",
    description:
      "I built a CMOS cell library from scratch in Tanner EDA on a generic 250 nm process (W/L = 1.5 μm / 250 nm). Each lab added cells, starting from single-transistor layouts, and the final design reused all of them in a 2-bit parallel adder placed inside a pad frame.",
    architecture:
      "The CMOS inverter cell was laid out manually at 21.3 × 12.5 μm, confirmed with DRC, then re-generated via Schematic Driven Layout (SDL) from a T-Spice netlist export to cross-validate both flows. DC sweep produced a VTC with a switching threshold near 1.7 V, below the ideal 2.5V midpoint due to the NMOS electron mobility advantage over the matched-width PMOS. Transient simulation at 50 MHz (20ns period, 1ns rise/fall) confirmed clean inversion. Subsequent labs added NAND/NOR, transmission gate, and D flip-flop cells, all reused as subcomponents in the final design: a 2-bit parallel adder (2 FA, 8 DFF, 3 TG, 1 inverter) placed within a pad frame, with a WRITE-controlled transmission gate output buffer and synchronous CK/_CK control interface.",
    images: [
      { src: "/assets/tanner_ledit_inverter.png", alt: "CMOS Inverter Physical Layout in Tanner L-Edit", caption: "Inverter Physical Layout" },
    ],
    githubHref: "https://github.com/Ethansuttor/ECE-515-VLSI",
  },
  {
    slug: "autonomous-vision-guided-robotics",
    featured: false,
    title: "Autonomous Vision-Guided Robotics Platform",
    tag: "Competition build · Autonomous robots",
    techStack: [
      { label: "C / kipr", category: "LANGUAGE" },
      { label: "PID Control", category: "ALGO" },
      { label: "OpenCV", category: "VISION" },
      { label: "MATLAB", category: "ANALYSIS" },
    ],
    summary:
      "Won first place. I wrote the C firmware for a robot that read QR codes to pick a cube color, collected those cubes from a 4×6 ft arena, and found its way home by the brightness of the floor.",
    description:
      "I wrote the C control firmware for an autonomous mobile robot on a Wallaby controller (kipr/wombat.h) with touch sensors, IR reflectance, CdS photoresistors, an E.T. distance sensor, and a USB camera.",
    architecture:
      "Labs built up through reactive, Braitenberg, and closed-loop control paradigms. Lab 3 fused touch-sensor obstacle avoidance with IR-based line following into a single behavior-priority loop. Lab 4 implemented a Braitenberg light-follower: raw CdS readings (100–4000 range) normalized to 0–100% motor power, with a meta-sensing counter that detected repetitive bump cycles within a fixed time window and injected a random escape maneuver to break the loop. Lab 5 added a PID wall-following controller using the E.T./IR sensor, with data logged to arrays and plotted in MATLAB to compare P-gain values.",
    iteration:
      "Final competition: the robot autonomously collected color-coded cubes on a 4×6 ft arena, reading QR codes at the arena corners to determine the target cube color, and used a floor luminosity gradient to identify the home zone. 2-minute autonomous collection window. 1st place finish.",
    images: [
      { src: "/assets/robot1.jpeg", alt: "The final competition robot, side view", caption: "Final Competition Chassis" },
      { src: "/assets/robot2.jpeg", alt: "The final competition robot, front view", caption: "Front Assembly" },
      { src: "/assets/robot3.jpeg", alt: "Inside the robot: control board and power distribution", caption: "Control Board & Power Distribution" },
    ],
    githubHref: "https://github.com/Ethansuttor/ECE-565",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}
