---
title: "MediaPipe Hand Tracking Advanced Techniques"
tags:
  - touchdesigner
  - td/recipes
  - handtracking
  - mediapipe
  - interaction
  - gestures
  - recipes
date: 2026-03-16
---

This recipe builds upon basic hand tracking to demonstrate advanced techniques using Torin Blankensmith's MediaPipe TouchDesigner plugin. Learn to create complex gesture recognition systems, multi-hand interactions, and sophisticated visual controls.

> **Based on:** Torin Blankensmith's MediaPipe TouchDesigner series
> **Plugin:** [github.com/torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner)

## Overview

Advance your hand tracking skills with:

- Multi-hand tracking and interaction detection
- Complex gesture recognition (swipes, pinches, rotations)
- Hand-based particle and physics systems
- Performance optimization for multiple hands
- Integration with 3D objects and particle systems

## 1. Setup & Plugin Configuration

### 1.1 Install the Plugin

1. Download the latest release from [github.com/torinmb/mediapipe-touchdesigner/releases](https://github.com/torinmb/mediapipe-touchdesigner/releases)
2. Extract the `release.zip` file
3. Place the `toxes/` folder alongside your TouchDesigner project file
4. In TouchDesigner, press `Tab` and add a `MediaPipe` COMP
5. Enable "External .tox" and load `MediaPipe.tox` from the toxes folder
6. Add `Hand Tracking.tox` to the same network

### 1.2 Configure for Multiple Hands

1. Select the MediaPipe COMP
2. In the parameters, enable **Hand Tracking** in the model list
3. Set **Max Num Hands** to `2` (or higher if needed)
4. Disable other models (Face, Pose, Object, etc.) to save performance
5. Optionally enable **Preview Overlay** to see landmarks on the video feed
6. Set your webcam as the video source

## 2. Understanding Multi-Hand Output

When tracking multiple hands, the plugin prefixes data with hand identifiers:

### 2.1 Hand Identification

- Hand 1: `H1_<joint>_<axis>`
- Hand 2: `H2_<joint>_<axis>`
- And so on for additional hands

### 2.2 Available Data Per Hand

- 21 landmark points per hand (x, y, z coordinates)
- Gesture confidence values (open palm, pointing, thumbs up/down, etc.)
- Helper channels:
  - `H1_pinch_midpoint_xyz` (midpoint between thumb and index finger)
  - `H1_pinch_distance` (0-1, where 0.05 = tight pinch, 0.25 = open hand)
  - `H1_spread` (hand openness, 0 = fist, 1 = fully spread)
  - `H1_<gesture>_confidence` for 7 built-in gestures

### 2.3 Additional Tracking Data

- Hand presence confidence (indicates if each hand is detected)
- Handedness classification (left vs right hand)

## 3. Multi-Hand Interaction Systems

### 3.1 Distance-Based Interactions

Detect when hands come close together or move apart:

1. **Extract Hand Positions:**
   - Add two `Select CHOP`s: one for `H1_palm_center_xyz`, one for `H2_palm_center_xyz`
   - (Calculate palm center by averaging wrist and MCP joints, or use available helper channels)

2. **Calculate Distance:**
   - Use a `Math CHOP` to compute Euclidean distance between the two position vectors
   - Formula: sqrt((x2-x1)² + (y2-y1)² + (z2-z1)²)

3. **Map Distance to Visuals:**
   - Use distance to control:
     - Size of a connecting visual element (line, beam, etc.)
     - Color hue (close = warm, far = cool)
     - Particle emission rate between hands
     - Audio frequency or filter cutoff

### 3.2 Gesture-Based Interactions

Recognize specific multi-hand gestures:

#### Clap Detection

1. Extract `H1_palm_center` and `H2_palm_center`
2. Calculate distance between palms
3. When distance < threshold AND both hands have low velocity → clap detected
4. Add `Lag CHOP` and `Trigger CHOP` for clean pulse output

#### Prayer Hands Detection

1. Check if both hands have high `F1_palm_center_y` (high position)
2. Check if distance between palms is small
3. Check if both hands have low spread values (fists or partial fists)
4. Combine conditions with Logic CHOPs

#### Push/Pull Gestures

1. Track distance change over time:
   - Subtract previous frame distance from current distance
   - Positive value = pushing apart, negative value = pulling together
2. Use this delta to control:
   - Force strength in a particle system
   - Scale of a 3D object
   - Feedback amount in a visual effect

## 4. Advanced Gesture Recognition

### 4.1 Swipe Detection

Detect horizontal or vertical swipes with one or both hands:

1. **Velocity Calculation:**
   - Track position over time to calculate velocity vectors
   - Use `Math CHOP` with derivatives or manual frame-delay subtraction

2. **Direction Detection:**
   - Compare velocity components:
     - |vx| > |vy| and vx > threshold → right swipe
     - |vx| > |vy| and vx < -threshold → left swipe
     - |vy| > |vx| and vy > threshold → up swipe
     - |vy| > |vx| and vy < -threshold → down swipe

3. **State Management:**
   - Use `Delay CHOP` and `Logic CHOPs` to create swipe state machine
   - Require hand to be above velocity threshold for minimum duration
   - Reset state when velocity drops below threshold

### 4.2 Rotation Detection

Detect circular hand movements:

1. **Angular Velocity Calculation:**
   - Track position history to calculate angle change over time
   - Use multiple `Delay CHOP`s to get position at t, t-1, t-2
   - Calculate angle between vectors (current-previous) and (previous-previous-previous)

2. **Direction Detection:**
   - Positive angular velocity = clockwise rotation
   - Negative angular velocity = counter-clockwise rotation

3. **Applications:**
   - Control hue rotation in a color wheel
   - Drive parameter knobs in audio synthesizers
   - Rotate 3D objects in scene
   - Control scroll position in long lists

### 4.3 Pinch and Spread Tracking

Beyond basic pinch distance:

1. **Pinch Velocity:**
   - Calculate rate of change of `H1_pinch_distance`
   - Fast closing pinch = grab/release gesture
   - Slow opening pinch = gradual parameter control

2. **Multi-Finger Gestures:**
   - Track distance between index and middle fingers
   - Track spread of all fingertips (variance of fingertip positions)
   - Detect "rock on" gesture (index + pinky extended)
   - Detect "spock" gesture (index-middle split, ring-pinky split)

## 5. Hand-Driven Particle and Physics Systems

### 5.1 Particle Emitters from Hands

Create particle systems that emit from hand positions:

1. **Basic Setup:**
   - Use `H1_palm_center` or `H1_pinch_midpoint` as emitter position
   - Connect to `Source POP` → `Solver POP` chain
   - Render with `Point Sprite MAT` or instanced geometry

2. **Parameter Mapping:**
   - Map `H1_pinch_distance` to particle emission rate (close pinch = more particles)
   - Map `H1_spread` to particle initial velocity (spread hand = faster particles)
   - Map hand velocity to particle initial direction/velocity
   - Map `F1_thumb_up_confidence` to enable/disable emitter

### 5.2 Hand-Controlled Forces

Use hands to affect particle systems or physics simulations:

1. **Attractor/Repulsor:**
   - Map hand position to `Force POP` center
   - Map gesture confidence to force strength (thumbs up = attract, thumbs down = repel)
   - Use both hands for bipolar forces (one attracts, one repels)

2. **Wind Control:**
   - Map hand velocity/direction to `Wind POP` direction and strength
   - Use palm orientation (calculated from landmarks) for wind direction
   - Map hand spread to wind turbulence/noise

### 5.3 Soft Body Interaction

Create deformable objects that respond to hand touch:

1. **Distance Field Approach:**
   - Calculate distance from hand to each point in a soft body SOP
   - Apply displacement inversely proportional to distance
   - Use `Attribute Create SOP` to store and modify point positions

2. **Direct Position Driving:**
   - For low point count SOPs, directly drive nearby points toward hand position
   - Use falloff based on distance to prevent rigid movement
   - Apply smoothing/lag to prevent jitter

## 6. Performance Optimization for M1 Pro

### 6.1 Model Configuration

- Only enable **Hand Tracking** - disable Face, Pose, Object models
- Set **Max Num Hands** to the actual maximum you need (2 is usually sufficient)
- Consider lowering `model_complexity` to 0 for maximum performance (less accurate but faster)

### 6.2 Resolution Settings

- Hand Tracking works well at 640×480
- Can go down to 320×240 for static or slow-moving interactions
- Higher resolution (1280×720) only needed for fine finger tracking at distance

### 6.3 Data Processing Efficiency

- Only extract landmarks you actually need (use specific Select CHOPs)
- Calculate helper channels (like palm center) once and reuse
- Use `Null CHOPs` to avoid recalculating the same expressions
- Chain Math CHOPs efficiently (combine multiple operations when possible)

### 6.4 Visualization Optimization

- For hand visualization: use low-poly spheres (~16 segments) or instanced circles
- For trails: use Feedback TOP system rather than accumulating geometry
- For particle systems: optimize POP SOP cook resolution and particle count
- Consider rendering hand visualization to smaller TOP then compositing

### 6.5 Reducing Data Flow

- If only using one hand's data, add a `Logic CHOP` to zero out the other hand's channels when not present
- Use `Switch CHOP` to select between hands based on confidence or other criteria
- Implement dead zones to ignore micro-movements when hands are supposed to be stationary

## 7. Practical Applications

### 7.1 Conducting System

Create a virtual conductor that controls music or visuals with hand movements:

- Left hand position/volume → audio gain or visual intensity
- Right hand position/tempo → beat detection or animation speed
- Conducting patterns (down-up-left-right) trigger different sections
- Gesture size controls dynamics (big gestures = forte, small = piano)

### 7.2 Two-Handed Sculpting

Create a virtual clay sculpting system:

- Left hand positions and orients the virtual workplane
- Right hand adds/subtracts material at intersection point
- Pinch distance controls tool size
- Hand rotation controls tool orientation
- Use feedback loops to accumulate sculpting changes over time

### 7.3 Interactive Particle Orchestra

Map different hand gestures to different sound-producing particle systems:

- Open palms → ambient pad particle system (slow, diffuse particles)
- Pointing fingers → lead synth particles (focused, directional)
- Clasped hands → bass particle system (large, slow-moving particles)
- Fingers spread → high-frequency particle system (fast, chaotic)
- Each system mapped to different audio frequencies or synth parameters

### 7.4 Collaborative Interaction

Enable multiple users to interact with the same system:

- Track hands from multiple users (if using multiple cameras or wide-angle lens)
- Assign colors or IDs to each user's hands
- Create interaction zones where hands from different users can "collide" or "merge"
- Use hand proximity to trigger collaborative effects or shared visual elements

## 8. Parameter Reference

| Parameter            | Location        | Typical Range | Purpose                                    |
| -------------------- | --------------- | ------------- | ------------------------------------------ |
| Max Num Hands        | MediaPipe COMP  | 1-4           | Number of hands to track simultaneously    |
| Model Complexity     | MediaPipe COMP  | 0-1           | 0 = fastest (less accurate), 1 = default   |
| Detection Confidence | MediaPipe COMP  | 0.5-0.9       | Minimum confidence to detect hand          |
| Tracking Confidence  | MediaPipe COMP  | 0.5-0.9       | Minimum confidence to keep tracking hand   |
| Gesture Threshold    | Expression CHOP | 0.6-0.8       | Confidence threshold for gesture triggers  |
| Lag Time             | Lag CHOP        | 0.02-0.08s    | Smoothing for jitter reduction             |
| Velocity History     | Math CHOP/Delay | 2-5 frames    | How many frames to calculate velocity over |
| Interaction Distance | Math CHOP       | 0.1-0.5 units | Distance threshold for hand interactions   |

## 9. Performance Tips for M1 Pro

1. **Limit Hands:** Only track as many hands as you actually need
2. **Lower Complexity:** Set model_complexity to 0 unless you need high precision
3. **Smart Data Extraction:** Only pull the 5-10 landmarks you use in your patch
4. **Cache Calculations:** Calculate complex values (like palm center) once and reuse
5. **Efficient Math:** Combine multiple operations in single Math CHOPs when possible
6. **Visual LOD:** Use simpler representations when hands are far from camera or moving fast
7. **Monitor Frame Time:** Use Dialogs → Performance Monitor; maintain <33ms per frame for 30fps
8. **Batch Similar Ops:** Group similar mathematical operations to reduce CHOP count

## 10. Related Techniques

- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] — Basic hand tracking setup
- [[MediaPipe Face Tracking for Interactive Expressions|(y-) MediaPipe Face Tracking for Interactive Expressions]] — Facial expression tracking
- [[MediaPipe Pose Tracking for Full-Body Avatars|(y-) MediaPipe Pose Tracking for Full-Body Avatars]] — Full body tracking
- [[Hand-Tracked Chaotic Attractor|(y-) Hand-Tracked Chaotic Attractor]] — Chaos system from hand data
- [[Particle System with POPs|(y-) Particle System with POPs]] — Advanced particle systems driven by hands
- [[GPU Fluid Simulation|(y-) GPU Fluid Simulation]] — Use hands to control fluid parameters

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
