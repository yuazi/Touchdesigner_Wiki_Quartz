---
title: "Recipe: Real-time Motion History Images and Optical Flow"
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

This recipe creates real-time motion analysis using Motion History Images (MHI) and Optical Flow techniques in TouchDesigner. Perfect for interactive installations where you want to detect and visualize movement in a video stream. Optimized for Apple M1 Pro performance.

> **Based on:** Combining computer vision techniques (MHI from OpenCV, Optical Flow from Farnebäck) with TouchDesigner's real-time processing capabilities

## Overview

Build a motion analysis system that:

- Captures live video from webcam or video file
- Computes Motion History Images to show movement over time
- Calculates Optical Flow to detect direction and speed of motion
- Visualizes both motion representations with color coding
- Includes interactive thresholds and sensitivity controls
- Optimized for real-time performance on Apple Silicon

## 1. Video Input Setup

### 1.1 Webcam Input

1. Create a `Video Device In TOP`
   - **Device:** Select your webcam (built-in or external)
   - **Resolution:** 640×480 (good balance for motion analysis)
   - **Frame Rate:** 30 FPS (sufficient for most motion)
   - **Pixel Format:** 8-bit fixed (RGBA) - faster than float for CV tasks

### 1.2 Video File Input (Alternative)

1. Create a `Movie File In TOP`
   - **File:** Point to your video file
   - **Play Mode:** Loop (if desired)
   - **Preload Frames:** 2-3 (reduces stutter)

### 1.3 Preprocessing

Regardless of source:

1. Connect video TOP → `Level TOP`
   - **Black Level:** 0.05 (lift shadows to reduce noise)
   - **White Level:** 0.95 (compress highlights)
2. Connect to `Null TOP` (name it `NULL_VIDEO_IN`)

## 2. Motion History Images (MHI)

MHI creates a "heat map" showing where motion has occurred recently, with newer motion brighter.

### 2.1 Frame Difference

1. Create `Subtract TOP`
   - **Input 1:** `NULL_VIDEO_IN` (current frame)
   - **Input 2:** Create a `Delay TOP` (1 frame delay) → `NULL_VIDEO_IN` (previous frame)
   - **Operation:** Absolute Difference (|current - previous|)

2. Connect to `Grayscale TOP` (to get single channel intensity)

### 2.2 Motion Mask

1. Create `Level TOP` (threshold the difference)
   - **Black Level:** 0.02 (adjust for sensitivity)
   - **White Level:** 1.0
   - **Pass Through:** Off (so we get 0-1 values)

2. Connect to `Null TOP` (name it `NULL_MOTION_MASK`)

### 2.3 Motion History Accumulation

1. Create `Feedback TOP`
   - **Target TOP:** Itself (null_top at end of chain)
   - **Initial Value:** Black (0)

2. Inside feedback network:
   - `NULL_MOTION_MASK` → `Math TOP` (Multiply by decay factor, e.g., 0.95)
   - Result → `Maximum TOP` (compares with new motion mask)
   - Output → `Null TOP` (this is the MHI)

### 2.4 MHI Visualization

1. Connect MHI output → `HSV Adjust TOP`
   - **Hue:** 0.0 (red for motion)
   - **Saturation:** 1.0
   - **Value:** MHI brightness (controls intensity)
   - **Alpha:** 1.0

2. Or use `Lookup TOP` with a color gradient ramp for more sophisticated coloring

## 3. Optical Flow (Farnebäck Algorithm)

Optical Flow calculates the motion vector (direction and speed) for each pixel.

### 3.1 Prepare Grayscale Video

1. Connect `NULL_VIDEO_IN` → `Grayscale TOP` (name it `NULL_GRAY_IN`)

### 3.2 Calculate Optical Flow

TouchDesigner doesn't have a built-in Optical Flow TOP, so we use a GLSL TOP implementing the Farnebäck algorithm:

1. Create `GLSL TOP`
   - **Pixel Format:** 32-bit float (RG) - two channels for flow vectors (dx, dy)

2. **GLSL Shader Code:**

   ```glsl
   uniform sampler2D sTD2DInputs[2]; // [0] = current gray, [1] = previous gray
   uniform vec2 uTDOutputInfo;       // texture resolution (width, height)

   // Farnebäck parameters (expose as uniforms)
   uniform float uPyrScale;   // 0.5
   uniform int uLevels;       // 3
   uniform int uWinsize;      // 15
   uniform int uIterations;   // 3
   uniform int uPolyN;        // 5
   uniform float uPolySigma;  // 1.1
   uniform float uFlags;      // 0 (OPTFLOW_FARNEBACK_GAUSSIAN)

   out vec2 fragColor;

   void main() {
       // Note: Full Farnebäck implementation is complex and lengthy
       // This is a simplified placeholder - in practice, you would
       // implement the full algorithm or use an external library

       // For demonstration, we'll use a simple block matching approach
       ivec2 texSize = ivec2(uTDOutputInfo);
       ivec2 coord = ivec2(gl_FragCoord.xy);

       // Sample current and previous frame
       vec4 curr = texture(sTD2DInputs[0], gl_FragCoord.xy / texSize);
       vec4 prev = texture(sTD2DInputs[1], gl_FragCoord.xy / texSize);

       // Simple difference as flow (NOT real optical flow!)
       vec2 flow = (curr.rg - prev.rg) * 10.0; // Scale for visibility

       fragColor = flow;
   }
   ```

   > **Note:** For production use, consider:
   >
   > - Implementing the full Farnebäck algorithm in GLSL (long but possible)
   > - Using an external Python OpenCV Script TOP (see Part 4)
   > - Using the OpenCV TOP if available in your TouchDesigner build

3. **Setup:**
   - **Input 0:** `NULL_GRAY_IN` (current frame)
   - **Input 1:** `Delay TOP` (1 frame) → `NULL_GRAY_IN` (previous frame)
   - **Custom Parameters:** Add the uniforms above with sensible defaults
   - **Output:** Two-channel TOP (RG) representing flow vectors

### 3.3 Optical Flow Visualization

Convert flow vectors to HSV color representation:

1. **HUE:** Direction (angle of flow vector)
2. **SATURATION:** Magnitude (speed) - clamped
3. **VALUE:** Constant brightness

4. Create `Math TOP` to calculate magnitude and angle:
   - **Input:** Optical Flow TOP (dx, dy channels)
   - **Operation:** Custom (we'll use multiple Math TOPs or a GLSL TOP)
   - **Alternative:** Use a single GLSL TOP for conversion:

     ```glsl
     uniform sampler2D sTD2DInputs[1]; // Flow vector TOP (dx, dy)
     uniform vec2 uTDOutputInfo;

     out vec3 fragColor; // RGB but we'll use as HSV

     void main() {
         vec2 flow = texture(sTD2DInputs[0], gl_FragCoord.xy / uTDOutputInfo).rg;
         float angle = atan(flow.y, flow.x); // -π to π
         float magnitude = length(flow);

         // Convert angle to 0-1 range for hue
         float hue = (angle + 3.14159) / (2.0 * 3.14159);
         float saturation = clamp(magnitude * 5.0, 0.0, 1.0); // Scale magnitude
         float value = 0.8; // Constant brightness

         fragColor = vec3(hue, saturation, value);
     }
     ```
5. Connect to `HSV Adjust TOP` (set mode to HSV input)
6. Connect to `Null TOP` (name it `NULL_OPTICAL_FLOW_VIS`)

## 4. Advanced: OpenCV Script TOP (Alternative Optical Flow)

For better performance and accuracy, use OpenCV via Python:

### 4.1 Setup OpenCV

1. Ensure OpenCV is installed in your Python environment:
   ```bash
   pip install opencv-python
   ```
2. In TouchDesigner, Edit → Preferences → DAT → Python → [x] Use External Python
   - Point to your Python installation with OpenCV

### 4.2 Create Optical Flow Script TOP

1. Create `Script TOP`
2. Set **Script Language** to Python
3. In the DAT, paste:

   ```python
   import numpy as np
   import cv2

   def onSetupParameters(scriptOp):
       scriptOp.appendCustomPage('OpenCV Parameters')
       p = scriptOp.appendFloat('Pyrscale', label='Pyr Scale')
       p.default = 0.5
       p.min = 0.1
       p.max = 0.9

       p = scriptOp.appendInt('Levels', label='Levels')
       p.default = 3
       p.min = 1
       p.max = 10

       p = scriptOp.appendInt('Winsize', label='Win Size')
       p.default = 15
       p.min = 5
       p.max = 31

       p = scriptOp.appendInt('Iterations', label='Iterations')
       p.default = 3
       p.min = 1
       p.max = 10

       p = scriptOp.appendInt('PolyN', label='Poly N')
       p.default = 5
       p.min = 5
       p.max = 10

       p = scriptOp.appendFloat('PolySigma', label='Poly Sigma')
       p.default = 1.1
       p.min = 0.1
       p.max = 2.0

       p = scriptOp.appendInt('Flags', label='Flags')
       p.default = 0
       p.menuNames = ['Gaussian', 'NotUseInitialFlow']
       p.menuLabels = ['0', '4']

   def onCook(scriptOp):
       # Get inputs
       curr = scriptOp.inputs[0].numpyArray()[:,:,:3]  # RGB to grayscale later
       prev = scriptOp.inputs[1].numpyArray()[:,:,:3]

       # Convert to grayscale
       if len(curr.shape) == 3:
           curr_gray = cv2.cvtColor(curr, cv2.COLOR_RGB2GRAY)
           prev_gray = cv2.cvtColor(prev, cv2.COLOR_RGB2GRAY)
       else:
           curr_gray = curr
           prev_gray = prev

       # Calculate optical flow
       flow = cv2.calcOpticalFlowFarneback(
           prev_gray, curr_gray, None,
           scriptOp.par.Pyrscale,
           scriptOp.par.Levels,
           scriptOp.par.Winsize,
           scriptOp.par.Iterations,
           scriptOp.par.PolyN,
           scriptOp.par.PolySigma,
           scriptOp.par.Flags
       )

       # Output as two-channel TOP (dx, dy)
       scriptOp.copyNumpyArray(flow)
   ```

4. **Inputs:**
   - Input 0: `NULL_GRAY_IN` (current frame)
   - Input 1: `Delay TOP` (1 frame) → `NULL_GRAY_IN` (previous frame)
5. **Output:** Two-channel TOP (RG) - same as GLSL version

## 5. Combining MHI and Optical Flow

Create a unified visualization:

### 5.1 Side-by-Side Display

1. Create `Container COMP`
2. Layout two viewers:
   - Left: MHI visualization (`NULL_MHI_VIS`)
   - Right: Optical Flow visualization (`NULL_OPTICAL_FLOW_VIS`)
3. Add labels using `Text TOP`

### 5.2 Overlay Visualization

1. Create `Blend TOP`
   - **Input 0:** `NULL_VIDEO_IN` (original video)
   - **Input 1:** MHI visualization (scaled to 0.5 opacity)
   - **Operation:** Add or Screen
2. Connect Optical Flow visualization to another blend layer for combined view

### 5.3 Motion-triggered Effects

Use motion data to drive visual effects:

1. **From MHI:**
   - `NULL_MHI` → `Analyze CHOP` (Average or Maximum)
   - CHOP value controls:
     - Background color intensity
     - Particle emitter rate
     - Geometry deformation amount
2. **From Optical Flow:**
   - Calculate average motion vector:
     - `NULL_OPTICAL_FLOW` → `Blur TOP` (to reduce noise)
     - `Analyze CHOP` (Average of R and G channels separately)
   - Use motion vector to:
     - Push/pop geometry in direction of flow
     - Rotate objects based on flow curl
     - Displace textures according to flow

## 6. Performance Optimization for M1 Pro

### 6.1 Resolution Guidelines

- **Input Video:** 320×240 or 640×480 (higher = more accurate but slower)
- **Processing:** Perform motion analysis at input resolution
- **Display:** Upscale to output resolution with `Resize TOP` (use Nearest or Bilinear)
- **Maximum:** 1280×720 for simple motion analysis on M1 Pro

### 6.2 Optimization Techniques

1. **Region of Interest (ROI):**
   - Crop video to area of interest before processing
   - Use `Crop TOP` to focus on relevant area
2. **Frame Skipping:**
   - Use `Select TOP` to process every 2nd or 3rd frame
   - Interpolate results for smooth visualization
3. **Downsample for Processing:**
   - Resize input to smaller resolution for CV tasks
   - Upscale flow/MHI results for display
4. **Efficient Operators:**
   - Use `Subtract TOP` instead of GLSL for frame diff when possible
   - `Level TOP` for thresholding is faster than `Threshold TOP`
   - `Feedback TOP` with simple math is efficient for MHI

### 6.3 Monitoring

- Use Dialogs → Performance Monitor
- Target: <16ms per frame for 60fps
- Bottlenecks often in: video decode, Python scripts, large resolution TOPs

## 7. Interactive Controls

Create a control panel with:

- **Motion Sensitivity:** Threshold for motion mask (0.01-0.1)
- **MHI Decay:** How fast history fades (0.90-0.99)
- **Flow Sensitivity:** Scale for flow visualization (1.0-10.0)
- **Blur Amount:** Pre-blur to reduce noise (0-5px)
- **Processing Resolution:** Dropdown (160×120, 320×240, 640×480)
- **Algorithm Select:** MHI only, Flow only, Both

## 8. Variations and Extensions

### 8.1 Background Subtraction

Replace simple frame difference with:

1. `NULL_VIDEO_IN` → `Background TOP` (if available) or
2. Implement running average:
   - `Feedback TOP` with: `new_frame * 0.01 + background * 0.99`
   - Then subtract current frame from background

### 8.2 Motion History Silhouettes

1. Threshold MHI to binary mask
2. Use as alpha for cutting out moving objects
3. Composite over different backgrounds

### 8.3 Optical Flow Particles

1. Sample flow vectors at sparse points
2. Create particles that move according to local flow
3. Color particles by flow magnitude or direction

### 8.4 Directional Motion Energy Images (MEI)

1. Similar to MHI but accumulates motion energy in direction of flow
2. Requires splitting flow into horizontal/vertical components

### 8.5 Multi-scale Analysis

1. Process video at multiple resolutions (pyramid)
2. Combine flow vectors from different scales
3. Better for detecting both small and large motions

## 9. Parameter Reference

| Parameter        | Location               | Typical Range      | Purpose                 |
| ---------------- | ---------------------- | ------------------ | ----------------------- |
| Input Resolution | Video Device In TOP    | 160×120-640×480    | Processing vs accuracy  |
| Motion Threshold | Level TOP (after diff) | 0.01-0.08          | Sensitivity to movement |
| MHI Decay        | Math TOP (in feedback) | 0.90-0.99          | History persistence     |
| Flow Scale       | Math TOP (viz)         | 1.0-5.0            | Flow vector scaling     |
| Blur Size        | Blur TOP (pre-process) | 0-4px              | Noise reduction         |
| History Duration | Feedback setup         | Implicit via decay | How long MHI remembers  |
| Pyr Scale        | OpenCV Script TOP      | 0.5                | Pyramid scale factor    |
| Levels           | OpenCV Script TOP      | 3-4                | Pyramid levels          |
| Win Size         | OpenCV Script TOP      | 13-23              | Window size             |
| Iterations       | OpenCV Script TOP      | 3-5                | Iterations per level    |
| Poly N           | OpenCV Script TOP      | 5                  | Neighborhood size       |
| Poly Sigma       | OpenCV Script TOP      | 1.1                | Gaussian sigma          |

## 10. Performance Tips for M1 Pro

1. **Start Low Resolution:** Begin at 320×240, increase only if needed
2. **Use Video Device In TOP:** Hardware-accelerated decode when possible
3. **Prefer TOPs over Python:** GLSL/TOPs generally faster than Script TOPs for pixel ops
4. **Cache Intermediate Results:** Null TOPs after expensive operations
5. **Disable During Editing:** Pause motion analysis when not needed
6. **Consider GPU Affinity:** In Preferences → GPU, ensure TouchDesigner uses Apple GPU
7. **Monitor Memory:** Motion analysis can use significant RAM at high res
8. **Use Compressed Formats:** H.264 input if using Movie File In TOP

## 11. Related Techniques

- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] — More specific tracking (hands vs general motion)
- [[Real-time Audio Visualizer|(y-) Real-time Audio Visualizer]] — Combine motion with audio reactivity
- [[GPU Fluid Simulation|(y-) GPU Fluid Simulation]] — Use motion to drive fluid forces
- [[Instanced 3D Models with PBR|(y-) Instanced 3D Models with PBR]] — Instance objects that react to motion
- [[GLSL Feedback Effect|(y-) GLSL Feedback Effect]] — Add trails to motion visualization

[[touchdesigner/06_Recipes_and_Projects/index|Return to Recipes & Projects]] | [[touchdesigner/index|Return to TouchDesigner]]

---
