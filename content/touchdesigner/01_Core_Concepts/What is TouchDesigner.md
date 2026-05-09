---
title: "What is TouchDesigner?"
tags:
  - touchdesigner
  - td/core
  - introduction
date: 2026-03-01
---

**TouchDesigner** is a node-based visual programming environment for real-time interactive multimedia, built by Toronto-based [Derivative](https://derivative.ca/). You build by wiring together small operators in a network, each one transforms data, and the result renders live every frame.

It's commonly used for:

- **Live visuals & VJing**: generative imagery driven by audio, MIDI, or DMX
- **Projection mapping**: warping output across irregular surfaces and multi-display rigs
- **Interactive installations**: Kinect, MediaPipe, OSC, and sensor-driven experiences
- **Prototyping**: quickly mocking up systems that would take weeks in C++ or Unity
- **Generative & data art**: feedback loops, particle systems, real-time shaders

## The Pull-System Mental Model

This is the single most important concept in TouchDesigner. Operators only **cook** (recalculate) when something downstream asks for their data. A `Constant CHOP → Math CHOP` chain doesn't recompute the Math when you change the Constant. It recomputes only when something further downstream (a viewer, a render pipeline, a Python script) asks the Math for a value.

Wires don't push data, they expose it. The destination pulls. See [[touchdesigner/04_Scripting_and_Architecture/Cooking|Cooking]] for the full mechanic.

## The Six Operator Families

Every operator belongs to one of six families. They generally only wire to siblings of the same family. Cross-family bridges happen through dedicated converter ops (e.g. `CHOP to DAT`, `TOP to CHOP`).

| Family   | Stands for        | What it handles                                                                                                                        |
| -------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **TOP**  | Texture Operator  | 2D images and video, GPU-accelerated. See [[touchdesigner/02_The_Operators/TOPs/index\|TOPs]]                                          |
| **CHOP** | Channel Operator  | Time-varying data: audio, animation, control signals. See [[touchdesigner/02_The_Operators/CHOPs/index\|CHOPs]]                        |
| **SOP**  | Surface Operator  | 3D geometry: polygons, NURBS, points. See [[touchdesigner/02_The_Operators/SOPs/index\|SOPs]]                                          |
| **MAT**  | Material Operator | Shaders and materials applied to 3D objects. See [[touchdesigner/02_The_Operators/MATs/index\|MATs]]                                   |
| **DAT**  | Data Operator     | Text, tables, scripts, and structured data. See [[touchdesigner/02_The_Operators/DATs/index\|DATs]]                                    |
| **COMP** | Component         | Containers that hold networks of other ops; also 3D Objects and 2D Panel UI. See [[touchdesigner/02_The_Operators/COMPs/index\|COMPs]] |
| **POP**  | Point Operator    | GPU-resident point clouds (newer family). See [[touchdesigner/02_The_Operators/POPs/index\|POPs]]                                      |

Every COMP contains a network. Every network lives in a COMP. The whole project is just a tree of components rooted at `/`.

## Licensing Tiers

TouchDesigner ships in four editions. The non-commercial edition is fully featured, _except_ for a hard resolution cap.

| Tier               | Cost                               | Key constraint                                                      |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------- |
| **Non-Commercial** | Free                               | Output capped at **1280×1280**; non-commercial use only             |
| **Educational**    | Free for verified students/schools | Same features as Commercial, no resolution cap; non-commercial only |
| **Commercial**     | $600 USD per license               | Any resolution; required if you're paid for the work                |
| **Pro**            | Higher (per Derivative pricing)    | Everything; includes Pro Support hours                              |

> [!tip] If you're learning, the Non-Commercial edition is enough for almost everything. The 1280×1280 cap only bites once you're driving a 4K wall.

## What's Next

- [[touchdesigner/01_Core_Concepts/Interface Overview|Interface Overview]]: get oriented in the UI
- [[touchdesigner/01_Core_Concepts/Network Editor|The Network Editor]]: where you'll spend most of your time
- [[touchdesigner/Glossary|Glossary]]: the vocabulary all in one place

---

[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
