---
title: TouchDesigner Glossary
tags:
  - touchdesigner
  - reference
  - glossary
date: 2026-03-19
---

A quick reference for common TouchDesigner jargon and core concepts.

| Term                | Definition                                                                                                                                                                                                                                  |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **OP (Operator)**   | The fundamental building blocks of a network (nodes). Categorized into families: COMP, TOP, CHOP, SOP, DAT, MAT, and POP. See [[touchdesigner/02_The_Operators/index\|The Operators]].                                                      |
| **Cooking**         | The process where an operator recalculates its data. TD only "cooks" a node if its inputs have changed and its output is being requested by another node or a viewer. See [[touchdesigner/04_Scripting_and_Architecture/Cooking\|Cooking]]. |
| **Dirty**           | A state an operator enters when its inputs change but it hasn't cooked yet. The next time its output is requested, it re-cooks.                                                                                                             |
| **Binding**         | A bi-directional link between two parameters. Changing one automatically updates the other. See [[touchdesigner/01_Core_Concepts/Parameters\|Parameters]].                                                                                  |
| **Referencing**     | A one-way Python link where one parameter "reads" the value of another (e.g., `op('null1')['chan1']`). See [[touchdesigner/01_Core_Concepts/Expressions and Parameters\|Expressions and Parameters]].                                       |
| **Export**          | A one-way link where a CHOP channel drives a parameter directly, bypassing its constant value. Faster than an expression for many channels. See [[touchdesigner/01_Core_Concepts/Parameters\|Parameters]].                                  |
| **Time Slice**      | The process of calculating only the data needed for the current frame. Essential for real-time performance in CHOPs.                                                                                                                        |
| **Global Shortcut** | A name given to a COMP that allows it to be referenced from anywhere in the project using `parent.Name` or `op.Name`.                                                                                                                       |
| **Clone**           | A system where one "Master" COMP's internal network is automatically copied to multiple "Clone" COMPs.                                                                                                                                      |
| **TOX**             | A saved, reusable component exported to a `.tox` file. The unit of modular design in TD; drag one into any project to reuse it. See [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes\|Modular Design and Toxes]].     |
| **Instancing**      | Drawing many copies of one piece of geometry in a single GPU draw call, positioned and colored from CHOP/SOP/POP channels. The key to rendering thousands of objects. See [[touchdesigner/03_Rendering_and_Output/Instancing\|Instancing]]. |
| **Feedback Loop**   | Routing an operator's output back into its own input (via a Feedback TOP) to accumulate trails, blur, and motion over time. See [[touchdesigner/03_Rendering_and_Output/Feedback Loops\|Feedback Loops]].                                   |
| **Viewer Active**   | A mode where you can interact directly with a node's visual display (e.g., rotating 3D geometry or clicking buttons). See [[touchdesigner/01_Core_Concepts/Viewer Active Mode\|Viewer Active Mode]].                                        |
| **Null**            | A "do-nothing" operator used at the end of a chain. It's a best practice to reference Nulls instead of active operators to avoid breaking links when you add nodes in the middle of a chain.                                                |
| **Palette**         | The built-in browser of ready-made components and example `.tox` files, opened with `Alt+L`.                                                                                                                                                |
| **Network Path**    | The location of an operator in the project hierarchy (e.g., `/project1/geo1/transform1`).                                                                                                                                                   |
| **Perform Mode**    | A specialized mode (F1) that hides the network editor and only displays a designated Window COMP for maximum performance.                                                                                                                   |

---

[[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
