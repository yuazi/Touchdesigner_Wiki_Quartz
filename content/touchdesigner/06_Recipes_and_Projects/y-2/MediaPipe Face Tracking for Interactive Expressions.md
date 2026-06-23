---
title: "MediaPipe Face Tracking"
tags:
  - touchdesigner
  - td/recipes
  - facetracking
  - mediapipe
  - interaction
  - expressions
  - recipes
date: 2026-03-16
---

Want to make a digital avatar that smiles when you do? This recipe shows you how to use **MediaPipe** to track your face and facial expressions in real time. We'll use this data to drive fun, interactive visuals.

> [!info] Before You Start
> You will need to download the **MediaPipe TouchDesigner Plugin** by Torin Blankensmith.
> [Download it here](https://github.com/torinmb/mediapipe-touchdesigner/releases) (get the `release.zip`).

---

## 1. Setup the Plugin

1.  **Extract the Zip:** Unzip the plugin and place the `toxes/` folder right next to your `.toe` project file.
2.  **Add to TD:**
    - Press **Tab** and add a **Base COMP**. Name it `mediapipe_face`.
    - Inside, drag in `MediaPipe.tox` and `Face Tracking.tox`.
3.  **Turn it on:**
    - Click the `MediaPipe` node.
    - In the parameters, find **Face Tracking** and toggle it **On**.
    - Set your **Webcam** in the dropdown.

---

## 2. Understanding the Data

MediaPipe gives us two main types of data:

1.  **Landmarks:** 468 points on your face (eyes, nose, lips).
2.  **Blend Shapes (Expressions):** These are numbers from 0 to 1 that represent how much you are doing a specific expression (like `mouthSmile` or `browInnerUp`).

> [!tip] What is a Blend Shape?
> Think of it as a slider. If your mouth is closed, `mouthSmile` is `0.0`. If you're grinning ear-to-ear, it's `1.0`.

---

## 3. Extracting Your Smile

Let's grab your smile and use it to control something!

1.  Add a **Select CHOP** and connect it to the output of the `Face Tracking` node.
2.  In the **Channel Names** parameter, type: `F1_mouthSmileLeft`.
3.  Add a **Math CHOP** to make it more sensitive if needed.
4.  Add a **Null CHOP** and name it `MY_SMILE`.

---

## 4. Your First Project: The "Glowing Smile"

Let's make a circle that grows and changes color when you smile.

1.  **The Circle:** Add a **Circle TOP**.
2.  **Control the Size:**
    - Make the `MY_SMILE` Null active (click the + icon).
    - Drag the channel onto the **Radius** parameter of the Circle TOP.
    - Select **CHOP Bind**.
3.  **Control the Color:**
    - Drag the same channel onto the **Color R** (Red) parameter.
    - Now the circle will turn redder the more you smile!

---

## Troubleshooting

- **"The plugin is red/erroring."** - Make sure the `toxes/` folder is in the same folder as your project file.
- **"It's really slow."** - MediaPipe is heavy. Go to the MediaPipe COMP and make sure **Face Tracking** is the _only_ model turned on.
- **"My face isn't being detected."** - Ensure you have good lighting! If your room is dark, the AI will struggle to find your features.

---

## Next Steps

- **Puppet an Avatar:** Map your jaw opening (`F1_jawOpen`) to a 3D character's mouth.
- **Eyebrow Control:** Use `F1_browInnerUp` to trigger a burst of particles.
- **3D Mesh:** Check out the `Face Mesh` output to see a full 3D wireframe of your face.

---

## Parameter Tuning & Behavior

| Parameter                | Behavior                                                                              |
| :----------------------- | :------------------------------------------------------------------------------------ |
| **mouthSmile intensity** | 0 to 1; drives how much the visual "reacts" to your happiness.                        |
| **Math Multiplier**      | Higher = makes the visual react to even a tiny smirk; Lower = requires a wide grin.   |
| **Lag / Smoothing**      | Higher = visual reacts slowly and "fluidly"; Lower = visual is "twitchy" and instant. |
| **Bloom Intensity**      | Higher = smile becomes a blinding light; Lower = subtle, soft glow.                   |

## Network Architecture

To visualize how the face tracking data flows, here is the final network map:

```text
[ VIDEO INPUT ]                  [ MEDIAPIPE PLUGIN ]
Webcam TOP ──────────────────▶ [ MediaPipe.tox ]
                                      │
                                      ▼
[ DATA DECODING ]              [ Face Tracking.tox ]
                                      │
                                      ▼
[ EXPRESSIONS ]                [ Select CHOP ] (F1_mouthSmile*)
                                      │
                                      ▼
[ SMOOTHING ]                  [ Lag / Filter CHOP ]
                                      │
                                      ▼
[ EXPORT ]                     [ Null CHOP (MY_SMILE) ]
                                      │
                                      ▼
[ VISUALS ]                    [ Circle TOP ] ◀──────────────┐
                               (Radius Bind)                 │
                                      │                      │
[ RENDERING ]                  [ Bloom TOP ] ──▶ [ HSV Adjust ] ──▶ [ OUT ]
```

> [!tip]- 📚 Learning Path · Stage 5 - Intermediate Recipes · step 28 of 44
> [[touchdesigner/06_Recipes_and_Projects/y-2/Instanced 3D Models with PBR|(y-) ← Prev: Instanced 3D Models with PBR]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Next: Python in TD →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
