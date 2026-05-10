---
tags:
  - touchdesigner
  - td/operators
  - chop
  - math
  - operators
date: 2026-02-11
---

# Math CHOP

The **Math CHOP** is the workhorse for combining and remapping numerical data. It handles per-channel functions, channel-to-channel arithmetic, multi-input arithmetic, and linear range remapping in a single op. If you find yourself reaching for a Constant + a multiply + a clamp, a single Math CHOP almost always does it more cleanly.

## The OP Page

The OP page is where most of the work happens. It runs in a fixed order: pre-op (per-channel) → combine channels → combine CHOPs → post-op.

| Parameter            | Options                                                                 | What it does                                         |
| -------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| **Channel Pre OP**   | Off, Negate, Positive, Root, Square, Inverse                            | Per-channel function applied first                   |
| **Combine Channels** | Off, Add, Subtract, Multiply, Divide, Average, Minimum, Maximum, Length | Combine the channels within one CHOP into one        |
| **Combine CHOPs**    | Off, Add, Subtract, Multiply, Divide, Average, Minimum, Maximum, Length | Combine across multiple input CHOPs                  |
| **Channel Post OP**  | Off, Negate, Positive, Root, Square, Inverse                            | Per-channel function applied last                    |
| **Match by**         | Channel Number, Channel Name                                            | How channels from multiple inputs are paired         |
| **Align**            | Automatic, Extend to Min/Max, Stretch, Shift, Trim (multiple variants)  | How to handle inputs with differing start/end times  |
| **Integer**          | Off, Ceiling, Floor, Round                                              | Cast result to integer with the chosen rounding rule |

## Mult-Add Page

A linear scaling step that runs after the OP page work. Equivalent to `out = (x + preoff) * gain + postoff`.

| Parameter    | What it does                                            |
| ------------ | ------------------------------------------------------- |
| **Pre-Add**  | Add this value to each sample before multiplying        |
| **Multiply** | Scale the sample (the most-used parameter on this page) |
| **Post-Add** | Add this value after multiplying                        |

## Range Page

Linear remap from one range to another. Useful any time the natural range of a signal doesn't match what the consumer wants.

| Parameter      | What it does                                                              |
| -------------- | ------------------------------------------------------------------------- |
| **From Range** | The expected low/high of the incoming data (e.g. `-1` to `1` from an LFO) |
| **To Range**   | The desired low/high of the output (e.g. `0` to `360` for a rotation)     |

## Practical Example: LFO into Geo Rotation

```
lfo1 (Sine, default range -1..1)
   ↓
math1 (Range: From -1 to 1, To 0 to 360)
   ↓
[exported into geo1.par.Rry]
```

The LFO's natural ±1 swings become a 0-to-360 degree spin without any expression math.

## Common Patterns

- **Normalize MIDI velocity.** From Range 0..127, To Range 0..1.
- **Remap normalized to color.** From Range 0..1, To Range 0..255 for an 8-bit color channel.
- **Sum a vector.** Combine Channels = Length on a 3-channel CHOP gives the magnitude (sqrt of sum of squares).
- **Average channels.** Combine Channels = Average on a multi-channel CHOP gives a one-channel mean.
- **Difference between two CHOPs.** Combine CHOPs = Subtract on two single-channel inputs gives `a - b`.

## Common Gotchas

- **From Range vs To Range direction.** Mapping From `0..1` To `100..0` is a valid inversion; the result decreases as input increases. The Range page does not clamp by default; values outside From Range extrapolate linearly.
- **Combine CHOPs with mismatched channel counts.** If one input has `tx ty tz` and another has just `tx`, "Match by Channel Number" pairs the first three positionally; "Match by Channel Name" only acts on `tx` and leaves `ty tz` from the larger input alone.
- **Combine Channels collapses to one channel.** Once Combine Channels is set, the output of that step is a single channel. Channel naming preserves the first input's name.
- **Pre OP and Post OP both run.** They aren't either/or; you can square (Pre OP) and then negate (Post OP) for `-x²`.

## Related Nodes

- [[Constant CHOP]]: typed-in values to feed into the math
- [[LFO CHOP]]: the most common time-varying input
- [[Noise - CHOP and TOP]]: organic randomness as input
- [[Select CHOP]]: pick the channels you want to math against

---

[[Noise - CHOP and TOP|(y-) Next Page: Noise - CHOP and TOP]]

---

[[touchdesigner/02_The_Operators/CHOPs/index|(y) Return to CHOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
