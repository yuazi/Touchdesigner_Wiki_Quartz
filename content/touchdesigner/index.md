---
title: (y) TouchDesigner Wiki
tags:
  - touchdesigner
date: 2026-02-01
---

My TouchDesigner wiki. Reference notes for visual programming with nodes and real-time interactive media.

> [!tip] New to TouchDesigner?
> If you just installed TouchDesigner, start with the **[[touchdesigner/06_Recipes_and_Projects/y-1/index|(y-1) Beginner Recipes]]**. You should be making visuals inside ten minutes.

---

## (y1) Core Concepts

The fundamentals: interface, navigation, and workflow.

- **[[touchdesigner/01_Core_Concepts/index|(y) Index: Core Concepts]]**: Chapter hub and navigation.
- **[[touchdesigner/01_Core_Concepts/What is TouchDesigner|(y-) What is TouchDesigner]]**: Overview of TD and its use cases.
- **[[touchdesigner/01_Core_Concepts/Interface Overview|(y-) Interface Overview]]**: Panels, panes, and the main UI.
- **[[touchdesigner/01_Core_Concepts/Network Editor|(y-) Network Editor]]**: Working in the node graph.
- **[[touchdesigner/01_Core_Concepts/Connecting Nodes|(y-) Connecting Nodes]]**: Wiring operators together.
- **[[touchdesigner/01_Core_Concepts/Parameters|(y-) Parameters]]**: Reading and editing node parameters.
- **[[touchdesigner/01_Core_Concepts/Expressions and Parameters|(y-) Expressions and Parameters]]**: Python expressions in parameters.
- **[[touchdesigner/01_Core_Concepts/Viewer Active Mode|(y-) Viewer Active Mode]]**: Interacting with node viewers.
- **[[touchdesigner/01_Core_Concepts/Common Shortcuts|(y-) Common Shortcuts]]**: Essential keyboard shortcuts.

---

## (y2) The Operators

The seven operator families are the building blocks of every network.

- **[[touchdesigner/02_The_Operators/index|(y) Index: The Operators]]**: Chapter hub and navigation.
- **[[touchdesigner/02_The_Operators/TOPs/index|(y-) TOPs]]**: 2D image & video processing (GPU).
- **[[touchdesigner/02_The_Operators/CHOPs/index|(y-) CHOPs]]**: Numeric signals, audio & control data.
- **[[touchdesigner/02_The_Operators/SOPs/index|(y-) SOPs]]**: 3D geometry (CPU).
- **[[touchdesigner/02_The_Operators/COMPs/index|(y-) COMPs]]**: Containers, 3D objects & UI panels.
- **[[touchdesigner/02_The_Operators/DATs/index|(y-) DATs]]**: Text, tables, scripts & JSON.
- **[[touchdesigner/02_The_Operators/MATs/index|(y-) MATs]]**: Materials & shaders for 3D geometry.
- **[[touchdesigner/02_The_Operators/POPs/index|(y-) POPs]]**: GPU point clouds and particles.

---

## (y3) Rendering & Output

Generating and compositing visuals.

- **[[touchdesigner/03_Rendering_and_Output/index|(y) Index: Rendering & Output]]**: Chapter hub and navigation.
- **[[touchdesigner/03_Rendering_and_Output/Rendering Basics|(y-) Rendering Basics]]**: The Render TOP pipeline.
- **[[touchdesigner/03_Rendering_and_Output/Cameras and Lights|(y-) Cameras and Lights]]**: Setting up a 3D scene.
- **[[touchdesigner/03_Rendering_and_Output/Instancing|(y-) Instancing]]**: Rendering thousands of objects efficiently.
- **[[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Feedback Loops]]**: Feeding output back into itself.

---

## (y4) Scripting & Architecture

Python, project structure, and performance.

- **[[touchdesigner/04_Scripting_and_Architecture/index|(y) Index: Scripting & Architecture]]**: Chapter hub and navigation.
- **[[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TD]]**: Writing Python inside TouchDesigner.
- **[[touchdesigner/04_Scripting_and_Architecture/The op and me objects|(y-) The op and me objects]]**: Navigating the network with code.
- **[[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|(y-) Custom Parameters]]**: Adding your own parameters to COMPs.
- **[[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes|(y-) Modular Design and Toxes]]**: Reusable components (.tox files).
- **[[touchdesigner/04_Scripting_and_Architecture/Container and Widgets|(y-) Container and Widgets]]**: Building custom UIs.
- **[[touchdesigner/04_Scripting_and_Architecture/Cooking|(y-) Cooking]]**: How TD decides what to compute.
- **[[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|(y-) Performance Monitoring]]**: Finding and fixing slowdowns.

---

## (y5) Connectivity & Shaders

External I/O, protocols, and GPU programming.

- **[[touchdesigner/05_Connectivity_and_Shaders/index|(y) Index: Connectivity & Shaders]]**: Chapter hub and navigation.
- **[[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI|(y-) OSC and MIDI]]**: Sending and receiving control messages.
- **[[touchdesigner/05_Connectivity_and_Shaders/NDI and Syphon|(y-) NDI and Syphon]]**: Sharing video between applications.
- **[[touchdesigner/05_Connectivity_and_Shaders/DMX and Art-Net|(y-) DMX and Art-Net]]**: Lighting control protocols.
- **[[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity|(y-) Audio Reactivity]]**: Driving visuals from audio signals.
- **[[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|(y-) Introduction to GLSL]]**: Writing custom GPU shaders.

---

## (y6) Recipes & Projects

Practical examples and projects categorized by difficulty.

- **[[touchdesigner/06_Recipes_and_Projects/y-1/index|(y-1) Fundamentals]]**: Core UI, Binding, and basic audio-reactive 3D.
- **[[touchdesigner/06_Recipes_and_Projects/y-2/index|(y-2) Intermediate]]**: Shaders, PBR Materials, and basic MediaPipe tracking.
- **[[touchdesigner/06_Recipes_and_Projects/y-3/index|(y-3) Advanced]]**: Fluid simulations, advanced gesture recognition, and fractal math.

---

## (y7) TouchDesigner Wiki Reference

- **[[touchdesigner/Glossary|(y) Glossary]]**: Core concepts and terminology.
- **[[touchdesigner/07_Tutorials_and_Links/index|(y) Tutorials & Links Index]]**: Chapter hub for curated resources.

---

## (y8) Trending: Gallery-Grade 2026

Ten installation-quality projects on what is trending right now: real-time AI (live diffusion, Gaussian splats, AI depth) and camera-only MediaPipe interaction.

- **[[touchdesigner/08_Trending_2026/index|(y8) Trending 2026 Index]]**: Chapter hub for the ten projects.
- **[[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|(y-) Live AI Painting with TouchDiffusion]]**: Real-time Stable Diffusion repaint of any input.
- **[[touchdesigner/08_Trending_2026/ControlNet Pose to Art|(y-) ControlNet Pose-to-Art]]**: AI artwork that forms around your live body pose.
- **[[touchdesigner/08_Trending_2026/Gaussian Splatting Scenes|(y-) Gaussian Splatting Scenes]]**: Photoreal volumetric flythroughs from a phone capture.
- **[[touchdesigner/08_Trending_2026/Depth Anything Parallax Portraits|(y-) Depth Anything Parallax Portraits]]**: Turn a flat photo into a living 2.5D scene with AI depth.
- **[[touchdesigner/08_Trending_2026/Interactive Portrait Wall|(y-) Interactive Portrait Wall]]**: A portrait that dissolves into particles as you approach.
- **[[touchdesigner/08_Trending_2026/Air Drawing Light Painting|(y-) Air-Drawing Light Painting]]**: Pinch in the air to paint glowing ribbons of light.
- **[[touchdesigner/08_Trending_2026/Holistic Magic Mirror|(y-) Holistic Magic Mirror]]**: Face, hands, and body tracked at once for a responsive mirror.
- **[[touchdesigner/08_Trending_2026/Reaction Diffusion Living Canvas|(y-) Reaction-Diffusion Living Canvas]]**: A GLSL system that grows organic textures forever.
- **[[touchdesigner/08_Trending_2026/Volumetric Audio Nebula|(y-) Volumetric Audio Nebula]]**: A glowing 3D point cloud that breathes with music.
- **[[touchdesigner/08_Trending_2026/Projection Mapped Memory Garden|(y-) Projection-Mapped Memory Garden]]**: Flowers bloom on a real wall when someone walks up.

---

[[/index|(y) Return to Home]]
