---
title: "GPU Fluid Simulation with Feedback TOPs"
tags:
  - touchdesigner
  - td/recipes
  - fluid
  - simulation
  - feedback
  - gpu
  - recipes
  - fluids
date: 2026-03-16
---

This document details the implementation of a real-time GPU-accelerated fluid simulation system in TouchDesigner utilizing Feedback TOP operators. The approach adapts Jos Stam's stable fluids algorithm for execution entirely within TouchDesigner's nodal environment, leveraging GPU parallelism for computational efficiency.

> **Based on:** GPU Fluid Simulation techniques adapted from Jos Stam's "Real-Time Fluid Dynamics for Games" and TouchDesigner feedback loop best practices

## What You'll Build

This fluid simulation will:

- Run entirely on your GPU for buttery-smooth performance (optimized for M1 Pro)
- Simulate how fluids move and interact using velocity and density fields
- Include all the good stuff: forces to push the fluid around, vorticity confinement to keep those cool swirly details, and dissipation controls to prevent things from getting out of hand
- Respond to interactive inputs like mouse movements or audio signals
- Give you a foundation you can extend into fire, smoke, liquids, or whatever crazy fluid effect you're dreaming up

## 1. Field Setup

### 1.1 Resolution and Format

Fluid simulations require multiple fields. We'll use:

- **Velocity Field:** 2-channel TOP (u, v components) - 32-bit float
- **Density Field:** 1-channel TOP (smoke/dye concentration) - 32-bit float
- **Pressure Field:** 1-channel TOP (for projection step) - 32-bit float

### 1.2 Create the Fields

1. **Velocity Field (vel_field)**
   - Create `Constant TOP`
   - **Resolution:** 128×128 (good balance for M1 Pro)
   - **Color:** Black (0, 0) - represents zero velocity
   - **Pixel Format:** 32-bit float (RG) - two channels for u,v

2. **Density Field (dens_field)**
   - Create `Constant TOP`
   - **Resolution:** 128×128
   - **Color:** Black (0) - no density
   - **Pixel Format:** 32-bit float (R) - single channel

3. **Pressure Field (pressure_field)**
   - Create `Constant TOP`
   - **Resolution:** 128×128
   - **Color:** Black (0)
   - **Pixel Format:** 32-bit float (R)

4. **Divergence Field (div_field)** (temporary)
   - Create `Constant TOP`
   - **Resolution:** 128×128
   - **Color:** Black (0)
   - **Pixel Format:** 32-bit float (R)

Name all fields appropriately and place them in a container for organization.

## 2. Feedback Loop Structure

The fluid simulation uses two coupled feedback loops:

1. **Velocity Feedback Loop:** Updates velocity field each frame
2. **Density Feedback Loop:** Advects and displays fluid density

### 2.1 Velocity Feedback Loop

```
[vel_field]
   → [Add Forces]
   → [Velocity Advection]
   → [Vorticity Confinement]
   → [Pressure Projection]
   → [Dissipation]
   → [Feedback TOP]
   → (back to vel_field)
```

### 2.2 Density Feedback Loop

```
[dens_field]
   → [Add Density Sources]
   → [Density Advection]
   → [Dissipation]
   → [Feedback TOP]
   → (back to dens_field)
```

## 3. Velocity Update Step-by-Step

### 3.1 Add Forces

1. Create `Math TOP` (forces_math)
   - **Operation:** Add
   - **Input 1:** vel_field (current velocity)
   - **Input 2:** force_field (to be created)

2. **Create Force Sources:**
   - **Mouse Force:** Use `Mouse In CHOP` → Math CHOPs → Constant TOP
   - **Radial Force:** Noise TOP → Math TOP (for turbulence)
   - **Buoyancy Force:** dens*field * buoyancy*strength * up_vector

### 3.2 Velocity Advection

Advection moves the velocity field through itself (self-advection).

1. Create `SLTOP` (SLTOP is ideal for fluid advection)
   - **Operation:** Lookup
   - **Input 1:** vel_field (velocity to advect)
   - **Input 2:** vel_field (velocity field as lookup coordinates)
   - **Note:** Requires velocity to be in texture coordinate space (0-1)

2. **Prepare Coordinates:**
   - Current velocity needs to be scaled and offset to become texture lookup coordinates
   - Create Math TOP chain:
     - vel_field → Multiply by dt (timestep) → Add 0.5 → Clamp 0-1

### 3.3 Vorticity Confinement

Preserves small-scale details that numerical dissipation would lose.

1. Calculate vorticity (curl of velocity):
   - `vorticity = ∂v/∂x - ∂u/∂y`
   - Use `Sobel TOP` or custom GLSL for derivatives

2. Calculate vorticity confinement force:
   - `N = ∇|ω|` (normalized gradient of vorticity magnitude)
   - `F_vc = ε * (N × ω)` where ε is confinement strength

3. Add this force to velocity field

### 3.4 Pressure Projection

Ensures fluid remains incompressible (∇·v = 0).

1. Calculate divergence:
   - `div = ∂u/∂x + ∂v/∂y`
   - Store in div_field

2. Solve Poisson equation: ∇²p = div
   - Use Jacobi iteration (simple but effective for real-time)
   - Multiple passes of: p_new = (p_left + p_right + p_top + p_bottom + div) / 4

3. Subtract pressure gradient:
   - `u -= ∂p/∂x * dt`
   - `v -= ∂p/∂y * dt`

### 3.5 Dissipation

1. Create `Level TOP`
   - **Multiply:** 0.99 (per frame velocity dissipation)
   - **Add:** 0 (no bias)

## 4. Density Update Step-by-Step

### 4.1 Add Density Sources

1. Create `Math TOP` (dens_math)
   - **Operation:** Add
   - **Input 1:** dens_field
   - **Input 2:** density_sources (mouse dye, emitters, etc.)

### 4.2 Density Advection

Similar to velocity advection but advecting density through velocity field.

1. Create `SLTOP`
   - **Operation:** Lookup
   - **Input 1:** dens_field (density to advect)
   - **Input 2:** vel_field_ADV (velocity prepared for lookup, same as in velocity step)

### 4.3 Density Dissipation

1. Create `Level TOP`
   - **Multiply:** 0.995 (density dissipates slower than velocity)
   - **Add:** 0

## 5. Rendering the Fluid

### 5.1 Basic Density Visualization

1. Create `Level TOP` (for brightness/contrast)
   - **Brightness 1:** 1.5-3.0 (make fluid visible)
   - **Gamma:** 0.7-0.9 (enhance dark areas)

2. Convert to RGB for color:
   - `Constant TOP` (blue tint) × dens_field (as alpha)
   - Or use `HSV Adjust TOP` for color mapping

### 5.2 Velocity Field Visualization (Debug)

1. **Speed Visualization:**
   - `Math TOP`: sqrt(u*u + v*v) → Level TOP for brightness

2. **Direction Visualization (HSV):**
   - Hue: atan2(v, u) mapped to 0-1
   - Saturation Multiplier: constant (e.g., 0.8)
   - Value: velocity magnitude normalized

### 5.3 Smoke Rendering (Advanced)

For volumetric smoke/fire effects:

1. Use density as density field in ray marcher
2. Or use multiple density layers with different dissipation rates
3. Add temperature field for buoyancy and color

## 6. Performance Optimization for M1 Pro

### 6.1 Resolution Guidelines

- **Minimum:** 64×64 (very fast, low detail)
- **Recommended:** 128×128 (good balance)
- **High Quality:** 256×256 (still real-time on M1 Pro, ~30-45fps)
- **Maximum:** 512×512 (may drop frames, use for offline)

### 6.2 Iteration Counts

- **Pressure Solver:** 4-8 iterations (more = more incompressible but slower)
- **Advection Steps:** 1-2 (semi-Lagrangian is stable with large timesteps)
- **Vorticity Confinement:** 1 pass usually sufficient

### 6.3 TOP Format Optimization

- Always use 32-bit float for fluid fields (precision matters)
- Consider using RG16F for velocity if precision allows (2x memory savings)
- Use R8 for mask/control fields when possible

### 6.4 Geometry vs TOP Simulation

- This TOP-based approach is faster than SOP/POP for fluid dynamics
- Avoid read-back to CPU (keeps everything on GPU)
- Use SLTOP for advection (highly optimized for this use case)

## 7. Interactive Controls

### 7.1 Mouse Interaction

1. Create `Mouse In CHOP`
   - **Normalize:** On (0-1 range)
   - **Invert Y:** On (TouchDesigner origin)

2. **Position to Force:**
   - Mouse position → Math TOP (create radial force field)
   - Mouse velocity → Math TOP (create directional force)

### 7.2 Audio Reactivity

1. `Audio Device In CHOP` → `Audio Spectrum CHOP` → `Math CHOP` (bass energy)
2. Map to:
   - Global force magnitude
   - Vorticity confinement strength
   - Color hue shift
   - Radial pulse from center

### 7.3 GUI Controls

Create a control panel with:

- **Viscosity:** Velocity dissipation (0.90-0.999)
- **Diffusion:** Density dissipation (0.95-0.99)
- **Vorticity Confinement:** 0.0-0.5
- **Force Scale:** 0.0-5.0
- **Timestep:** 0.1-0.5 (higher = faster but less stable)

## 8. Variations and Extensions

### 8.1 Flame/Fire Simulation

1. Add **temperature field** (similar to density)
2. **Buoyancy:** temperature \* gravity_vector
3. **Cooling:** temperature dissipation over time
4. **Color Mapping:** black → red → yellow → white based on temperature
5. **Upward Force:** stronger buoyancy for hot regions

### 8.2 Liquid Simulation (Water)

1. **Surface Tracking:** Add height field or use density threshold
2. **Surface Tension:** Curvature-based forces
3. **Waves:** Implement wave equations on surface
4. **Foam:** Particle system where velocity divergence is high

### 8.3 Multiple Fluids

1. **Color Fields:** Advect multiple density fields (RGB)
2. **Different Properties:** Each color has different viscosity/diffusion
3. **Reactions:** When colors mix, create third color or heat

### 8.4 Obstacles and Boundaries

1. **Solid Objects:** Mask TOP where velocity = 0
2. **Flow Obstacles:** Project velocity to be tangent to surfaces
3. **Inflow/Outflow:** Set fixed velocity/pressure regions
4. **Walls:** Velocity reflection or zero-normal condition

## 9. Parameter Reference

| Parameter             | Range      | Purpose                 | Performance Impact      |
| --------------------- | ---------- | ----------------------- | ----------------------- |
| Resolution            | 64²-512²   | Simulation detail       | High (quadratic)        |
| Velocity Dissipation  | 0.90-0.999 | Fluid "thickness"       | Low                     |
| Density Dissipation   | 0.95-0.99  | Smoke persistence       | Low                     |
| Vorticity Confinement | 0.0-0.5    | Detail preservation     | Medium                  |
| Pressure Iterations   | 2-16       | Incompressibility       | High                    |
| Force Scale           | 0.0-10.0   | External force strength | Low                     |
| Timestep (dt)         | 0.05-0.5   | Simulation speed        | Low (affects stability) |
| Buoyancy Strength     | 0.0-5.0    | Hot fluid rise          | Low                     |
| Cooling Rate          | 0.0-0.1    | Temperature decay       | Low                     |

## 10. Performance Tips for M1 Pro

1. **Start Low Resolution:** Begin at 64×64, increase only if needed
2. **Monitor GPU Usage:** Use Activity Monitor → GPU History
3. **Reduce Iterations First:** If slow, lower pressure solver iterations
4. **Use External Forces Sparingly:** Complex force fields cost more
5. **Disable During Editing:** Pause simulation when not needed
6. **Consider Hybrid Approach:** Simulate at 128×128, upscale to output res with blur

## 11. Related Techniques

- [[Particle System with POPs|(y-) Particle System with POPs]] - CPU/GPU hybrid alternative
- [[Dreamscape Particle Cloud|(y-) Dreamscape Particle Cloud]] - GPU particle fluids
- [[GLSL Feedback Effect|(y-) GLSL Feedback Effect]] - simpler feedback applications
- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] - for interactive fluid control

---

## Parameter Tuning & Behavior

| Parameter                        | Behavior                                                                                       |
| :------------------------------- | :--------------------------------------------------------------------------------------------- |
| **Viscosity (Vel Dissipation)**  | Higher (0.999) = fluid flows like water; Lower (0.90) = fluid is thick like honey/oil.         |
| **Diffusion (Dens Dissipation)** | Higher = smoke lingers for a long time; Lower = smoke vanishes almost instantly.               |
| **Pressure Iterations**          | Higher = more realistic, incompressible fluid; Lower = fluid may "compress" or look "springy." |
| **Vorticity Confinement**        | Higher = more small-scale swirls and "turbulent" detail; Lower = smooth, laminar flow.         |
| **Timestep (dt)**                | Higher = faster simulation speed; Lower = more stable and accurate physics.                    |

## Network Architecture

Fluid simulations are complex "coupled" feedback loops. Here is the high-level data flow for the two main fields:

```text
[ VELOCITY LOOP ]                [ DENSITY LOOP ]
Constant (RG32) ──┐              Constant (R32) ──┐
                  │ (Input 0)                     │ (Input 0)
                  ▼                               ▼
[ Add Forces ] ──▶ [ Math TOP ]    [ Add Sources ] ──▶ [ Math TOP ]
       │                                  │
       ▼                                  ▼
[ Advection ] ──▶ [ SLTOP ]        [ Advection ] ──▶ [ SLTOP ]
       │                                  │ (Velocity Drives Advection)
       ▼                                  ▼
[ Projection ] ──▶ [ Jacobi Loops ] ─▶ [ Dissipation ] ──▶ [ Level TOP ]
       │                                  │
       ▼                                  ▼
[ Feedback TOP ] ◄───────────────── [ Feedback TOP ] ◄─────────┘
       │                                  │
       ▼                                  ▼
[ vel_field ] ────────────────────▶ [ dens_field ] ──▶ [ OUT ]
```

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
