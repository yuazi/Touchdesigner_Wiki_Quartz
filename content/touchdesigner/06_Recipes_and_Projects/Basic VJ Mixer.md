---
tags:
  - touchdesigner
  - td/recipes
  - mixing
  - recipes
  - vj
date: 2026-03-02
---

# Recipe: Basic A/B VJ Mixer

This recipe walks you through building a fundamental **A/B Crossfader**—the backbone of any live visual performance. You will learn how to take two different video sources and smoothly blend between them using a slider.

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
2.  **Look inside:** Every COMP is like a folder. Double-click the **Slider COMP** to "dive" inside it.
3.  **Find the signal:** Inside, you'll see a node named `out1` (a CHOP). This represents the slider's value (0 to 1).
4.  **Go back up:** Press **U** on your keyboard to "jump up" to the main network.
5.  **View the value:** Click the small **plus (+) icon** in the bottom-right corner of the Slider COMP node. This makes the node "Active." Now you can click and drag the slider handle right there in the network!

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

- **"I don't see the parameters!"** — Press **P** to toggle the parameter window on/off.
- **"The slider isn't moving."** — Make sure the "Viewer Active" flag (the little plus icon in the bottom right of the node) is turned ON.
- **"The blend is jumpy."** — Add a **Lag CHOP** between the slider and the Cross TOP to smooth out your hand movements.

---

## Next Steps

- [[touchdesigner/06_Recipes_and_Projects/Audio Reactive Geometry|Drive the mixer with Audio]] instead of a manual slider.
- [[touchdesigner/03_Rendering_and_Output/Feedback Loops|Add a Feedback Loop]] for psychedelic trails.

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]]
