---
title: "Recipe: Real-time Audio Visualizer with FFT and Instancing"
tags:
  - touchdesigner
  - td/recipes
  - audio
  - instancing
  - fft
  - recipes
  - visualization
date: 2026-03-16
---

This recipe creates a professional-grade real-time audio visualizer using TouchDesigner's Audio Spectrum CHOP, FFT analysis, and geometry instancing. Optimized for Apple M1 Pro with GPU acceleration.

> **Based on:** Combining techniques from TouchDesigner's official audio tutorials and community best practices

## Overview

Build a responsive audio visualizer that:

- Analyzes live audio input using FFT (Fast Fourier Transform)
- Maps frequency bands to visual parameters (height, color, rotation)
- Uses efficient GPU instancing for thousands of visual elements
- Includes smooth response curves and falloff for professional look
- Optimized for real-time performance on Apple Silicon

## 1. Audio Analysis Chain

### 1.1 Audio Input Setup

1. Create an `Audio Device In CHOP`
   - Set **Device** to your preferred input (built-in microphone, audio interface, etc.)
   - Set **Channels** to 2 (stereo) or 1 (mono) as needed
   - Set **Sample Rate** to 44100 Hz (standard)

### 1.2 FFT Analysis

1. Connect `Audio Device In CHOP` → `Audio Spectrum CHOP`
   - **Type:** Magnitude (for standard amplitude spectrum)
   - **Number of Bands:** 64 (good balance of detail and performance)
   - **Band Width:** Linear (even spacing) or Logarithmic (more low-frequency detail)
   - **Normalize:** On (helps with consistent response across volumes)

### 1.3 Signal Processing

1. Connect `Audio Spectrum CHOP` → `Lag CHOP` (smoothing)
   - **Lag:** 0.01-0.05 seconds (adjust for responsiveness vs smoothness)
2. Connect `Lag CHOP` → `Math CHOP` (dynamic range adjustment)
   - **Operation:** Multiply-Add
   - **Multiply:** 2.0 (increase sensitivity)
   - **Add:** -0.5 (center around zero)
   - **Clamp:** On (Min 0, Max 1)

3. Connect `Math CHOP` → `Null CHOP` (name it `OUT_AUDIO_FFT`)

## 2. Visual Generation System

### 2.1 Geometry Template

1. Create a `Box SOP`
   - **Size:** 0.1, 0.1, 0.1 (small cube)
   - **Transform:** Center at origin

2. Create a `Geometry COMP`
   - **SOP:** Point to your Box SOP
   - **Material:** Assign a `Phong MAT` or `Constant MAT`

### 2.2 Instancing Setup

1. On the Geometry COMP's **Instance** page:
   - **Instancing:** On
   - **Instance CHOP:** Create a null CHOP named `NULL_INSTANCES`
   - **Translate X/Y/Z:** Map to channels we'll create next

### 2.3 Position Generation

1. Create a `Noise TOP` (for spatial distribution)
   - **Resolution:** 32×32 (1024 instances - good starting point)
   - **Type:** Sparse or Hermite (for organic distribution)
   - **Period:** 0.5-1.0 (controls clustering)
   - **Amplitude:** 1.0 (full noise range)

2. Connect `Noise TOP` → `TOP to CHOP`
   - This converts RGB channels to R, G, B channels

3. Add a `Rename CHOP`
   - Rename `r` → `tx`, `g` → `ty`, `b` → `tz`

4. Add a `Math CHOP` for scaling
   - **Multiply by:** 4.0 (spreads instances across -2 to 2 range)
   - This gives us positions for our instances

5. Connect to `NULL_INSTANCES` (our instance source)

## 3. Audio-Driven Parameters

### 3.1 Frequency Band Mapping

Instead of using all 64 bands directly (too many parameters), we'll create meaningful aggregates:

#### Low Bass (0-80Hz) - Controls overall scale/height

1. Create a `Select CHOP` from `OUT_AUDIO_FFT`
   - **Channel Names:** `chan0 chan1 chan2 chan3` (first 4 bands ~0-80Hz)
2. Connect to `Math CHOP` (set to Average mode)
   - Outputs single channel representing low bass energy
3. Connect to `Null CHOP` (name it `NULL_LOW_BASS`)

#### Midrange (80Hz-2kHz) - Controls color/hue

1. Create a `Select CHOP` from `OUT_AUDIO_FFT`
   - **Channel Names:** `chan4 chan5 chan6 chan7 chan8 chan9 chan10 chan11` (approx 80Hz-2kHz)
2. Connect to `Math CHOP` (Average mode)
   - Outputs single channel for midrange
3. Connect to `Null CHOP` (name it `NULL_MIDRANGE`)

#### High End (2kHz+) - Controls detail/brightness

1. Create a `Select CHOP` from `OUT_AUDIO_FFT`
   - **Channel Names:** `chan12 chan13 chan14 ... chan63` (remaining bands)
2. Connect to `Math CHOP` (Average mode)
   - Outputs single channel for high frequencies
3. Connect to `Null CHOP` (name it `NULL_HIGH_END`)

### 3.2 Mapping to Instance Parameters

Now map these audio controls to our instances:

#### Height Control (from low bass)

1. On Geometry COMP Instance page:
   - **Translate Y:** Reference `NULL_LOW_BASS` channel
   - **Multiply:** 2.0 (so full bass = 2 units high)
   - **Add:** 0.5 (so minimum height is 0.5 units)

#### Color Control (from midrange)

1. On Geometry COMP's Material (Phong MAT):
   - **Base Color R:** Reference `NULL_MIDRANGE`
   - **Base Color G:** Reference `NULL_MIDRANGE` (with Math CHOP to invert: 1-value)
   - **Base Color B:** 0.8 (constant blue tint)
   - _Alternative:_ Use HSV Adjust TOP after render for hue shifting

#### Scale/Detail Control (from high end)

1. On Geometry COMP Instance page:
   - **Scale X/Y/Z:** Reference `NULL_HIGH_END`
   - **Multiply:** 1.5 (so high end = 2.5x scale, low end = 1x scale)
   - **Add:** 1.0

## 4. Rendering and Post Processing

### 4.1 Basic Render Setup

1. Create `Camera COMP`
   - **Translate:** 0, 0, -4 (pull back to see the field)
   - **Look at:** 0, 0, 0 (center)

2. Create `Light COMP`
   - **Type:** Point Light
   - **Translate:** 2, 2, 3
   - **Color:** White, slightly tinted (e.g., 1.0, 0.95, 0.9)
   - **Intensity:** 1.5

3. Create `Render TOP`
   - **Resolution:** 1920×1080 (or your output resolution)
   - **Camera:** Point to your Camera COMP
   - **Background Color:** Black (0, 0, 0, 1)

### 4.2 Post-Processing Chain

1. Connect `Render TOP` → `Level TOP`
   - **Brightness:** 1.2 (slight boost)
   - **Contrast:** 1.1 (makes pops stand out)

2. Connect `Level TOP` → `Bloom TOP`
   - **Threshold:** 0.3 (only bright parts bloom)
   - **Size:** 0.015 (tight bloom)
   - **Mix:** 0.7 (70% bloom effect)

3. Connect `Bloom TOP` → `Null TOP` (name it `OUT_FINAL`)

## 5. Performance Optimization for M1 Pro

### 5.1 Instance Count Management

- Start with 32×32 = 1,024 instances (Noise TOP resolution)
- For more detail: 64×64 = 4,096 instances (still very manageable)
- Maximum recommended: 128×128 = 16,384 instances (monitor performance)
- Each additional doubling quadruples the instance count

### 5.2 TOP Resolutions

- Keep Noise TOP at reasonable resolutions (32-64px)
- Render TOP at 1920×1080 or lower for better performance
- Use lower resolution intermediates when possible (e.g., process audio at 512×512 then upscale)

### 5.3 CHOP Efficiency

- Use Math CHOPs instead of multiple operators when possible
- Lag CHOPs are inexpensive - use them for smoothing
- Avoid unnecessary conversions between TOPs and CHOPs

### 5.4 Material Optimization

- Use Constant MAT instead of Phong MAT when lighting isn't needed
- If using Phong MAT, keep light count low (1-2 lights max)
- Consider using Point Sprite MAT with instances for even better performance (billboards)

## 6. Variations and Extensions

### 6.1 Radial Layout

Replace Noise TOP with:

1. `Circle TOP` → `Convert TOP` (to polar coordinates)
2. Map angle to instance rotation, radius to audio response

### 6.2 Frequency-Specific Response

Instead of averaging bands:

1. Map specific bands to specific instance attributes
2. Example: Bass → height, Low-mids → color, Highs → rotation speed

### 6.3 Geometry Variations

Replace Box SOP with:

- `Sphere SOP` for orbs
- `Tube SOP` for cables/pipes
- `Text SOP` for letter visualization (use instance index to select letter)

### 6.4 Stereo Separation

Process left and right channels separately:

1. Split stereo input before Audio Spectrum CHOP
2. Map left channel to X position, right to Z position
3. Creates widening stereo visualization effect

## 7. Parameter Reference

| Parameter       | Source                  | Typical Range      | Purpose                     |
| --------------- | ----------------------- | ------------------ | --------------------------- |
| Instance Count  | Noise TOP Resolution    | 16²-128² (256-16k) | Number of visual elements   |
| Lag Time        | Lag CHOP                | 0.01-0.1s          | Smoothness of response      |
| Bass Scale      | Math CHOP Multiply      | 1.0-3.0            | Height sensitivity          |
| Midrange Gain   | Math CHOP Multiply      | 0.5-2.0            | Color intensity             |
| High End Scale  | Math CHOP Multiply      | 0.5-2.0            | Detail/brightness response  |
| Camera Distance | Camera COMP Translate Z | -2 to -8           | Field of view               |
| Bloom Threshold | Bloom TOP               | 0.1-0.5            | Brightness cutoff for bloom |
| Bloom Size      | Bloom TOP               | 0.01-0.05          | Bloom spread                |

## 8. Performance Tips for M1 Pro

1. **Monitor Performance:** Use Dialogs → Performance Monitor
2. **Target 60fps:** Keep render times under 16ms per frame
3. **Instance Sweet Spot:** 4,000-8,000 instances gives great visual density with good performance
4. **Use External TOPs:** For static elements, use Movie File In TOPs instead of generators
5. **Disable Viewers:** During performance, close unnecessary panel viewers
6. **Adjust Cook Mode:** Set TOPs/CHOPs to "Realtime" or "Sync to Timeline" as appropriate

## 9. Related Techniques

- [[5 Ways To Make Particles|(y-) 5 Ways To Make Particles]] — alternative particle-based visualization
- [[Audio Reactive Geometry|(y-) Audio Reactive Geometry]] — simpler bar-graph style visualizer
- [[GLSL Feedback Effect|(y-) GLSL Feedback Effect]] — for adding trails and persistence
- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] — for interactive audio/visual control

[[touchdesigner/06_Recipes_and_Projects/index|Return to Recipes & Projects]] | [[touchdesigner/index|Return to TouchDesigner]]

---
