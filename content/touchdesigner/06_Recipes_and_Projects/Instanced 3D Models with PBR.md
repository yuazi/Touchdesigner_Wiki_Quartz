---
title: "Instanced 3D Models with PBR Materials"
tags:
  - touchdesigner
  - td/recipes
  - instancing
  - pbr
  - 3d
  - models
  - recipes
  - rendering
date: 2026-03-16
---

This document details the implementation of high-performance instanced rendering in TouchDesigner using Geometry COMP instances in conjunction with Physically Based Rendering (PBR) materials. The system enables efficient visualization of large numbers of 3D objects while maintaining physically accurate light interaction and material properties.

> **Based on:** Combining TouchDesigner's official instancing tutorials, PBR workflow guides, and community best practices

## What You'll Build

We're putting together a system that lets you:

- Render tons of 3D models efficiently using Geometry COMP instancing (think forests, cities, particle systems made of actual geometry)
- Use PBR materials for lighting that behaves like it does in the real world
- Give each instance its own personality with variations in position, rotation, scale, and even color
- Keep everything running smoothly on Apple Silicon (we've got specific optimizations for M1 Pro)
- Handle large instance counts without choking your GPU

## 1. Model Preparation

### 1.1 Choosing and Preparing Models

For best performance with instancing:

- Use low-poly models (under 1000 vertices ideal)
- Ensure models are centered at origin
- Apply consistent scale (typically 1 unit = 1 meter)
- UV unwrap properly for texturing

### 1.2 Model Formats

TouchDesigner supports:

- **FBX** (.fbx) - Best for animations and complex hierarchies
- **OBJ** (.obj) - Simple static models
- **GLTF/GLB** (.gltf, .glb) - Modern, efficient format
- **3DS** (.3ds) - Legacy format
- **DAE** (.dae) - Collada format

For instancing, static models (OBJ, GLTF) work best as they avoid animation overhead.

### 1.3 Importing Models

1. Place your model files in a `/models/` folder next to your `.toe`
2. In TouchDesigner, use `File → Import...` or drag directly into network
3. For FBX/OBJ/GLTF: Use `Geo COMP` → **File** parameter to point to model
4. The Geo COMP will automatically create a SOP network containing the model

## 2. Setting Up Instancing

### 2.1 Base Geometry COMP

1. Create a `Geo COMP` named `geo_instances`
2. Delete the default torus
3. Import your model (or create primitive SOP like Box/Sphere)
4. Ensure model is scaled appropriately (typically 0.01-0.1 size for instancing fields)

### 2.2 PBR Material Setup

1. Create a `PBR MAT` (recommended over Phong for realism)
   - **Base Color:** Texture or solid color
   - **Metalness:** 0.0-1.0 (0 for non-metal, 1 for metal)
   - **Roughness:** 0.0-1.0 (0 for smooth/mirror, 1 for rough)
   - **Normal Map:** Optional for surface detail
   - **Ambient Occlusion:** Optional for contact shadows
   - **Emissive:** Optional for self-illumination

2. Assign the PBR MAT to the Geo COMP's material slot

### 2.3 Enabling Instancing

1. On the Geo COMP, go to the **Instance** tab
2. Set **Instancing** → `On`
3. Set **Instance CHOP/DAT** → We'll create this next
4. **Instance Type:** `CHOP` (for dynamic control) or `DAT` (for static positions)

## 3. Generating Instance Data

### 3.1 Using CHOPs for Dynamic Instances

Best for audio-reactive or animated instances:

#### Position Generation

1. Create a `Noise TOP` (for spatial distribution)
   - **Resolution:** 64×64 (4096 instances - good start)
   - **Type:** Sparse or Hermite
   - **Period:** 0.5
   - **Amplitude:** 1.0

2. Convert to CHOP:
   - `Noise TOP` → `TOP to CHOP` → `Rename CHOP` (r→tx, g→ty, b→tz)
   - `Math CHOP` → Multiply by 3.0 (spread to -1.5 to 1.5 range)

#### Rotation Generation

1. Create another `Noise TOP` (different seed)
   - Same resolution as position noise
2. `TOP to CHOP` → `Rename CHOP` (r→rx, g→ry, b→rz)
3. `Math CHOP` → Multiply by 6.28 (0-2π radians)

#### Scale Generation

1. Create `Noise TOP` → `TOP to CHOP` → `Rename CHOP` (r→xs, g→ys, b→zs)
2. `Math CHOP` → Multiply by 0.5, Add 0.5 (range 0.5-1.5)
3. Optional: Link all scales together for uniform scaling

#### Color Per Instance (Optional)

1. Create `Noise TOP` → `TOP to CHOP` → `Rename CHOP` (r→cr, g→cg, b→cb)
2. These will drive instance color via MAT parameters

### 3.2 Merging All Channels

1. Create `Merge CHOP`
2. Connect all position, rotation, scale, and color channels
3. Add `Null CHOP` at end (name it `NULL_INSTANCES`)

### 3.3 Mapping Channels to Instance Parameters

On Geo COMP Instance page:

- **Translate X/Y/Z:** Map to tx, ty, tz channels
- **Rotate X/Y/Z:** Map to rx, ry, rz channels (in radians)
- **Scale X/Y/Z:** Map to xs, ys, zs channels
- For uniform scale: Map one channel to all three scale parameters

### 3.4 Instance Color (Advanced)

To drive per-instance color:

1. On Geo COMP Instance page:
   - Enable **Instance Color** → `On`
   - **Instance Color R/G/B:** Map to cr, cg, cb channels
2. In PBR MAT:
   - Enable **Base Color From Instance** → `On`
   - Base Color will be multiplied by instance color

## 4. Audio Reactivity Example

Make instances respond to audio:

### 4.1 Audio Analysis

1. `Audio Device In CHOP` → `Audio Spectrum CHOP` (64 bands)
2. `Lag CHOP` (0.02s smoothing)
3. `Math CHOP` (remap 0-1 to 0-2 for displacement)
4. `Null CHOP` (name it `NULL_AUDIO_DRIVE`)

### 4.2 Driving Instance Parameters

#### Option A: Displace Positions

1. Create `Math CHOP`:
   - Input: `NULL_INSTANCES` tx channel
   - Operation: Add
   - Second input: `NULL_AUDIO_DRIVE` (with Math CHOP to scale)
2. Output to new tx channel for instances

#### Option B: Scale Pulse

1. Create `Math CHOP`:
   - Input: `NULL_INSTANCES` xs channel
   - Operation: Multiply
   - Second input: `NULL_AUDIO_DRIVE` (remapped to 0.5-2.0 pulse)
2. Output controls instance scale

#### Option C: Color Shift

1. Map audio bass to hue shift:
   - `NULL_AUDIO_DRIVE` → `HSV Adjust TOP` (after rendering)
   - Or drive PBR MAT hue via instance color

## 5. Performance Optimization for M1 Pro

### 5.1 Instance Count Guidelines

- **Lightweight Models** (<100 verts): 50,000+ instances possible
- **Medium Models** (100-500 verts): 10,000-30,000 instances
- **Heavy Models** (>500 verts): 1,000-5,000 instances
- **Test:** Start low, increase while monitoring FPS (target 60fps)

### 5.2 Model Optimization

- **Reduce Polygon Count:** Use decimation tools (Blender, Maya)
- **Use LOD:** Create multiple versions, switch based on distance (advanced)
- **Instancing-Friendly:** Avoid models with heavy deformation per instance

### 5.3 Material Optimization

- **Texture Atlases:** Combine multiple textures into one atlas
- **Mipmapping:** Enable on texture TOPs for distance filtering
- **Texture Compression:** Use .png or .txr (TouchDesigner optimized)
- **Avoid Expensive Features:** Subsurface scattering, clear coat when not needed

### 5.4 Render Settings

- **Shadows:** Disable or use low-resolution shadow maps
- **Anti-Aliasing:** Use MSAA 2x instead of 4x for better performance
- **Render Target:** Consider rendering to lower res TOP then upscaling
- **Culling:** Enable back-face culling in Geo COMP (usually on by default)

### 5.5 Monitoring Performance

1. **Dialogs → Performance Monitor**
   - Watch GPU usage and frame times
   - Look for bottlenecks in TOP/CHOP/GLSL
2. **Geometry COMP Stats:**
   - SOP cooking time (should be minimal for instanced geo)
   - Instance count displayed in Geo COMP info
3. **Reduce Resolution First:** If slow, lower instance count before simplifying models

## 6. Variations and Extensions

### 6.1 Procedural Model Generation

Instead of importing models:

- Use `Box SOP`, `Sphere SOP`, `Tube SOP` as base geometry
- Modify with `Transform SOP`, `Twist SOP`, `Bend SOP` per instance
- Drive modifications from instance channels

### 6.2 Instancing from TOPs

For texture-driven placement:

1. Create `Noise TOP` or `Movie File In TOP`
2. On Geo COMP Instance page:
   - **Instance OP:** Point to your TOP
   - **Translate X/Y/Z:** Map to R,G,B channels
   - **Instance Type:** `TOP` (instead of CHOP)

### 6.3 Hybrid Instancing

Combine techniques:

- Base positions from Noise TOP (static)
- Animated offsets from CHOPs (dynamic)
- Audio-driven scaling/color

### 6.4 Instancing with Particles

Drive instances from POP system:

1. `Particle System with POPs` → `POP SOP`
2. `POP SOP` → `SOP to CHOP` (extract px,py,pz,etc)
3. Use CHOP as instance source for Geo COMP
4. Renders actual geometry at each particle position

### 6.5 GPU Instancing Limits

TouchDesigner instancing limits:

- **Maximum Instances:** ~1 million (practical limit much lower)
- **Vertex Buffer Size:** Depends on GPU memory
- **Uniform Limits:** Instance attributes via CHOP/DAT avoid uniform limits
- **M1 Pro Specific:** Unified memory helps, but still monitor GPU usage

## 7. Parameter Reference

| Parameter          | Location               | Typical Range     | Purpose                |
| ------------------ | ---------------------- | ----------------- | ---------------------- |
| Instance Count     | Noise TOP Resolution   | 32²-256² (1k-65k) | Number of instances    |
| Model Complexity   | Model verts/tris       | <500 verts ideal  | Performance vs detail  |
| Position Spread    | Math CHOP Multiply     | 1.0-5.0           | Spatial distribution   |
| Rotation Range     | Math CHOP Multiply     | 0-6.28 (0-2π)     | Rotation freedom       |
| Scale Range        | Math CHOP Multiply/Add | 0.2-3.0           | Size variation         |
| Audio Response     | Math CHOP Scale        | 0.1-2.0           | Sensitivity to audio   |
| Texture Resolution | Texture TOPs           | 256-1024 px       | Detail vs memory       |
| Shadow Quality     | Light COMP             | Low/Med/High      | Performance vs quality |
| MSAA               | Render TOP             | None/2x/4x        | Anti-aliasing quality  |

## 8. Performance Tips for M1 Pro

1. **Start Simple:** Begin with Box SOP instances, then replace with models
2. **Use External Models:** Keep `.obj`/`.fbx` files external, don't embed
3. **Optimize Textures:** Use power-of-two dimensions (256, 512, 1024)
4. **Disable Viewers:** Close geometry viewers when not editing
5. **Use Perform Mode:** Test in Perform mode (F1) for true performance
6. **Monitor Memory:** Activity Monitor → Memory pressure
7. **Consider LOD:** Distant instances could use simpler models (advanced)
8. **Batch Similar Models:** If multiple model types, separate Geo COMPs

## 9. Related Techniques

- [[5 Ways To Make Particles|(y-) 5 Ways To Make Particles]] — Alternative for point-based rendering
- [[Particle System with POPs|(y-) Particle System with POPs]] — GPU particle systems
- [[GLSL Feedback Effect|(y-) GLSL Feedback Effect]] — Adding trails to instances
- [[Audio Reactive Geometry|(y-) Audio Reactive Geometry]] — Simpler audio-reactive instancing
- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] — Interactive instance control
- [[Real-time Audio Visualizer|(y-) Real-time Audio Visualizer]] — Audio-driven visuals

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
