---
tags:
  - touchdesigner
  - td/operators
  - operators
  - top
date: 2026-02-11
---

# TOP - Texture Operators (2D)

TOPs are used for image processing and 2D graphics. They run on the GPU.

## Key TOPs

- **Movie File In:** Load images or videos.
- **Constant:** Create a solid color.
- **Composite:** Blend multiple TOPs together (Add, Multiply, Screen, etc.).
- **Blur:** Soften textures.
- **Level:** Adjust brightness, contrast, and gamma.
- **Render:** The bridge between 3D (SOPs/MATs) and 2D (TOPs).

## Resolution and Pixel Formats

TOP computations happen under specific settings found on the **Common** page of almost any TOP node:

- **Resolution:** Dictates the width and height. You usually want to dictate this clearly at the start of a chain (e.g., using a Constant TOP set to 1920x1080) and let downstream nodes "Use Input" resolution.
- **Pixel Format (Crucial!):**
  - **8-bit fixed:** Default for most images/video. Values stay strictly between 0 and 1 (or 0-255).
  - **16-bit / 32-bit float:** Critical for Displacement maps, Point Clouds (XYZ coordinates stored as RGB), and Feedback loops. Float formats allow negative numbers and numbers far exceeding 1.0 without being clipped or crushed.

## Tips

- Always check your resolution in the middle-mouse-click menu.
- Purple = 2D Data.

## How to Use TOPs

To use TOPs effectively:

1. **Adding a TOP:** Open the OP Create Dialog (Tab) and select the TOP family (purple color).
2. **Generating vs Processing:** Start chains with generator TOPs (darker purple, no inputs required) like `Movie File In` or `Constant`, then connect them to processing TOPs (lighter purple) like `Level`, `Blur`, or `Composite`.
3. **Connecting:** Drag from the output port on the right of one TOP to the input port on the left of another to process the image stream.
4. **Resolution Management:** The first node in a chain usually dictates the resolution. Subsequent nodes default to "Use Input" resolution. You can override this in the Common page of any TOP's parameters.
5. **Viewing Output:** Click the 'Viewer Active' toggle (bottom right of the node) to interact with the image or background-click 'Display' to set it as the network's backdrop.
6. **Exporting and Converting:** You can pass TOP data to other families using conversion nodes like `TOP to CHOP` to convert pixel color values into channel data streams.

[[touchdesigner/02_The_Operators/TOPs/index|↑ Back to TOPs]] | [[touchdesigner/02_The_Operators/index|↑ Back to The Operators]] | [[touchdesigner/index|↑ Back to TouchDesigner]]

---
