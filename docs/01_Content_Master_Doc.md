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

#### CASE STUDY 01: CMOS VLSI Layout & Delay Analysis
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
