# Portfolio Content — Ethan Suttor

## Personal Info

- **Name:** Ethan Suttor
- **Title:** Electrical Engineering Student
- **Current Role:** Electrical Engineering Co-op at Gaylor Electric
- **Email:** ethan.suttor@louisville.edu
- **School:** University of Louisville (Speed School)
- **GitHub:** https://github.com/Ethansuttor
- **LinkedIn:** https://linkedin.com/in/ethan-suttor
- **Website:** https://ethansuttor.com

---

## Hero Section

**Badge:** "Currently at Gaylor Electric"

**Headline:** Ethan Suttor

**Subtitle:** Electrical Engineering Student

**Description:**
Electrical Engineering candidate at the University of Louisville specializing in hardware/software co-design, FPGA architecture, and embedded control systems. Designing, verifying, and debugging physical logic for real-time applications.

---

## About Me

I'm a junior Electrical Engineering student at the University of Louisville's Speed School, where most of my coursework has pulled me toward the hardware side: embedded systems, FPGA design, and VLSI physical layout. I like knowing what the silicon is actually doing.

Outside of class I work at the Speed Center for Innovation as an electrical engineering bench tech, helping students debug embedded systems and bring up PCBs. I also competed at SoutheastCon 2026, building a closed-loop motor controller with current sensing and IR encoder feedback for an autonomous competition platform.

Currently I am working an electrical engineering co-op at Gaylor Electric in southern Indiana.

---

## Skills

### Hardware Design & Analysis
- System Architecture
- Tanner EDA (L-Edit, S-Edit, T-Spice)
- PCB Design (Altium, KiCAD)
- Oscilloscopes
- Logic Analyzers

### Firmware & Logic
- C
- C++
- VHDL
- ISR / Hardware-level Interrupts

### Systems & Tooling
- Xilinx Vivado 2024.2
- Linux OS (POSIX/IPC)
- Python
- Git
- Soldering

---

## Projects

### 1. Custom Drone Flight Controller PCB
**Tag:** Personal Project — PCB Design
**Featured:** Yes (Index 01)
**GitHub:** https://github.com/Ethansuttor/drone_PCB

**Tech Stack:** STM32F405 (MCU) · KiCad (EDA) · Betaflight (FIRMWARE) · Bosch BMI270 (IMU) · TPS5450 (POWER)

**Summary:** Custom-designed STM32-based flight controller PCB for FPV drones — dual-LDO power architecture (AP2112K + TLV733P), onboard TPS5450 buck converter from raw LiPo, Bosch BMI270 IMU, and custom Betaflight target (ETHANF405). Designed with staged power isolation for self-reflow assembly.

**Description:** Designed a custom STM32F405-based flight controller PCB for FPV drones running Betaflight firmware with a custom target configuration (ETHANF405). Engineered a dual-LDO power architecture (AP2112K-3.3 for logic/VDDIO and TLV733P-3.3 for IMU VDD) to strictly isolate noisy logic rails from the sensitive IMU power rail. When supply chain constraints rendered the original 426xx IMU family unavailable, this dedicated rail isolation allowed a seamless migration to the Bosch BMI270 gyro with only footprint and decoupling changes and zero power redesign. An onboard TPS5450 buck converter steps down raw 4S LiPo voltage to 5V/5A, compensating for the lack of a BEC on the mating Flycolor Raptor BLS-04 4-in-1 ESC. Features 16MB SPI NOR Flash (BY25Q128ES) for blackbox logging, FlySky FS-iA6B i-BUS receiver interface, and staged-jumper power isolation for safe bench bring-up.

**Technical Details:**
- MCU: STM32F405RGT6 (168MHz Cortex-M4 with FPU), running custom Betaflight target ETHANF405 with motor 4 remapped to PB5 (TIM3_CH2) to prevent DMA1 Stream 3 collisions
- Power Tree: TPS5450DDAR buck converter (VBAT to 5V/5A) with Panasonic POSCAP 220µF ESR-matched output cap; dual-LDO architecture (AP2112K for logic/VDDIO, TLV733P for dedicated quiet IMU VDD)
- IMU: Bosch BMI270 6-axis MEMS gyro/accelerometer on isolated 3.3V sensor rail, mounted dead-center for optimal flight dynamics
- Blackbox: BOYAMICRO BY25Q128ES 16MB SPI NOR Flash for high-rate flight telemetry and PID tuning log capture
- Bring-Up: Normally-open solder jumpers split the power tree across 4 stages for current-limited bench testing; test points on all rails and scope ground loops
- PCB & Fab: ~60×60mm 4-layer stackup (ENIG finish for LGA gyro) with single-sided SMD layout for hotplate reflow; mated to Flycolor Raptor BLS-04 ESC via 10-pin JST SH1.0 harness

**Images:**
- `/assets/3D-angled.png` — 3D Board Render
- `/assets/STM32.png` — MCU & Core Logic
- `/assets/3d-viewer-PDB.png` — Power Tree & Buck Converter
- `/assets/PCB-Back.png` — PCB Bottom Layer

---

### 2. Dual-Factor Hardware Security System
**Tag:** Academic Project — Microcontrollers
**Featured:** Yes (Index 01)
**GitHub:** https://github.com/Ethansuttor/ECE-412-Microcontrollers

**Tech Stack:** ATmega328PB (MCU) · Bare-Metal C · AVR-GCC · UART + PWM

**Summary:** Two-factor authentication lock in bare-metal C on an ATmega328PB. Keypad entry, UART second factor, and servo actuation via Timer1 Fast PWM.

**Description:** Implemented a two-factor authentication lock in bare-metal C on an ATmega328PB Xplained Mini. A 4x4 membrane switch keypad feeds a 30ms software debouncer that filters contact bounce on each keypress. A strcmp() call checks the entered 4-digit code, and on match, the firmware sends a prompt over UART to a connected terminal for a second password. A correct password triggers Timer1 in Fast PWM mode to output a 2.0ms duty-cycle pulse, actuating a Datan B1122 servo to unlock for 5 seconds. State transitions are managed entirely through ISRs.

**Technical Details:**
- Debouncer: 30ms software debounce loop per keypress on 4x4 membrane matrix
- Code Match: strcmp() against stored 4-digit entry; immediate retry on mismatch
- UART: uart_putstr() prompt for second factor; password verified before actuating servo
- Actuation: Timer1 Fast PWM, 2.0ms pulse to Datan B1122 servo, 5-second unlock window

**Images:**
- `/assets/doorlock_hardware.jpeg` — Hardware Prototype
- `/assets/doorlock_schematic.png` — Wiring Schematic
- `/assets/doorlock_flowchart.png` — Program Flow

---

### 2. FPGA Hierarchical ALU & 7-Segment Display Controller
**Tag:** Academic Capstone — Digital Design
**Featured:** Yes (Index 02)
**GitHub:** https://github.com/Ethansuttor/ECE-510-511-FPGA

**Tech Stack:** Artix-7 Basys3 · VHDL · Xilinx Vivado 2024.2 · ILA

**Summary:** 10-bit synchronous up/down counter in VHDL on an Artix-7 Basys3 — four modular subcomponents, BCD conversion, TDM 7-segment display. 117 of 20,800 logic slices utilized.

**Description:** Designed and implemented a 10-bit synchronous up/down counter in VHDL on an Artix-7 Basys3, integrating four modular subcomponents into a synthesized top-level architecture. The counter operates over a 0-to-1000 range, with each clock pulse triggered manually via the debounced center push button (BTNC). Direction (SW13), synchronous preset from SW0–SW9 (SW14), and asynchronous reset (SW15) are all switch-controlled. The binary output is converted to four-digit BCD by a standalone converter, then displayed on the 7-segment array via time-division multiplexing.

**Technical Details:**
- Debouncer: 16-bit shift register clocked at 100MHz; output changes state only on all-high or all-low shift register, suppressing contact bounce on BTNC
- Counter: 10-bit synchronous design with async reset priority, synchronous preset with overflow clamping to 1000, and up/down wraparound logic
- BCD Converter: Integer division and modulo on CONV_INTEGER output; results packed into 16-bit BCD vector
- SSD Driver: 20-bit free-running counter; top 2 bits select active digit and anode; 100MHz refresh
- Verification: Each submodule verified with dedicated testbenches (signal assertions, waveform inspection) before top-level integration in Vivado
- Footprint: 117 / 20,800 Artix-7 logic slices utilized post-synthesis

**Images:**
- `/assets/basys3jpg.jpg` — Hardware — Basys3 FPGA
- `/assets/counter_schematic.png` — Synthesized Schematic
- `/assets/counter_device_layout.png` — Device Layout — Artix-7

---

### 3. CMOS VLSI Physical Layout & Delay Analysis
**Tag:** Academic Project — Integrated Circuits
**Featured:** No
**GitHub:** https://github.com/Ethansuttor/ECE-515-VLSI

**Tech Stack:** Tanner L-Edit · T-Spice · DRC/LVS · 250nm Process

**Summary:** Full CMOS cell library designed in Tanner EDA targeting a 250nm process — from manual inverter layout through a 2-bit parallel adder placed in a pad frame, verified with DRC/LVS.

**Description:** Designed and verified a complete CMOS cell library from scratch in Tanner EDA, targeting a 250nm process (Generic_250nm_Devices, W/L = 1.5μm/250nm), progressing from individual transistor layouts up to a 2-bit parallel adder placed within a full pad frame.

The CMOS inverter cell was laid out manually at 21.3 × 12.5 μm, confirmed with DRC, then re-generated via Schematic Driven Layout (SDL) from a T-Spice netlist export to cross-validate both flows. DC sweep produced a VTC with a switching threshold near 1.7V — below the ideal 2.5V midpoint due to the NMOS electron mobility advantage over the matched-width PMOS. Transient simulation at 50 MHz (20ns period, 1ns rise/fall) confirmed clean inversion. Subsequent labs added NAND/NOR, transmission gate, and D flip-flop cells, all reused as subcomponents in the final design: a 2-bit parallel adder (2 FA, 8 DFF, 3 TG, 1 inverter) placed within a pad frame, with a WRITE-controlled transmission gate output buffer and synchronous CK/_CK control interface.

**Images:**
- `/assets/tanner_ledit_inverter.png` — Inverter Physical Layout

---

### 4. Autonomous Vision-Guided Robotics Platform
**Tag:** Competition Build — Autonomous Systems
**Featured:** No
**GitHub:** https://github.com/Ethansuttor/ECE-565

**Tech Stack:** C / kipr · PID Control · OpenCV · MATLAB

**Summary:** 1st place — C-based firmware for an autonomous mobile robot using Braitenberg light-following, PID wall-following, and QR-guided cube collection on a 4×6 ft competition arena.

**Description:** Wrote the C-based control firmware for an autonomous mobile robot on a Wallaby controller (kipr/wombat.h) with touch sensors, IR reflectance, CdS photoresistors, an E.T. distance sensor, and a USB camera.

Labs built up through reactive, Braitenberg, and closed-loop control paradigms. Lab 3 fused touch-sensor obstacle avoidance with IR-based line following into a single behavior-priority loop. Lab 4 implemented a Braitenberg light-follower: raw CdS readings (100–4000 range) normalized to 0–100% motor power, with a meta-sensing counter that detected repetitive bump cycles within a fixed time window and injected a random escape maneuver to break the loop. Lab 5 added a PID wall-following controller using the E.T./IR sensor, with data logged to arrays and plotted in MATLAB to compare P-gain values.

Final competition: the robot autonomously collected color-coded cubes on a 4×6 ft arena, reading QR codes at the arena corners to determine the target cube color, and used a floor luminosity gradient to identify the home zone. 2-minute autonomous collection window. 1st place finish.

**Images:**
- `/assets/robot1.jpeg` — Final Competition Chassis
- `/assets/robot2.jpeg` — Front Assembly
- `/assets/robot3.jpeg` — Control Board & Power Distribution

---

## Experience / Timeline

### Speed Center for Innovation — SCI Student Worker
**Period:** Jan 2026 – Present
**Location:** University of Louisville
**Type:** Professional

Driving hands-on electronics innovation through rapid hardware prototyping and embedded system debugging. Providing technical support for industrial test equipment and ensuring precision in laboratory operations. Assisting students with component selection and workstation management.

**Tags:** Prototyping · Embedded Debug · Hardware Test

---

### Engineering Living-Learning Community — Peer Mentor
**Period:** Aug 2025 – Present
**Location:** University of Louisville
**Type:** Leadership

Mentored a cohort of 40 first-year engineering students through their transition to university-level coursework. Planned and facilitated 2 community-building events with 20 attendees each, fostering collaboration and peer networking within the residential engineering program.

**Tags:** Mentorship · Event Planning · First-Year Support

---

### IEEE Student Chapter — Treasurer
**Period:** Active (ongoing)
**Location:** University of Louisville
**Type:** Leadership

Managing PCB assembly lab operations for 15+ personnel. Orchestrating technical workshops focused on hardware design and enforcing strict IPC assembly standards to ensure professional-grade production.

**Tags:** IPC Standards · Lab Management · Technical Workshops

---

### Nifco Americas — Industrial Engineering Intern
**Period:** Aug 2022 – May 2023
**Location:** Shelbyville, KY — Tier 1 Automotive Supplier
**Type:** Internship

Learned design processes from professional engineers. Designed mechanical parts for machine conversions and conveyors. Managed the hardware engineering database and updated technical documentation for global suppliers.

**Key Contributions:**
- CAD Design: Created SolidWorks assemblies for machine conversion projects and conveyor system upgrades
- Database: Maintained and updated the hardware engineering database used across multiple plant locations
- Documentation: Updated technical specs and drawings for global supplier communications
- Manufacturing: Gained hands-on exposure to injection molding processes and 5S lean manufacturing standards

**Tags:** SolidWorks · 5S Lean · Database Management · Technical Documentation · Injection Molding

---

## Contact Section

**Header:** Get in Touch
**Description:** Currently working as an Electrical Engineering Co-op at Gaylor Electric.
**Email:** ethan.suttor@louisville.edu
**LinkedIn:** linkedin.com/in/ethan-suttor

---

## SEO / Metadata

**Site Title:** Ethan Suttor | Electrical Engineering Portfolio
**Description:** Electrical Engineering student at the University of Louisville specializing in FPGA architecture, embedded systems, and hardware/software co-design.
**Keywords:** Ethan Suttor, Electrical Engineering, FPGA, Embedded Systems, University of Louisville, Hardware Software Co-Design
**OG/Twitter Description:** Electrical Engineering student at U of L. FPGA, embedded systems, hardware/software co-design.
**Projects Page Title:** Projects | Ethan Suttor
**Projects Page Description:** Engineering projects by Ethan Suttor — FPGA design, embedded systems, VLSI layout, and autonomous robotics.

---

## Navigation

**Nav Links:** Projects · Skills · Experience · Contact
**Footer Links:** GitHub · LinkedIn · Back to Top
