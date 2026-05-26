---
title: "Basic A/B VJ Mixer"
tags:
  - touchdesigner
  - td/recipes
  - mixing
  - recipes
  - vj
date: 2026-03-02
---

This recipe walks you through building a fundamental **A/B Crossfader**, the backbone of any live visual performance. You will learn how to take two different video sources and smoothly blend between them using a slider.

> [!info] New to TouchDesigner?
> Before we start, remember the three main "families" of operators we'll use:
>
> - **TOPs (Texture Operators):** These handle images and video.
> - **CHOPs (Channel Operators):** These handle numbers and signals (like sliders and audio).
> - **COMPs (Components):** These are "containers" that hold UIs or 3D scenes.

---

## 1. Prepare Your Sources (TOPs)

First, we need two visual sources to mix between.

1.  **Source A:** Press **Tab**, select the **TOP** tab, and find the **Noise TOP**. This generates a procedural cloudy pattern.
    - _Tip:_ Rename it to `source_a` by clicking the name below the node.
2.  **Source B:** Press **Tab** and find the **Movie File In TOP**. By default, it loads a banana or a nature scene.
    - _Tip:_ Rename it to `source_b`.
3.  **The Mixer:** Add a **Cross TOP**. This is our magic "blender" node.
4.  **Connect them:**
    - Click the output connector (right side) of `source_a` and drag the wire to the _first_ input of the `Cross TOP`.
    - Click the output of `source_b` and drag it to the _second_ input of the `Cross TOP`.

---

## 2. Create the Controller (COMPs & CHOPs)

Now we need a way to control that "Cross" parameter with a slider.

1.  **Add a Slider:** Press **Tab**, go to the **COMP** tab, and select **Slider**.
2.  **Understand what it outputs:** The Slider COMP automatically produces a CHOP channel called `v1` with a value from 0 to 1 as you drag the handle.
3.  **Activate the viewer:** Click the small **plus (+) icon** in the bottom-right corner of the Slider COMP node. This makes the node "Active" so you can interact with it. Now you can click and drag the slider handle right there in the network!

---

## 3. The "Magic Link" (Binding)

We need the slider's number (CHOP) to drive the Cross TOP's blend value (Parameter).

1.  Select your **Cross TOP**. Look at the **Parameters** window in the top-right of your screen.
2.  Find the **Cross** slider (it probably says `0.5`).
3.  **The Drag-and-Drop:**
    - Make sure your Slider COMP is "Active" (the + icon is clicked).
    - Click and drag the "v1" channel (the line) from the slider directly onto the word **Cross** in the Cross TOP's parameters.
    - A menu will pop up. Select **CHOP Bind**.
4.  **Test it:** Drag your slider left and right. You should see the visuals cross-fade between the clouds and the movie!

---

## 4. Final Output

To see your work properly, we need an output node.

1.  Connect the output of your **Cross TOP** to a **Null TOP**.
2.  Rename the Null to `OUT`.
3.  Click the **Display Flag** (the circle icon in the bottom-right) of the `OUT` node. Your visual will now appear in the background of your workspace.

---

## Adding "Spice": Effects

You can insert effects between the `Cross TOP` and your `OUT` node to make it more professional:

- **Level TOP:** Adjust brightness, contrast, and gamma.
- **Edge TOP:** Turn your visuals into glowing outlines.
- **Blur TOP:** Soften the image for a dreamy look.

> [!tip] Pro Tip: Keyboard Shortcut
> To quickly insert a node between two others, right-click on the wire connecting them and select **Insert Operator**.

---

## Troubleshooting

- **"I don't see the parameters!"** - Press **P** to toggle the parameter window on/off.
- **"The slider isn't moving."** - Make sure the "Viewer Active" flag (the little plus icon in the bottom right of the node) is turned ON.
- **"The blend is jumpy."** - Add a **Lag CHOP** between the slider and the Cross TOP to smooth out your hand movements.

---

## Next Steps

- **Add smoothing:** Insert a **Lag CHOP** between the Slider COMP and the Cross TOP to soften abrupt crossfades. Try a Lag value of `0.1`.
- **Try a third source:** Add a **Switch TOP** before the Cross TOP to cycle through more than two video sources.
- **Make it audio-reactive:** Replace the Slider COMP with an **Audio Device In CHOP** and an **Analyze CHOP** so the crossfade responds to live sound. See [[Audio Reactive Geometry]].

---

## Parameter Tuning & Behavior

| Parameter            | Behavior                                                                         |
| :------------------- | :------------------------------------------------------------------------------- |
| **Cross (Mixer)**    | 0 = Source A only; 1 = Source B only; 0.5 = Equal blend of both sources.         |
| **Level Brightness** | Higher = more intense light; Lower = darker, more moody visuals.                 |
| **Edge Strength**    | Higher = thicker, more visible outlines; Lower = subtler, thinner lines.         |
| **Blur Size**        | Higher = dreamier, softer focus; Lower = sharp, clear details.                   |
| **Lag (Smoothing)**  | Higher = slower, more "weighted" transition; Lower = instant, "snappy" response. |

## Network Architecture

To visualize how the data flows, here is a map of the final network:

```text
[ VIDEO SOURCES ]             [ CONTROL ]
Noise TOP (Source A) ──┐      Slider COMP
Movie In TOP (Source B) ─┤           │
                       ▼             ▼
                  Cross TOP ◀─── [ CHOP Bind ]
                       │
                       ▼
                    Null TOP (OUT) ──▶ [ Display Flag ]
```

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
