---
title: COMP - Components
tags:
  - touchdesigner
  - td/operators
  - comp
  - operators
date: 2026-02-11
---

COMPs are the family that holds _other_ networks. Every other operator family stays in its own column of the network; COMPs are the wrappers that group ops together, give them a 3D transform, host a UI panel, or run a sub-process. They're the structural backbone of any project bigger than a sketch.

## Three Sub-Families

| Sub-family         | What it is                                                                                      | Examples                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Object COMPs**   | "A subset of all Components, used to create and render 3D scenes." Each carries a 3D transform. | Geometry, Camera, Light, Ambient Light, Environment Light, Bone, Null, Handle, FBX, USD   |
| **Panel COMPs**    | "Used to create custom interactive 2D control panels and user interfaces (also called Panels)." | Container, Widget, Button, Slider, Field, Text, List, Table, OP Viewer, Parameter, Select |
| **Misc / Utility** | Everything else: logic groupings, animation, replication, time, sub-process isolation.          | Base, Animation, Replicator, Time, Engine                                                 |

## Container vs Base (the one to memorize)

| Choice                     | When to use                                                                                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Container COMP** (Panel) | Anything you want to render as a UI panel: a window of buttons, sliders, an inspector. Has Width/Height and a panel TOP.                                                      |
| **Base COMP**              | Pure logic grouping. The wiki: "no panel parameters and no 3D object parameters... a component that has no panel associated with it, nor any 3D." Use it for utility modules. |

Picking Base for a "fold this Python and CHOP logic away" group keeps the parameter dialog clean (no irrelevant Panel parameters), and avoids the cooking cost of a Container with a visible panel.

## Custom Parameters

Any COMP can have **custom parameters**: knobs you add to the wrapper, exposed at the COMP level. Inside the COMP, internal nodes bind to those parameters, so the wrapper acts as a clean module interface. This is the foundation of every reusable `.tox`. Full details on the Ch 04 page: [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]].

## Nesting and Navigation

| Action                             | How                                                             |
| ---------------------------------- | --------------------------------------------------------------- |
| Enter a COMP                       | Click the selected COMP, press `i`, or scroll-wheel into it     |
| Exit upward one level              | Press `u`, or scroll-wheel out                                  |
| Pass data across the COMP boundary | In CHOP/TOP/SOP/DAT inside the COMP, Out CHOP/TOP/SOP/DAT       |
| Reach into a parent or grandparent | `parent()`, `parent(2)`, or define Parent Shortcuts on the COMP |
| Reach into a fixed internal node   | `iop` (Internal Operator) shortcut declared on the COMP         |

See [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]] for the Python side of these.

## Building a Reusable Module

The standard recipe:

```
1. Group the network: select the nodes, RMB → Collapse Selected → Base COMP
2. Customize: RMB → Customize Component → add custom parameters
3. Bind: inside the COMP, set internal node parameters to Bind mode against the new custom parameters
4. (Optional) Add a panel: drop a Container COMP inside, add Sliders/Buttons bound to the same custom params
5. Save: RMB the wrapper → Save Component .tox
```

Now anyone (including future you) can drop the `.tox` in and get a clean parameter surface without touching internals. See [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes|Modular Design and Toxes]] for the full pattern, and [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets|Container and Widgets]] for the panel side.

## Common Gotchas

- **Container COMPs cook when visible.** A panel that's currently displayed is itself a cook request, even if the value behind it didn't change. Hide panels you're not watching, or toggle the Cooking Flag on the wrapper.
- **Replicator rebuilds wholesale.** Changing the source DAT regenerates every replicated child from scratch; in-flight state is lost. Don't use it for things that need persistent state.
- **Custom parameter name collisions.** Custom parameters live in the same namespace as built-ins on the COMP. Adding a custom `Width` to a Container quietly shadows the built-in. Capitalize and prefix to be safe.
- **Base vs Container at save time.** A Container COMP saved as a `.tox` carries panel parameters. Strip them down to a Base before saving if the module is logic-only.

## Related Nodes

- [[Geo COMP]]: the most common Object COMP, full deep-dive
- [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]]: design the wrapper interface
- [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets|Container and Widgets]]: build a Panel UI inside a Container
- [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes|Modular Design and Toxes]]: package a COMP as an external `.tox`

---

[[Geo COMP|(y-) Next Page: Geo COMP]]

---

> [!tip]- 📚 Learning Path · Stage 3 - The Operator Families · step 17 of 44
> [[touchdesigner/02_The_Operators/SOPs/SOP - Surface Operators|(y-) ← Prev: SOPs]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/02_The_Operators/DATs/DAT - Data Operators|(y-) Next: DATs →]]

---

[[touchdesigner/02_The_Operators/COMPs/index|(y) Return to COMPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
