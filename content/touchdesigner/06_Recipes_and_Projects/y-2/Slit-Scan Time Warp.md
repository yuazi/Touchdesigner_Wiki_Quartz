---
title: "Slit-Scan Time Warp"
tags:
  - touchdesigner
  - td/recipes
  - camera
  - timewarp
  - texture3d
  - timemachine
  - recipes
date: 2026-05-26
---

The slit-scan effect makes your webcam into a time-smear machine. Each horizontal position on screen samples the camera from a different moment in the past - so when you move, you leave an ethereal trail across the frame. Made famous by *2001: A Space Odyssey* and widely used in contemporary music video aesthetics.


> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Buffering, time-sampling, and assembling frames.

---

## How It Works

The `Texture 3D TOP` stores a rolling buffer of recent video frames as a 3D texture (width x height x time). The `Time Machine TOP` samples from this buffer using a grayscale "time map" - wherever the map is black, it shows the oldest frame; wherever it is white, it shows the most recent. By using a horizontal gradient as the time map, each column of the screen shows a different moment in time.

---

## Part 1: Camera Input

1. Add a **Video Device In TOP** and set **Device** to your webcam.
2. Add a **Blur TOP** (Filter Size: `1`) to reduce camera noise.
3. Connect to a **Null TOP** named `VID_IN`.

---

## Part 2: Build the Frame Buffer

1. Add a **Texture 3D TOP** and connect `VID_IN` to its input.
   - \*\*Cache Size\*\* → `60` (1 second at 60fps). Oldest frame is at depth 0, newest at 59.

---

## Part 3: Create the Time Map

The time map tells the `Time Machine TOP` which moment in time to show at each pixel position.

1. Add a **Ramp TOP** (separate from the camera chain).
   - **Type** → `Horizontal`.
   - **Color 0** → `0, 0, 0` (black = oldest frame on the left).
   - **Color 1** → `1, 1, 1` (white = current frame on the right).
   - Match its resolution to `VID_IN` (e.g., `1280 x 720`).

> [!tip] Flip the Time Direction
> To reverse the effect (current frame on the left, oldest on the right), set Color 0 to white and Color 1 to black. Moving your hand will leave a trail that "follows" rather than "leads."

---

## Part 4: The Time Machine

1. Add a **Time Machine TOP**.
   - Connect the **Texture 3D TOP** to **input 0**.
   - Connect the **Ramp TOP** to **input 1** (the time map).
2. The output is now a slit-scan: the left side of the image shows 60 frames ago, the right side shows the current frame. Moving objects smear across the temporal gradient.

---

## Part 5: Polish

1. Add an **HSV Adjust TOP** and animate **Hue Offset** → `absTime.seconds * 3` for a slow color drift.
2. Add a **Level TOP** and boost **Contrast** to `1.3` to make the time smear more dramatic.
3. Finish with a **Null TOP** named `OUT`.

---

## Part 6: Custom Time Maps (Variations)

The time map can be any grayscale texture - not just a linear ramp. Try these alternatives for different effects:

| Time Map | Effect |
| -------- | ------ |
| Horizontal Ramp (default) | Classic left/right temporal smear |
| **Noise TOP** (greyscale) | Organic, turbulent time distortion |
| **Circle TOP** (white center) | Objects trail outward from the center |
| **Video Device In TOP** (camera as map) | Your own movement controls the time warp |
| Vertical Ramp | Top/bottom temporal smear |

> [!tip] Camera-Driven Time Map
> Connect a second `Video Device In TOP` (or a processed version of the camera with high contrast) directly to the Time Machine input 1. Your own brightness and movement now control which frame each pixel samples - where you are bright, you see the current moment; where you are dark, you see the past.

---

## Troubleshooting

- **"Output is static / not changing."** - Check that the Texture 3D TOP has **Depth** set to more than 1, and that the Ramp TOP is connected to Time Machine input 1 (not input 0).
- **"Effect is too subtle."** - Increase the **Depth** on the Texture 3D TOP (try `120` or `240`) for a longer time trail.
- **"Image looks stretched or wrong resolution."** - Ensure all TOPs (Video Device In, Ramp, Texture 3D) are set to the same resolution.
- **"Black on one side, frozen image on the other."** - The Texture 3D TOP needs a few seconds to fill its buffer after loading. Wait a moment, then the oldest frame will be further back in time.

---

## Next Steps

- **Audio-reactive warp:** Use an **Analyze CHOP** to animate the Ramp TOP's gradient speed so the time trail stretches on loud beats.
- **Feedback combo:** Feed the Time Machine output into a Feedback loop with slight decay for recursive time echo trails.
- **Multiple zones:** Use a custom masked time map to apply the effect only to specific regions of the frame (face, hands, etc.).

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Texture 3D Depth** | Higher = longer time trail (more past visible); Lower = subtle, quick echo. |
| **Ramp Gradient Direction** | Horizontal = left/right smear; Vertical = top/bottom; Custom = sculptural distortion. |
| **Noise as Time Map (Amplitude)** | Higher noise = more chaotic, fractured time; Lower = gentle ripple. |
| **Hue Offset Speed** | Higher = rapid psychedelic color cycling; Lower = slow cinematic mood. |

## Network Architecture

```text
[ WEBCAM ]
Video Device In ──▶ Blur ──▶ VID_IN
                                │
                                ▼
                         Texture 3D TOP (Depth: 60)
                                │ (input 0)
                                ▼
[ TIME MAP ]           Time Machine TOP ──▶ HSV Adjust ──▶ Level ──▶ OUT
Ramp TOP ──────────────────────┘ (input 1)
(black = oldest, white = newest)
```

Sources:
- [Slit Scan using the Time Machine TOP - TouchDesigner Curriculum](https://learn.derivative.ca/courses/200-intermediate/lessons/202-tops-intermediate/topic/slit-scan-using-the-time-machine-top/)
- [Time Machine TOP - TouchDesigner Documentation](https://docs.derivative.ca/Time_Machine_TOP)
- [Texture 3D TOP - TouchDesigner Documentation](https://docs.derivative.ca/Texture_3D_TOP)

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
