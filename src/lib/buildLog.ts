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
export const buildStatus = "Airframe built, flips on liftoff";

export const buildLog: BuildLogEntry[] = [
  {
    slug: "flash-was-never-dead",
    date: "2026-09-14",
    dateLabel: "September 14, 2026",
    phase: "Debug",
    title: "The flash chip was fine the whole time",
    standfirst:
      "The quad flips as soon as it lifts off, so I finally went after the blackbox flash. I spent two days blaming the chip and one night thinking I'd killed the board, and the actual problem was a missing line in Betaflight.",
    media: {
      kind: "image",
      src: "/assets/drone-airframe-assembled.jpg",
      alt: "The finished quadcopter with the custom flight controller, props and LiPo fitted, sitting on a tripod",
      caption: "Airframe done on September 12. All four motors spin, and it flips as soon as it gets light on its feet.",
    },
    blocks: [
      {
        kind: "text",
        text: "The airframe went together on the 12th and all four motors spin. It also tries to flip over as soon as it starts to lift, every time. I don't think it's the frame. The gyro alignment in my target is still a placeholder I guessed for the old IMU, and I've never checked which motor each output drives or which way they turn, and any one of those would make a quad do exactly this. On top of that, a gyro that's 180° out and a mirrored motor map look identical from the air, so I can't reason my way to the answer. It needs a props-off tilt test on the bench, which in hindsight I should have done before arming it the first time.",
      },
      {
        kind: "text",
        text: "The flip is also what made the flash urgent. Without a blackbox log I have nothing to diagnose it from except watching it flip, so the chip I'd written off on September 3 became the next thing to fix.",
      },
      {
        kind: "text",
        text: "Going back over why I'd decided it was dead, the reasoning had holes in it. A JEDEC ID of all zeros fits a dead die, but it also fits a chip that never gets selected, or a MISO line that something else is holding low. Three of the checks I'd counted as passes would pass in all three cases:",
      },
      {
        kind: "list",
        items: [
          "/CS idles at 3.3 V. With the pull-up fitted it reads 3.3 V whether the MCU ever drives it or not.",
          "Continuity from each U3 pin to the MCU. That shows each net is continuous, but it doesn't rule out a bridge to another net.",
          "MISO to ground measured 1.4 MΩ, unpowered. That can't catch anything that only pulls the line low once the board is on.",
        ],
      },
      {
        kind: "text",
        text: "At one point I was also poking at pins on the powered 0.5 mm LQFP with a handheld meter, and shortly after that the board stopped enumerating: power LED on, status LED off, no USB, and the F405 hot to the touch. Unpowered, I measured about 3 Ω from VCAP_1 to ground. I pulled C12 and measured again, still about 3 Ω, so I figured the short was inside the die, wrote the board off and started planning a respin.",
      },
      {
        kind: "text",
        text: "The next day I plugged it in with a scope attached and it just booted, like nothing had happened. The 3 Ω was me probing the ground-side pad of C12's now-empty footprint, so ground against ground (2.4 Ω raw against 1.6 Ω of lead resistance was never a short). The actual fault was C12 itself, a flex-cracked MLCC shorting the core regulator's output, which is why the chip got hot and never started, and pulling it fixed the board on the spot. In hindsight I should have tried powering it again before deciding anything.",
      },
      {
        kind: "text",
        text: "With C12 replaced and a working board again, I spent the evening checking the flash hardware properly, this time with tests that would give a real answer either way:",
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
        text: "So MISO was high, the MCU could read it as high, and flash_info still printed zeros, which pointed at firmware. To find where, I built a debug version of Betaflight that records which exit flashSpiInit() takes and prints the raw ID bytes instead of the tidied-up result. This is from the first boot:",
      },
      {
        kind: "code",
        caption: "flash_info debug",
        code: "stage: 4 TRANSACTED\nresolved pins: sck=B13 sdi=C02 sdo=B15 regbase=0x40003800\nspi regs: cr1=0x0357  spe=1 mstr=1 br=2\nsdi pin: moder=2 (alternate function) af=5 (SPI2 on F4)\nrdid: issued=1 raw=c8 40 15 c8",
      },
      {
        kind: "text",
        text: "C8 40 15 is the ID straight out of the GigaDevice datasheet, so the chip had been answering correctly since September 3. It turns out Betaflight 4.5.5 doesn't have the GD25Q16E in its chip table, so the driver didn't recognise the reply and gave up, and flash_info printed an empty struct. The 0x00000000 was never read off the wire at all.",
      },
      {
        kind: "text",
        text: "My July 30 entry says the part is already in that table. It isn't, at least not in the release I'm running, and that wrong line in my notes is why I spent two days debugging the hardware.",
      },
      {
        kind: "code",
        caption: "The fix, in flash_m25p16.c",
        code: "{ 0xC84015, 104, 50, 32, 256 },   // GigaDevice GD25Q16E, 2 MB\n// geometry copied from the Winbond W25Q16 entry above it",
      },
      {
        kind: "text",
        text: "The Winbond W25Q16 entry right above it has the same 2 MB layout, so I copied its geometry rather than guessing. It isn't upstream, so I have to re-apply it after every clean build or fresh clone.",
      },
      {
        kind: "callout",
        label: "What I'm doing differently",
        text: "Looking at the raw bytes before deciding what a bus returned. \"Nothing detected\" and \"read a zero\" printed exactly the same, and I treated one as the other for two days. And no meter probes on a powered 0.5 mm package: I'll probe a via, a pad or a passive, or tack on a wire.",
      },
      {
        kind: "text",
        text: "Blackbox works now. Next is setting the sample rate to 1/4 so the 2 MB chip doesn't fill in 22 seconds, checking motor mapping and direction, testing failsafe, and then logging a flight so I can diagnose the flip from data instead of guessing.",
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
      poster: "/assets/drone-motor-spin-poster.jpg",
      alt: "Bench test: the flight controller spins a brushless motor from FlySky transmitter throttle input",
      caption: "Throttle up on the FlySky, board powered from the pack and USB at once.",
    },
    blocks: [
      {
        kind: "text",
        text: "Spun a motor off the board today, with the LiPo in through CN1 and USB-C plugged in at the same time. Throttle up and it just ran, cleanly: no stutter, no brownout, no smoke.",
      },
      {
        kind: "text",
        text: "The dual-source part is what I was really testing. Three ORing diodes (D3, D4, D7) sit between the buck's 5 V and USB's 5 V, and until today I'd never had both live at once. If I'd got those backwards, one source would have been pushing current into the other. Nothing happened, which is the right result and not a very exciting one.",
      },
      {
        kind: "text",
        text: "The receiver is bound, with i-BUS into UART1 and live channel data showing in the Configurator. Current sense on PA2 reads correctly with the motor under load.",
      },
      {
        kind: "text",
        text: "The blackbox flash is dead, though, not miswired. I went back and re-checked every pin by hand: VCC, /HOLD, /WP, /CS, all four SPI2 continuity points, pin-1 orientation, and no MISO-to-ground short (1.4 MΩ). All of them are what they should be, and flash_info still returns nothing:",
      },
      {
        kind: "code",
        caption: "Betaflight CLI",
        code: "# flash_info\nFlash sectors=0, sectorSize=0, pagesPerSector=0, pageSize=0, totalSize=0 JEDEC ID=0x00000000",
      },
      {
        kind: "text",
        text: "All zeros rather than all ones is the giveaway. An open MISO floats high and reads 0xFFFFFF, whereas 0x000000 means the MCU clocked out the read command and the data line sat low the whole time, so the chip never answered. That leaves nothing to blame but the die. I have five spares, so it's a hot-air swap, keeping the nozzle narrow and well away from U7, since the BMI270 is the one part on this board I don't want to reflow twice.",
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
          "Four DShot outputs landed on DMA1 streams 7, 2, 6 and 1. Four distinct streams, no clash.",
        ],
      },
      {
        kind: "text",
        text: "That last one closes out the motor remap from June: the pin I moved to avoid a DMA collision is clear on real silicon too.",
      },
      {
        kind: "text",
        text: "Then I lost a day to the ADC. status showed a healthy Vref=3.28V and a core temperature climbing normally, with Voltage: 0 * 0.01V (0S battery - NOT PRESENT) directly underneath, while my meter read 1.4 V on PA1. I checked the divider, JP8, battery_meter = ADC, adc_device = 1 and the resource mapping, and they were all correct. Everything downstream of that pin measured fine and the reading stayed at zero.",
      },
      {
        kind: "text",
        text: "It turned out to be DMA. On the F405, ADC1's regular-conversion DMA defaults to DMA2 Stream 0 Channel 0, and SPI1_RX (the gyro) defaults to DMA2 Stream 0 Channel 3, so they both want the same stream. SPI1 gets allocated first and wins, and then the ADC driver does this:",
      },
      {
        kind: "code",
        caption: "betaflight/src/main/drivers/adc_stm32f4xx.c",
        code: "if (!dmaAllocate(dmaGetIdentifier(adc.dmaResource), OWNER_ADC, 0)) {\n    return;\n}",
      },
      {
        kind: "text",
        text: "It just returns, with no error, no boot warning and no log line. The regular conversion sequence never runs and every external ADC channel reads zero, which here means both battery voltage and current.",
      },
      {
        kind: "text",
        text: "It's hard to spot because on F4, Vref and core temperature come through injected channels triggered by software polling, and those don't need DMA at all. So the ADC looks healthy in status while the two channels I actually wanted are missing, which is why I went through the jumper, the divider and the pin mapping before I looked at DMA.",
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
        text: "I checked DMA for the motors because that was the collision I already knew about, and it didn't occur to me to check it for the ADC. Checking DMA at bring-up applies to every peripheral, not just the motors.",
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
      alt: "Assembled STM32F405 flight controller PCB after hotplate reflow",
      caption: "Everything placed, one reflow pass, no rework yet.",
    },
    blocks: [
      {
        kind: "text",
        text: "Before any paste went down I generated a placement guide from the KiCad file, reading the actual pad-to-net connections instead of trusting the BOM. It's organised by part value rather than reference designator, because that's how you actually assemble: open one strip, place every position for that value, seal the strip, then open the next. Never two strips open at once.",
      },
      {
        kind: "text",
        text: "That might sound like a lot of process for a board with sixty-odd passives, but two pairs on this board sit next to each other in the same 0805 package and are silently wrong if swapped:",
      },
      {
        kind: "list",
        items: [
          "R6 (marked 1003, 100 kΩ) and R13 (1002, 10 kΩ) are the VBAT divider. Swapped, PA1 sees 15.3 V instead of 1.53 V and the pin dies the first time a pack goes in.",
          "R7 (1002) and R8 (3241) set the buck feedback. Swapped, the converter outputs 1.221 × (1 + 3.24/10) = 1.62 V instead of 5 V, nothing downstream runs, and you spend an evening blaming the TPS5450.",
        ],
      },
      {
        kind: "text",
        text: "One deliberate change from the BOM: R14 went from 470 Ω to 330 Ω. The 470 was sized for the red power LED I originally specified, but the LEDs that turned up are green with a Vf around 2.55 V, which left D5 at roughly 1.6 mA and basically invisible. At 330 Ω it runs about 2.3 mA. D6 keeps its own 330 Ω for a different reason: it hangs off PC14 in the backup domain, which is limited to about 3 mA.",
      },
      {
        kind: "text",
        text: "Everything goes down value-side-up so I can read the markings back afterwards instead of taking my own word for it.",
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
        text: "Two bad discoveries today. First the gyro: I'd designed around a TDK ICM-42605, and somewhere between choosing it and needing it the whole 426xx family went reel-only at LCSC (minimum order a thousand-plus) and out of stock at DigiKey and Mouser. In quantity one it's effectively gone.",
      },
      {
        kind: "text",
        text: "The replacement is a Bosch BMI270. It has the same 2.5 × 3.0 mm LGA-14 outline, but that's the only thing it shares. The pinout is different, so it needed a new footprint and every IMU net re-routed. The decoupling is different too (100 nF at VDD and 100 nF at VDDIO, where the 42605 wanted a 2.2 µF / 0.1 µF / 10 nF set), and the unused-pin strapping is inverted: ASDx and ASCx now go to VDDIO and must not be grounded, whereas grounding is what the 42605's RESV pins wanted.",
      },
      {
        kind: "text",
        text: "The power tree absorbed all of it with no changes. VDD stayed on the quiet TLV733P rail and VDDIO stayed on the main AP2112K rail, so a forced sourcing change cost me a footprint and a re-route instead of a power redesign. That wasn't planned. I split the rails back in June to keep digital switching noise off the gyro supply, and it happened to pay off two months later for an unrelated reason.",
      },
      {
        kind: "text",
        text: "It does cost something. The BMI270 ships uncalibrated, which is why Betaflight discourages it for new designs, and it caps the PID loop at 3.2 kHz instead of 8 kHz. For Acro freestyle neither matters much, and the alternative was not having a board.",
      },
      {
        kind: "text",
        text: "Then, while reconciling three different BOM files against each other, I found the flash problem. U3 as ordered and fitted is a GigaDevice GD25Q16E, which is 16 Mbit, so 2 MB. The BOM called for a 128 Mbit part. The wrong one made it onto the order and I didn't catch it until a week after the boards shipped, which says a fair bit about how I was managing the BOM.",
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
        text: "What I lose is log duration, not function: roughly 22 seconds at 3.2 kHz, 44 at 1.6 kHz, 87 at 800 Hz. Tuning runs are 30 to 60 seconds anyway, and 800 Hz still resolves everything below 400 Hz, which is where the motor and frame noise peaks that filter tuning depends on are. The real loss is not being able to log a whole pack. Every candidate upgrade uses the same SOIC-8 208-mil footprint, so fixing it later is a hot-air swap.",
      },
      {
        kind: "callout",
        label: "New bring-up item: JP10",
        text: "Found this while auditing. The quiet 3.3 V rail reaches the BMI270's VDD through JP10, a normally-open solder jumper. If it isn't bridged, the board enumerates fine over USB and reports no gyro, which looks a lot like a firmware bug.",
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
        text: "All of that went into one file, VERIFIED_PINOUT.md, which is now the only pin document I trust. I marked the older tables superseded instead of deleting them, so I can still see what I got wrong and when.",
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
        text: "Motor 4 also had to move. It was on a pin that wants DMA1 Stream 3, and so does SPI2_RX, which is the blackbox flash, so DShot and the logger would have been fighting over the same stream. That doesn't show up as a compile error. It shows up as a motor misbehaving only while you're logging, which would be a miserable bug to track down.",
      },
      {
        kind: "text",
        text: "I remapped it and checked the new assignment against the DMA request tables in RM0090, but I don't fully trust the table. dma show all on real hardware is the check that counts, so that went on the bring-up list.",
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
        text: "The BLS-04 has no BEC, it just hands you raw pack voltage. So the board carries its own buck converter running off up to 16.8 V, which is a much more interesting problem than taking a regulated 5 V from somewhere else, and the external Matek BEC I'd planned on is gone. So far that constraint has been the most useful decision on the project.",
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
