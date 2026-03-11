---
title: "TouchDesigner Wiki"
date: 2026-02-01
---

Welcome to your **TouchDesigner** learning wiki, a structured reference for visual programming with nodes and interactive media in real time.

---

## [[touchdesigner/01_Core_Concepts/index|y\ Core Concepts]]

The fundamentals: interface, navigation, and workflow.

| Page                                                                                        | Description                         |
| ------------------------------------------------------------------------------------------- | ----------------------------------- |
| [[touchdesigner/01_Core_Concepts/What is TouchDesigner\|(y-) What is TouchDesigner]]           | Overview of TD and its use cases    |
| [[touchdesigner/01_Core_Concepts/Interface Overview\|(y-) Interface Overview]]                 | Panels, panes, and the main UI      |
| [[touchdesigner/01_Core_Concepts/Network Editor\|(y-) Network Editor]]                         | Working in the node graph           |
| [[touchdesigner/01_Core_Concepts/Connecting Nodes\|(y-) Connecting Nodes]]                     | Wiring operators together           |
| [[touchdesigner/01_Core_Concepts/Parameters\|(y-) Parameters]]                                 | Reading and editing node parameters |
| [[touchdesigner/01_Core_Concepts/Expressions and Parameters\|(y-) Expressions and Parameters]] | Python expressions in parameters    |
| [[touchdesigner/01_Core_Concepts/Viewer Active Mode\|(y-) Viewer Active Mode]]                 | Interacting with node viewers       |
| [[touchdesigner/01_Core_Concepts/Common Shortcuts\|(y-) Common Shortcuts]]                     | Essential keyboard shortcuts        |

---

## [[touchdesigner/02_The_Operators/index|y\ The Operators]]

The six operator families are the building blocks of every network.

| Family                                                  | Role                                  |
| ------------------------------------------------------- | ------------------------------------- |
| [[touchdesigner/02_The_Operators/TOPs/index\|(y-) TOPs]]   | 2D image & video processing (GPU)     |
| [[touchdesigner/02_The_Operators/CHOPs/index\|(y-) CHOPs]] | Numeric signals, audio & control data |
| [[touchdesigner/02_The_Operators/SOPs/index\|(y-) SOPs]]   | 3D geometry (CPU)                     |
| [[touchdesigner/02_The_Operators/COMPs/index\|(y-) COMPs]] | Containers, 3D objects & UI panels    |
| [[touchdesigner/02_The_Operators/DATs/index\|(y-) DATs]]   | Text, tables, scripts & JSON          |
| [[touchdesigner/02_The_Operators/MATs/index\|(y-) MATs]]   | Materials & shaders for 3D geometry   |
| [[touchdesigner/02_The_Operators/POPs/index\|(y-) POPs]]   | GPU point clouds and particles        |

---

## [[touchdesigner/03_Rendering_and_Output/index|y\ Rendering & Output]]

Generating and compositing visuals.

| Page                                                                               | Description                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------ |
| [[touchdesigner/03_Rendering_and_Output/Rendering Basics\|(y-) Rendering Basics]]     | The Render TOP pipeline                    |
| [[touchdesigner/03_Rendering_and_Output/Cameras and Lights\|(y-) Cameras and Lights]] | Setting up a 3D scene                      |
| [[touchdesigner/03_Rendering_and_Output/Instancing\|(y-) Instancing]]                 | Rendering thousands of objects efficiently |
| [[touchdesigner/03_Rendering_and_Output/Feedback Loops\|(y-) Feedback Loops]]         | Feeding output back into itself            |

---

## [[touchdesigner/04_Scripting_and_Architecture/index|y\ Scripting & Architecture]]

Python, project structure, and performance.

| Page                                                                                                 | Description                         |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [[touchdesigner/04_Scripting_and_Architecture/Python in TD\|(y-) Python in TD]]                         | Writing Python inside TouchDesigner |
| [[touchdesigner/04_Scripting_and_Architecture/The op and me objects\|(y-) The op and me objects]]       | Navigating the network with code    |
| [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters\|(y-) Custom Parameters]]               | Adding your own parameters to COMPs |
| [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes\|(y-) Modular Design and Toxes]] | Reusable components (.tox files)    |
| [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets\|(y-) Container and Widgets]]       | Building custom UIs                 |
| [[touchdesigner/04_Scripting_and_Architecture/Cooking\|(y-) Cooking]]                                   | How TD decides what to compute      |
| [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring\|(y-) Performance Monitoring]]     | Finding and fixing slowdowns        |

---

## [[touchdesigner/05_Connectivity_and_Shaders/index|y\ Connectivity & Shaders]]

External I/O, protocols, and GPU programming.

| Page                                                                                       | Description                            |
| ------------------------------------------------------------------------------------------ | -------------------------------------- |
| [[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI\|(y-) OSC and MIDI]]                 | Sending and receiving control messages |
| [[touchdesigner/05_Connectivity_and_Shaders/NDI and Syphon\|(y-) NDI and Syphon]]             | Sharing video between applications     |
| [[touchdesigner/05_Connectivity_and_Shaders/DMX and Art-Net\|(y-) DMX and Art-Net]]           | Lighting control protocols             |
| [[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity\|(y-) Audio Reactivity]]         | Driving visuals from audio signals     |
| [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL\|(y-) Introduction to GLSL]] | Writing custom GPU shaders             |

---

## [[touchdesigner/06_Recipes_and_Projects/index|y\ Recipes & Projects]]

Practical examples from start to finish.

| Page                                                                                                                                | Description                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [[touchdesigner/06_Recipes_and_Projects/Basic VJ Mixer\|(y-) Basic VJ Mixer]]                                                          | A simple live video mixer                                                                                   |
| [[touchdesigner/06_Recipes_and_Projects/Audio Reactive Geometry\|(y-) Audio Reactive Geometry]]                                        | Geometry driven by audio                                                                                    |
| [[touchdesigner/06_Recipes_and_Projects/GLSL Feedback Effect\|(y-) GLSL Feedback Effect]]                                              | Feedback loop built with shaders                                                                            |
| [[touchdesigner/06_Recipes_and_Projects/Particle System with POPs\|(y-) Particle System with POPs]]                                    | GPU particle system                                                                                         |
| [[touchdesigner/06_Recipes_and_Projects/Dreamscape Particle Cloud\|(y-) Dreamscape Particle Cloud]]                                    | Glowing particle cloud with feedback bloom (söla tutorial)                                                  |
| [[touchdesigner/06_Recipes_and_Projects/Hand Tracking\|(y-) Hand Tracking]]                                                            | MediaPipe hand tracking with gestures, landmarks, and visuals (Torin Blankensmith)                          |
| [[touchdesigner/06_Recipes_and_Projects/Hand Tracking Tutorial\|(y-) ★ Hand Tracking Tutorial]]                                        | Full walkthrough: setup → watercolor brush → generative architecture                                        |
| [[touchdesigner/06_Recipes_and_Projects/Sierpinski Tetrahedron with Hand Tracking\|(y-) 3D Sierpinski Tetrahedron with Hand Tracking]] | Recursive fractal geometry with Copy SOP, controlled by wrist orientation and pinch zoom via MediaPipe      |
| [[touchdesigner/06_Recipes_and_Projects/5 Ways To Make Particles\|(y-) 5 Ways To Make Particles]]                                      | Every particle method compared: Particle SOP, POPs, Instancing, GLSL Feedback, 2D Feedback (anya maryina)   |
| [[touchdesigner/06_Recipes_and_Projects/Hand-Tracked Chaotic Attractor\|(y-) ★ Chaotic Attractor with Hand Tracking]]                  | Lorenz attractor driven by MediaPipe hand tracking, using Script CHOP + Script SOP and optimized for M1 Pro |

---

## [[touchdesigner/07_Tutorials_and_Links/index|y\ Tutorials & Links]]

Curated external resources, including YouTube channels, courses, and community forums.

[[index|Return to Home]]

---
