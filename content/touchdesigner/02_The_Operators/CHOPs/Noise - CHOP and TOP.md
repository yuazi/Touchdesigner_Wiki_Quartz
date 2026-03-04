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
[[touchdesigner/02_The_Operators/CHOPs/index|CHOPs]]

# Noise Operators

Noise is the foundation of organic movement, procedural textures, and generative behavior in TouchDesigner. You will use the **Noise CHOP** and **Noise TOP** in almost every project.

## Noise Types (Algorithm)
Both TOP and CHOP versions offer different algorithms (Simplex, Perlin, Random, etc.). 
* **Simplex:** The default and generally the best looking/most performant for smooth continuous curves.
* **Random:** Outputs pure white noise (completely disconnected random values per sample/pixel).

## Key Parameters
- **Seed:** Changing this gives you a completely different output while keeping the same "flavor" or character of noise.
- **Period:** The "scale" of the noise. 
  - *Large Period:* Smooth, slow rolling hills.
  - *Small Period:* Fast, jittery, tight oscillations.
- **Harmonics:** Adds smaller, higher-frequency detail on top of the base noise. Higher harmonics = rougher/crunchier noise.
- **Amplitude:** Scales the output values.
- **Offset:** Shifts the output center up or down.

## Animating Noise
To make the noise evolve over time:
1. Go to the **Transform** page.
2. In the `Translate z` parameter (usually `tz`), type the expression: `absTime.seconds * 0.1`
3. The multiplier (`0.1`) controls the speed of the animation.

## Common Uses
- **Noise CHOP:** Driving the rotation of geometry, instancing coordinates, simulating wind/wobble on parameters.
- **Noise TOP:** Building procedural clouds, water textures, or displacement maps. Using it over a generic geometry gives it an organic, undulating feel.
---
[[touchdesigner/02_The_Operators/CHOPs/index|Back to CHOPs]] | [[touchdesigner/02_The_Operators/index|Back to The Operators]] | [[touchdesigner/index|Back to Main Page]]
