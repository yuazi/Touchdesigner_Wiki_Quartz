---
tags:
  - touchdesigner
  - td/operators
  - chop
  - noise
  - operators
  - top
date: 2026-02-11
---

# Noise Operators (CHOP and TOP)

Noise is the foundation of organic movement, procedural textures, and any generative behavior that needs a coherent random feel. The **Noise CHOP** and **Noise TOP** share the same family of noise functions but operate on different sides of the GPU/CPU divide. Pick the one that matches what you'll do with the result: per-channel signal work goes through the CHOP; per-pixel image work goes through the TOP.

## Noise Types

The two ops do not have identical Type lists. Worth knowing both.

| Type                     | Noise CHOP | Noise TOP | Use for                                                      |
| ------------------------ | :--------: | :-------: | ------------------------------------------------------------ |
| **Sparse**               |     ✓      |     ✓     | "High quality, continuous noise based on Sparse Convolution" |
| **Hermite**              |     ✓      |     ✓     | "Quicker than Sparse, but produces lower quality noise"      |
| **Harmonic Summation**   |     ✓      |     ✓     | Sum of progressively higher-frequency harmonics              |
| **Brownian**             |     ✓      |     ✓     | Brownian motion noise (CHOP-listed type)                     |
| **Random**               |     ✓      |     ✓     | "(White Noise) Every sample is random and unrelated"         |
| **Alligator**            |     ✓      |     ✓     | "Cell Noise" (Voronoi-style)                                 |
| **Perlin 2D / 3D / 4D**  |            |   ✓ GPU   | Classic gradient noise on the GPU (TOP-only)                 |
| **Simplex 2D / 3D / 4D** |            |   ✓ GPU   | Simplex variant, faster than Perlin in higher dimensions     |
| **Random (GPU)**         |            |   ✓ GPU   | GPU-side white noise                                         |

GPU types are TOP-only and run on the graphics card. Everything else runs on the CPU in both ops.

## Shared Key Parameters

| Parameter           | What it does                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Type**            | Algorithm (see table above)                                                                                    |
| **Period**          | "The approximate separation between peaks of a noise cycle. It is expressed in Units." Bigger = wider features |
| **Harmonics**       | "The number of higher frequency components to layer on top of the base frequency." More = more detail          |
| **Harmonic Spread** | "The factor by which the frequency of the harmonics are increased. It is normally 2"                           |
| **Amplitude**       | "Defines the noise value's amplitude (a scale on the values output)"                                           |
| **Offset**          | DC offset added after amplitude                                                                                |
| **Seed**            | "Any number, integer or non-integer, which starts the random number generator"                                 |

## Animating Noise

Both ops sample noise along a position in noise space. Animate by walking that position over time on the **Transform** page.

The Noise CHOP wiki explains the technique: "translating, rotating and scaling the line along which the Noise CHOPs samples the noise space" is like "walking in a straight path in the mountains, recording your altitude along the way, then re-starting from the same initial location, walking in a slightly different direction."

```
Transform page → tz parameter → expression: absTime.seconds * 0.1
```

The multiplier sets the speed. `0.1` is slow rolling; `2.0` is jittery.

## Noise CHOP Specifics

- **Channel Names**: takes a pattern. `chan[1-3]` produces three channels `chan1`, `chan2`, `chan3`, each a separate noise stream.
- Per-sample evaluation: the CHOP evaluates noise at each sample position along the timeline, so a 1-second 60 fps CHOP gives 60 unique noise values.
- Output is unbounded; with default Amplitude the typical range is roughly `-0.5` to `0.5`. Pipe through a Math CHOP if you need a clean `0..1` or `-1..1`.

## Noise TOP Specifics

- **Resolution**: set on the Common page. Same as any TOP.
- **Monochrome toggle**: switches between single-channel grayscale output and 3-channel color noise.
- **Output Aspect**: maintain input aspect, use resolution-based aspect, or custom.
- **Pixel Format**: 8-bit fixed clamps the output to `[0, 1]`; switch to 16- or 32-bit float when you need negative values or HDR (e.g. for displacement maps or normal maps).

## Common Patterns

- **Drive Geo COMP rotation.** Noise CHOP with one channel, exported into `geo1.par.Rry`, gives organic wobble.
- **Procedural displacement map.** Noise TOP with Type Perlin 3D, fed as the Normal Map of a PBR MAT, creates a bumpy surface.
- **Animated alpha mask.** Noise TOP with Monochrome on, fed as an alpha mask in a Composite TOP.
- **Spawn jitter for instances.** Noise CHOP with three channels, exported as `tx ty tz` for an instanced Geo COMP.

## Common Gotchas

- **Period semantics are inverted from frequency.** Small Period = high frequency = jittery. Big Period = low frequency = slow rolls. Easy to get backward when reaching for a familiar "frequency" knob.
- **Seed jumps reset animation.** Changing Seed mid-animation causes a discontinuity. Pick the seed first, then animate.
- **Random has no spatial coherence.** Two adjacent samples can be wildly different. For smooth movement, never use Random; use Sparse or Perlin.
- **GPU and CPU types differ.** A patch you build with Noise TOP set to Perlin 2D won't render the same if you swap the Type to Sparse, even at the same Period. They're different algorithms.
- **Amplitude isn't a `[-1, 1]` slider.** It's a multiplier on whatever the underlying noise function returns; that range varies by Type.

## Related Nodes

- [[Constant CHOP]]: combine with Noise via Math CHOP to bias the output
- [[LFO CHOP]]: deterministic oscillation; the regular cousin of Noise
- [[Math CHOP]]: remap noise output to whatever range you actually need
- [[touchdesigner/03_Rendering_and_Output/Instancing|Instancing]]: feed Noise into per-instance position/color

---

[[Select CHOP|(y-) Next Page: Select CHOP]]

---

[[touchdesigner/02_The_Operators/CHOPs/index|(y) Return to CHOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
