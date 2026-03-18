---
title: "Hand Tracking in TouchDesigner — Tutorial"
tags:
  - touchdesigner
  - td/tutorials
  - td/tracking
  - td/interaction
  - td/mediapipe
  - td/generative
date: 2026-03-02
---

**Based on:** Torin Blankensmith's MediaPipe TouchDesigner series
**Plugin:** [github.com/torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner)

---

## Overview

This tutorial walks you through building a real-time hand-tracking system in TouchDesigner powered by Google's **MediaPipe** framework. By the end you will have:

1. A **core hand-tracking rig** — the MediaPipe plugin wired up to expose finger positions, gesture signals, and helper channels (pinch distance, midpoint, spread) as CHOPs you can plug into anything.
2. A **watercolor hand-tracking brush** — an interactive painting system where your hand paints soft, blurry strokes onto a canvas that you can composite over your webcam feed.
3. A **generative architecture scene** — a procedurally instanced "brutalist" block cityscape that reacts to your hand gestures in real time.

> **Note:** This tutorial targets beginners-to-intermediate TouchDesigner users. You should know what TOPs, CHOPs, and SOPs are, and be comfortable adding operators by pressing Tab and connecting wires.

---

## 1. Setup & MediaPipe Plugin

### 1.1 Download the Plugin

1. Go to [github.com/torinmb/mediapipe-touchdesigner/releases](https://github.com/torinmb/mediapipe-touchdesigner/releases) and download the latest `release.zip`.
2. Unzip it. You will find a `toxes/` folder and a `MediaPipe TouchDesigner.toe` file.
3. **Place the `toxes/` folder alongside your own project's `.toe` file.** The components use relative paths to load the embedded browser assets, so the folder position matters.

> **Tip:** If you are starting a new project, copy the entire unzipped folder somewhere permanent and build your `.toe` file there, or copy the `toxes/` folder next to your existing `.toe`.

### 1.2 Add the MediaPipe Component

1. Open your project `.toe` file.
2. Press **Tab** to open the operator search and type `Component`. Select a base **COMP** and name it `mediapipe_rig` — this will be your container for the whole tracking system.
3. Inside the container, drag `MediaPipe.tox` from the `toxes/` folder directly into the network.
4. When TouchDesigner prompts you: **"Enable External .tox?"** — click **Yes**. This keeps the component as a reference to the external file rather than embedding it. Embedding it would inflate your `.toe` by hundreds of MB.
5. Drag `Hand Tracking.tox` into the same network.

> **Common issue:** If you see a blank component or errors about missing files, check that the `toxes/` folder is in the expected relative location — it should be right next to your `.toe`, not inside a subfolder of it.

### 1.3 Configure the Camera Source

1. Click on the **MediaPipe COMP**. In the **Parameters** panel, find the first tab (usually called `MediaPipe`).
2. You will see a **Webcam** dropdown — this lets the embedded browser grab any camera directly. Select your webcam from the list.
3. Toggle on **Hand Tracking** in the model list. **Toggle off** every other model (Face, Pose, Object, etc.) that you are not using — each active model runs continuously and burns GPU/CPU.
4. Optionally enable **Preview Overlay** to draw the skeleton joints on the video output for debugging.

> **Tip:** The plugin communicates via a local WebSocket on port 9222. If hand tracking never starts, open Google Chrome and go to `http://localhost:9222` — this opens Chrome DevTools for the embedded browser. You can read error messages there without affecting your project.

---

## 2. Core Hand-Tracking Rig (Master Class Concepts)

This section explains what comes out of the plugin and how to wire it into a clean, reusable rig.

### 2.1 Understanding the Plugin's Outputs

The **MediaPipe COMP** has two main outputs visible at the top level:

| Output   | Type | What is in it                                                     |
| -------- | ---- | ----------------------------------------------------------------- |
| TOP out  | TOP  | Live camera feed with optional landmark overlay drawn             |
| CHOP out | CHOP | All model channels: landmark positions, gestures, helper channels |

The **Hand Tracking.tox** (connected via internal wiring) further breaks those channels into:

| Output   | Type | Contents                                                                |
| -------- | ---- | ----------------------------------------------------------------------- |
| CHOP out | CHOP | All 21 landmark x/y/z channels + gesture + confidence + helper channels |
| DAT out  | DAT  | Raw landmark data as a table (one row per landmark)                     |

The 21 landmark channels follow this naming pattern: `H1_<joint_name>_<axis>` for hand 1 (and `H2_…` for hand 2 if two hands are present). For example: `H1_index_fingertip_x`, `H1_index_fingertip_y`, `H1_index_fingertip_z`.

There are also pre-computed **helper channels** the plugin calculates for you:

| Channel                   | What it measures                                      |
| ------------------------- | ----------------------------------------------------- |
| `H1_pinch_midpoint_x/y/z` | Midpoint between thumb tip and index tip              |
| `H1_pinch_distance`       | Euclidean distance between thumb and index tips (0–1) |
| `H1_spread`               | Overall hand openness                                 |
| `H1_<gesture>_confidence` | Confidence from 0–1 for each built-in gesture         |

### 2.2 Pulling Specific Joints with Select CHOP

Rather than working with all 63+ channels at once, use a **Select CHOP** to grab only the ones you need.

1. Add a **Select CHOP** and wire the Hand Tracking CHOP out into it.
2. In the **Channel Names** field, use a glob pattern to grab all three axes of the index fingertip:

```
H1_index_fingertip_*
```

The `_*` wildcard matches `_x`, `_y`, `_z`. You can also grab multiple joints at once:

```
H1_index_fingertip_* H1_thumb_tip_*
```

3. Add a **Null CHOP** after it and name it `null_fingertip` — this is your clean export reference.

### 2.3 Remapping Coordinates

MediaPipe outputs values normalised **0 to 1**, where (0, 0) is the top-left of the camera frame. TouchDesigner's 3D space and many TOPs use a **−0.5 to 0.5** or **−1 to 1** coordinate space.

1. After your Select CHOP, add a **Math CHOP**.
2. Go to the **Range** tab:

```
From Range:  0   →   1
To Range:   -0.5 →  0.5
```

3. Y needs inverting too (MediaPipe Y=0 is the top of frame, TD often treats Y=0 as center). Add a second **Math CHOP** in **Multiply-Add** mode. For the Y channel only, set:

```
Multiply: -1
Add:       0
```

> **Tip:** You can combine these into one Math CHOP by setting `To Range` to `0.5 → -0.5` (swapping min and max), which inverts and remaps in one step.

4. Add a **Lag CHOP** after the Math CHOP. Set **Lag** to around `0.05` or `0.1` seconds. This smooths jittery raw output so that visuals don't snap and flicker.

5. Finish with a **Null CHOP** — name it `null_hand_pos`. This is what everything else in the project will reference.

### 2.4 Quick Example — Move a Shape to the Pinch Midpoint

Let's test the rig by positioning a simple shape at the pinch point.

1. Add a **Circle TOP** to your main network.
2. Set its resolution to match your project resolution (e.g. 1920×1080).
3. On the **Circle TOP**, right-click the **Center X** parameter → **Add Expression** and type:

```python
op('null_hand_pos')['H1_pinch_midpoint_x']
```

4. Do the same for **Center Y**:

```python
op('null_hand_pos')['H1_pinch_midpoint_y']
```

5. Use an **Over TOP** to composite this over the camera feed from the MediaPipe TOP out. You should now see the circle following the midpoint between your thumb and index finger.

---

## 3. Gestures and Confidence Channels

### 3.1 Available Gestures

The hand tracking plugin outputs a confidence value (0–1) for each of the following built-in gestures:

| Gesture channel             | Trigger condition                    |
| --------------------------- | ------------------------------------ |
| `H1_open_palm_confidence`   | Hand flat, fingers spread            |
| `H1_pointing_up_confidence` | Index finger extended, others curled |
| `H1_thumb_up_confidence`    | Thumbs-up shape                      |
| `H1_thumb_down_confidence`  | Thumbs-down shape                    |
| `H1_closed_fist_confidence` | Clenched fist                        |
| `H1_victory_confidence`     | Peace / V sign                       |
| `H1_iloveyou_confidence`    | 🤘 horns sign                        |

### 3.2 Converting Confidence to a Clean Trigger

Raw confidence values fluctuate, so threshold them into a clean 0/1 signal before wiring them to any logic.

1. Add a **Select CHOP**, grab the channel you want, e.g.:

```
H1_thumb_up_confidence
```

2. Add an **Expression CHOP** after it. In the expression field:

```python
me.inputVal[0] > 0.8
```

This outputs `1.0` when confidence is above 80%, and `0.0` otherwise — a clean binary trigger.

3. Add a **Lag CHOP** with a short lag (`0.03` seconds) to prevent rapid oscillation right at the threshold.

4. Add a **Trigger CHOP** after the Lag — it fires a one-sample pulse on the rising edge (0→1). Use this pulse to trigger one-shot events like resetting a canvas or switching a mode.

### 3.3 Example — Reset the Canvas with Open Palm

We'll use this in the brush section. When you flatten your hand, the painting canvas clears.

1. Wire the thumbs-up trigger (from 3.2) into a **Count CHOP** — it will increment a counter each time you give a thumbs-up.
2. To reset (not count), you can instead wire the open-palm trigger to the **Reset** input on any relevant operator, or reference it directly:

```python
# In any parameter expression — returns 1 when palm is open
op('null_gesture_palm')[0]
```

---

## 4. Watercolor Hand-Tracking Brush

This section builds the interactive painting system step by step.

### 4.1 Brush Shape — Circle Driven by Pinch

The brush tip is a soft circle whose position is the pinch midpoint, whose size is the pinch distance, and whose opacity indicates whether the pen is "down".

1. Add a **Circle TOP** (1920×1080). Name it `circle_brush`.
2. Set the **Softness** parameter to around `0.3–0.5` for a soft, feathered edge.
3. **Position:** Bind Center X and Center Y to the pinch midpoint channels (see Section 2.4).
4. **Size:** Add a **Math CHOP** after your `null_hand_pos` that grabs `H1_pinch_distance`, remapped from its useful range (e.g. `0.02 → 0.2`) to a brush radius range (`0.01 → 0.12`):

```
From Range:  0.02  →  0.2
To Range:    0.01  →  0.12
```

5. Clamp the output with another **Math CHOP** (Clamp mode, Min `0.01`, Max `0.15`) so the brush never collapses to zero or bloats to fill the screen.
6. Wire this clamped value to the **Radius** parameter of `circle_brush`.

### 4.2 Pen Up / Pen Down — Using Z Depth

Z gives you depth — when your hand is close to the camera, Z is a large negative number in normalized space. Use this as a pen-up/pen-down switch.

1. Add a **Select CHOP** to grab `H1_pinch_midpoint_z`.
2. Add an **Expression CHOP**:

```python
1 if me.inputVal[0] < -0.1 else 0
```

This outputs `1` (pen down, drawing) when the hand is within a certain depth threshold, `0` (pen up, not drawing) otherwise.

3. Wire this to the **Alpha** parameter of `circle_brush`:

```python
op('null_pen_state')[0]
```

> **Tip:** The exact threshold depends on your webcam distance. Tweak the `-0.1` value while watching the value in a **Constant CHOP** display window until the pen up/down switch feels natural at your typical working distance.

### 4.3 Feedback Loop — Accumulating Paint

A **Feedback TOP** holds the previous frame's output and composites new brush strokes on top of it, creating the painted canvas.

1. From the **Palette** browser (press Alt+L to open), search for **Feedback** and drag it into your network. This gives you a pre-built `feedback` component.
2. The Feedback component has two inputs: _New Frame_ (what to add this frame) and _Feedback In_ (where to read the previous frame from). It will connect to itself internally.
3. Wire `circle_brush` → Feedback input.
4. Wire the Feedback output → an **Over TOP** which composites the canvas over your camera feed.

### 4.4 Painterly Blur and Distortion Inside the Loop

To make strokes look soft and watercolor-like, process the feedback buffer before it's fed back into itself.

Inside the Feedback network (or between the Feedback output and composite):

1. Add a **Blur TOP** — set **Size** to `2–4 pixels`. This subtly spreads each stroke a little every frame, giving the watercolor bleed effect.
2. Add a **Displace TOP** after the Blur:
   - Use a **Noise TOP** as the displacement source (low frequency, small amplitude `0.002–0.005`).
   - This makes the paint appear to slightly drift and flow rather than sit completely still.
3. Optionally add a **Level TOP** set to reduce **Opacity** by `0.998` per frame — this makes old paint very slowly fade, giving a long-tail painting memory.

> **Common issue:** If the canvas accumulates too fast and becomes fully saturated immediately, lower the **Opacity** (or **Multiply**) value on the Level TOP to something like `0.995`, so each pass reduces brightness very slightly.

### 4.5 Brush Textures — Switching with Gestures

Instead of a plain white circle, apply textures to the brush to vary the stroke feel.

1. Create several texture sources:
   - **Noise TOP**: set **Type** to `Sparse` or `Hermite`, adjust **Period** and \*\*Amplitude` for a grainy texture.
   - **Movie File In TOP**: point at a paper texture or watercolor swatch image.
   - **Video Device In TOP**: the live webcam feed itself (for a self-portrait brush effect).

2. Add a **Switch TOP** and wire all three texture sources into it as inputs.
3. Enable **Blend Between Inputs** on the Switch TOP (this cross-fades textures as the index changes).

4. Add a **Count CHOP** driven by the thumbs-up one-shot trigger from Section 3.2:
   - Set **Limit** to the number of textures (e.g. `3`).
   - Set **Reset to** `0` when it hits the limit.
5. Wire the Count CHOP into the Switch TOP's **Index** parameter:

```python
op('count_brush')[0]
```

6. Apply the texture to the brush by multiplying it against the Circle TOP using a **Multiply TOP**:

```
[Circle TOP] ──► [Multiply TOP] ──► Feedback input
[Switch TOP] ─────────────────┘
```

> **Tip:** Use an **Over TOP** instead of Multiply if you want the texture to only appear inside the circle shape but preserve the circle's soft edge mask.

---

## 5. Generative Architecture Scene

This section uses hand data to control an instanced 3D scene — a brutalist block structure that reshapes itself based on your hand movements.

### 5.1 Building the Block Structure (Geometry + Instancing)

Instancing lets you render thousands of copies of one object using a table of positions and transforms stored in a CHOP or DAT.

1. Add a **Box SOP**. Set its default size to something small — `0.1 × 0.1 × 0.5` (tall, narrow column).
2. Add a **Geometry COMP** and set its SOP to the Box SOP.
3. On the **Geometry COMP**, go to the **Instance** tab:
   - Set **Instancing** → `On`.
   - Set **Instance CHOP** to the CHOP you will create below (e.g. `op('null_instances')`).

### 5.2 Generating Instance Positions via TOPs and CHOPs

1. Add a **Noise TOP** (64×64 resolution). This generates a grid of random values — one value per "column" in our building grid.
2. Add a **TOP to CHOP** to bring that noise into CHOP land as three channels: r, g, b.
3. Add a **Rename CHOP** — rename channel `r` to `tx`, `g` to `tz` (we'll use Y for height). Now you have X and Z instances spread across the grid.
4. Add a **Math CHOP** to scale tx and tz to the physical size of your grid:

```
Multiply by: 10
```

5. For height (`ty`): Add another channel or derive it. Use a **Constant CHOP** initially, then drive it with hand data in the next step.
6. Wire everything into a **Merge CHOP** with channels `tx`, `ty`, `tz`.
7. Add a **Null CHOP** named `null_instances` and set this as the **Instance CHOP** on the Geometry COMP.

> **Tip:** To get a proper grid layout rather than random scatter, use a **Grid SOP** instead of Noise TOP, then convert it with **SOP to CHOP** to extract point positions directly as CHOP channels.

### 5.3 Connecting Hand Data to the Architecture

Now wire hand gestures and positions into the building's parameters.

**Block height from pinch distance:**

1. Take `H1_pinch_distance` from `null_hand_pos`.
2. Remap it:

```
From Range:  0.01  →  0.3
To Range:    0.1   →  5.0
```

3. Feed this into a **Math CHOP** combining it with your instance `ty` channel (via a **Math CHOP** in Multiply mode) — so more pinching = taller or shorter buildings.

**Camera orbit from hand X position:**

1. Use `H1_pinch_midpoint_x` (remapped to -45° to 45°) to drive the **Rx** (rotation X) parameter of a **Camera COMP**.
2. Use `H1_pinch_midpoint_y` (remapped to -30° to 30°) to drive **Ry**.

```python
# On Camera COMP Rx parameter:
op('null_hand_pos')['H1_pinch_midpoint_x'] * 90 - 45
```

**Gesture to switch styles:**

- **Open palm** → spread buildings far apart (drive a scale multiplier on `tx` and `tz`).
- **Closed fist** → compress buildings close together.
- Use the binary confidence triggers from Section 3.2 with a **Lag CHOP** to smoothly interpolate between spread states.

### 5.4 Materials and Lighting

1. Add a **Phong MAT** or **PBR MAT** to the Geometry COMP's material slot.
2. For a concrete brutalist look: set **Base Color** to a mid-grey (`0.5, 0.5, 0.5`), **Roughness** to `0.9`, **Metallic** to `0.0`.
3. Add a **Light COMP** above and to one side of the scene. Enable shadows if performance allows.
4. Add a **Render TOP** connected to a **Camera COMP** and the scene. Set resolution to 1920×1080.

---

## 6. Performance & Packaging

### 6.1 Setting Up the Output

1. Add an **Out TOP** at the end of your final composite chain. This is the canonical output operator.
2. To composite the 3D render over the painting over the camera:

```
[Camera feed TOP]
    └─► [Over TOP 1]  ←── [Painting canvas TOP]
            └─► [Over TOP 2]  ←── [Render TOP (3D scene)]
                    └─► [Out TOP]
```

### 6.2 Perform Window

1. Go to **Dialogs → Window COMP Manager** (or right-click any COMP → **Perform**).
2. Click **New** to create a Perform window linked to your top-level output.
3. Set options:
   - **Fill** → On (fills the monitor).
   - **Always on Top** → On.
   - **Borders** → Off.
4. Press **F1** (or click Perform) to enter fullscreen performance mode. **Esc** exits.

### 6.3 Saving and Media Paths

1. Always save with **File → Save As** and put the `.toe` in the same folder as the `toxes/` directory.
2. Store any media (textures, videos) in a `/media/` subfolder next to your `.toe`. Reference them in **Movie File In TOPs** with a relative path:

```
media/paper_texture.jpg
```

This ensures the project opens correctly on other machines without re-linking files.

3. Before sharing the project, run **File → Export** (or use the built-in Palette's **Project Exporter**) to bundle all external assets.

### 6.4 Final Performance Checklist

- [ ] **Disable unused MediaPipe models** — face, pose, and object detection all cost GPU even when idle.
- [ ] **Enable External .tox** is checked on both `MediaPipe.tox` and `Hand Tracking.tox`.
- [ ] Webcam is set to **1280×720** — the model caps at 720p anyway.
- [ ] All **Null CHOPs** acting as references are named consistently.
- [ ] Feedback TOP has **Clamp** enabled to prevent overbright accumulation.
- [ ] Check **Realtime CHOP** channels inside the MediaPipe COMP:

| Channel             | Healthy value                                           |
| ------------------- | ------------------------------------------------------- |
| `isRealTime`        | `1`                                                     |
| `realTimeRatio`     | Below `1.0`                                             |
| `detectTime`        | Below `33 ms` (for 30 fps)                              |
| `totalInToOutDelay` | Use as Cache TOP offset if sending TD feed to MediaPipe |

---

## Summary

You now have three interconnected systems, all driven from a single hand-tracking data source:

```
[Webcam]
    └─► [MediaPipe.tox + Hand Tracking.tox]
                │
        [null_hand_pos CHOP]  ──────────┬─────────────────────┐
                │                       │                       │
      [Watercolor Brush]     [Generative Architecture]  [Gesture Triggers]
      Circle TOP + Feedback   Box SOP + Instancing       Count / Trigger CHOPs
                │                       │                       │
                └───────────────────────┴───────────────────────┘
                                        │
                              [Final Composite → Out TOP]
```

From here you can extend the rig by:

- Adding more gestures to cycle through brush modes or architectural styles.
- Bringing in audio-reactive data via an **Audio Spectrum CHOP** and blending it with hand data.
- Using the **Face Tracking.tox** decoder to also track eye gaze and blend it with hand control.

---

## Related

- [[Hand Tracking|(y) Return to Hand Tracking]] — video links and series overview
- [[Sierpinski Tetrahedron with Hand Tracking]] — fractal geometry project using the same MediaPipe rig
- [[Hand-Tracked Chaotic Attractor]] — Lorenz attractor driven by a custom Script CHOP (no plugin)
- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TD]]
- [[touchdesigner/02_The_Operators/CHOPs/index|(y-) CHOPs]]
- [[touchdesigner/03_Rendering_and_Output/Instancing|(y-) Instancing]]
- [[Particle System with POPs]]

---
[[Hand Tracking|(y) Return to Hand Tracking]]
[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
