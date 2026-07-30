---
tags:
  - touchdesigner
  - td/rendering
  - rendering
  - feedback
  - advanced
date: 2026-02-16
---

# Feedback Loops

A **Feedback TOP** outputs the previous frame of another TOP. Combine that with a blend or composite, and you can build motion trails, painterly streaks, fluid-like reaction-diffusion patterns, and complex generative imagery. The wiki's terse summary: it "can be used to create feedback effects in TOPs. It can give fake motion blur by not clearing the color buffer."

The pattern is simple but counterintuitive at first because it looks like an infinite loop on paper. The cook system handles it: a Feedback TOP reads its Target TOP from the previous frame, not the current frame, so there's no recursion.

## Key Parameters

| Parameter           | Description                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| **Target TOP**      | "Specifies a TOP for feedback to use as its source when activated."                                   |
| **Bypass Feedback** | 0 = feedback active (output from Target TOP), 1 = bypass (input passes through directly)              |
| **Reset**           | "Activates feedback when set to 0. Disables feedback when set to 1." (a steady-state reset toggle)    |
| **Reset Pulse**     | "Resets the feedback in a single frame when clicked." Use this to clear the canvas mid-run.           |
| **Pixel Format**    | 8-bit fixed through 32-bit float. Critical: 8-bit clamps each frame's accumulated values to `[0, 1]`. |
| **Resolution**      | Custom or matched to input. Mismatch with the Target TOP's resolution gives black output.             |

## How the Loop Works

```
source_top  ──┐
              ↓
              composite (blend source over previous frame)
              ↓                      ↑
              null (the Target TOP) ─┘
              ↑
              feedback1 (Target TOP = null)
```

The Feedback TOP and the Target TOP form a cycle on paper. In practice:

1. Frame 1: Feedback TOP outputs black (no previous frame yet). Composite outputs `source_top`. Null holds that result.
2. Frame 2: Feedback TOP outputs Frame 1's Null (the result of Composite). Composite blends new `source_top` over it.
3. Frame N: Each frame stamps `source_top` on top of the accumulated history.

The Feedback TOP delivers the **previous frame's** Target TOP. That's what makes the cycle finite.

## Decay

Without decay, every blend stamps a value that stays forever, and most patterns drift toward white. Add a **Level TOP** inside the loop with Opacity around 0.95 to fade the previous frame slightly each tick:

```
source_top → composite (Add) → level (Opacity 0.95) → null (Target TOP)
                  ↑
              feedback1
```

For clean fades, use the Black Level parameter on Level TOP to nudge dark pixels toward zero each frame.

## Motion

Add a Transform TOP inside the loop for drifting trails: every frame, the previous accumulation shifts before the new source stamps on top.

```
source → composite → transform (translate +0.001, +0.000) → null
                              ↑
                          feedback
```

Swap Transform for Noise TOP (as a displacement map fed into a Displace TOP) for warpy organic motion.

## Recipes

- **Motion blur trail.** Source = a moving Circle TOP. Blend = Add or Over. Decay via Level TOP Opacity 0.92. Result: bright moving head with a soft fading tail.
- **Painterly streak.** Source = brush strokes from a Render TOP. Transform inside the loop with a slow drift. Decay 0.97.
- **Reaction-diffusion approximation.** Source = a black canvas. Inside the loop: Blur TOP (small radius) → Level TOP with high contrast. The recursion finds patterns.
- **Trails on rendered geometry.** Source = a Render TOP of moving objects. Feedback chain after, decay 0.95. Cheaper than per-pixel motion blur.

## Common Gotchas

- **Pixel format clamping.** A Feedback loop at 8-bit fixed clamps every accumulated value to `[0, 1]`; bright Add blends look posterized or vanish into pure white. Switch the loop's Pixel Format to 16- or 32-bit float for any HDR work.
- **Resolution mismatch produces black.** The Feedback TOP and its Target TOP must agree on resolution. If the Target's resolution changes (e.g. a Render TOP whose camera changed), expect a black frame on the resync.
- **Reset Pulse, not Pulse Bypass.** To clear the canvas, pulse **Reset Pulse**. Pulsing Bypass Feedback briefly disables the loop output but doesn't clear accumulated state.
- **Runaway brightness.** No decay = unbounded accumulation. Even at 32-bit float, eventually you hit numerical limits and the picture turns NaN-grey. Always include a Level TOP or similar in the loop.
- **The Target TOP is the loop output.** People sometimes set Target TOP to the Feedback TOP itself, which sounds right but isn't. Target TOP is the _result_ of the blend that you want fed back next frame.

## Related Pages

- [[touchdesigner/03_Rendering_and_Output/Rendering Basics|Rendering Basics]]: the rest of the render pipeline
- [[TOP - Texture Operators]]: TOP family overview, including Pixel Format
- [[touchdesigner/04_Scripting_and_Architecture/Cooking|Cooking]]: how the pull system makes feedback finite

---

> [!tip]- 📚 Learning Path · Stage 4 - Rendering & 3D · step 24 of 44
> [[touchdesigner/03_Rendering_and_Output/Instancing|(y-) ← Prev: Instancing]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-2/Real-time Audio Visualizer|(y-) Next: Real-time Audio Visualizer →]]

---

[[touchdesigner/03_Rendering_and_Output/index|(y) Return to Rendering & Output]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
