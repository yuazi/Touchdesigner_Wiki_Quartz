---
title: "Viral: Audio-Reactive Hand-Tracking Reel"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - td/viral
  - mediapipe
  - audioreactive
  - handtracking
date: 2026-06-18
---

The exact combo blowing up on Instagram in 2026: visuals that pulse with the music **and** bend to your hands at the same time. The music gives it energy; the hand control makes it feel magic and personal. This tutorial wires both signals into one reactive scene built for a vertical reel.

> [!info] Watch the trend
>
> - [Audio reactive + hand tracking #touchdesigner (Instagram reel)](https://www.instagram.com/reel/DUjQgrBCurX/)
>
> Technique base: [[touchdesigner/08_Trending_2026/Volumetric Audio Nebula|Volumetric Audio Nebula]] (audio) and [[touchdesigner/08_Trending_2026/Holistic Magic Mirror|Holistic Magic Mirror]] (hands).
> You need the **MediaPipe plugin**: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).

---

## 1. Two Control Signals

You are blending two data sources. Keep them on separate, clearly named CHOPs.

1.  **Audio:** Add an **Audio Device In** (or **Audio File In**) plus an **Audio Spectrum CHOP**. Split into `BASS`, `MID`, `HIGH` and smooth with **Lag**.
2.  **Hands:** Enable the MediaPipe **Hand** model. Grab fingertip and palm positions, plus a **pinch** distance. Smooth these too.

---

## 2. Assign the Roles

The trick to not looking chaotic is giving each signal a clear, separate job.

- **Music drives the energy:** `BASS` scales the whole scene or pushes a particle cloud outward; `HIGH` adds sparkle.
- **Hands drive the shape:** Palm position moves the centre of the effect; pinch distance controls density or zoom; finger spread opens or closes the form.

Build the base visual as an audio-reactive [[touchdesigner/02_The_Operators/POPs/index|POP]] cloud, then let the hand data steer where and how it forms.

---

## 3. The Glue Move

1.  Use the hand palm position as the **emitter point**, so particles spawn from your hand.
2.  Bind `BASS` to emission rate so they burst on the beat from wherever your hand is.
3.  Pinch to gather them into a tight ball; open your hand to release them into a cloud.

This single interaction (hand position plus beat plus pinch) is what reads as "magic" on camera.

---

## 4. Reel-Ready Output

1.  Mirror the webcam, output **1080x1920**, hands and effect centred.
2.  Add **bloom** and a subtle camera drift.
3.  Pick a track with a clear beat, record 15 seconds of expressive hand movement, post.

> [!tip] Perform to the song
> Rehearse once. Punch your hand open exactly on the drop. The sync between your gesture and the music beat is what makes people rewatch.

---

## Troubleshooting

- **"Everything reacts to everything, it's a mess."** - Cut it back: let music do energy only, hands do position only. Separation reads cleaner than coupling everything.
- **"Audio reaction strobes."** - More Lag on `BASS`; you want a swell, not a flicker.
- **"Hand control feels laggy."** - Lower the Lag on position channels (keep smoothing on the audio side).

---

## Parameter Tuning & Behavior

| Parameter           | Behavior                                                  |
| :------------------ | :-------------------------------------------------------- |
| **Bass → energy**   | Higher = explosive on the beat; Lower = subtle pulse.     |
| **Palm → position** | Direct = effect glued to hand; Lagged = trailing, dreamy. |
| **Pinch → density** | Strong = tight gather/release; Weak = barely changes.     |
| **High → sparkle**  | Higher = glittery and busy; Lower = calm.                 |

## Network Architecture

```text
[ AUDIO ]     [ Audio Spectrum CHOP ] ──▶ BASS / MID / HIGH (+Lag)
                                              │
[ HANDS ]     [ MediaPipe Hand ] ──▶ palm XY + pinch (+Lag)
                                              │
                         ┌────────────────────┘
                         ▼
[ EMITTER ]   particle spawn at palm,  rate = BASS,  density = pinch
                         │
                         ▼
[ CLOUD ]     [ POP cloud ]  size/bright += HIGH
                         │
                         ▼
[ OUT ]       [ Render (additive) ] ──▶ [ Bloom ] ──▶ [ OUT 1080x1920 ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
