---
title: "Performance Monitoring"
tags:
  - touchdesigner
  - td/architecture
  - optimization
date: 2026-02-21
---

A real-time project lives or dies by its frame rate. Most installations target 60 fps, which gives you a 16.6 ms budget per frame for _everything_: cooking, rendering, panel UI, Python, and waiting on the GPU. TouchDesigner ships with three tools to figure out where you're spending that budget and what's blowing it.

## The Frame Budget

| Target FPS | Budget per frame |
| ---------- | ---------------- |
| 30         | 33.3 ms          |
| 60         | 16.6 ms          |
| 90 (VR)    | 11.1 ms          |
| 120        | 8.3 ms           |

The Cook number in the bottom-right of the TouchDesigner window shows your current frame time. If it stays under budget consistently, you're fine. If it spikes, you have work to do.

## The Performance Monitor

The primary diagnostic tool. Open with **Dialogs → Performance Monitor** or `Alt+Y`.

What it logs:

- Cook time and cook counter per operator
- Order of cook (which op cooked when)
- Viewport draw times
- Panel and UI compute times
- Per-frame total

Click **Analyze** to take a snapshot of a few frames. Analyze pauses normal output to avoid the monitor itself perturbing measurements. The bar graph it produces shows relative time per op, with grey sections marking time spent waiting on upstream nodes.

The **Filter** field scopes the output:

| Filter             | Result                             |
| ------------------ | ---------------------------------- |
| `*CHOP*`           | Only CHOPs                         |
| `*render*`         | Only ops with "render" in the name |
| `/project1/geo1/*` | Only ops inside that COMP          |

> [!warning] **TOP cook times lie.** Most TOP work runs on the GPU asynchronously, so the cook time the monitor shows isn't the GPU's actual processing time. For real GPU profiling, use the probe or external tools like RenderDoc.

## Middle-Mouse Info

Middle-click any node for a quick popup with its name, cook time, cook count, and frequency. Fastest way to spot-check whether a single op is hot.

## The Probe Tool

`probe` is a Palette component (under `Tools`, drag from the Palette browser into `/`) that gives you a live, visual heat map of the whole project.

| Visual         | Means                                  |
| -------------- | -------------------------------------- |
| Circles        | CPU times per op                       |
| Diamonds       | GPU times per op                       |
| Stacked rings  | History across the last 10 time slices |
| Color and size | Cook duration in milliseconds          |

Toggle Probe on with `Ctrl+P` (`Cmd+P` on macOS). Left-click a component to descend into it, click background to go up, scroll to zoom. Middle-click opens the param dialog for the hovered op, right-click opens the network editor at it. Probe also has modes for CPU memory, GPU memory, and child counts via the left selector.

Probe is the right tool when you don't yet know _where_ the slowdown is. Performance Monitor is the right tool when you already have a suspect and want exact numbers.

## Common Bottlenecks

| Symptom                                  | Likely cause                                             |
| ---------------------------------------- | -------------------------------------------------------- |
| Frame rate tanks when a panel is visible | Active viewers or a Panel COMP cooking unnecessarily     |
| Render TOP cook spikes                   | Resolution too high, too many lights, shadows enabled    |
| CHOP chain steady but slow               | Missing Time Slice on operators that support it          |
| GPU pegged at 100%                       | Overdraw, too many vertices, expensive shader            |
| Cook time creeps up over time            | Feedback loop accumulating, or a runaway storage append  |
| Whole UI lags                            | Heavy Python in an `Execute DAT` `onFrameStart` callback |

## Optimization Checklist

Apply in this order, cheapest fixes first:

1. **Turn off viewers** you're not actively watching. `a` to toggle on a node, `Alt+a` to toggle all.
2. **Cooking Flag off** on COMPs that don't need to update (idle UI panels, dormant systems). The Cooking Flag is the lower-right purple flag on COMPs. See [[touchdesigner/04_Scripting_and_Architecture/Cooking|Cooking]].
3. **Time Slice on** for CHOPs that support it (Lag, Filter, Trail, Speed). Time Slice tells the CHOP to compute only the samples needed for the current frame instead of the whole buffer.
4. **Downscale TOPs** before expensive operations. Halving width and height cuts GPU work to a quarter.
5. **Render only what you display.** Hide off-screen content; turn off `Color Output Needed` on shadow-only Render TOPs; use `Draw Depth Only` for depth passes.
6. **Transform at the object level**, not via Transform SOPs. The graphics card does object-level transforms for free.
7. **Move static ops upstream** so they don't recook every frame.
8. **Profile Python** with `time.perf_counter()` around suspicious blocks.

## What's Next

- [[touchdesigner/04_Scripting_and_Architecture/Cooking|Cooking]]: the underlying mechanic that determines what costs cook time
- [[touchdesigner/01_Core_Concepts/Viewer Active Mode|Viewer Active Mode]]: viewer-related cost, the most common source of accidental cooking

---

[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
