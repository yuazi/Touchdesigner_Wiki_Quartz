---
title: "(y6) Recipes & Projects"
tags:
  - touchdesigner
  - td/recipes
date: 2026-03-01
---

Welcome to the **Recipes & Projects** module! This is where we put theory into practice. These tutorials combine techniques from all previous chapters into functional networks you can use in live shows, installations, or as starting points for your own experiments.

---

## [[touchdesigner/06_Recipes_and_Projects/y-1/index|(y-1) Fundamentals]]

_Perfect for your first hour in TouchDesigner. Focus on the core UI and basic operator families._

- **[[touchdesigner/06_Recipes_and_Projects/y-1/Basic VJ Mixer|(y-) Basic VJ Mixer]]**: Learn how to build a 2-channel crossfader. Covers the most important skill in TD: **Binding**.
- **[[touchdesigner/06_Recipes_and_Projects/y-1/Audio Reactive Geometry|(y-) Audio Reactive Geometry]]**: A classic project. Turn sound into numbers and use **Instancing** to drive 3D shapes.
- **[[touchdesigner/06_Recipes_and_Projects/y-1/Chromatic Aberration Feedback|(y-) Chromatic Aberration Feedback]]**: The "Okamirufu" signature. A simple post-processing trick using time-delayed caching.
- **[[touchdesigner/06_Recipes_and_Projects/y-1/Particle System with POPs|(y-) Particle System with POPs]]**: Your first look at **POPs** (Point Operators) for GPU-accelerated particles.
- **[[touchdesigner/06_Recipes_and_Projects/y-1/Waveform Oscilloscope|(y-) Waveform Oscilloscope]]**: Turn live mic or system audio into a glowing 3D waveform with **CHOP to SOP**. A ten-minute build.

---

## [[touchdesigner/06_Recipes_and_Projects/y-2/index|(y-2) Intermediate]]

_Requires a basic understanding of how data flows between TOPs, CHOPs, and SOPs._

### Audio & Visuals

- **[[touchdesigner/06_Recipes_and_Projects/y-2/Real-time Audio Visualizer|(y-) Real-time Audio Visualizer with FFT]]**: A professional version of the audio reactive recipe focusing on frequency analysis.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/GLSL Feedback Effect|(y-) GLSL Feedback Effect]]**: Your first dip into **GLSL (Shaders)**. Create hypnotic trails and zooms that respond to music.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/5 Ways To Make Particles|(y-) 5 Ways To Make Particles]]**: A comparison of every way to make particles in TD. Great for choosing the right tool.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Fluid Text Morphing|(y-) Fluid Text Morphing]]**: Liquid text effects bridging the 2D TOP world into 3D points that melt and dissolve.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Audio Terrain Generator|(y-) Audio Terrain Generator]]**: A scrolling 3D landscape whose peaks rise and fall with the bass, driven from mic amplitude.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Slit-Scan Time Warp|(y-) Slit-Scan Time Warp]]**: Webcam time-smear using the **Texture 3D TOP + Time Machine TOP** workflow.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/MIDI Hardware Control|(y-) MIDI Hardware Control]]**: Wire a physical MIDI controller to any visual parameter for a live VJ rig.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Pixel Sorting Glitch|(y-) Pixel Sorting Glitch]]**: Glitch-art streaks from live webcam footage via a GLSL threshold-shift shader.

### 3D & Rendering

- **[[touchdesigner/06_Recipes_and_Projects/y-2/Instanced 3D Models with PBR|(y-) Instanced 3D Models with PBR]]**: Learn how to use high-quality **PBR Materials** with thousands of 3D models.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Image to POPs|(y-) Image to POPs - Pointcloud and Line Grid]]**: Convert any 2D image or video into a 3D digital point cloud and structured grid using the **POPs** family.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Organic Amoeba|(y-) Organic Amoeba]]**: Create a "living," pulsating point cloud using Noise POPs and iridescent position-to-color mapping.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Biomechanical Metallic Spines|(y-) Biomechanical Metallic Spines]]**: Parametric vertebral structures using Revolve POPs and high-metallic shaders.

### Tracking Basics

- **[[touchdesigner/06_Recipes_and_Projects/y-2/MediaPipe Face Tracking for Interactive Expressions|(y-) MediaPipe Face Tracking]]**: Real-time expression detection (smiling, blinking) to drive visuals.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/MediaPipe Pose Tracking for Full-Body Avatars|(y-) MediaPipe Pose Tracking]]**: Full body skeleton tracking for driving 2D/3D avatars.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Body Segmentation Composite|(y-) Body Segmentation Composite]]**: Cut your live silhouette from the webcam and composite it over a generative background.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Face Mesh 3D Sculpture|(y-) Face Mesh 3D Sculpture]]**: Turn all 468 face mesh landmarks into a glowing 3D point cloud that moves with you.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/Object Tracking Particle Trails|(y-) Object Tracking Particle Trails]]**: Track everyday objects and leave glowing comet trails as they move.

---

## [[touchdesigner/06_Recipes_and_Projects/y-3/index|(y-3) Advanced]]

_Deep dives into fluid dynamics, motion tracking, and complex math._

### Physics & Simulation

- **[[touchdesigner/06_Recipes_and_Projects/y-3/GPU Fluid Simulation|(y-) GPU Fluid Simulation]]**: A complex TOP-based feedback system for smoke and liquid dynamics.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/Dreamscape Particle Cloud|(y-) Dreamscape Particle Cloud]]**: A stylized, glowing particle system with recursive feedback-based bloom.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/Vector Field Instancing|(y-) Vector Field Instancing]]**: Millions of points following swirling vortex paths driven by a 3D vector noise grid.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/Reaction-Diffusion|(y-) Reaction-Diffusion (Gray-Scott)]]**: Animal-skin and seashell patterns emerging from a two-parameter GLSL feedback loop.

### Motion Tracking & Interaction

- **[[touchdesigner/06_Recipes_and_Projects/y-3/Hand Tracking|(y-) Hand Tracking Index]]**: The central hub for all MediaPipe hand-tracking resources and the project series.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/Fluid Brush Hand Tracking|(y-) Fluid Brush with Hand Tracking]]**: Your hand becomes a brush painting glowing fluid trails through a feedback loop.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/Hand Tracking Tutorial|(y-) ★ Complete Hand Tracking Walkthrough]]**: Setup → core rig → watercolor brush → generative architecture.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/MediaPipe Hand Tracking Advanced Techniques|(y-) MediaPipe Hand Tracking Advanced]]**: Multi-hand tracking, complex gesture recognition, and interaction systems.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/Real-time Motion History and Optical Flow|(y-) Motion History & Optical Flow]]**: Track movement from a simple webcam without expensive sensors.

### Math & Fractals

- **[[touchdesigner/06_Recipes_and_Projects/y-3/Sierpinski Tetrahedron with Hand Tracking|(y-) 3D Sierpinski Tetrahedron]]**: Fractal geometry controlled by hand orientation and pinch-zoom.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/Hand-Tracked Chaotic Attractor|(y-) ★ Hand-Tracked Chaotic Attractor]]**: A math-heavy project using **Script CHOPs** to drive a Lorenz attractor with hand data.
- **[[notes/random/neural-style-transfer|(y-) Real-time Neural Style Transfer]]**: A deep-learning recipe using OpenCV and pre-trained ONNX models.

---

## [[touchdesigner/08_Trending_2026/index|(y-4) Trending: Gallery-Grade 2026]]

_The ten projects lighting up galleries right now (June 2026): real-time AI and camera-only MediaPipe interaction. Built to look finished on a big screen._

- **[[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|(y-) Live AI Painting with TouchDiffusion]]**: Real-time Stable Diffusion repaint of any TOP.
- **[[touchdesigner/08_Trending_2026/ControlNet Pose to Art|(y-) ControlNet Pose-to-Art]]**: AI artwork that forms around your live body pose.
- **[[touchdesigner/08_Trending_2026/Gaussian Splatting Scenes|(y-) Gaussian Splatting Scenes]]**: Photoreal volumetric flythroughs from a phone capture.
- **[[touchdesigner/08_Trending_2026/Depth Anything Parallax Portraits|(y-) Depth Anything Parallax Portraits]]**: AI monocular depth turns a flat photo into living 2.5D.
- **[[touchdesigner/08_Trending_2026/Interactive Portrait Wall|(y-) Interactive Portrait Wall]]**: A portrait that dissolves into particles as you approach.
- **[[touchdesigner/08_Trending_2026/Air Drawing Light Painting|(y-) Air-Drawing Light Painting]]**: Pinch in the air to paint glowing ribbons of light.
- **[[touchdesigner/08_Trending_2026/Holistic Magic Mirror|(y-) Holistic Magic Mirror]]**: Face, hands, and body tracked together for a responsive mirror.
- **[[touchdesigner/08_Trending_2026/Reaction Diffusion Living Canvas|(y-) Reaction-Diffusion Living Canvas]]**: A GLSL system that grows organic textures forever.
- **[[touchdesigner/08_Trending_2026/Volumetric Audio Nebula|(y-) Volumetric Audio Nebula]]**: A glowing 3D point cloud that breathes with music.
- **[[touchdesigner/08_Trending_2026/Projection Mapped Memory Garden|(y-) Projection-Mapped Memory Garden]]**: Flowers bloom on a real wall when someone walks up.

---

[[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
