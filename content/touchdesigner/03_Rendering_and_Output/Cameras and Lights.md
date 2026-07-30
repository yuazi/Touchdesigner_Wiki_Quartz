---
title: Cameras and Lights
tags:
  - touchdesigner
  - td/rendering
  - rendering
date: 2026-02-16
---

The Camera COMP and Light COMP are the two Object COMPs that join the Geo COMP in any 3D render. The Camera defines the eye; the Lights illuminate. Both attach to a Render TOP via name, not via wires.

## Camera COMP

### Key Parameters

| Parameter                   | Description                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Translate (t)**           | Position along X, Y, Z. Default Camera sits at `(0, 0, 5)` looking toward the origin.                             |
| **Rotate (r)**              | Rotation in degrees with configurable order (xyz, xzy, yxz, yzx, zxy, zyx).                                       |
| **Scale (s)**               | Non-uniform scale, plus a Uniform Scale parameter for proportional resizing.                                      |
| **Look At**                 | "Orient this Component by naming another 3D Component you would like it to Look At, or point to."                 |
| **Look At Up Vector**       | Stabilizes orientation when the target passes through the Y axis. Standard vectors, quaternions, or roll options. |
| **Projection**              | Perspective, Orthographic, Perspective-to-Ortho Blend, or Custom Projection Matrix.                               |
| **FOV Angle**               | "The field of view (FOV) angle is the angular extend of the scene imaged by the camera."                          |
| **Focal Length / Aperture** | Alternative to FOV, mapped to real-world lens properties.                                                         |
| **Ortho Width**             | Active only with Orthographic projection. "Specifies the width of the orthographic projection."                   |
| **Near**                    | Clipping plane. "Geometry closer from the lens than these distances will not be visible."                         |
| **Far**                     | Clipping plane on the back side. Geometry farther than this becomes invisible.                                    |

### Camera Tricks

- **Ortho for 2D-feeling 3D.** Set Projection to Orthographic and Ortho Width to your scene size; you get a flat painterly look without losing 3D math.
- **Multiple cameras + Switch.** Drop several Camera COMPs at different positions, plug their paths into a Render TOP that supports multiple cameras, then use Render Select TOP to retrieve specific images. Or Switch between cameras.
- **Stable orbit.** Parent the Camera under a Null COMP at the orbit center, then animate the Null's rotation. The Camera follows on a perfect arc.
- **Tracking shot.** Set Look At to the path of a moving Null COMP. The Camera retargets every frame.

## Light COMP

The wiki defines three light types on the Light COMP. Other lighting wraps separate COMPs (Ambient Light COMP, Environment Light COMP).

### Light Types

| Type              | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Point Light**   | "Radiates light equally in all directions"                                                                                      |
| **Cone Light**    | "A directional spotlight that uses cone angle, delta, and falloff to control the size and intensity"                            |
| **Distant Light** | "All light radiates from one direction vector. This can be used to simulate lights at a far-off distance, for example, the sun" |

### Light Parameters

| Parameter                   | Description                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Light Color**             | RGB hue                                                                                                                    |
| **Dimmer**                  | "Changes the intensity of the light without affecting its hue. Lights with Dimmer intensity below 0.001 are ignored."      |
| **Distance Attenuated**     | Toggle on for distance-based falloff (Point and Cone).                                                                     |
| **Attenuation Start / End** | Distance range over which the light fades.                                                                                 |
| **Attenuation Rolloff**     | Curve between start and end.                                                                                               |
| **Cone Angle**              | "Specifies the angle within which the light remains at full intensity"                                                     |
| **Cone Delta**              | "In degrees, represents the angle outside the cone angle through which the light intensity drops from its maximum to zero" |
| **Cone Rolloff**            | "A value between one and ten" controlling fade gradient.                                                                   |
| **Projector Map**           | TOP texture overlay (a "cookie"). Filter options: Nearest, Linear, Mipmap Linear; anisotropic supported.                   |

## Shadows

Set on the Shadows page of the Light COMP.

| Parameter                         | Description                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| **Shadow Type**                   | Off, Hard 2D Mapped, Soft 2D Mapped, or Custom                                      |
| **Shadow Resolution**             | Texture map resolution for the shadow buffer. Higher = sharper but more GPU memory. |
| **Polygon Offset**                | Z-fighting prevention via factor and unit values                                    |
| **Filter Samples / Search Steps** | Soft shadow quality controls (Soft type only)                                       |

Shadow cost scales hard. A 2048x2048 shadow map for one light is fine; four lights at 4096 each can dominate a frame budget. Use Hard 2D Mapped where you can; Soft 2D Mapped where you must.

## Environment Light

The Environment Light COMP is image-based lighting. Per the wiki: "This light, unlike the Light Component, has no particular position. It comes from outside all of the objects in the scene." Required for PBR MAT to look like anything other than a dim sphere.

| Parameter                  | Description                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| **Environment Map**        | "The Environment Map parameter uses a TOP texture to define an environment map for the material." |
| **Dimmer**                 | "Allows you to change the intensity of the light either as a static value or over time"           |
| **Use Pre-Filter Maps**    | Off, Automatic, or manual via a PreFilter Map TOP                                                 |
| **Environment Map Rotate** | X / Y / Z rotation of the env map                                                                 |

Per the wiki: "The Env Map is added to whatever the normal lighting will be, so to make an object purely reflective turn the Diffuse and Specular parameters to 0." Translation: pair an Environment Light with at least one regular Light COMP for Phong + IBL setups.

## Common Gotchas

- **Light at origin, geometry also at origin.** A Point Light inside the geometry illuminates the inside (and the outside not at all). Move the light a few units off.
- **Distant lights ignore position.** Translate parameters do nothing for a Distant Light; only Rotate matters. Rotate to choose the direction.
- **Shadows missing on a target geo.** Each Geo COMP has Light Influence settings on its Render page. If the target's Light Influence excludes this light, no shadow lands. Default is "all lights affect."
- **Near/Far too tight clips silently.** Z-fighting at the back, popping at the front, geometry vanishing at distance: usually a clipping plane issue. Default 0.1 / 1000 covers most cases; expand as needed.
- **PBR with no Environment Light is dim.** PBR shading expects an environment to bounce off; without one, only direct lights contribute and the look is flat. Drop an Environment Light, even a tiny grey one.

## Related Pages

- [[touchdesigner/03_Rendering_and_Output/Rendering Basics|Rendering Basics]]: the four-piece scene
- [[Render TOP]]: where the lights and camera are referenced by pattern
- [[MAT - Material Operators]]: shaders that consume the lighting (Phong vs PBR)

---

> [!tip]- 📚 Learning Path · Stage 4 - Rendering & 3D · step 22 of 44
> [[touchdesigner/03_Rendering_and_Output/Rendering Basics|(y-) ← Prev: Rendering Basics]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/03_Rendering_and_Output/Instancing|(y-) Next: Instancing →]]

---

[[touchdesigner/03_Rendering_and_Output/index|(y) Return to Rendering & Output]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
