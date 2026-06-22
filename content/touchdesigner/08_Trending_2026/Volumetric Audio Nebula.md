---
title: "Volumetric Audio Nebula"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - pops
  - audioreactive
  - particles
date: 2026-06-18
---

A slow, glowing cloud of thousands of points, drifting in 3D space and breathing with the music: bass pushes the cloud outward, highs make it sparkle. It is the perfect ambient loop for a date night, a quiet gallery room, or a screen behind a couch. Built on the GPU **POP** family so it stays smooth at high point counts.

> [!info] Before You Start
>
> - Helpful background: [[touchdesigner/02_The_Operators/POPs/index|POPs]] and [[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity|Audio Reactivity]].
> - Any audio source works: a track on disk, system audio, or a microphone.

---

## 1. Build the Point Cloud

1.  Add a **Noise POP** or a **Grid/Sphere POP** to scatter a few thousand points into a rough sphere.
2.  Add a second **Noise POP** to offset positions with smooth 3D turbulence so the cloud looks gaseous rather than geometric.
3.  Animate the noise offset slowly over time so the nebula always drifts.

> [!tip] Start modest
> Begin with around 50k points. POPs scale to millions, but get the look right first, then crank the count for the final piece.

---

## 2. Get the Audio Bands

1.  Add an **Audio File In CHOP** (or **Audio Device In**) for your track.
2.  Add an **Audio Spectrum CHOP** to split it into frequency bins.
3.  Make three averages with **Math/Analyze CHOP**s: `BASS`, `MID`, `HIGH`. Smooth each with a **Lag CHOP** (bass slow, highs fast).

---

## 3. Make It React

1.  **Breathing:** Bind `BASS` to the radius of the cloud (multiply each point's position outward). Bass hits push the nebula outward, then it eases back.
2.  **Sparkle:** Bind `HIGH` to point brightness or size so cymbals and hi-hats glitter across the cloud.
3.  **Swirl:** Bind `MID` to the rotation speed or the turbulence amplitude for gentle internal motion.

---

## 4. The Glow

1.  Render the points with **additive blending** so overlapping points build up light.
2.  Colour points by their distance from the centre (a [[touchdesigner/02_The_Operators/POPs/index|POP]] position-to-colour map) for an iridescent core-to-edge gradient.
3.  Add a strong **Bloom TOP** and a faint **lens distortion**. Slow camera orbit. Done.

---

## Troubleshooting

- **"It reacts too violently / strobes."** - Increase the Lag on the audio channels, especially bass. You want a swell, not a flicker.
- **"The points look flat and digital."** - Add more turbulence, vary point size slightly per point, and lean on additive bloom.
- **"Frame rate drops at high counts."** - Keep everything in POPs (GPU); avoid converting to SOPs. Reduce bloom resolution before reducing point count.

---

## Next Steps

- **FFT colour:** Map different frequency bands to different hues so the cloud changes colour with the song's texture.
- **Beat bursts:** Detect onsets to fire occasional shockwaves through the cloud.
- **Inside a splat:** Place the nebula inside a [[touchdesigner/08_Trending_2026/Gaussian Splatting Scenes|Gaussian splat]] scene for a magical hybrid space.

---

## Parameter Tuning & Behavior

| Parameter          | Behavior                                                 |
| :----------------- | :------------------------------------------------------- |
| **Bass → radius**  | Higher = dramatic inhale/exhale; Lower = subtle pulse.   |
| **Bass lag**       | Slower = smooth swelling; Faster = punchy, percussive.   |
| **High → sparkle** | Higher = glittery and busy; Lower = calm and ambient.    |
| **Point count**    | Higher = dense, luminous nebula; Lower = sparse, starry. |

## Network Architecture

```text
[ AUDIO ]                      [ Audio File In CHOP ]
                                      │
                                      ▼
                               [ Audio Spectrum CHOP ]
                                      │
                          ┌───────────┼───────────┐
                          ▼           ▼           ▼
                       [ BASS ]    [ MID ]    [ HIGH ]   (each + Lag)
                          │           │           │
[ GEOMETRY ]   [ Sphere/Noise POP ] ──┼───────────┤
                          │           │           │
                          ▼           ▼           ▼
                  radius×BASS   swirl×MID   size/bright×HIGH
                          │
                          ▼
[ COLOUR ]            [ position-to-colour POP ]
                          │
                          ▼
[ RENDER ]            [ Render TOP (additive) ] ◀── [ Camera (slow orbit) ]
                          │
                          ▼
[ OUT ]               [ Bloom ] ──▶ [ Lens distortion ] ──▶ [ OUT ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
