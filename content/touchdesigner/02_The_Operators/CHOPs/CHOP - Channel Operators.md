---
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
date: 2026-02-11
---

# CHOP - Channel Operators (Data)

CHOPs ("CHannel OPerators") are the family that handles motion, audio, math, logic, MIDI, OSC, and any other stream of numeric data. Per the wiki: a CHOP holds one or more named **channels**, and each channel is "a sequence of numbers (also known as Samples)." A sample is "one floating point number per channel." If a CHOP needs to represent something time-varying, those samples are spaced at the CHOP's sample rate.

## Data Structure

| Concept         | What it is                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Channel**     | A named sequence of floats. Names like `tx`, `chan1`, `audio_l`. Valid characters are letters, digits, and `- _ : /`.                                 |
| **Sample**      | One floating-point value at index `i`. A 1-sample channel holds a single value (a scalar); a 60-sample channel can hold a second of 60 fps animation. |
| **Sample Rate** | Samples per second. The wiki example: "a CHOP's sample rate of 240 samples per second gives 4 samples per frame."                                     |
| **Start / End** | The first and last sample indices that are active in the channel.                                                                                     |

Most control-signal CHOPs are 1 sample long (just a current value). Audio and recorded animation CHOPs hold long sequences of samples.

## CHOP Categories

The wiki itself doesn't carve CHOPs into formal sub-families (the only split it draws is generators vs processors), but the practical groupings worth knowing:

- **Generators** create channels from nothing: Constant, LFO, Noise, Pattern, Wave, Beat, Audio Oscillator
- **Filters** modify what flows through them: Math, Lag, Filter, Trail, Speed, Limit, Hold
- **Analyzers** reduce a stream to a number: Analyze, Pattern, Count, Cross
- **Sources / Inputs** pull data from outside: Audio Device In, MIDI In, OSC In, Keyboard In, Mouse In, DMX In, Touch In
- **Time-related** orchestrate playback: Timer, Speed, Hold, Cue, Sequencer
- **Outputs** send data outside: Audio Device Out, MIDI Out, OSC Out, DMX Out

## Time Slice

Most CHOPs work in **Time Slice mode**: instead of computing all samples on the timeline, they compute only the samples between the previous cook frame and the current one. The wiki: a Time Slice is "the time from the last cook frame to the current cook frame." If the framerate stutters from 60 fps down to 15 fps for one frame, the slice grows wider, so audio and animation stay continuous instead of dropping samples.

The Time Slice toggle lives on the Common page of every CHOP that supports it. It's auto-set on most generators and filters. Constant CHOP "is not time sliced: it is always one sample long." See [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|Performance Monitoring]] for what to do when CHOP cooks dominate a frame.

## Three Ways to Drive a Parameter

| Method             | How                                                                                                                                                          | When to use                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **CHOP Reference** | Python expression mode (blue), e.g. `op('math1')['speed']`                                                                                                   | One parameter, any kind of computation, easiest to read                  |
| **CHOP Export**    | Activate the CHOP's viewer, drag a channel onto a parameter, choose Export CHOP. Exported parameters show with a green underline and a gray dotted data link | Mass-exporting many channels by naming them `opname:parname`             |
| **Bind**           | Set parameter mode to Bind (purple), point at `op('slider').par.Value0`                                                                                      | Two-way connection: moving the parameter writes back to the bound source |

> [!note] Since 2017, "exporting and expression references perform equivalently": the wiki notes parameter expressions are compiled once into pseudocode, so the old "Export is faster" rule no longer applies. Pick by ergonomics, not by speed.

## Practical Example: Global Speed

```
constant1 (chan: "speed" = 1.0)
   ↓
[referenced by op('constant1')['speed'] in five different LFO CHOPs]
```

One value, one place to edit, propagates everywhere. Wrap a Null CHOP at the end if you want a stable reference target so swapping the source for an LFO later doesn't break links.

## Common Gotchas

- **Channel ordering matters on Merge.** Merge CHOP concatenates by input order; if your downstream code assumes `tx` is channel 0 and you reordered the inputs, indexes silently shift.
- **Type promotion is silent.** Everything in a channel is float. Comparing a Constant CHOP integer against an integer parameter through Python may need an explicit `int(...)`.
- **Renaming breaks exports.** Channel reordering doesn't break Export connections, but renaming a channel does: the export points at the name.
- **Constant CHOPs aren't time-sliced.** They hold exactly one sample, so anything that expects a time-varying signal (e.g. an audio Filter) has to deal with that.

## Related Nodes

- [[Constant CHOP]]: fixed values
- [[LFO CHOP]]: oscillating signals
- [[Math CHOP]]: combine and remap
- [[Noise - CHOP and TOP|(y-) Noise CHOP]]: organic randomness
- [[Select CHOP]]: pick or rename channels from a remote CHOP
- [[Timer CHOP]]: state machine for triggers and segments
- [[touchdesigner/01_Core_Concepts/Parameters|Parameters]]: full reference for the four parameter modes
- [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|Performance Monitoring]]: for diagnosing CHOP cook spikes

---

[[Constant CHOP|(y-) Next Page: Constant CHOP]]

---

> [!tip]- 📚 Learning Path · Stage 3 - The Operator Families · step 15 of 44
> [[touchdesigner/02_The_Operators/TOPs/TOP - Texture Operators|(y-) ← Prev: TOPs]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/02_The_Operators/SOPs/SOP - Surface Operators|(y-) Next: SOPs →]]

---

[[touchdesigner/02_The_Operators/CHOPs/index|(y) Return to CHOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
