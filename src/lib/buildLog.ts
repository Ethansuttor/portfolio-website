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
    title: "v2 is ordered",
    standfirst: "Black boards this time, and about half the size.",
    media: {
      kind: "image",
      src: "/assets/iris-v2-render.png",
      alt: "KiCad 3D render of the IRIS v2 flight controller: square black-masked board with the STM32 in the middle and JST connectors for GPS, I2C, flow and camera around the edges",
      caption: "IRIS in KiCad's 3D viewer. 55 × 55 mm, with plugs for GPS, flow, I2C and the camera around the edge.",
    },
    blocks: [
      {
        kind: "text",
        text: "Sent v2 off to fab today, stencil included. I'm calling it IRIS (the logo is an eye with a camera aperture for the iris, since this is the board that gets a camera), and this time the mask is black.",
      },
      {
        kind: "text",
        text: "It's 55 × 55 mm. v1 was 80 × 80, so that's 53% less board area, and it bolts straight onto the 30.5 mm stack instead of needing that big carrier plate. The 3D model on the project page is this one.",
      },
      {
        kind: "text",
        text: "Smaller, but it has more on it:",
      },
      {
        kind: "list",
        items: [
          "16 MB of blackbox flash instead of 2, so logs go from about 85 seconds to about 11 minutes",
          "a barometer",
          "plugs for GPS/compass, optical flow and a spare I2C device",
          "a header for the camera out of an old Hubsan H501A, plus power pads for a camera/VTX",
          "battery voltage sent back to my transmitter",
          "a 5 V supply that can actually do 3 A",
          "one 3.3 V regulator instead of two, and three test jumpers instead of nine",
        ],
      },
      {
        kind: "text",
        text: "I only ordered the parts I don't already have. Everything else comes out of the leftover v1 bags, assuming my count is right. I should probably actually count them before the boards show up.",
      },
      {
        kind: "text",
        text: "Two things I knowingly left alone. The buck chip only has 3 vias under it for heat, and nothing stops the board back-feeding USB if the battery is in and the cable goes to a computer that's off. So: keep an eye on the buck temperature, and don't do that.",
      },
      {
        kind: "text",
        text: "Also pulled the GPS out of the Hubsan and hooked it to an ESP32. Got a fix in 43 seconds sitting in a window, so that's going on v2.",
      },
    ],
  },
  {
    slug: "v2-layout",
    date: "2026-10-29",
    dateLabel: "October 29, 2026",
    phase: "v2 Layout",
    title: "Routing v2",
    standfirst: "About a week of moving parts around and rerouting the same few traces.",
    blocks: [
      {
        kind: "text",
        text: "Layout took about a week of save, run checks, fix stuff, repeat. A few things worth writing down.",
      },
      {
        kind: "text",
        text: "The buck's switch node (the noisiest trace on the board) was about 19 mm long because the chip was facing the wrong way. Rotated it and it's about 7 mm now.",
      },
      {
        kind: "text",
        text: "The camera and VTX power was on the same 5 V that USB feeds, so just plugging in USB would have tried to run the VTX and camera off the USB port. Moved them to the battery-only 5 V.",
      },
      {
        kind: "text",
        text: "At one point the current sense trace ended up right under the buck inductor, which is about the worst place for it. Moved it. A couple of traces were also way too close to the mounting holes, which have metal screws going through them, so those moved too.",
      },
      {
        kind: "text",
        text: "Inner layers are a solid ground plane and a solid 3.3 V plane. DRC is clean apart from silkscreen nitpicks.",
      },
    ],
  },
  {
    slug: "v2-scope",
    date: "2026-10-21",
    dateLabel: "October 21, 2026",
    phase: "v2 Design",
    title: "Figuring out what v2 is",
    standfirst: "Smaller, a camera, and eventually holding position. Most of the changes are fixing v1 stuff.",
    blocks: [
      {
        kind: "text",
        text: "Now that v1 flies I sat down and worked out v2. Three goals: smaller, video, and eventually being able to hold position on its own.",
      },
      {
        kind: "text",
        text: "Staying on the same STM32F405. It has enough pins once I shuffle the motors around, and an H7 would only really be worth it for ArduPilot.",
      },
      {
        kind: "text",
        text: "Moving motors meant checking DMA again, since I'm not losing another day to that. There's one overlap: motor 4 and the flash chip's receive side want the same stream. Betaflight gives it to the motor and flash reads just run without DMA. Small CPU cost, motors are fine, I'll take it.",
      },
      {
        kind: "text",
        text: "I added a whole OSD chip for video and then ripped it back out the same day. Simpler to use an all-in-one camera/VTX and let the Hubsan camera record to its own SD card.",
      },
      {
        kind: "text",
        text: "Position hold needs optical flow, which Betaflight doesn't do, so that's INAV at some point. For now v2 just has the plugs for it.",
      },
      {
        kind: "text",
        text: "The rest is fixing things v1 taught me:",
      },
      {
        kind: "list",
        items: [
          "bigger flash, since every log so far has ended because the 2 MB filled up",
          "no separate gyro regulator. I flew v1 with the gyro on the main rail and it felt the same. That's a feel thing, not a measurement, so there's a spot for a filter if noise shows up",
          "a beefier inductor, since v1's tops out around 1.5 A",
          "a pulldown on the current sense pin so it reads 0 instead of garbage when nothing's connected",
          "the status LED moved off one of the weak backup-domain pins",
          "an SMD buzzer",
        ],
      },
    ],
  },
  {
    slug: "first-flight-logs",
    date: "2026-10-21",
    dateLabel: "October 21, 2026",
    phase: "Flight logs",
    title: "The current sensor was lying",
    standfirst: "First real flight logs. Current read 30 A at a hover, which can't be right.",
    media: {
      kind: "image",
      src: "/assets/drone-v1-on-frame.jpg",
      aspect: "portrait",
      alt: "The green v1 flight controller mounted on a red 3D-printed carrier plate on the quad frame, with jumper wires and a large 1000 µF capacitor soldered on",
      caption: "v1 on the carrier plate, bodge wires and all. This is the setup these logs came from.",
    },
    blocks: [
      {
        kind: "text",
        text: "Got actual blackbox logs now. First thing I noticed: both logs just stop when the 2 MB flash fills up, around 85 seconds. Yeah, that's why v2 gets 16 MB.",
      },
      {
        kind: "text",
        text: "The current sensor said about 30 A at hover, which is way too much for a 790 g quad. I figured the scale setting was off, but the reading didn't go up with throttle (it went down a little) and it followed the battery voltage almost exactly. A bad scale would still move with load.",
      },
      {
        kind: "text",
        text: "What it looks like is the current pin is floating, so the ADC is reading leftover charge from the battery voltage channel it samples right before. So the signal isn't making it to the pin at all. Need to check the jumper and the harness.",
      },
      {
        kind: "text",
        text: "The motors are more interesting. Yesterday's log had a smooth gradient across all four in how hard they were driven, which made me think the weight was off center. Today motors 1 to 3 are within 3% of each other and motor 4 (front left) alone is running about 13% higher, with a new yaw offset. One motor standing apart points at that motor or its prop, not the balance. Spun them all by hand with the power off and that one has noticeably weaker magnetic detents, so I think its magnets are weak, maybe from heat. Haven't confirmed that yet. Gentle hovers until I swap it.",
      },
      {
        kind: "text",
        text: "Gyro noise looks mechanical (it's at motor frequency and moves between axes from one flight to the next), not electrical. Good enough for now.",
      },
    ],
  },
  {
    slug: "it-flies",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    phase: "First flight",
    title: "It flies",
    standfirst: "No more flipping. Two motors were spinning the wrong way.",
    media: {
      kind: "video",
      src: "/assets/drone-first-flight.mp4",
      poster: "/assets/drone-first-flight-poster.jpg",
      aspect: "portrait",
      alt: "The quadcopter taking off and hovering on the v1 flight controller",
      caption: "Off the ground and staying right side up.",
    },
    blocks: [
      {
        kind: "text",
        text: "Found the flip. Nothing was wrong with the board or the firmware. Some of the motor leads were wired backwards, so a motor was spinning clockwise with a counterclockwise prop on it. Swapped the leads and it flies fine now.",
      },
      {
        kind: "text",
        text: "This one's on me. I was too eager to see it fly and skipped the basic checks. A spin test with the props off would have caught it in a minute, and I lost a lot more than a minute by not doing one.",
      },
      {
        kind: "text",
        text: "Haven't tested failsafe yet. That's next.",
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
      "Two days blaming the chip, one night thinking I'd killed the board. It was a missing line in Betaflight.",
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
        text: "Finished the airframe on the 12th and it flips over every time it tries to take off. Could be gyro orientation (still a guess from the old IMU), could be motor order or direction. I hadn't checked any of it. Without blackbox logs I'm just guessing, so the \"dead\" flash chip from the 3rd became the priority.",
      },
      {
        kind: "text",
        text: "Looking back at why I called it dead, my checks weren't great. Most of them would have passed whether the chip was dead or not.",
      },
      {
        kind: "text",
        text: "Then I made it worse. I was poking pins on the powered MCU with a meter (0.5 mm pitch, bad idea) and the board stopped showing up on USB. The MCU got hot, I read about 3 Ω to ground, decided the whole board was dead, and started planning a respin.",
      },
      {
        kind: "text",
        text: "Next day I plugged it in and it booted fine. The 3 Ω was me sitting on the ground pad of a capacitor. In that same session a probe slip cracked that cap (C12), which was the only real damage in the whole thing, and I caused it. Pulling it had already fixed the board. Should have just tried powering it again.",
      },
      {
        kind: "text",
        text: "Back to the flash, this time with tests that could actually fail. Toggled chip select from Betaflight and watched it move, pulled MISO up to see if anything was holding it low, and used the MISO pin as an analog input to check the pin itself. All fine, so it had to be firmware. I built a debug Betaflight that prints the raw ID bytes:",
      },
      {
        kind: "code",
        caption: "flash_info debug",
        code: "rdid: issued=1 raw=c8 40 15 c8",
      },
      {
        kind: "text",
        text: "C8 40 15 is exactly what the datasheet says, so the chip had been answering correctly every time. Betaflight 4.5.5 just doesn't have it in its table of known parts, so the driver threw the answer away and printed zeros. The zeros I'd been reasoning from for days were a placeholder nobody had measured. My own July notes said it was in the list. It wasn't.",
      },
      {
        kind: "code",
        caption: "The fix, in flash_m25p16.c",
        code: "{ 0xC84015, 104, 50, 32, 256 },   // GigaDevice GD25Q16E, 2 MB\n// geometry copied from the Winbond W25Q16 entry above it",
      },
      {
        kind: "text",
        text: "It's not upstream, so I have to re-add it every clean build. New rules: before running a test, write down what each explanation predicts, and skip it if they all predict the same thing. Look at raw data before trusting a summary of it. And don't call a part dead off a meter reading. Power it and see what it does.",
      },
    ],
  },
  {
    slug: "one-motor-full-throttle",
    date: "2026-09-03",
    dateLabel: "September 3, 2026",
    phase: "Bench test",
    title: "One motor at full throttle, and a dead flash chip",
    standfirst: "Motor spins fine on battery and USB at the same time. The flash chip isn't answering.",
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
        text: "Spun a motor today with the battery and USB plugged in at the same time. That's the test I actually cared about, because if I'd put the power diodes in backwards one supply would be pushing into the other. Nothing happened, so they're the right way round.",
      },
      {
        kind: "text",
        text: "Receiver is bound and showing channels, and current sense reads under load.",
      },
      {
        kind: "text",
        text: "The blackbox flash returns nothing:",
      },
      {
        kind: "code",
        caption: "Betaflight CLI",
        code: "# flash_info\nFlash sectors=0, sectorSize=0, pagesPerSector=0, pageSize=0, totalSize=0 JEDEC ID=0x00000000",
      },
      {
        kind: "text",
        text: "All zeros instead of all ones, which to me says the chip isn't answering (an open line would read high). Wiring checks out, so I'm calling the chip dead. I have spares, so it's a hot air swap, just keeping the heat away from the gyro.",
      },
      {
        kind: "text",
        text: "Other three motors and failsafe still untested, so not flying yet.",
      },
    ],
  },
  {
    slug: "bring-up-adc-dma",
    date: "2026-08-19",
    dateLabel: "August 19, 2026",
    phase: "Bring-up",
    title: "Bring-up, and a day lost to the ADC",
    standfirst: "Everything came up except battery voltage and current, which read zero for no visible reason.",
    blocks: [
      {
        kind: "text",
        text: "Brought the board up one power stage at a time through the solder jumpers. Rails, clock and IMU all came up first try: 3.3 V up, MCU on USB, system clock at 168 MHz, buck putting out 4.98 V from a 15.58 V pack (4.99 V expected), the BMI270 showed up on SPI1 at a 3225 Hz gyro rate as soon as I bridged its jumper, and each motor got its own DMA stream. The one thing that didn't come up was the flash, which returned a chip ID of all zeros. Parking that for now.",
      },
      {
        kind: "text",
        text: "Then battery voltage read 0, with 1.4 V on the pin according to my meter. Divider, jumper, config, pin mapping, all fine. Lost most of a day here.",
      },
      {
        kind: "text",
        text: "It was DMA. The ADC and the gyro's SPI default to the same DMA stream, the gyro gets it first, and the ADC driver just quietly gives up:",
      },
      {
        kind: "code",
        caption: "betaflight/src/main/drivers/adc_stm32f4xx.c",
        code: "if (!dmaAllocate(dmaGetIdentifier(adc.dmaResource), OWNER_ADC, 0)) {\n    return;\n}",
      },
      {
        kind: "text",
        text: "No error, nothing. And the internal channels (Vref, temperature) don't use DMA, so the status screen looked completely healthy while voltage and current sat at zero. The fix is one line:",
      },
      {
        kind: "code",
        caption: "Fix, now permanent in the target",
        code: "#define ADC1_DMA_OPT 1      // ADC1 -> DMA2 Stream 4, clear of SPI1",
      },
      {
        kind: "text",
        text: "With that in, the battery divider measures 11.13:1 against the 11:1 it was designed for. I'd checked DMA for the motors and nothing else. Checking all of it from now on.",
      },
    ],
  },
  {
    slug: "placement-guide",
    date: "2026-08-11",
    dateLabel: "August 11, 2026",
    phase: "Assembly",
    title: "Placing parts without killing the board",
    standfirst: "Made a placement sheet sorted by value, mostly because of two resistor pairs that look the same.",
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
        text: "Before putting paste down I made a placement list from the KiCad file, sorted by part value. Open one strip, place every spot that uses it, close it, next one.",
      },
      {
        kind: "text",
        text: "Maybe overkill for 60-ish passives, but there are two pairs that sit right next to each other in the same package and would be bad to mix up. Swap the battery divider resistors and an ADC pin sees 15 V. Swap the buck feedback resistors and it puts out 1.6 V instead of 5.",
      },
      {
        kind: "text",
        text: "Also changed the power LED resistor from 470 to 330 Ω. The LEDs I got are green, not the red I'd planned for, and they were basically invisible at 470.",
      },
    ],
  },
  {
    slug: "imu-swap-and-flash",
    date: "2026-07-30",
    dateLabel: "July 30, 2026",
    phase: "Sourcing",
    title: "The IMU went out of stock, and I ordered the wrong flash",
    standfirst: "Two bad surprises in one day.",
    blocks: [
      {
        kind: "text",
        text: "The gyro I designed around (TDK ICM-42605) is basically gone. The whole family went reel-only, so you can't buy just one anymore.",
      },
      {
        kind: "text",
        text: "Switched to a Bosch BMI270. Same size package, different everything else: new footprint, new pinout, different caps, rerouted. The power side didn't have to change, because I'd already put the gyro on its own regulator back in June (for noise, not because I saw this coming).",
      },
      {
        kind: "text",
        text: "Betaflight isn't a big fan of the BMI270 and it caps the loop at 3.2 kHz instead of 8. For what I'm flying that's fine.",
      },
      {
        kind: "text",
        text: "Then, going through three BOM files that didn't agree with each other, I found out the flash I ordered is 2 MB, not 16. Having three BOMs is probably how that happened.",
      },
      {
        kind: "text",
        text: "Keeping it. Betaflight should already know this chip, so no firmware changes. Logs are just short, around 22 seconds at full rate, longer if I drop the sample rate. Bigger chips use the same footprint, so I can swap later.",
      },
      {
        kind: "text",
        text: "Also noticed the gyro's power goes through a solder jumper that's open by default. If I forget to bridge it the board will just say there's no gyro, and I'd probably blame firmware. Added it to the bring-up list.",
      },
    ],
  },
  {
    slug: "custom-betaflight-target",
    date: "2026-07-23",
    dateLabel: "July 23, 2026",
    phase: "Firmware",
    title: "Writing the Betaflight target while I wait",
    standfirst: "Boards are in the mail, so firmware.",
    blocks: [
      {
        kind: "text",
        text: "Nothing to solder yet, so I wrote the Betaflight target for the board, plus notes on how to build and flash it so I don't have to figure that out twice.",
      },
      {
        kind: "text",
        text: "While matching up pins I found my planning docs didn't match the actual schematic. The boards are already made, so the schematic wins. Put the real pinout in one file and marked the old tables as outdated instead of deleting them.",
      },
      {
        kind: "text",
        text: "Also threw together a 5 inch frame in Python while waiting. 220 mm wheelbase, change one number to resize it, spits out an STL. Haven't printed it.",
      },
      {
        kind: "text",
        text: "Gyro orientation in the target is still a guess. I'll sort it out on the bench.",
      },
    ],
  },
  {
    slug: "boards-ordered",
    date: "2026-07-19",
    dateLabel: "July 19, 2026",
    phase: "Fab",
    title: "Boards ordered",
    standfirst: "$130 and two weeks to wait.",
    media: {
      kind: "image",
      src: "/assets/3D-angled.png",
      alt: "KiCad 3D render of the flight controller board, angled view",
      caption: "What I was hoping would show up in two weeks.",
    },
    blocks: [
      {
        kind: "text",
        text: "Sent it to JLCPCB: 4 layers, ENIG (nicer for the gyro, whose pads you can't see once it's down), a stencil, five boards. My commit message that day was \"Ordered the PCB now i have to wait and see if i waisted 130 dollars,\" which about covers it.",
      },
      {
        kind: "text",
        text: "A couple of BOM questions I'll answer with a meter when the parts show up, mainly which buck chip and inductor actually shipped.",
      },
    ],
  },
  {
    slug: "schematic-verified",
    date: "2026-07-11",
    dateLabel: "July 11, 2026",
    phase: "Schematic",
    title: "Schematic done",
    standfirst: "Last of the analog bits, then going through every pin.",
    blocks: [
      {
        kind: "text",
        text: "Finished the analog stuff: a clamp on the ESC's current line so it can't push more than 3.3 V into the MCU, the battery voltage divider, and an SWD header in case flashing over USB doesn't work.",
      },
      {
        kind: "text",
        text: "Then went through the netlist pin by pin against KiCad. ERC is clean.",
      },
      {
        kind: "text",
        text: "One thing I don't trust on paper: the ESC connector is numbered backwards from the manufacturer's diagram, which only works if it mates flipped. I'll beep it out before powering anything, because if it's wrong, battery voltage lands on a 3.3 V pin.",
      },
      { kind: "text", text: "Layout next." },
    ],
  },
  {
    slug: "4s-and-motor-remap",
    date: "2026-06-28",
    dateLabel: "June 28, 2026",
    phase: "Design",
    title: "6S to 4S, and a DMA clash",
    standfirst: "Motor 4 and the flash wanted the same DMA stream.",
    blocks: [
      {
        kind: "text",
        text: "Dropped from 6S to 4S. Easier on the capacitors, and the buck inductor goes to 15 µH to match TI's example circuit.",
      },
      {
        kind: "text",
        text: "Also, motor 4 was on a pin that shares a DMA stream with the flash chip. That doesn't throw an error, you'd just get a motor acting weird only while it's logging. Moved it. I'll check it on the real board too, since I don't totally trust the tables in the reference manual.",
      },
    ],
  },
  {
    slug: "esc-has-no-bec",
    date: "2026-06-23",
    dateLabel: "June 23, 2026",
    phase: "Architecture",
    title: "The ESC has no BEC",
    standfirst: "So the board has to make its own 5 V.",
    blocks: [
      {
        kind: "text",
        text: "I want this to plug into the ESC I already have, a Flycolor Raptor BLS-04. Turns out it has no BEC, it just passes battery voltage through. So the board needs its own buck converter, which is a more interesting problem anyway.",
      },
      {
        kind: "text",
        text: "Other decisions: 4 layers, every part on top so it's one reflow, hot air for the gyro. The board's bigger than it needs to be because I'm placing everything by hand.",
      },
      {
        kind: "text",
        text: "Sticking with the ICM-42605 for the gyro. Looked at the BMI270, but Betaflight discourages it for new designs.",
      },
    ],
  },
  {
    slug: "kickoff",
    date: "2026-05-20",
    dateLabel: "May 20, 2026",
    phase: "Kickoff",
    title: "Starting",
    standfirst: "Blank schematic to something that flies.",
    blocks: [
      {
        kind: "text",
        text: "Goal: design a flight controller from scratch and get it flying. STM32F405, because Betaflight supports it and I want to write my own target.",
      },
      {
        kind: "text",
        text: "Skipping video, camera and OSD for now. I'd rather spend the time on power, the gyro and getting the pinout right.",
      },
    ],
  },
];
