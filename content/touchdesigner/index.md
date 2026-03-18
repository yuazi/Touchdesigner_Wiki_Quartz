---
title: "TouchDesigner Wiki"
date: 2026-02-01
---

Welcome to your **TouchDesigner** learning wiki, a structured reference for visual programming with nodes and interactive media in real time.

> [!tip] New to TouchDesigner?
> If you've just installed the software, start with our **[[touchdesigner/06_Recipes_and_Projects/index#(y-1) Fundamentals|(y-1) Beginner Recipes]]**. They are designed to get you making visuals in under 10 minutes without needing deep technical knowledge.

---

## (y1) Core Concepts

The fundamentals: interface, navigation, and workflow.

| Page                                                                                           | Description                         | Role       |
| :--------------------------------------------------------------------------------------------- | :---------------------------------- | :--------- |
| [[touchdesigner/01_Core_Concepts/index\|(y) Index: Core Concepts]]                             | Chapter hub                         | Navigation |
| [[touchdesigner/01_Core_Concepts/What is TouchDesigner\|(y-) What is TouchDesigner]]           | Overview of TD and its use cases    | Overview   |
| [[touchdesigner/01_Core_Concepts/Interface Overview\|(y-) Interface Overview]]                 | Panels, panes, and the main UI      | UI         |
| [[touchdesigner/01_Core_Concepts/Network Editor\|(y-) Network Editor]]                         | Working in the node graph           | Workflow   |
| [[touchdesigner/01_Core_Concepts/Connecting Nodes\|(y-) Connecting Nodes]]                     | Wiring operators together           | Workflow   |
| [[touchdesigner/01_Core_Concepts/Parameters\|(y-) Parameters]]                                 | Reading and editing node parameters | Operators  |
| [[touchdesigner/01_Core_Concepts/Expressions and Parameters\|(y-) Expressions and Parameters]] | Python expressions in parameters    | Scripting  |
| [[touchdesigner/01_Core_Concepts/Viewer Active Mode\|(y-) Viewer Active Mode]]                 | Interacting with node viewers       | UI         |
| [[touchdesigner/01_Core_Concepts/Common Shortcuts\|(y-) Common Shortcuts]]                     | Essential keyboard shortcuts        | Shortcuts  |

---

## (y2) The Operators

The six operator families are the building blocks of every network.

| Family                                                             | Role                                  | Category   |
| :----------------------------------------------------------------- | :------------------------------------ | :--------- |
| [[touchdesigner/02_The_Operators/index\|(y) Index: The Operators]] | Chapter hub                           | Navigation |
| [[touchdesigner/02_The_Operators/TOPs/index\|(y-) TOPs]]           | 2D image & video processing (GPU)     | Textures   |
| [[touchdesigner/02_The_Operators/CHOPs/index\|(y-) CHOPs]]         | Numeric signals, audio & control data | Channels   |
| [[touchdesigner/02_The_Operators/SOPs/index\|(y-) SOPs]]           | 3D geometry (CPU)                     | Surface    |
| [[touchdesigner/02_The_Operators/COMPs/index\|(y-) COMPs]]         | Containers, 3D objects & UI panels    | Components |
| [[touchdesigner/02_The_Operators/DATs/index\|(y-) DATs]]           | Text, tables, scripts & JSON          | Data       |
| [[touchdesigner/02_The_Operators/MATs/index\|(y-) MATs]]           | Materials & shaders for 3D geometry   | Materials  |
| [[touchdesigner/02_The_Operators/POPs/index\|(y-) POPs]]           | GPU point clouds and particles        | Points     |

---

## (y3) Rendering & Output

Generating and compositing visuals.

| Page                                                                                  | Description                                | Role        |
| :------------------------------------------------------------------------------------ | :----------------------------------------- | :---------- |
| [[touchdesigner/03_Rendering_and_Output/index\|(y) Index: Rendering & Output]]        | Chapter hub                                | Navigation  |
| [[touchdesigner/03_Rendering_and_Output/Rendering Basics\|(y-) Rendering Basics]]     | The Render TOP pipeline                    | Rendering   |
| [[touchdesigner/03_Rendering_and_Output/Cameras and Lights\|(y-) Cameras and Lights]] | Setting up a 3D scene                      | Rendering   |
| [[touchdesigner/03_Rendering_and_Output/Instancing\|(y-) Instancing]]                 | Rendering thousands of objects efficiently | Rendering   |
| [[touchdesigner/03_Rendering_and_Output/Feedback Loops\|(y-) Feedback Loops]]         | Feeding output back into itself            | Compositing |

---

## (y4) Scripting & Architecture

Python, project structure, and performance.

| Page                                                                                                    | Description                         | Role         |
| :------------------------------------------------------------------------------------------------------ | :---------------------------------- | :----------- |
| [[touchdesigner/04_Scripting_and_Architecture/index\|(y) Index: Scripting & Architecture]]              | Chapter hub                         | Navigation   |
| [[touchdesigner/04_Scripting_and_Architecture/Python in TD\|(y-) Python in TD]]                         | Writing Python inside TouchDesigner | Scripting    |
| [[touchdesigner/04_Scripting_and_Architecture/The op and me objects\|(y-) The op and me objects]]       | Navigating the network with code    | Scripting    |
| [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters\|(y-) Custom Parameters]]               | Adding your own parameters to COMPs | Architecture |
| [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes\|(y-) Modular Design and Toxes]] | Reusable components (.tox files)    | Architecture |
| [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets\|(y-) Container and Widgets]]       | Building custom UIs                 | UI           |
| [[touchdesigner/04_Scripting_and_Architecture/Cooking\|(y-) Cooking]]                                   | How TD decides what to compute      | Performance  |
| [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring\|(y-) Performance Monitoring]]     | Finding and fixing slowdowns        | Performance  |

---

## (y5) Connectivity & Shaders

External I/O, protocols, and GPU programming.

| Page                                                                                          | Description                            | Role       |
| :-------------------------------------------------------------------------------------------- | :------------------------------------- | :--------- |
| [[touchdesigner/05_Connectivity_and_Shaders/index\|(y) Index: Connectivity & Shaders]]        | Chapter hub                            | Navigation |
| [[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI\|(y-) OSC and MIDI]]                 | Sending and receiving control messages | I/O        |
| [[touchdesigner/05_Connectivity_and_Shaders/NDI and Syphon\|(y-) NDI and Syphon]]             | Sharing video between applications     | I/O        |
| [[touchdesigner/05_Connectivity_and_Shaders/DMX and Art-Net\|(y-) DMX and Art-Net]]           | Lighting control protocols             | I/O        |
| [[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity\|(y-) Audio Reactivity]]         | Driving visuals from audio signals     | I/O        |
| [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL\|(y-) Introduction to GLSL]] | Writing custom GPU shaders             | Shaders    |

---

## (y6) Recipes & Projects

Practical examples from start to finish.

| Page                                                                                                                                       | Description                                                                                                 | Role       |
| :----------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- | :--------- |
| [[touchdesigner/06_Recipes_and_Projects/index\|(y) Index: Recipes & Projects]]                                                             | Chapter hub                                                                                                 | Navigation |
| [[touchdesigner/06_Recipes_and_Projects/Basic VJ Mixer\|(y-) Basic VJ Mixer]]                                                              | A simple live video mixer                                                                                   | Recipe     |
| [[touchdesigner/06_Recipes_and_Projects/Audio Reactive Geometry\|(y-) Audio Reactive Geometry]]                                            | Geometry driven by audio                                                                                    | Recipe     |
| [[touchdesigner/06_Recipes_and_Projects/GLSL Feedback Effect\|(y-) GLSL Feedback Effect]]                                                  | Feedback loop built with shaders                                                                            | Recipe     |
| [[touchdesigner/06_Recipes_and_Projects/Particle System with POPs\|(y-) Particle System with POPs]]                                        | GPU particle system                                                                                         | Recipe     |
| [[touchdesigner/06_Recipes_and_Projects/Dreamscape Particle Cloud\|(y-) Dreamscape Particle Cloud]]                                        | Glowing particle cloud with feedback bloom (söla tutorial)                                                  | Recipe     |
| [[touchdesigner/06_Recipes_and_Projects/Hand Tracking\|(y-) Hand Tracking]]                                                                | MediaPipe hand tracking with gestures, landmarks, and visuals (Torin Blankensmith)                          | Recipe     |
| [[touchdesigner/06_Recipes_and_Projects/Hand Tracking Tutorial\|(y-) ★ Hand Tracking Tutorial]]                                            | Full walkthrough: setup → watercolor brush → generative architecture                                        | Project    |
| [[touchdesigner/06_Recipes_and_Projects/Sierpinski Tetrahedron with Hand Tracking\|(y-) 3D Sierpinski Tetrahedron with Hand Tracking]]     | Recursive fractal geometry with Copy SOP, controlled by wrist orientation and pinch zoom via MediaPipe      | Project    |
| [[touchdesigner/06_Recipes_and_Projects/5 Ways To Make Particles\|(y-) 5 Ways To Make Particles]]                                          | Every particle method compared: Particle SOP, POPs, Instancing, GLSL Feedback, 2D Feedback (anya maryina)   | Guide      |
| [[touchdesigner/06_Recipes_and_Projects/Hand-Tracked Chaotic Attractor\|(y-) ★ Chaotic Attractor with Hand Tracking]]                      | Lorenz attractor driven by MediaPipe hand tracking, using Script CHOP + Script SOP and optimized for M1 Pro | Project    |
| [[touchdesigner/06_Recipes_and_Projects/Real-time Audio Visualizer\|(y-) Real-time Audio Visualizer with FFT and Instancing]]              | Professional audio visualizer using Audio Spectrum CHOP, FFT analysis, and geometry instancing              | Project    |
| [[touchdesigner/06_Recipes_and_Projects/GPU Fluid Simulation\|(y-) GPU Fluid Simulation with Feedback TOPs]]                               | Real-time GPU-accelerated fluid simulation using Feedback TOP system for velocity and density fields        | Project    |
| [[touchdesigner/06_Recipes_and_Projects/Instanced 3D Models with PBR\|(y-) Instanced 3D Models with PBR Materials]]                        | Efficiently render thousands of 3D models using instancing with Physically Based Rendering (PBR) materials  | Project    |
| [[touchdesigner/06_Recipes_and_Projects/Real-time Motion History and Optical Flow\|(y-) Real-time Motion History Images and Optical Flow]] | Motion analysis using Motion History Images (MHI) and Optical Flow techniques for interactive installations | Project    |

---

## (y7) Tutorials & Links

Curated external resources, including YouTube channels, courses, and community forums.

[[index|(y) Return to Home]]

---
