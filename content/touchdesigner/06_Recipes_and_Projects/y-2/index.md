---
title: "(y-2) Intermediate"
tags:
  - touchdesigner
  - td/recipes
date: 2026-03-01
---

Welcome to the **Intermediate** module. These recipes require a basic understanding of how data flows between TOPs, CHOPs, and SOPs. We explore procedural content generation, shader-based feedback, and high-quality 3D rendering.

---

## Audio & Visuals

- **[[Real-time Audio Visualizer|(y-) Real-time Audio Visualizer]]**: A more "professional" version of the audio reactive recipe. We use the **Audio Spectrum CHOP** to perform frequency analysis (Bass/Treble) to drive a detailed 3D scene.
- **[[GLSL Feedback Effect|(y-) GLSL Feedback Effect]]**: Your first dip into **GLSL (Shaders)**. Learn how to create hypnotic trails, zooms, and rotations by writing custom GPU code.
- **[[5 Ways To Make Particles|(y-) 5 Ways To Make Particles]]**: A comprehensive comparison of every way to make particles in TouchDesigner. Great for learning when to choose a Palette tool versus building your own GPU system.
- **[[Fluid Text Morphing|(y-) Fluid Text Morphing]]**: A liquid-like text effect that bridges the 2D TOP world into 3D points. We use a **Solver POP** to make text "melt" and dissolve into droplets.
- **[[Audio Terrain Generator|(y-) Audio Terrain Generator]]**: Build a living, scrolling 3D landscape where mountain peaks rise and fall with the bass. Drives a **Noise SOP** directly from microphone amplitude via CHOP Reference.
- **[[Slit-Scan Time Warp|(y-) Slit-Scan Time Warp]]**: Turn your webcam into a time-smear machine using the official **Texture 3D TOP + Time Machine TOP** workflow. Each horizontal column samples a different moment in the past.
- **[[MIDI Hardware Control|(y-) MIDI Hardware Control]]**: Wire a physical MIDI controller (knobs, sliders, pads) to any visual parameter in real time. The foundation of a live VJ performance rig.
- **[[Pixel Sorting Glitch|(y-) Pixel Sorting Glitch Effect]]**: Turn live webcam footage into a glitch art piece where bright pixels streak horizontally. Uses a GLSL threshold-shift shader with an optional feedback datamosh loop.

---

## 3D & Rendering

- **[[Instanced 3D Models with PBR|(y-) Instanced 3D Models with PBR]]**: Learn how to use high-quality **PBR (Physically Based Rendering)** materials with thousands of 3D models efficiently on the GPU.
- **[[Image to POPs|(y-) Image to POPs - Pointcloud and Line Grid]]**: Convert any 2D image or video into a 3D digital point cloud and structured grid using the **POPs** family.
- **[[Organic Amoeba|(y-) Organic Amoeba]]**: Create a "living," pulsating point cloud inspired by biomechanical art. We use **Noise POPs** and map point positions directly to their colors for an iridescent effect.
- **[[Biomechanical Metallic Spines|(y-) Biomechanical Metallic Spines]]**: Parametric, vertebral structures generated from mathematical patterns. Uses the **Revolve POP** for GPU-accelerated 3D modeling.

---

## Tracking Basics

- **[[MediaPipe Face Tracking for Interactive Expressions|(y-) MediaPipe Face Tracking for Interactive Expressions]]**: Real-time expression detection (smiling, blinking, jaw opening) to drive interactive visuals and 2D/3D facial animation.
- **[[MediaPipe Pose Tracking for Full-Body Avatars|(y-) MediaPipe Pose Tracking for Full-Body Avatars]]**: Full-body skeleton tracking for driving digital puppets and motion-controlled background visuals.
- **[[Body Segmentation Composite|(y-) Body Segmentation Composite]]**: Cut your live silhouette from the webcam using the MediaPipe segmentation model and composite it over any generative background in real time.
- **[[Face Mesh 3D Sculpture|(y-) Face Mesh 3D Sculpture]]**: Convert all 468 MediaPipe face mesh landmarks into a glowing 3D point cloud - a live digital sculpture that tilts and turns with you.
- **[[Object Tracking Particle Trails|(y-) Object Tracking Particle Trails]]**: Use MediaPipe object detection to track everyday items in the webcam frame and leave glowing comet trails as they move.

---
[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
