---
title: "Fluid Brush with Hand Tracking"
tags:
  - touchdesigner
  - td/recipes
  - mediapipe
  - fluid
  - feedback
  - handtracking
  - webcam
  - recipes
date: 2026-05-26
---

Your hand becomes a brush that paints glowing fluid streaks in real time. Move your wrist and ink trails behind your fingers, diffuses outward, and slowly fades - the effect used in interactive wall installations where visitors draw into a liquid screen.

No GLSL needed: diffusion is a Blur, advection is a Displace, and evaporation is a Level.

> [!info] Operator Families in this Recipe
>
> - **COMPs:** MediaPipe plugin for hand landmark extraction.
> - **CHOPs:** Converting landmark positions into coordinates.
> - **TOPs:** Fluid simulation as a texture feedback loop.

---

## Before You Start

You need the free MediaPipe TouchDesigner plugin (`mediapipe.tox`) from [github.com/torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner).

---

## Part 1: Hand Tracking Setup

1. Add a **Video Device In TOP** (your webcam). Connect to a **Null TOP** named `CAM`.
2. Drag `mediapipe.tox` into the network.
3. Connect `CAM` to the first input of `mediapipe1`.
4. Set **Model** → `Hand` and enable tracking.

Click on the **Hands** table DAT output. Each row is one detected hand; columns are `x0, y0, z0` through `x20, y20, z20`. Landmark 0 is the wrist.

---

## Part 2: Extract Hand Position as CHOP

1. Add a **DAT to CHOP** connected to the **Hands DAT** output of `mediapipe1`.
   - **Select Rows** → `by Index`, **From** `0`, **To** `0`.
   - **Output** → `Channel per Column`.
2. Add a **Select CHOP** → **Channel Names** `x0 y0`.
3. Add a **Rename CHOP** → From `x0 y0`, To `hx hy`.
4. Connect to a **Null CHOP** named `HAND_POS`.

> [!tip] Verify the Position
> Activate `HAND_POS`'s viewer flag. `hx` and `hy` should update between 0 and 1 as you move your wrist. MediaPipe's origin is top-left (hx=0 = left edge, hy=0 = top).

---

## Part 3: Create the Ink Brush

1. Add a **Circle TOP** at `512 x 512`.
   - **Radius** → `0.04`, **Fill Color** → `1, 1, 1`, **Background Color** → `0, 0, 0`.
   - Right-click **Center X** → Expression → `op('HAND_POS')['hx'] - 0.5`.
   - Right-click **Center Y** → Expression → `-(op('HAND_POS')['hy'] - 0.5)`.
2. Connect to a **Null TOP** named `INK`.

Y is negated because MediaPipe measures from the top down; TD measures from the center up.

---

## Part 4: Build the Fluid Feedback Loop

1. Add a **Feedback TOP** - leave the Target blank for now.
2. **Add TOP**: Input 0 = Feedback output, Input 1 = `INK`.
3. **Displace TOP**:
   - Map input: a separate **Noise TOP** at `512 x 512` (Type: Sparse, Period: `2.0`, Amplitude: `0.4`, Translate X: `absTime.seconds * 0.08`).
   - **Displace Amount** → `0.003`.
4. **Blur TOP** → **Filter Size** `2`.
5. **Level TOP** → **Brightness 1** `0.97`.
6. Connect to a **Null TOP** named `SIM_OUT`.
7. Set the **Feedback TOP Target** → `SIM_OUT`.

---

## Part 5: Colorize and Output

1. **HSV Adjust TOP** on `SIM_OUT` → **Saturation Multiplier** `1.5`, **Hue Offset** `absTime.seconds * 15`.
2. **Bloom TOP** (Threshold: `0.3`, Intensity: `0.8`).
3. Optionally add an **Over TOP** to layer the fluid over the webcam:
   - Input 0: fluid output (with a **Level TOP** at Brightness 1 `0.6`).
   - Input 1: `CAM`.
4. Connect to a **Null TOP** named `OUT`.

---

## Troubleshooting

- **"Nothing appears when I move my hand."** - Click on the Hands DAT output and confirm values change when your hand is in frame. If the table is empty, MediaPipe isn't detecting a hand.
- **"Circle appears in the wrong spot."** - Confirm Center X uses `- 0.5` and Center Y is negated.
- **"Simulation fills up white and won't clear."** - Lower Level TOP Brightness 1 to `0.94`. Also confirm Displace Amount is non-zero.
- **"Ink leaves a permanent ghost."** - Right-click the Feedback TOP → **Reset**.
- **"Tracking is jittery."** - Add a **Lag CHOP** (Lag: `0.05`) before `HAND_POS`.

---

## Next Steps

- **All five fingertips:** Extract landmarks 4, 8, 12, 16, 20 and merge their Circle TOPs into the Add TOP. Each finger brushes independently.
- **Velocity-sized strokes:** Use `Trail CHOP` + `Math CHOP` to compute hand speed. Bind that to the Circle Radius so faster movement makes thicker marks.
- **Person + fluid:** Combine with the Body Segmentation recipe to keep the fluid inside the person's silhouette only.

---

## Parameter Tuning & Behavior

| Parameter                       | Behavior                                                      |
| :------------------------------ | :------------------------------------------------------------ |
| **Circle Radius**               | Larger = thick strokes; Smaller = hair-line trails.           |
| **Level Brightness (decay)**    | Closer to 1.0 = longer persistence; lower (0.90) = fast fade. |
| **Blur Filter Size**            | Higher = smoky diffusion; Lower = tight crisp trails.         |
| **Noise Amplitude (advection)** | Higher = turbulent chaotic flow; Lower = slow laminar drift.  |
| **Displace Amount**             | Higher = faster advection; too high causes tearing.           |

## Network Architecture

```text
[ HAND TRACKING ]
CAM ──▶ mediapipe1 ──▶ Hands DAT
                             │
                    DAT to CHOP → Select → Rename
                             │
                       HAND_POS (hx, hy)
                             │
                        Circle TOP (INK)
                             │
                             ▼
[ FLUID LOOP ]          Add TOP ◀── Feedback TOP (target: SIM_OUT)
                             │
                        Displace TOP
                             │
                         Blur TOP
                             │
                         Level TOP (0.97)
                             │
                         SIM_OUT
                             │
                    HSV Adjust ──▶ Bloom ──▶ (Over CAM) ──▶ OUT

[ ADVECTION FIELD ]
Noise TOP (Sparse, slow) ──▶ Displace TOP (map input)
```

---

Sources:

- [Liquid Simulation with MediaPipe Hand Tracking - AllTouchDesigner](https://alltd.org/touchdesigner-liquid-simulation-with-mediapipe-hand-tracking/)
- [MediaPipe TouchDesigner Plugin - GitHub](https://github.com/torinmb/mediapipe-touchdesigner)

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
