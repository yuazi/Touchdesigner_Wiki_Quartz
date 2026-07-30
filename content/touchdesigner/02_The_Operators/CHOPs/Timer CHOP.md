---
title: Timer CHOP
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
  - timer
date: 2026-02-11
---

The **Timer CHOP** is a state machine for time. Use it any time you'd reach for "do X after N seconds," "play through these phases," or "loop this for 10 cycles." It outputs a current fraction, a current state (running, done, ready), and fires Python callbacks at the right moments. Building this by hand with Constant CHOPs and counters works briefly, then breaks the moment you need cycling, segments, or pause.

## Output Channels

The Timer CHOP exposes a lot of channels. The five you'll use most:

| Channel            | What it holds                                                |
| ------------------ | ------------------------------------------------------------ |
| **timer_fraction** | "0 to 1 per-segment" - drives most animation directly        |
| **timer_seconds**  | Elapsed time in seconds since Start                          |
| **timer_pulse**    | Pulses (1 for one frame) "when the timer reaches its length" |
| **running**        | "1 after a Start and before the Done"                        |
| **done**           | Activates "when done or complete"                            |

Additional channels worth knowing:

| Channel             | Use for                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| **ready**           | "1 after an Initialize and before a Start" - confirms the timer is armed |
| **cycles**          | Number of completed cycles                                               |
| **cycle_pulse**     | One-frame pulse at each cycle boundary                                   |
| **segment**         | Index of the current segment (0-based) in segment mode                   |
| **segment_pulse**   | "pulse at the end of each segment"                                       |
| **playing_seconds** | Elapsed time, unaffected by Speed parameter                              |
| **running_seconds** | "wall-clock time since Start occurred"                                   |

## Key Parameters (Timer Page)

| Parameter              | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| **Initialize** (pulse) | "sets the frames, samples and fraction counters to zero"              |
| **Start** (pulse)      | "begin the timers counting. It will count through the delay first"    |
| **Length**             | "the time-length of the timer"                                        |
| **Length Type**        | Fixed or Infinite                                                     |
| **Length Units**       | Samples / Frames / Seconds                                            |
| **Delay**              | "after Start, the delay before the timer begins counting"             |
| **Speed**              | "Slows down or speeds up the timer" (default 1)                       |
| **Play**               | "Pauses the timer. It is basically a 0 or 1 multiplier on the Speed"  |
| **Cycle**              | "causes the timer to loop back to 0 when it reaches the end"          |
| **Cycle Limit**        | Cap the number of cycles                                              |
| **Maximum Cycles**     | The cap value when Cycle Limit is on                                  |
| **Cue Point**          | A frozen reference time the timer can jump to                         |
| **Cue Pulse** (pulse)  | "Jump instantly to the Cue Point"                                     |
| **On Done**            | Do Nothing / Re-Initialize / Re-Start / Re-Start without Initializing |
| **Callbacks DAT**      | "The path to the DAT containing callbacks for this Timer CHOP"        |

## Segments Mode

A Segments DAT (a Table DAT) drives a multi-stage timer. One row per segment, with these column headings: `delay` or `begin`, `length`, `cycle`, `cyclelimit`, `maxcycles`, `cycleendalert`. The `begin` column "represents the time from Start that the timer will begin counting." Custom columns are allowed and can be exported as channels via the **Columns to Custom Channels** parameter.

Choose **Serial Timers** ("timers will be played back-to-back") or **Parallel Timers** ("timers can be played at the same time"). Segment Units (Samples/Frames/Seconds) controls the unit of the time columns.

Navigation pulses: **Go to Previous Segment**, **Go to Next Segment**, **Exit Segment at End of Cycle**.

## Callbacks (Timer Callback DAT)

The Timer CHOP creates a Text DAT full of Python skeletons. Fill in the methods you need.

| Method              | Fires when                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| `onInitialize()`    | Initialize is pulsed; "prepare any part of your setup prior to starting"     |
| `onStart()`         | "the frame that the Start parameter is pulsed"                               |
| `onTimerActive()`   | "every frame that the timer is running and there is no Delay or Play is off" |
| `onCycleStart()`    | "if the timer is set to cycle"                                               |
| `onCycleEndAlert()` | Configurable preview window before each cycle ends (use for crossfades)      |
| `onSegmentEnter()`  | A segment becomes active (segment-mode timers)                               |
| `onSegmentExit()`   | A segment finishes (segment-mode timers)                                     |
| `onDone()`          | "the timer reaches its finished state"                                       |

In a segment callback, `print(help(segment))` lists what's available on the segment object, including any custom columns.

## Python Control

```python
# Start the timer from another script
op('timer1').par.start.pulse()

# Re-arm and start fresh
op('timer1').par.initialize.pulse()
op('timer1').par.start.pulse()

# Read the current fraction
frac = op('timer1')['timer_fraction'][0]

# Jump to a cue
op('timer1').par.cuepoint = 5.0
op('timer1').par.cuepulse.pulse()
```

## Practical Example: 3-Segment Intro

Drop a Table DAT with this content:

```
length	cycle	cyclelimit	maxcycles
2	off	off	0
4	off	off	0
1	off	off	0
```

Set Timer CHOP Length Units to Seconds, point Segments DAT at this table, and define the callback:

```python
def onSegmentEnter(segment, prev, info):
    constant = op('phase_constant')
    if segment.index == 0:
        constant.par.value0 = 0.0   # intro
    elif segment.index == 1:
        constant.par.value0 = 1.0   # main
    elif segment.index == 2:
        constant.par.value0 = 0.5   # outro
```

The Timer cycles through 2 + 4 + 1 = 7 seconds total, switching the Constant CHOP at each segment boundary.

## Common Gotchas

- **Length Units matters.** "5" means 5 samples, 5 frames, or 5 seconds depending on Length Units. Misreading this is the most common Timer mistake.
- **Initialize is not Start.** Initialize zeros the counters and arms the timer (sets `ready` to 1); Start kicks off the run. You usually pulse both, in that order.
- **Pulse on the parameter, not the channel.** `op('timer1').par.start.pulse()` works; trying to "set" `op('timer1').par.start = 1` doesn't trigger the pulse.
- **Segments table needs the right column names.** A typo like `lenght` instead of `length` is silently ignored; the timer just uses defaults.
- **Callbacks need the Callbacks DAT parameter set.** The auto-created callback DAT is wired by default, but if you copy/paste a Timer CHOP, double-check the parameter still points at a DAT that exists.

## Related Nodes

- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|Python in TD]]: full reference for the callback DAT system
- [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]]: scoping rules for Python in callbacks
- [[Constant CHOP]]: the natural pairing for a state-driven value
- [[Math CHOP]]: remap `timer_fraction` into whatever range you need

---

[[touchdesigner/02_The_Operators/COMPs/index|(y-) Next Chapter: COMPs]]

---

[[touchdesigner/02_The_Operators/CHOPs/index|(y) Return to CHOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
