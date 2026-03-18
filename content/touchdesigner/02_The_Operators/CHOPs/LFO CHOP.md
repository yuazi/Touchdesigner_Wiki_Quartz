---
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
date: 2026-02-11
---

# LFO CHOP

The **LFO (Low Frequency Oscillator) CHOP** generates a continuously cycling waveform signal. It is one of the most fundamental CHOPs — used for anything that should repeat or pulse over time: camera movement, colour cycling, scale breathing, parameter animation.

## Key Parameters

| Parameter        | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| **Type**         | Waveform shape: Sine, Triangle, Ramp, Square, Pulse               |
| **Frequency**    | Cycles per second (Hz). `1` = one full cycle per second           |
| **Amplitude**    | Peak value of the wave                                            |
| **Offset**       | DC offset — shifts the entire waveform up or down                 |
| **Phase**        | Starting position in the cycle (0–1). `0.25` = starts at the peak |
| **Channels**     | How many output channels (each can have its own frequency/phase)  |
| **Channel Name** | Name(s) of the output channel(s), e.g. `chan1`                    |

## Output Range by Type

| Waveform | Min → Max (default) |
| -------- | ------------------- |
| Sine     | -1 → 1              |
| Triangle | -1 → 1              |
| Ramp     | 0 → 1               |
| Square   | -1 → 1              |
| Pulse    | 0 → 1               |

## Common Usage Patterns

### Basic oscillation

Drop in an **LFO CHOP**, set Frequency to `0.5` (one cycle every 2 seconds), then pipe it into a **Math CHOP** to remap the -1→1 range to whatever range your target parameter needs.

### Multiple channels with staggered phases

Set Channels to `3` and Channel Name to `chan[1-3]`. Then in the **Phase** parameter, click the `+` button to create per-channel values and enter `0 0.33 0.66` to stagger them 120° apart. Useful for RGB colour orbiting or animating 3 separate objects.

### Driving parameter via CHOP Reference

1. Viewer-Active the LFO CHOP.
2. Drag the channel name onto the target parameter.
3. Choose **CHOP Reference**.

This inserts `op('lfo1')['chan1']` as a Python expression in the parameter.

### Syncing to project FPS

The LFO is time-based, not frame-based, so it automatically stays in sync regardless of cook rate.

## Practical Example: Breathing Light

```
LFO CHOP (Sine, Freq=0.25, Amp=0.5, Offset=0.5)
  → Null CHOP (OUT_BREATH)
  → [CHOP reference onto a Light COMP's Intensity parameter]
```

This creates a light that fades between 0 and 1 with a gentle sine curve, completing one full cycle every 4 seconds.

## Common Gotchas

- **The square wave clicks** — place a `Lag CHOP` after it to smooth the edges.
- **Phase 0 starts at zero crossing** (for Sine), not the peak. Use `0.25` to start at the peak.
- **Frequency 0** freezes the output at the current phase position — useful as a trick to hold a value.
- If you need a **one-shot** (non-looping) animation, use a **Timer CHOP** or **Animation CHOP** instead.

## Related Nodes

- [[Math CHOP]] — remap and combine LFO output
- [[Noise - CHOP and TOP|(y-) Noise CHOP]] — like an LFO but organic/random
- [[Timer CHOP]] — for one-shot and sequenced events

---

[[Math CHOP|(y-) Next Page: Math CHOP]]

[[touchdesigner/02_The_Operators/CHOPs/index|(y) Return to CHOPs]]
[[touchdesigner/02_The_Operators/index|(y) Return to The Operators]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
