---
tags:
  - touchdesigner
  - td/rendering
  - rendering
  - feedback
  - advanced
date: 2026-02-16
---

# Feedback Loops

A **Feedback TOP** reads the texture from the previous frame. Combining current video with the previous frame creates echoes, trails, complex fractals, and reaction-diffusion simulations.

## Creating a Feedback Loop

1. Create a generative TOP (e.g., Noise TOP, Circle TOP).
2. Create a **Feedback TOP**.
3. Create a blending TOP (e.g., **Over TOP**, **Composite TOP**, **Add TOP**). Connect your source to the background, and the Feedback TOP to the foreground.
4. Drag the output of the blending TOP onto the Feedback TOP itself (or type the blend node's name into the _Target TOP_ parameter of the Feedback TOP).
5. Ensure there is a slight transformation (Translate, Scale, Rotate) inside the loop (e.g., placing a Transform TOP between the Feedback TOP and the Blend TOP). This creates the continuous movement over time.
6. Create a Keyboard In CHOP and map it to the **Pulse** button on the Feedback TOP to clear/reset the canvas.

## Stability

Feedback loops can quickly blow out to pure white or decay to pure black.

- Use a **Level TOP** inside the loop to slightly reduce opacity or brightness (e.g., setting the opacity multiplier to 0.99) so trails fade out over time.
- Be mindful of pixel formats (using 16-bit or 32-bit float prevents early color clamping).

---

[[touchdesigner/03_Rendering_and_Output/index|(y) Return to Rendering & Output]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
