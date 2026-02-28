---
tags:
  - touchdesigner
  - td/rendering
  - advanced
---
# Geometry Instancing

Instancing allows you to draw the same piece of geometry thousands or millions of times at very low performance cost. This is because the GPU is highly optimized for drawing the same mesh multiple times with varying transformation data.

## Setting Up Instancing

1. Create a base mesh inside a **Geometry COMP**.
2. Go to the *Instance* page of the Geometry COMP and turn "Instancing" ON.
3. Supply translation data (usually a CHOP, SOP, or TOP containing x,y,z coordinates).
4. Map the channels in the *Instance* parameters to the translation fields:
   - Example: `tx`, `ty`, `tz`

## Driving Instances
- **CHOP Data:** The most common method. Using a Noise CHOP to drive coordinates.
- **TOP Data (Pixel Data):** Excellent for massive counts. Extracting coordinates directly from the RGB values of a texture. Highly optimized on the GPU.
- **POP Data (GPU Point Cloud):** The most modern and efficient way to handle millions of points for instancing. POPs provide native GPU-based attributes (position, color, mass) that drive geometry instancing with minimal overhead.
- **SOP Data:** Using the points of another 3D shape as positions for your instances. Less efficient but simple for 3D arrays.

By instancing a simple box, you can create a massive cityscape, a grid of reactive particles, or a complex flocking simulation—all in real-time.

[[Index|Back to Home]]
