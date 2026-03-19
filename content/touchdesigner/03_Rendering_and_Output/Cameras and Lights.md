---
tags:
  - touchdesigner
  - td/rendering
  - rendering
date: 2026-02-16
---

# Cameras and Lights

## Camera COMP

The **Camera COMP** is your virtual lens.

### Key Parameters:

- **Translate / Rotate:** Positions and aims the camera.
- **Look At:** Instead of rotating manually, you can provide the path to another COMP (like a `null` COMP) in the _Look At_ parameter. The camera will automatically track it.
- **FOV (Field of View):** Wider FOV (e.g., 90) gives a fisheye effect; narrower (e.g., 20) compresses distance like a telephoto lens.
- **Near/Far Plane:** Determines the clipping range. Objects closer than _Near_ or further than _Far_ are not rendered. Optimizing this range improves Z-depth precision.

## Light COMP

The **Light COMP** brings materials to life.

### Types of Lights:

- **Point Light:** Emits light in all directions from a point (like a bare lightbulb).
- **Cone Light:** Emits light in a directional cone (like a flashlight or spotlight).
- **Distant Light:** Emits parallel rays from an infinite distance (like the sun).

### Shadows:

To enable shadows:

1. Go to the _Shadows_ page of the Light COMP.
2. Change the _Shadow Type_ (e.g., Hard, Soft).
3. Soft shadows require adjusting the _Softness_ and _Resolution_ parameters for quality.

---
[[touchdesigner/03_Rendering_and_Output/index|(y) Return to Rendering & Output]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
