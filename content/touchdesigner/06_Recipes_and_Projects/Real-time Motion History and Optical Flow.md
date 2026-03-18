---
title: "Real-time Motion & Optical Flow"
tags:
  - touchdesigner
  - td/recipes
  - motion
  - tracking
  - opticalflow
  - recipes
  - installation
date: 2026-03-16
---

Ever wanted to make your visuals react to someone's movement without fancy sensors? This recipe shows you two classic ways to detect motion using just a webcam: **Motion History** and **Optical Flow**.

> [!info] Core Concepts
>
> - **Motion History (MHI):** A "heat map" of your movement. If you move your arm, it leaves a trailing glow that slowly fades away.
> - **Optical Flow:** Calculates the _direction_ and _speed_ of movement. It's like seeing the wind blowing through your camera.

---

## 1. Setup Your Camera (TOPs)

1.  **Input:** Add a **Video Device In TOP**.
2.  **Smoothing:** Add a **Blur TOP** with a small value (1-2) to reduce "noise" (static) from the webcam.
3.  **Prepare:** Connect to a **Null TOP** named `NULL_VIDEO`.

---

## 2. Motion History (The "Glow" Effect)

Let's make a visual that shows where people have moved recently.

1.  **Find the Difference:**
    - Connect `NULL_VIDEO` to a **Subtract TOP**.
    - Add a **Delay TOP** (set to 1 frame delay) and connect it into the second input of the **Subtract TOP**.
    - _What it does:_ It subtracts the previous frame from the current one. If something moved, there's a difference!
2.  **The Accumulator:**
    - Connect the result to a **Feedback TOP**.
    - Inside the feedback network, add a **Level TOP** and set **Opacity** to `0.95`.
    - This creates the trailing "history" effect that slowly fades out.
3.  **Finalize:** Connect to an **HSV Adjust TOP** to turn that white glow into a vibrant color!

---

## 3. Optical Flow (The "Vector" Effect)

This is more advanced and requires a special "Farneback" node or GLSL.

> [!tip] New to Optical Flow?
> In simple terms, it converts your movement into colors. Red/Blue might mean moving Left/Right. Yellow/Green might mean Up/Down.

1.  **Add the Node:** Press **Tab** and search for **Optical Flow TOP**. (If you don't have it, look for a community `farneback_optical_flow` component in the forum).
2.  **Connect it:** Wire your `NULL_VIDEO` into it.
3.  **Visualize:** Use a **Math TOP** to turn those direction vectors into colors.

---

## 4. Your First Project: The "Ghost Effect"

Let's make a visual where your motion "paints" trails on the screen.

1.  **Composite:** Add a **Composite TOP**.
2.  **Layers:**
    - Input 0: Your original `NULL_VIDEO`.
    - Input 1: Your Motion History result from Section 2.
3.  **Operation:** Set to **Add**.
    - Now you should see yourself with a colorful "ghost trail" trailing behind your every move!

---

## Troubleshooting

- **"I see lots of tiny white dots everywhere."** — That's digital noise. Increase the **Blur TOP** before your motion detection or use a **Threshold TOP** to cut out the small stuff.
- **"The trails never disappear!"** — Lower the **Opacity** in your Feedback loop's **Level TOP** (try `0.90` instead of `0.95`).
- **"Everything is red/blue."** — Optical Flow results can look strange. Use an **HSV Adjust TOP** to remap the colors into something more pleasing.

---

## Next Steps

- **Trigger an Event:** Use an **Analyze CHOP** to detect when the motion "amount" is very high (like someone jumping) to trigger a burst of light.
- **Particle Trails:** Use the Optical Flow colors to push particles in the direction of your arm's movement.
- **Interactive Mask:** Use the Motion History as an alpha mask to only show a 3D scene where someone is moving.

---
[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
