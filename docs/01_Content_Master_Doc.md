# CONTENT MASTER DOC: ETHAN SUTTOR

### PART 1: THE HERO BIO
**Ethan Suttor | Electrical Engineering | Embedded Systems & FPGA Architecture**
Electrical Engineering candidate at the University of Louisville specializing in hardware/software co-design, FPGA architecture, and embedded control systems. Designing, verifying, and debugging physical logic for real-time applications.

### PART 2: THE SKILLS MATRIX
* **Hardware Design & Analysis:** System Architecture, Tanner EDA (L-Edit, S-Edit, T-Spice), PCB Design (Altium, KiCAD), Oscilloscopes, Logic Analyzers.
* **Firmware & Logic:** C, C++, VHDL, ISR / Hardware-level Interrupts.
* **Systems & Tooling:** Xilinx Vivado 2024.2, Linux OS (POSIX/IPC), Python.

---

### PART 3: TECHNICAL CASE STUDIES

#### CASE STUDY 01: Firebird-1 Autonomous Robot (SoutheastCon 2026)
* **Objective:** Design and implement the real-time hardware control system for an autonomous competition robot operating under strict power and speed constraints.
* **The Stack:** Arduino Mega 2560, L293D H-Bridge, INA219 (I2C), IR Encoders (Digital ISR), C++.
* **Architecture & Implementation:** Collaborated on overall system architecture while personally owning the hardware prototyping and motor control logic. Engineered an I2C sensor bus for real-time current monitoring via the INA219, and implemented hardware interrupt service routines (ISRs) with software debounce logic to calculate precise motor RPM from raw IR encoder pulses. 
* **Hardware Debugging & Iteration:** Initially spent two hours prototyping a custom discrete motor controller utilizing MOSFETs and flyback diodes to manage inductive kickback. After discovering a pre-packaged motor driver IC in the provided hardware kit, I immediately pivoted to the integrated L293D solution to save board space and reduce points of failure, trading a custom design for system reliability.

![Firebird-1 Hardware Prototype](/public/assets/firebird_prototype.jpg)

#### CASE STUDY 02: FPGA MicroBlaze Co-Design (Artix-7)
* **Objective:** Instantiate a MicroBlaze soft-core processor on an FPGA and design the custom hardware/software interface for peripheral control.
* **The Stack:** Digilent Basys3 (Artix-7), Xilinx Vivado 2024.2, VHDL, C, AXI Interconnect.
* **Architecture & Implementation:** Architected a Vivado block design integrating a MicroBlaze processor connected to UART, BRAM, and GPIO peripherals via an AXI Interconnect. Mapped 16 physical DIP switches and LEDs to `gpio_rtl_0` interfaces, driven by a 100MHz system clock generated via an on-board PLL.
* **Hardware Debugging & Iteration:** Encountered arithmetic errors when reading the 16-bit DIP switch array through a single 32-bit GPIO register. Resolved the interface mismatch by implementing bitwise masking and a right-shift (`(DataRead & 0xFF00) >> 8`) in the C application, correctly separating the hardware input into two aligned 8-bit operands for processor execution. 

![Vivado MicroBlaze AXI Interconnect](/public/assets/vivado_microblaze.png)

#### CASE STUDY 03: CMOS VLSI Layout & Delay Analysis
* **Objective:** Execute schematic capture, physical layout, and transient simulation of foundational CMOS logic gates.
* **The Stack:** Tanner EDA Suite (L-Edit, S-Edit, T-Spice).
* **Architecture & Implementation:** Designed physical layouts for CMOS inverters, NAND/NOR gates, and transmission gates. Executed DRC/LVS verification to ensure manufacturing compliance, followed by T-Spice transient simulations to measure propagation delays (tpHL, tpLH) and dynamic power consumption under variable capacitive loads.

![Tanner L-Edit CMOS Inverter Layout](/public/assets/tanner_ledit_inverter.png)

---

### PART 4: THE LAB LOG FEED

**LOG // CSE 420: POSIX Multi-threading & IPC**
> Engineered a Linux keyword search server in C. Spawned per-client child processes and `pthread` workers, utilizing System V message queues for IPC and custom word-boundary parsing for high-throughput, concurrent file searching.

**LOG // ECE 565: Differential-Drive Autonomy**
> Implemented control logic for a differential-drive robot navigating an elliptical track. Bypassed standard bang-bang thresholds in favor of continuous wheel speed differential modulation to account for non-constant trajectory curvature.
