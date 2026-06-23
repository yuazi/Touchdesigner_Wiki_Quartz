---
title: "Viewer Active Mode"
tags:
  - touchdesigner
  - td/core
  - workflow
date: 2026-03-01
---

Every node in TouchDesigner can show a live preview of its output (the **Node Viewer**) right inside the network editor. Whether you can _interact_ with that preview, vs just look at it, is controlled by a separate two-stage flag system.

## Two Flags, Not One

| Flag                   | Position                 | What it does                                              |
| ---------------------- | ------------------------ | --------------------------------------------------------- |
| **Viewer Flag**        | Top-left of the node     | Toggles whether the viewer is _visible_ (preview vs icon) |
| **Viewer Active Flag** | Bottom-right of the node | Toggles whether the viewer is _interactive_               |

The viewer is visible the moment you turn on the top-left flag, but clicks still go to the node itself (drag to move, click to select). Turning on the bottom-right Viewer Active Flag passes pointer input _into_ the viewer instead.

## Toggling

| Action                                 | How                          |
| -------------------------------------- | ---------------------------- |
| Toggle Viewer Active on selected nodes | Press `a`                    |
| Momentarily activate all viewers       | Hold `Alt+a`                 |
| Toggle on a single node                | Click the bottom-right flag  |
| Open a floating, always-active viewer  | RMB the node → View...       |
| Make all new nodes show their viewer   | Edit → Preferences → Network |

When a viewer is active, the cursor changes to a `^` symbol over the node, signaling you're now manipulating the viewer's contents instead of the node.

## What "Active" Enables, Per Family

| Op family                              | Interactive in viewer                                       |
| -------------------------------------- | ----------------------------------------------------------- |
| Geo COMP / SOP                         | Orbit (LMB), pan (MMB), zoom (RMB or scroll)                |
| TOP                                    | Pan/zoom the texture, sample pixel values                   |
| CHOP                                   | Scrub the time slice, zoom into samples                     |
| Panel COMP (Button, Slider, Container) | Click, drag, type to test UI                                |
| Text DAT                               | Type directly to edit (an external editor is usually nicer) |

Note: moving content inside a node viewer doesn't change the node's parameters, with one exception: the **Camera COMP**, which writes its tumble/pan back to its transform parameters.

## Performance Caveat

Active viewers cost cook time. The viewer has to render every frame, and an interactive 3D viewer asks the network downstream of it to cook even when nothing else is consuming the output. If you have a network with dozens of active viewers, your frame rate will drop. Keep them off when you're not actively using them.

See [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|Performance Monitoring]] for diagnosing viewer-related slowdowns.

## Common Pattern: Custom Inspectors

A frequent trick: you want a always-on inspector for some op deep in your network. Drop a Container COMP somewhere convenient, set its Background TOP to your op, leave the container's Viewer Flag on. You get a live readout without polluting the original op with viewer overhead.

For something more involved, build a small Panel UI with a `Slider COMP` and a few `Field COMP`s wired to the op's parameters. See [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets|Container and Widgets]].

---

> [!tip]- 📚 Learning Path · Stage 1 - Foundations · step 7 of 44
> [[touchdesigner/01_Core_Concepts/Expressions and Parameters|(y-) ← Prev: Expressions and Parameters]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/01_Core_Concepts/Common Shortcuts|(y-) Next: Common Shortcuts →]]

---

[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
