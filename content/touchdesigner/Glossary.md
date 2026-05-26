---
title: TouchDesigner Glossary
tags:
  - touchdesigner
  - reference
  - glossary
date: 2026-03-19
---

A quick reference for common TouchDesigner jargon and core concepts.

| Term                | Definition                                                                                                                                                                                   |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **OP (Operator)**   | The fundamental building blocks of a network (nodes). Categorized into 6 families: COMP, TOP, CHOP, SOP, DAT, MAT.                                                                           |
| **Cooking**         | The process where an operator recalculates its data. TD only "cooks" a node if its inputs have changed and its output is being requested by another node or a viewer.                        |
| **Dirty**           | A state an operator enters when its inputs change but it hasn't cooked yet.                                                                                                                  |
| **Binding**         | A bi-directional link between two parameters. Changing one automatically updates the other.                                                                                                  |
| **Referencing**     | A one-way Python link where one parameter "reads" the value of another (e.g., `op('null1')['chan1']`).                                                                                       |
| **Time Slice**      | The process of calculating only the data needed for the current frame. Essential for real-time performance in CHOPs.                                                                         |
| **Global Shortcut** | A name given to a COMP that allows it to be referenced from anywhere in the project using `parent.Name` or `op.Name`.                                                                        |
| **Clone**           | A system where one "Master" COMP's internal network is automatically copied to multiple "Clone" COMPs.                                                                                       |
| **Viewer Active**   | A mode where you can interact directly with a node's visual display (e.g., rotating 3D geometry or clicking buttons).                                                                        |
| **Null**            | A "do-nothing" operator used at the end of a chain. It's a best practice to reference Nulls instead of active operators to avoid breaking links when you add nodes in the middle of a chain. |
| **Network Path**    | The location of an operator in the project hierarchy (e.g., `/project1/geo1/transform1`).                                                                                                    |
| **Perform Mode**    | A specialized mode (F1) that hides the network editor and only displays a designated Window COMP for maximum performance.                                                                    |

---

[[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
