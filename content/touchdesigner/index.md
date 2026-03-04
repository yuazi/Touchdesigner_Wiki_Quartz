---
title: "TouchDesigner Wiki"
date: 2026-02-01
---
Welcome to your **TouchDesigner** learning wiki — a structured reference for node-based visual programming and real-time interactive media.

---

## [[touchdesigner/01_Core_Concepts/index|Back to Core Concepts]]
The fundamentals: interface, navigation, and workflow.

| Page | Description |
|------|-------------|
| [[touchdesigner/01_Core_Concepts/What is TouchDesigner\|What is TouchDesigner]] | Overview of TD and its use cases |
| [[touchdesigner/01_Core_Concepts/Interface Overview\|Interface Overview]] | Panels, panes, and the main UI |
| [[touchdesigner/01_Core_Concepts/Network Editor\|Network Editor]] | Working in the node graph |
| [[touchdesigner/01_Core_Concepts/Connecting Nodes\|Connecting Nodes]] | Wiring operators together |
| [[touchdesigner/01_Core_Concepts/Parameters\|Parameters]] | Reading and editing node parameters |
| [[touchdesigner/01_Core_Concepts/Expressions and Parameters\|Expressions and Parameters]] | Python expressions in parameters |
| [[touchdesigner/01_Core_Concepts/Viewer Active Mode\|Viewer Active Mode]] | Interacting with node viewers |
| [[touchdesigner/01_Core_Concepts/Common Shortcuts\|Common Shortcuts]] | Essential keyboard shortcuts |

---

## [[touchdesigner/02_The_Operators/index|Back to The Operators]]
The six operator families — the building blocks of every network.

| Family                                                | Role                                     |
| ----------------------------------------------------- | ---------------------------------------- |
| [[touchdesigner/02_The_Operators/TOPs/index\|TOPs]]   | 2D image & video processing (GPU)        |
| [[touchdesigner/02_The_Operators/CHOPs/index\|CHOPs]] | Numeric signals, audio & control data    |
| [[touchdesigner/02_The_Operators/SOPs/index\|SOPs]]   | 3D geometry (CPU)                        |
| [[touchdesigner/02_The_Operators/COMPs/index\|COMPs]] | Containers, 3D objects & UI panels       |
| [[touchdesigner/02_The_Operators/DATs/index\|DATs]]   | Text, tables, scripts & JSON             |
| [[touchdesigner/02_The_Operators/MATs/index\|MATs]]   | Materials & shaders for 3D geometry      |
| [[touchdesigner/02_The_Operators/POPs/index\|POPs]]   | GPU-accelerated point clouds & particles |

---

## [[touchdesigner/03_Rendering_and_Output/index|Back to Rendering & Output]]
Generating and compositing visuals.

| Page | Description |
|------|-------------|
| [[touchdesigner/03_Rendering_and_Output/Rendering Basics\|Rendering Basics]] | The Render TOP pipeline |
| [[touchdesigner/03_Rendering_and_Output/Cameras and Lights\|Cameras and Lights]] | Setting up a 3D scene |
| [[touchdesigner/03_Rendering_and_Output/Instancing\|Instancing]] | Rendering thousands of objects efficiently |
| [[touchdesigner/03_Rendering_and_Output/Feedback Loops\|Feedback Loops]] | Feeding output back into itself |

---

## [[touchdesigner/04_Scripting_and_Architecture/index|Back to Scripting & Architecture]]
Python, project structure, and performance.

| Page | Description |
|------|-------------|
| [[touchdesigner/04_Scripting_and_Architecture/Python in TD\|Python in TD]] | Writing Python inside TouchDesigner |
| [[touchdesigner/04_Scripting_and_Architecture/The op and me objects\|The op and me objects]] | Navigating the network with code |
| [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters\|Custom Parameters]] | Adding your own parameters to COMPs |
| [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes\|Modular Design and Toxes]] | Reusable components (.tox files) |
| [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets\|Container and Widgets]] | Building custom UIs |
| [[touchdesigner/04_Scripting_and_Architecture/Cooking\|Cooking]] | How TD decides what to compute |
| [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring\|Performance Monitoring]] | Finding and fixing slowdowns |

---

## [[touchdesigner/05_Connectivity_and_Shaders/index|Back to Connectivity & Shaders]]
External I/O, protocols, and GPU programming.

| Page | Description |
|------|-------------|
| [[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI\|OSC and MIDI]] | Sending and receiving control messages |
| [[touchdesigner/05_Connectivity_and_Shaders/NDI and Syphon\|NDI and Syphon]] | Sharing video between applications |
| [[touchdesigner/05_Connectivity_and_Shaders/DMX and Art-Net\|DMX and Art-Net]] | Lighting control protocols |
| [[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity\|Audio Reactivity]] | Driving visuals from audio signals |
| [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL\|Introduction to GLSL]] | Writing custom GPU shaders |

---

## [[touchdesigner/06_Recipes_and_Projects/index|Back to Recipes & Projects]]
End-to-end practical examples.

| Page | Description |
|------|-------------|
| [[touchdesigner/06_Recipes_and_Projects/Basic VJ Mixer\|Basic VJ Mixer]] | A simple live video mixer |
| [[touchdesigner/06_Recipes_and_Projects/Audio Reactive Geometry\|Audio Reactive Geometry]] | Geometry driven by audio |
| [[touchdesigner/06_Recipes_and_Projects/GLSL Feedback Effect\|GLSL Feedback Effect]] | Shader-based feedback loop |
| [[touchdesigner/06_Recipes_and_Projects/Particle System with POPs\|Particle System with POPs]] | GPU particle system |
| [[touchdesigner/06_Recipes_and_Projects/Dreamscape Particle Cloud\|Dreamscape Particle Cloud]] | Glowing particle cloud with feedback bloom (söla tutorial) |
| [[touchdesigner/06_Recipes_and_Projects/Hand Tracking\|Hand Tracking]] | MediaPipe hand tracking — gestures, landmarks, driving visuals (Torin Blankensmith) |
| [[touchdesigner/06_Recipes_and_Projects/Hand Tracking Tutorial\|★ Hand Tracking Tutorial]] | Full step-by-step: setup → watercolor brush → generative architecture |
| [[touchdesigner/06_Recipes_and_Projects/Sierpinski Tetrahedron with Hand Tracking\|3D Sierpinski Tetrahedron with Hand Tracking]] | Recursive fractal geometry with Copy SOP, controlled by wrist orientation and pinch-zoom via MediaPipe |
| [[touchdesigner/06_Recipes_and_Projects/5 Ways To Make Particles\|5 Ways To Make Particles]] | Every particle method compared: Particle SOP, POPs, Instancing, GLSL Feedback, 2D Feedback (anya maryina) |


---

## [[touchdesigner/07_Tutorials_and_Links/index|Back to Tutorials & Links]]
Curated external resources — YouTube channels, courses, and community forums.

[[index|Back to Home]]

---
