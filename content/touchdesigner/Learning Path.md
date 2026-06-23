---
title: "(y) TouchDesigner Learning Path"
tags:
  - touchdesigner
  - td/learning-path
date: 2026-06-23
---

A single ordered track from zero to gallery-grade. The wiki has a lot of pages; this is the recommended **reading order** through them. Start at the top, work down, and check things off as you go.

> [!tip] How the path works
> Every page on this track has a collapsible **📚 Learning Path** bar pinned at the very top. Open it to see which stage you are in and jump to the **previous** or **next** step, so you never lose your place. This page is always one click away as the **Path Overview**.

> [!info] Not a beginner?
> Jump straight to the stage that matches you. Each stage lists what you should already be comfortable with and what you will be able to build by the end.

---

## Stage 1 - Foundations

_Goal: read a network, move around the canvas, and edit parameters without getting lost. No prior experience needed._

- [ ] **[[touchdesigner/01_Core_Concepts/What is TouchDesigner|(y-) What is TouchDesigner]]**
- [ ] **[[touchdesigner/01_Core_Concepts/Interface Overview|(y-) Interface Overview]]**
- [ ] **[[touchdesigner/01_Core_Concepts/Network Editor|(y-) Network Editor]]**
- [ ] **[[touchdesigner/01_Core_Concepts/Connecting Nodes|(y-) Connecting Nodes]]**
- [ ] **[[touchdesigner/01_Core_Concepts/Parameters|(y-) Parameters]]**
- [ ] **[[touchdesigner/01_Core_Concepts/Expressions and Parameters|(y-) Expressions and Parameters]]**
- [ ] **[[touchdesigner/01_Core_Concepts/Viewer Active Mode|(y-) Viewer Active Mode]]**
- [ ] **[[touchdesigner/01_Core_Concepts/Common Shortcuts|(y-) Common Shortcuts]]**

✅ **You can now:** navigate the network editor, wire operators, and switch a parameter between constant, expression, and export modes.

---

## Stage 2 - Your First Visuals

_Goal: build something that moves and reacts in your first hour. Hands-on, minimal theory._

- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-1/Basic VJ Mixer|(y-) Basic VJ Mixer]]** - the single most important skill: Binding.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-1/Audio Reactive Geometry|(y-) Audio Reactive Geometry]]** - sound into numbers into 3D.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-1/Waveform Oscilloscope|(y-) Waveform Oscilloscope]]** - a glowing 3D waveform in ten minutes.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-1/Chromatic Aberration Feedback|(y-) Chromatic Aberration Feedback]]** - your first feedback post-effect.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-1/Particle System with POPs|(y-) Particle System with POPs]]** - first taste of GPU particles.

✅ **You can now:** drive visuals from audio, use feedback for motion, and make a basic particle system.

---

## Stage 3 - The Operator Families

_Goal: learn the vocabulary. What each of the seven families is for and when to reach for it. Refer back here constantly._

- [ ] **[[touchdesigner/02_The_Operators/TOPs/TOP - Texture Operators|(y-) TOPs - Texture Operators]]** - 2D images and video (GPU).
- [ ] **[[touchdesigner/02_The_Operators/CHOPs/CHOP - Channel Operators|(y-) CHOPs - Channel Operators]]** - signals, audio, control data.
- [ ] **[[touchdesigner/02_The_Operators/SOPs/SOP - Surface Operators|(y-) SOPs - Surface Operators]]** - 3D geometry (CPU).
- [ ] **[[touchdesigner/02_The_Operators/COMPs/COMP - Components|(y-) COMPs - Components]]** - containers, 3D objects, UI panels.
- [ ] **[[touchdesigner/02_The_Operators/DATs/DAT - Data Operators|(y-) DATs - Data Operators]]** - text, tables, scripts.
- [ ] **[[touchdesigner/02_The_Operators/MATs/MAT - Material Operators|(y-) MATs - Material Operators]]** - shaders and materials.
- [ ] **[[touchdesigner/02_The_Operators/POPs/POP - Point Operators|(y-) POPs - Point Operators]]** - GPU point clouds and particles.

> [!note] Optional CHOP deep-dives
> When you want detail on individual nodes: [[touchdesigner/02_The_Operators/CHOPs/Constant CHOP|(y-) Constant]], [[touchdesigner/02_The_Operators/CHOPs/LFO CHOP|(y-) LFO]], [[touchdesigner/02_The_Operators/CHOPs/Math CHOP|(y-) Math]], [[touchdesigner/02_The_Operators/CHOPs/Noise - CHOP and TOP|(y-) Noise]], [[touchdesigner/02_The_Operators/CHOPs/Select CHOP|(y-) Select]], [[touchdesigner/02_The_Operators/CHOPs/Timer CHOP|(y-) Timer]].

✅ **You can now:** look at any node and know which family it belongs to and how to bridge between them.

---

## Stage 4 - Rendering & 3D

_Goal: turn a 3D scene into pixels and composite them. Requires Stage 3._

- [ ] **[[touchdesigner/03_Rendering_and_Output/Rendering Basics|(y-) Rendering Basics]]** - the Render TOP pipeline.
- [ ] **[[touchdesigner/03_Rendering_and_Output/Cameras and Lights|(y-) Cameras and Lights]]** - setting up a scene.
- [ ] **[[touchdesigner/03_Rendering_and_Output/Instancing|(y-) Instancing]]** - thousands of objects efficiently.
- [ ] **[[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Feedback Loops]]** - trails, blur, and accumulation.

✅ **You can now:** light and render a 3D scene and instance geometry from CHOP/SOP/POP data.

---

## Stage 5 - Intermediate Recipes

_Goal: combine what you know into richer pieces. Requires Stages 2-4._

- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-2/Real-time Audio Visualizer|(y-) Real-time Audio Visualizer]]** - FFT frequency analysis.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-2/GLSL Feedback Effect|(y-) GLSL Feedback Effect]]** - your first shader.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-2/Instanced 3D Models with PBR|(y-) Instanced 3D Models with PBR]]** - high-quality materials at scale.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-2/MediaPipe Face Tracking for Interactive Expressions|(y-) MediaPipe Face Tracking]]** - your first camera interaction.

> [!note] More intermediate recipes
> The full set lives in **[[touchdesigner/06_Recipes_and_Projects/y-2/index|(y-2) Intermediate]]** (Audio Terrain, Slit-Scan, Pixel Sorting, Organic Amoeba, Body Segmentation, and more).

✅ **You can now:** write a basic GLSL shader, analyze audio frequency, and react to a face on camera.

---

## Stage 6 - Scripting & Architecture

_Goal: make projects that scale and stay maintainable. Requires comfort with parameters and expressions._

- [ ] **[[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TD]]** - scripting inside TouchDesigner.
- [ ] **[[touchdesigner/04_Scripting_and_Architecture/The op and me objects|(y-) The op and me objects]]** - navigating the network in code.
- [ ] **[[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|(y-) Custom Parameters]]** - building your own controls.
- [ ] **[[touchdesigner/04_Scripting_and_Architecture/Cooking|(y-) Cooking]]** - how TD decides what to compute.
- [ ] **[[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes|(y-) Modular Design and Toxes]]** - reusable .tox components.
- [ ] **[[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|(y-) Performance Monitoring]]** - finding and fixing slowdowns.

✅ **You can now:** script with the `op`/`me` model, build reusable components, and diagnose performance.

---

## Stage 7 - Connectivity & Shaders

_Goal: get data in and out, and go deeper on the GPU. Requires Stage 6 for the scripting-heavy parts._

- [ ] **[[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI|(y-) OSC and MIDI]]** - control messages in and out.
- [ ] **[[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity|(y-) Audio Reactivity]]** - driving visuals from sound, properly.
- [ ] **[[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|(y-) Introduction to GLSL]]** - writing custom shaders.
- [ ] **[[touchdesigner/05_Connectivity_and_Shaders/NDI and Syphon|(y-) NDI and Syphon]]** - sharing video between apps.
- [ ] **[[touchdesigner/05_Connectivity_and_Shaders/DMX and Art-Net|(y-) DMX and Art-Net]]** - lighting control.

✅ **You can now:** wire external hardware and software, and author shaders from scratch.

---

## Stage 8 - Advanced Projects

_Goal: build the hard, impressive stuff. Requires most of the above._

- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-3/Hand Tracking Tutorial|(y-) Complete Hand Tracking Walkthrough]]** - the full MediaPipe rig.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-3/GPU Fluid Simulation|(y-) GPU Fluid Simulation]]** - stable fluids on the GPU.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-3/Reaction-Diffusion|(y-) Reaction-Diffusion]]** - organic patterns from two parameters.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-3/Vector Field Instancing|(y-) Vector Field Instancing]]** - millions of points on vortex paths.
- [ ] **[[touchdesigner/06_Recipes_and_Projects/y-3/Hand-Tracked Chaotic Attractor|(y-) Hand-Tracked Chaotic Attractor]]** - Script CHOP + Lorenz attractor.

> [!note] More advanced recipes
> The full set lives in **[[touchdesigner/06_Recipes_and_Projects/y-3/index|(y-3) Advanced]]**.

✅ **You can now:** build simulation-driven and gesture-driven installation pieces.

---

## Stage 9 - Gallery-Grade & Trending

_Goal: finished, installation-quality work. The capstone._

Head to **[[touchdesigner/08_Trending_2026/index|(y8) Trending 2026]]**, which has its own suggested build order for the ten gallery pieces (real-time AI, Gaussian splats, holistic mirror) plus five viral reels to recreate.

✅ **You can now:** ship a piece that looks finished on a big screen.

---

## Keep these open while you work

- **[[touchdesigner/Glossary|(y) Glossary]]** - every term in one place.
- **[[touchdesigner/01_Core_Concepts/Common Shortcuts|(y-) Common Shortcuts]]** - the hotkeys.
- **[[touchdesigner/07_Tutorials_and_Links/index|(y) Tutorials & Links]]** - the best external channels and resources.

---

[[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
