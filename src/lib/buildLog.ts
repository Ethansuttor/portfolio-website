/**
 * Build log for the STM32F405 flight controller.
 *
 * Written from the project's own dated records: the repo's DEVLOG, the design
 * reviews, the bring-up checklist with its inline results, the placement guide,
 * and the Betaflight CLI dumps. Newest entry first, which is the order someone
 * landing on the page wants to read it in.
 */

export type LogBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; caption?: string; code: string }
  | { kind: "callout"; label: string; text: string };

export type LogMedia = {
  kind: "image" | "video";
  src: string;
  /** Still frame for a clip. */
  poster?: string;
  alt: string;
  caption: string;
  aspect?: "portrait" | "landscape";
};

export type BuildLogEntry = {
  slug: string;
  /** ISO date, used for <time dateTime> and sorting. */
  date: string;
  /** How the date is printed. */
  dateLabel: string;
  /** Short phase label for the rail on the left. */
  phase: string;
  title: string;
  /** One-line teaser, also used for the jump list. */
  standfirst: string;
  media?: LogMedia;
  blocks: LogBlock[];
};

/** Where the build stands, shown in the log's header band. Kept beside the
 *  entries so it gets updated in the same edit as each new one. */
export const buildStatus = "v1 flying, v2 (IRIS) ordered";

export const buildLog: BuildLogEntry[] = [
  {
    slug: "iris-v2-ordered",
    date: "2026-11-02",
    dateLabel: "November 2, 2026",
    phase: "v2 Fab",
    title: "v2 is ordered, and it's about half the size",
    standfirst:
      "IRIS, the second board, went to fab with black solder mask. It's 55 × 55 mm against v1's 80 × 80, and it has more on it.",
    blocks: [
      {
        kind: "text",
        text: "Ordered the v2 boards today, with a stencil, from the fab export I made at 6:59 pm. The board is called IRIS (the logo is an eye where the iris is a camera aperture, since v2 is the board that adds a camera), and this time the mask is black. The 3D model on the project page is this board, exported straight out of KiCad.",
      },
      {
        kind: "text",
        text: "v1 is 80 × 80 mm and v2 is 55 × 55 mm, so 3,025 mm² against 6,400 mm², which is about 53% less board. I was aiming for 50 × 50 and it ended up at 55 once everything was routed. It still uses the 30.5 mm mounting pattern, so it bolts straight onto the ESC stack instead of needing the 80 × 80 carrier plate v1 sits on. Compared with v1 it adds:",
      },
      {
        kind: "list",
        items: [
          "16 MB of blackbox flash (W25Q128JV) instead of 2 MB. That's about 11 minutes at 1/4 sampling instead of about 85 seconds, and the part is already in Betaflight's stock flash table, so the driver patch v1 needs goes away.",
          "A barometer (Goertek SPA06-003, with the Infineon DPS368 as a second source on the same footprint) on I2C1.",
          "A 6 pin JST-GH GPS and compass port in Pixhawk pin order, so a stock GPS cable plugs straight in, plus a spare 4 pin I2C port for a rangefinder.",
          "A 4 pin JST-SH port on USART3 for an optical flow and rangefinder module, for position hold later.",
          "An 8 pin header that matches the H501A camera board's connector, on UART5, and power pads for an all-in-one camera and VTX.",
          "i-BUS telemetry out to the FS-iA6B's SENS port on UART4, so battery voltage shows up on the transmitter, and a pad on USART1 TX for an ELRS receiver.",
          "A 5 V buck sized for 3 A continuous instead of about 1.5 A, and an SMD buzzer.",
        ],
      },
      {
        kind: "text",
        text: "Only the parts v1's leftover stock doesn't cover went on the LCSC order. Everything else (the F405, BMI270, TPS5450, AP2112K, crystal, most of the passives) comes out of the v1 bags. That's based on a paper count, the v1 order minus one built board, so I still need to physically count the ICs, the crystal, CN1 and the 1210 caps before the boards show up.",
      },
      {
        kind: "text",
        text: "Two things I left as they are on purpose. The TPS5450's PowerPAD only has 3 GND vias (6 to 9 would be better), so I'll watch U6's temperature under load at bring-up. And there's no Schottky in series with VBUS, which means if the battery is in and the USB cable goes to a host that's switched off, the board back-drives VBUS at about 4.6 V. For now the rule is just not to do that.",
      },
      {
        kind: "text",
        text: "While waiting I pulled the GPS module out of the old Hubsan H501A. It's a u-blox M8030-KT, and wired to an ESP32 as a serial bridge it put out NMEA at 9600 baud straight away. Sitting inside a window it got a 3D fix 43 seconds after power-on, 7 satellites used of 17 in view, HDOP 1.34. That's below Betaflight's default 8 satellite minimum for GPS Rescue, but that's the window, not the module. It's going on the J4 GPS port.",
      },
      {
        kind: "text",
        text: "When the boards arrive: inspect them, check every power rail to ground for shorts before placing a single part, then bring up the buck on its own with a current limit before the MCU goes on.",
      },
    ],
  },
  {
    slug: "v2-layout",
    date: "2026-10-29",
    dateLabel: "October 29, 2026",
    phase: "v2 Layout",
    title: "Routing v2, and moving the camera supply off USB",
    standfirst:
      "A week of review rounds on the v2 layout. The worst finding was a 19 mm buck switch node, and the most useful one was a supply problem that only shows up on USB.",
    blocks: [
      {
        kind: "text",
        text: "The first review of the layout, on October 22, found the buck's switch node was about 19 mm of track. The PH pin is on the right side of U6, L3 was on the left, and the catch diode D2 was 6 mm above, so the noisiest net on the board went the long way round. I rotated U6 so PH faces L3 and put D2's cathode right at PH, and the U6 to D2 to L3 path is now about 7 mm at 0.8 mm wide.",
      },
      {
        kind: "text",
        text: "Two buck capacitors also needed actual part numbers, which turned out to matter. C16, the 330 µF output cap, has to be low ESR: the TPS5450 datasheet design example (15 µH, 330 µF) needs ESR under about 40 mΩ, and an ordinary MnO2 tantalum is in the hundreds of mΩ, which would break the loop compensation. It's a 330 µF polymer part now. The input caps were 4.7 µF 1210 with no voltage rating, and a 25 V X7R loses most of its capacitance at 16.8 V, so they went back to v1's 10 µF 100 V parts. v2 also has to run on 3S and 4S, so 12.6 V to 16.8 V in.",
      },
      {
        kind: "text",
        text: "The supply problem: the camera/VTX pads and the H501A header were on +5V, which USB VBUS feeds directly. On USB alone the VTX and camera would have powered up too (about 0.6 to 0.8 A from a 0.5 A port, with a VTX sitting on the bench with no airflow), and on battery they'd get 5 V minus the ORing diode drop, about 4.6 V, when the H501A is a 5.0 V part. I moved both to +5V_Buck, which only exists when the battery is in and doesn't go through D3. USB now only carries about 250 mA of board load.",
      },
      {
        kind: "text",
        text: "Then rounds of routing review against the saved board, with a script that measures clearances and trace lengths from the .kicad_pcb. Some of what came up:",
      },
      {
        kind: "list",
        items: [
          "VBAT_ADC was 0.25 mm and I2C1_SCL 0.31 mm from the edge of an M3 mounting hole, and three motor lines ran 0.4 to 0.6 mm from another one. A metal screw and standoff go through those holes.",
          "CURR_ADC was 55.7 mm long with a detour to the current-sense jumper in a corner. The first reroute ran 8.7 mm under the buck inductor, which is about the worst place for an analog line, so it got moved again and now runs between D2 and L3 instead of under either.",
          "The buzzer driver was 22 mm from the buzzer. Q2, D8 and R26 moved next to BZ1.",
          "+5V ended up 0.25 mm from the top right hole. By the time I ordered it was 1.38 mm.",
        ],
      },
      {
        kind: "text",
        text: "The stackup is F.Cu, 0.1 mm prepreg, In1, a 1.24 mm core, In2, 0.1 mm prepreg, B.Cu. In1 is a solid GND plane and In2 is one continuous 3.3 V plane, which means traces on the bottom layer reference the 3.3 V plane, not ground. The front got a full GND pour too. Final DRC is 0 unconnected, and everything left is silkscreen overlap or library mismatch warnings.",
      },
    ],
  },
  {
    slug: "v2-scope",
    date: "2026-10-21",
    dateLabel: "October 21, 2026",
    phase: "v2 Design",
    title: "Scoping v2, and taking the OSD back out",
    standfirst:
      "Three goals for v2: smaller, video, and holding position. Most of the actual changes came from what went wrong on v1.",
    blocks: [
      {
        kind: "text",
        text: "With v1 flying I could finally pin down v2. The goals are a smaller board, video, and flight that holds position as well as it can. I'm staying on the STM32F405. The LQFP64 has enough pins (about 40 of 51 used) and all six U(S)ARTs once the motors move off PA3/PB10 and the battery sensing moves to PC0/PC1. An H7 only really pays off for full ArduPilot, so that's a maybe for a v3.",
      },
      {
        kind: "text",
        text: "Moving motors 3 and 4 to PB6/PB7 (TIM4) meant checking DMA again, since v1 already lost a day to it. I went through Betaflight's DMA request map and init order before drawing anything:",
      },
      {
        kind: "code",
        caption: "DShot streams on v2, checked in Betaflight source and CubeMX",
        code: "M1 TIM3_CH3  DMA1 Stream 7\nM2 TIM3_CH4  DMA1 Stream 2\nM3 TIM4_CH1  DMA1 Stream 0\nM4 TIM4_CH2  DMA1 Stream 3   <- SPI2_RX only maps to D1S3\nADC1         DMA2 Stream 4",
      },
      {
        kind: "text",
        text: "So there's a conflict, but a soft one. Betaflight allocates motor DMA before SPI DMA, so the motors win, and the blackbox flash on SPI2 gets TX-only DMA with reads running polled. That costs a little CPU and doesn't touch the motors, so I'm accepting it, and if it matters, turning on bidirectional DShot moves F4 motors to bitbang and frees the stream. CubeMX's DMA tab came out the same, stream for stream.",
      },
      {
        kind: "text",
        text: "For video I designed in an AT7456E OSD with its 27 MHz crystal, a CAM/AUX video select jumper and the composite in/out network, and then took it all back out the same day. Live video is going to be an off-the-shelf all-in-one camera and VTX on power pads, and the H501A camera board records to its own SD card through an 8 pin header. Dropping the OSD also freed SPI3 and PA15, and meant I didn't need a filtered 5 V branch just for one chip.",
      },
      {
        kind: "text",
        text: "Position hold needs optical flow and a rangefinder, and Betaflight doesn't support optical flow at all, so that's INAV eventually. I didn't want v2 to wait on choosing modules, so the plan is a populated core with provisioned expansion: GPS and compass, optical flow and spare I2C ports are all on the board, nothing gets plugged in yet, and it runs Betaflight first.",
      },
      {
        kind: "text",
        text: "The rest of the changes trace back to v1:",
      },
      {
        kind: "list",
        items: [
          "Flash goes to 16 MB (W25Q128JV). v1's 2 MB holds about 85 seconds at 1/4 sampling, and every flight log so far has ended because it filled up.",
          "The separate IMU LDO is gone. I flew v1 with the BMI270 on the main 3.3 V rail and it flew the same, but that's how it felt, not a log, so the IMU gets an 0805 ferrite bead footprint (fit 0 Ω if it's not needed) plus 2.2 µF and 0.1 µF at the pin. If gyro noise shows up on v2, the bead goes on.",
          "The 5 V buck gets a bigger inductor. v1's has a 2 A saturation current, which limits the rail to about 1.5 A. At 3 A out, 16.8 V in and 15 µH, ripple is about 0.47 A peak to peak and the peak current about 3.24 A, so I wanted 4 A or more of saturation current and picked a 15 µH part rated 9 A. The SS34 diodes go to 5 A SS54s.",
          "Current sense gets a 100 kΩ pulldown and a 100 nF cap at the ADC pin, so an unplugged sense line reads 0 A instead of floating, which is exactly what v1's does.",
          "The status LED moves from PC14 to PC8. PC13 to PC15 are in the backup domain and the datasheet says they shouldn't source current.",
          "The buzzer goes SMD (MLT-8530). It's rated 3.6 V, so it has a 10 Ω series resistor from 5 V and has to be PWM driven at 2.7 kHz. Driven with DC it's silent and pulls about 190 mA.",
        ],
      },
    ],
  },
  {
    slug: "first-flight-logs",
    date: "2026-10-21",
    dateLabel: "October 21, 2026",
    phase: "Flight logs",
    title: "The current sensor was reading the battery voltage",
    standfirst:
      "First real blackbox logs. The current reading was 30 A at hover, which was wrong in a more interesting way than a bad scale factor.",
    blocks: [
      {
        kind: "text",
        text: "Now that it flies I've got actual blackbox data. The first log, on the 20th, was exactly 2,097,152 bytes, which is the whole 2 MB flash, and that's why the last recording ended without a clean stop. Second flight today: 85.4 seconds at an 821 Hz log rate, and it filled the flash again and cut off mid-hover. At 1/4 sampling 2 MB just holds about 85 seconds.",
      },
      {
        kind: "text",
        text: "The current sensor said about 30 A at hover, which is 450 W at 15 V for a 790 g quad. That isn't plausible, and my first guess was that ibat_scale was off. It isn't a scale problem though:",
      },
      {
        kind: "list",
        items: [
          "amperageLatest sits between 29.4 and 30.7 A from near idle all the way to hover.",
          "It goes down as load goes up (correlation -0.64 with the motor sum).",
          "It tracks the battery voltage at a fixed 2.05 A/V (std 1.2%). The October 20 log does the same at 2.00 A/V.",
        ],
      },
      {
        kind: "text",
        text: "A wrong scale factor would still move with load. This reads like PA2 is sitting at about 1.2 V and following VBAT, which is what a floating STM32 ADC input does: the sample cap holds charge from the previous channel in the sequence, and on v1 that's PA1, the battery divider. So the current signal isn't reaching the pin. Next is checking the CurrentM1 jumper is actually bridged and that the ESC harness current pin makes it to PA2. v2 gets a pulldown on that pin so this can't happen quietly again.",
      },
      {
        kind: "text",
        text: "The motors are uneven too. On the 20th the four motor averages were a smooth gradient. Today three of them are within 3% and motor 4 (front left) is on its own about 13% higher:",
      },
      {
        kind: "code",
        caption: "Mean motor output, M1 to M4",
        code: "2026-10-20   830   898   975  1023\n2026-10-21   977   990  1009  1123",
      },
      {
        kind: "text",
        text: "Yaw I term also moved from about 0 to +13. One motor out on its own plus a new yaw offset points at that motor or its prop more than at the centre of gravity. I spun each motor by hand with no power, and M4 has less resistance than the other three, specifically weaker cogging notches rather than smoother bearings. My working diagnosis is reduced magnet flux on M4 (heat damage, or a cracked or loose magnet), which would explain it needing about 13% more command. I haven't confirmed it yet. The plan is a shorted-phase braking comparison, a look at the bell magnets, then a replacement motor and a new log. Until then it's gentle hovers only, and I check bell temperature after each flight.",
      },
      {
        kind: "text",
        text: "Gyro noise has one narrow peak that moved from 173 to 180 Hz up to 182 to 186 Hz as hover rpm went up, and between the two flights pitch noise dropped while roll went up. Noise that's axis dependent and sits at motor frequency is mechanical (props, motors, frame), not supply noise, and after filtering it's 0.8 to 1.2 deg/s in that band. At an 821 Hz log rate I can't see anything above about 410 Hz though, so this doesn't prove the IMU supply is clean.",
      },
      {
        kind: "callout",
        label: "What changed in how I review logs",
        text: "Rewriting the analysis script for every flight was how I ended up with five slightly different versions of it. It's one flight review tool now, run the same way on every log, and it flags the current sensor as invalid on both of these logs without being told to look.",
      },
    ],
  },
  {
    slug: "it-flies",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    phase: "First flight",
    title: "It flies, and I can't say exactly why",
    standfirst:
      "Rebuilt the frame and checked motor direction and board orientation. It stopped flipping, but I changed two things at once.",
    blocks: [
      {
        kind: "text",
        text: "I rebuilt the frame from scratch with the same parts, built tighter so the flight controller and IMU sit more rigidly. I also went through motor direction and board orientation properly, which I hadn't done before the first liftoff attempt. It now takes off and flies without flipping.",
      },
      {
        kind: "text",
        text: "The catch is that I made both changes together, so I can't say for sure which one fixed it. Most likely it was the direction and orientation check: a wrong motor direction, motor order or align_board gives you a full flip right at liftoff, and a loose mount usually doesn't. A loose mount could still have been contributing.",
      },
      {
        kind: "text",
        text: "It's flying in ANGLE mode on stock 4.5 PIDs with a 3.2 kHz loop and blackbox at 1/4 sampling. Still open: failsafe hasn't been tested, and I need to save a diff all of the flying config so I can compare it with the September one.",
      },
    ],
  },
  {
    slug: "flash-was-never-dead",
    date: "2026-09-14",
    dateLabel: "September 14, 2026",
    phase: "Debug",
    title: "The flash chip was fine the whole time",
    standfirst:
      "The quad flips as soon as it lifts off, so I finally went back to the blackbox flash. Two days of blaming the chip and one night of thinking I'd killed the board, and it ended up being a missing line in Betaflight.",
    media: {
      kind: "image",
      src: "/assets/drone-airframe-assembled.jpg",
      aspect: "portrait",
      alt: "The finished quadcopter with the custom flight controller, props and LiPo fitted, sitting on a tripod",
      caption: "Airframe done on September 12. All four motors spin, and it flips as soon as it gets light on its feet.",
    },
    blocks: [
      {
        kind: "text",
        text: "The airframe went together on the 12th and all four motors spin. It also tries to flip over as soon as it starts to lift, every time. I don't think it's the frame. The gyro alignment in my target is still a placeholder I guessed for the old IMU, and I've never checked which motor each output drives or which way they spin, and any one of those would make a quad do this. The annoying part is that a gyro that's 180° out and a mirrored motor map look the same from the air, so watching it flip doesn't tell me which one it is. I need to do a props-off tilt test on the bench (I hadn't done one before arming it the first time, which I probably should have).",
      },
      {
        kind: "text",
        text: "The flip is also why the flash suddenly mattered. Without a blackbox log all I've got is watching it flip, so the chip I'd written off on September 3 was the next thing to fix.",
      },
      {
        kind: "text",
        text: "When I went back over why I'd decided it was dead, it didn't hold up that well. A JEDEC ID of all zeros fits a dead die, but it also fits a chip that never gets selected, or a MISO line that something else is holding low. Three of the checks I'd counted as passes would have passed in all three cases:",
      },
      {
        kind: "list",
        items: [
          "/CS idles at 3.3 V. With the pull-up fitted it reads 3.3 V whether the MCU ever drives it or not.",
          "Continuity from each U3 pin to the MCU. Fine for finding an open, but it wouldn't catch a bridge to another net.",
          "MISO to ground measured 1.4 MΩ, unpowered. That won't catch anything that only pulls the line low once the board is on.",
        ],
      },
      {
        kind: "text",
        text: "Somewhere in there I was also poking at pins on the powered 0.5 mm LQFP with a handheld meter, and not long after that the board stopped enumerating. Power LED on, status LED off, no USB, and the F405 hot to the touch. Unpowered, I got about 3 Ω from VCAP_1 to ground. I pulled C12, measured again and still got about 3 Ω, so I figured the short was inside the die, wrote the board off and started planning a respin.",
      },
      {
        kind: "text",
        text: "The next day I plugged it in with a scope attached and it just booted like nothing had happened. Turns out the 3 Ω was me probing the ground-side pad of C12's empty footprint, so I was measuring ground to ground (2.4 Ω raw, with 1.6 Ω of that being the leads, was never a short). The real fault was C12 itself, a flex-cracked MLCC shorting the core regulator's output. That's what made the chip hot and stopped it starting, and pulling it had already fixed the board. I should have just tried powering it again before deciding anything.",
      },
      {
        kind: "text",
        text: "Once I had C12 replaced and a working board again, I spent the evening going back over the flash wiring, this time with tests that could actually fail:",
      },
      {
        kind: "list",
        items: [
          "Drove /CS from Betaflight as a PINIO and watched it swing cleanly between 3.3 V and 0 V, so the chip select path is fine.",
          "Put 10 kΩ from MISO up to 3.3 V. The net sat at 3.3 V, so the chip wasn't holding it low.",
          "Reassigned PC2, the MISO pin, as a battery voltage input. It read 3.3 V, so the pin, its trace and its solder joint all work.",
        ],
      },
      {
        kind: "text",
        text: "So MISO was high, the MCU could read it as high, and flash_info still printed zeros. At that point it had to be firmware somewhere. I built a debug version of Betaflight that records which exit flashSpiInit() takes and prints the raw ID bytes instead of the tidied-up result. Output from the first boot is below, the last line is the one that matters:",
      },
      {
        kind: "code",
        caption: "flash_info debug",
        code: "stage: 4 TRANSACTED\nresolved pins: sck=B13 sdi=C02 sdo=B15 regbase=0x40003800\nspi regs: cr1=0x0357  spe=1 mstr=1 br=2\nsdi pin: moder=2 (alternate function) af=5 (SPI2 on F4)\nrdid: issued=1 raw=c8 40 15 c8",
      },
      {
        kind: "text",
        text: "C8 40 15 is the ID straight out of the GigaDevice datasheet, so the chip had been answering fine since September 3. Betaflight 4.5.5 just doesn't have the GD25Q16E in its chip table, so the driver didn't recognise the reply, gave up, and flash_info printed an empty struct. That's where the 0x00000000 came from, not from anything on the wire.",
      },
      {
        kind: "text",
        text: "My July 30 entry says the part is already in that table. It isn't, at least not in the release I'm running. I'd been going off that note the whole time, which is a big part of why I spent two days on the hardware.",
      },
      {
        kind: "code",
        caption: "The fix, in flash_m25p16.c",
        code: "{ 0xC84015, 104, 50, 32, 256 },   // GigaDevice GD25Q16E, 2 MB\n// geometry copied from the Winbond W25Q16 entry above it",
      },
      {
        kind: "text",
        text: "The Winbond W25Q16 entry right above it has the same 2 MB layout, so I copied its geometry rather than guessing. It isn't upstream, so I have to remember to re-apply it after every clean build or fresh clone.",
      },
      {
        kind: "callout",
        label: "What I'm doing differently",
        text: "Printing the raw bytes before I decide what a bus returned. \"Nothing detected\" and \"read a zero\" looked exactly the same in flash_info, and I mixed them up for two days. Also no more meter probes on a powered 0.5 mm package. I'll probe a via, a pad or a passive, or tack a wire on.",
      },
      {
        kind: "text",
        text: "Blackbox works now. Next up: set the sample rate to 1/4 so the 2 MB chip doesn't fill in 22 seconds, check motor mapping and direction, test failsafe, and then log a flight so I can look at the flip in actual data.",
      },
    ],
  },
  {
    slug: "one-motor-full-throttle",
    date: "2026-09-03",
    dateLabel: "September 3, 2026",
    phase: "Bench test",
    title: "One motor at full throttle, and a dead flash chip",
    standfirst:
      "Pack and USB live at the same time, throttle up, and the motor just ran. The blackbox flash, on the other hand, is dead.",
    media: {
      kind: "video",
      src: "/assets/drone-motor-spin.mp4",
      aspect: "portrait",
      poster: "/assets/drone-motor-spin-poster.jpg",
      alt: "Bench test: the flight controller spins a brushless motor from FlySky transmitter throttle input",
      caption: "Throttle up on the FlySky, board powered from the pack and USB at once.",
    },
    blocks: [
      {
        kind: "text",
        text: "Spun a motor off the board today, with the LiPo in through CN1 and USB-C plugged in at the same time. Throttled up and it just ran, no stutter or brownout, and nothing smoked.",
      },
      {
        kind: "text",
        text: "The two-sources-at-once part is what I actually wanted to test. There are three ORing diodes (D3, D4, D7) between the buck's 5 V and USB's 5 V, and until today I'd never had both live together. If I'd got those backwards, one source would have been pushing current into the other. Nothing happened, so as far as I can tell they're the right way round.",
      },
      {
        kind: "text",
        text: "The receiver is bound, with i-BUS into UART1 and live channel data showing in the Configurator. Current sense on PA2 reads correctly with the motor under load.",
      },
      {
        kind: "text",
        text: "The blackbox flash is another story. I'm pretty sure it's dead rather than miswired. I went back and re-checked every pin by hand: VCC, /HOLD, /WP, /CS, all four SPI2 continuity points, pin-1 orientation, and no MISO-to-ground short (1.4 MΩ). Everything reads like it should, and flash_info still returns nothing:",
      },
      {
        kind: "code",
        caption: "Betaflight CLI",
        code: "# flash_info\nFlash sectors=0, sectorSize=0, pagesPerSector=0, pageSize=0, totalSize=0 JEDEC ID=0x00000000",
      },
      {
        kind: "text",
        text: "The fact that it's all zeros and not all ones is what makes me think it's the chip. An open MISO floats high and reads 0xFFFFFF, whereas 0x000000 means the MCU clocked out the read command and the data line sat low the whole time, so the chip never answered, and with the wiring checked I can't see what else it would be. I have five spares, so it's a hot-air swap. I'll keep the nozzle narrow and well away from U7, since the BMI270 is the one part on this board I really don't want to reflow twice.",
      },
      {
        kind: "text",
        text: "Still open: the other three motors haven't been spun individually and failsafe hasn't been tested at all, so it doesn't fly yet.",
      },
    ],
  },
  {
    slug: "bring-up-adc-dma",
    date: "2026-08-19",
    dateLabel: "August 19, 2026",
    phase: "Bring-up",
    title: "Bring-up, and a day lost to the ADC",
    standfirst:
      "Staged bring-up through the solder jumpers, one rail at a time. Everything passed except the two ADC channels I needed most.",
    blocks: [
      {
        kind: "text",
        text: "I brought the board up stage by stage through the solder jumpers, which is how it was designed to be brought up, so a fault behind a closed jumper couldn't take out anything ahead of it.",
      },
      {
        kind: "list",
        items: [
          "3.3 V rail up, MCU running, enumerated over USB as STM32 BOOTLOADER (0483:DF11).",
          "Clock=168MHz (PLLP-HSE) in status, so the 8 MHz crystal and its load caps are good.",
          "Vref=3.28V, which is only readable if VDDA is live, so the FB1 wire link works.",
          "TPS5450 buck put out 4.98 V from a 15.58 V pack, 0.4% off target.",
          "Bridged JP10 and the gyro appeared immediately: GYRO=BMI270, ACC=BMI270, GYRO rate: 3225.",
          "Four DShot outputs landed on DMA1 streams 7, 2, 6 and 1, so none of them share a stream.",
        ],
      },
      {
        kind: "text",
        text: "That last one was the check left over from the motor remap in June, and the pin I moved to dodge a DMA collision is clear on the real board too.",
      },
      {
        kind: "text",
        text: "Then I lost a day to the ADC. status showed a healthy Vref=3.28V and a core temperature climbing normally, with Voltage: 0 * 0.01V (0S battery - NOT PRESENT) right underneath, while my meter read 1.4 V on PA1. I checked the divider, JP8, battery_meter = ADC, adc_device = 1 and the resource mapping, and they were all fine. Everything I could measure on that pin was right and the reading just stayed at zero.",
      },
      {
        kind: "text",
        text: "It ended up being DMA. On the F405, ADC1's regular-conversion DMA defaults to DMA2 Stream 0 Channel 0, and SPI1_RX (the gyro) defaults to DMA2 Stream 0 Channel 3, so they both want the same stream. SPI1 gets allocated first and wins, and then the ADC driver does this:",
      },
      {
        kind: "code",
        caption: "betaflight/src/main/drivers/adc_stm32f4xx.c",
        code: "if (!dmaAllocate(dmaGetIdentifier(adc.dmaResource), OWNER_ADC, 0)) {\n    return;\n}",
      },
      {
        kind: "text",
        text: "It just returns. There's no error, no warning at boot and nothing in the log. The regular conversion sequence never runs, and every external ADC channel reads zero, which on this board means battery voltage and current.",
      },
      {
        kind: "text",
        text: "What made it hard to spot is that on F4, Vref and core temperature come through injected channels triggered by software polling, and those don't need DMA at all. So the ADC looks healthy in status while the two channels I actually cared about are missing, and that's why I went through the jumper, the divider and the pin mapping before it occurred to me to look at DMA.",
      },
      {
        kind: "code",
        caption: "Fix, now permanent in the target",
        code: "#define ADC1_DMA_OPT 1      // ADC1 -> DMA2 Stream 4, clear of SPI1",
      },
      {
        kind: "text",
        text: "I also trimmed vbat_scale from 110 to 111 so the reading lands on the pack voltage, and corrected LED0_PIN to PC14 after the status LED wouldn't blink.",
      },
      {
        kind: "callout",
        label: "Note for next time",
        text: "I checked DMA for the motors because that was the collision I already knew about, and didn't think to check it for the ADC. From now on I'm checking DMA for every peripheral at bring-up, not just the motors.",
      },
    ],
  },
  {
    slug: "placement-guide",
    date: "2026-08-11",
    dateLabel: "August 11, 2026",
    phase: "Assembly",
    title: "Two resistor swaps that would have killed the board",
    standfirst:
      "Generated a placement guide from the KiCad file before any paste went down, organised by part value instead of by reference designator.",
    media: {
      kind: "image",
      src: "/assets/drone-pcb-assembled.jpeg",
      aspect: "portrait",
      alt: "Assembled STM32F405 flight controller PCB after hotplate reflow",
      caption: "Everything placed, one reflow pass, no rework yet.",
    },
    blocks: [
      {
        kind: "text",
        text: "Before any paste went down I generated a placement guide from the KiCad file, reading the actual pad-to-net connections instead of trusting the BOM. It's sorted by part value rather than reference designator, because that's how I actually place parts: open one strip, place every position for that value, seal it, then open the next, and never have two strips open at once.",
      },
      {
        kind: "text",
        text: "That's probably a lot of process for a board with sixty-odd passives, but there are two pairs on here that sit next to each other in the same 0805 package, and nothing would tell me if I swapped them:",
      },
      {
        kind: "list",
        items: [
          "R6 (marked 1003, 100 kΩ) and R13 (1002, 10 kΩ) are the VBAT divider. Swapped, PA1 sees 15.3 V instead of 1.53 V and the pin dies the first time a pack goes in.",
          "R7 (1002) and R8 (3241) set the buck feedback. Swapped, the converter outputs 1.221 × (1 + 3.24/10) = 1.62 V instead of 5 V, nothing downstream runs, and I'd probably spend an evening blaming the TPS5450.",
        ],
      },
      {
        kind: "text",
        text: "One deliberate change from the BOM: R14 went from 470 Ω to 330 Ω. The 470 was sized for the red power LED I originally specified, but the LEDs that turned up are green with a Vf around 2.55 V, which left D5 at roughly 1.6 mA and basically invisible. At 330 Ω it runs about 2.3 mA. D6 keeps its own 330 Ω for a different reason: it hangs off PC14 in the backup domain, which is limited to about 3 mA.",
      },
      {
        kind: "text",
        text: "Everything goes down value-side-up so I can read the markings back afterwards and check them.",
      },
    ],
  },
  {
    slug: "imu-swap-and-flash",
    date: "2026-07-30",
    dateLabel: "July 30, 2026",
    phase: "Sourcing",
    title: "The IMU went reel-only, and the flash is an eighth the size I ordered",
    standfirst:
      "The entire ICM-426xx family went reel-only in one week. Then I found out I'd ordered a 2 MB flash chip instead of a 16 MB one.",
    blocks: [
      {
        kind: "text",
        text: "Two bad discoveries today. First the gyro: I'd designed around a TDK ICM-42605, and somewhere between choosing it and needing it the whole 426xx family went reel-only at LCSC (minimum order a thousand-plus) and out of stock at DigiKey and Mouser, so for buying one it's basically gone.",
      },
      {
        kind: "text",
        text: "The replacement is a Bosch BMI270. It has the same 2.5 × 3.0 mm LGA-14 outline and not much else in common. The pinout is different, so it needed a new footprint and every IMU net re-routed. The decoupling is different too (100 nF at VDD and 100 nF at VDDIO, where the 42605 wanted a 2.2 µF / 0.1 µF / 10 nF set), and the unused-pin strapping is inverted: ASDx and ASCx now go to VDDIO and must not be grounded, whereas grounding is what the 42605's RESV pins wanted.",
      },
      {
        kind: "text",
        text: "The power side didn't need to change at all. VDD stayed on the quiet TLV733P rail and VDDIO stayed on the main AP2112K rail, so the swap cost me a footprint and a re-route instead of a power redesign. That was luck more than planning: I split the rails back in June to keep digital switching noise off the gyro supply, not because I expected to change parts.",
      },
      {
        kind: "text",
        text: "There are downsides. The BMI270 ships uncalibrated, which is why Betaflight discourages it for new designs, and it caps the PID loop at 3.2 kHz instead of 8 kHz. For Acro freestyle I don't think either matters much, and I couldn't get the other part in quantity one anyway.",
      },
      {
        kind: "text",
        text: "Then, while going through three different BOM files that didn't agree with each other, I found the flash problem. U3 as ordered and fitted is a GigaDevice GD25Q16E, which is 16 Mbit, so 2 MB. The BOM called for a 128 Mbit part. The wrong one ended up on the order and I didn't notice until a week after the boards shipped. Having three BOMs is probably how that happened.",
      },
      {
        kind: "text",
        text: "I'm keeping it. Betaflight identifies SPI NOR flash by JEDEC ID at runtime, and the GD25Q16E is already in the m25p16 driver's table, so nothing changes in firmware and the Configurator reporting 2 MB is correct:",
      },
      {
        kind: "code",
        caption: "betaflight/src/main/drivers/flash_m25p16.c",
        code: "{ 0xC84015, 104, 50, 32, 256 }   // GigaDevice GD25Q16E\n// 32 sectors x 256 pages x 256 B = 2,097,152 bytes",
      },
      {
        kind: "text",
        text: "Logging still works, the logs are just short: roughly 22 seconds at 3.2 kHz, 44 at 1.6 kHz, 87 at 800 Hz. Tuning runs are 30 to 60 seconds anyway, and 800 Hz still resolves everything below 400 Hz, which is where the motor and frame noise peaks that filter tuning cares about are. What actually bugs me is not being able to log a whole pack. Every candidate upgrade uses the same SOIC-8 208-mil footprint, so fixing it later is a hot-air swap.",
      },
      {
        kind: "callout",
        label: "New bring-up item: JP10",
        text: "Found this while auditing. The quiet 3.3 V rail reaches the BMI270's VDD through JP10, a normally-open solder jumper. If it isn't bridged, the board enumerates fine over USB and just reports no gyro, which I'd almost certainly mistake for a firmware bug.",
      },
    ],
  },
  {
    slug: "custom-betaflight-target",
    date: "2026-07-23",
    dateLabel: "July 23, 2026",
    phase: "Firmware",
    title: "Writing the Betaflight target before the boards arrive",
    standfirst:
      "The boards are somewhere between Shenzhen and here, so I wrote the Betaflight target, and found that my docs disagreed with my own schematic.",
    blocks: [
      {
        kind: "text",
        text: "Nothing to solder yet, so I wrote the firmware target, betaflight_target/ETHANF405/config.h, plus a build and flash guide so I don't have to work out the sequence again later.",
      },
      {
        kind: "text",
        text: "Reconciling the pin map against the fabricated board, it turned out my planning docs and the actual schematic disagreed. The board's already made, so the schematic wins. Motors are PB0, PB1, PA3 and PB10 (TIM3_CH3/CH4, TIM2_CH4/CH3), not what the older notes said. Flash MISO is on PC2, not PB14. Current sense is PA2. The status LED hangs off the backup domain through 330 Ω, so it'll be dim, and that's by design.",
      },
      {
        kind: "text",
        text: "All of that went into one file, VERIFIED_PINOUT.md, and that's the one I go by now. I marked the older tables superseded instead of deleting them, so I can still see what I got wrong and when.",
      },
      {
        kind: "text",
        text: "I also built a 5-inch frame while waiting. It's a Python script using trimesh that unions a centre plate, four arms and four motor pads, subtracts the hole pattern and writes an STL: 220 mm wheelbase, 30.5 mm stack holes, 16 mm motor bolt pattern, and a thinned pocket under each motor pad. It's parametric, so changing the wheelbase is one number. I haven't printed it yet.",
      },
      {
        kind: "callout",
        label: "Still open",
        text: "GYRO_1_ALIGN is still a guess. The committed CW0_DEG was worked out for the 42605's die orientation, and the BMI270 has different die axes and a different footprint rotation. I'll settle it on the bench.",
      },
    ],
  },
  {
    slug: "boards-ordered",
    date: "2026-07-19",
    dateLabel: "July 19, 2026",
    phase: "Fab",
    title: "Boards ordered, $130 and two weeks to wait",
    standfirst: "Bare 4-layer, ENIG, frameless stencil, quantity five.",
    media: {
      kind: "image",
      src: "/assets/3D-angled.png",
      alt: "KiCad 3D render of the flight controller board, angled view",
      caption: "What I was hoping would show up in two weeks.",
    },
    blocks: [
      {
        kind: "text",
        text: "Sent it to JLCPCB: bare 4-layer, ENIG finish, frameless top-side stencil, quantity five. The commit message I wrote that day was \"Ordered the PCB now i have to wait and see if i waisted 130 dollars,\" which about sums up the mood.",
      },
      {
        kind: "text",
        text: "I went with ENIG mostly for the LGA gyro and the fine-pitch parts. HASL is fine for through-hole and 0805, less so for a package whose joints you can't inspect afterwards.",
      },
      {
        kind: "text",
        text: "Two weeks to wait. In the meantime there's firmware to write and two BOM questions I haven't closed: whether the TPS5450 or the older TPS5430 actually shipped, and whether the buck inductor is the 15 µH from the TI worked example or the 22 µH left over from when this was a 6S design. Both get checked with a meter and a magnifier before anything gets populated.",
      },
    ],
  },
  {
    slug: "schematic-verified",
    date: "2026-07-11",
    dateLabel: "July 11, 2026",
    phase: "Schematic",
    title: "Schematic finished, checked pin by pin",
    standfirst:
      "Current-sense clamp, VBAT divider, SWD header, then a full netlist walk against the KiCad files.",
    blocks: [
      {
        kind: "text",
        text: "Finished the last of the analog and debug circuitry today. The ESC's current line gets a clamp: 1 kΩ in series with a 3.3 V zener to ground, with the ADC tapped between them. The ESC isn't obliged to keep that line inside 3.3 V, and I'd rather not find out the expensive way.",
      },
      {
        kind: "text",
        text: "There's also a VBAT divider, 100 kΩ over 10 kΩ with a 100 nF cap, so a full 16.8 V pack lands at 1.53 V, and an SWD header as a second way into the chip if USB DFU won't cooperate. I added a power-good LED on the main 3.3 V rail and removed the one I'd put on the quiet IMU rail, since there's no reason to hang a few milliamps of load on the supply I went out of my way to keep clean.",
      },
      {
        kind: "text",
        text: "Then I walked the netlist pin by pin against the KiCad files: MCU core, all fourteen IMU pins, flash, USB and its ESD part, both LDOs, the ORing diodes, boot and reset, current sense, the VBAT divider and SWD. ERC is clean.",
      },
      {
        kind: "callout",
        label: "Checking this on the bench, not on paper",
        text: "The schematic numbers the ESC connector in reverse order to the manufacturer's diagram, which is only correct if the connector mates flipped. Before anything gets powered I'm going to beep VBAT and both grounds out of the mated cable at the ESC's XT60, because if that's wrong, 16.8 V lands on a 3.3 V GPIO.",
      },
      { kind: "text", text: "Layout is next." },
    ],
  },
  {
    slug: "4s-and-motor-remap",
    date: "2026-06-28",
    dateLabel: "June 28, 2026",
    phase: "Design",
    title: "Going from 6S to 4S, and moving a motor off a DMA clash",
    standfirst:
      "Motor 4 wanted the same DMA stream as the blackbox flash, which is the kind of conflict that doesn't give you a compile error.",
    blocks: [
      {
        kind: "text",
        text: "Dropped the target battery from 6S to 4S (14.8 V nominal, 16.8 V charged). That relaxes the voltage rating on the input capacitors and moves the buck's output inductor to 15 µH, which is what TI's worked example uses at this input and output pair.",
      },
      {
        kind: "text",
        text: "Motor 4 also had to move. It was on a pin that wants DMA1 Stream 3, and so does SPI2_RX, which is the blackbox flash, so DShot and the logger would have been fighting over the same stream. You don't get a compile error for that, you'd just get a motor that misbehaves only while it's logging, which would be a miserable bug to track down.",
      },
      {
        kind: "text",
        text: "I remapped it and checked the new assignment against the DMA request tables in RM0090, but I don't fully trust the table, so running dma show all on the real board went on the bring-up list.",
      },
    ],
  },
  {
    slug: "esc-has-no-bec",
    date: "2026-06-23",
    dateLabel: "June 23, 2026",
    phase: "Architecture",
    title: "The ESC has no BEC, so the board needs its own buck",
    standfirst:
      "Designing around the ESC I already own means the board has to generate its own 5 V from the pack.",
    blocks: [
      {
        kind: "text",
        text: "The constraint I set myself: this has to mate with the ESC I already own, a Flycolor Raptor BLS-04 4-in-1, on its existing 10-pin SH1.0 harness.",
      },
      {
        kind: "text",
        text: "The BLS-04 has no BEC, it just hands you raw pack voltage. So the board carries its own buck converter running off up to 16.8 V, which is a much more interesting problem than taking a regulated 5 V from somewhere else, and the external Matek BEC I'd planned on is gone. I think that constraint has probably been the most useful decision on the project so far.",
      },
      {
        kind: "text",
        text: "Also decided today: a 4-layer stackup, every SMD part on the top side so the whole board goes through one hotplate reflow pass, and hot air for the LGA gyro. The board is oversized for the stack but keeps the standard 30.5 mm mounting pattern. On a real build that would be silly, but I'm hand-placing every part and the extra room is worth more to me.",
      },
      {
        kind: "text",
        text: "The gyro stays the ICM-42605. I looked at the BMI270 and rejected it because Betaflight discourages it for new designs.",
      },
    ],
  },
  {
    slug: "kickoff",
    date: "2026-05-20",
    dateLabel: "May 20, 2026",
    phase: "Kickoff",
    title: "Starting",
    standfirst:
      "Take an embedded system from a blank schematic to something that flies, and don't skip the annoying parts.",
    blocks: [
      {
        kind: "text",
        text: "The goal is to take an embedded system from a blank schematic to something that flies, without skipping the annoying parts.",
      },
      {
        kind: "text",
        text: "I'm using an STM32F405 because Betaflight supports it natively, and writing a custom target is a big part of why I'm doing this at all. The first pass at the power architecture assumes an external Matek MBEC6S for 5 V and a 6S pack.",
      },
      {
        kind: "text",
        text: "No VTX, camera or OSD. Those are solved problems, and adding them would take layout time I'd rather spend on the power tree, the IMU and getting the pinout right.",
      },
    ],
  },
];
