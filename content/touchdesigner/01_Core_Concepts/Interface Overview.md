---
title: "Interface Overview"
tags:
  - touchdesigner
  - td/core
  - introduction
date: 2026-02-06
---

TouchDesigner's window is built from **panes**: work areas that can be split, layered, and swapped between viewer types. The pane you'll spend the most time in is the **Network Editor**, but the same window also hosts the parameter dialog, the Palette browser, the timeline, and the Textport.

## The Five Areas You'll Use Daily

1. **Menu bar (top)**: File, Edit, Window, Dialogs, Help. Most of what's here also has a keyboard shortcut.
2. **The active pane**: typically a Network Editor showing one COMP's network, but it can be any pane type (see below).
3. **Pane bar (top of each pane)**: shows the network path of what the pane is looking at. Click a `/` segment to jump up the hierarchy, or click empty space to type a path directly.
4. **Parameter dialog**: a floating panel showing the selected operator's parameters. Toggle with `p`. See [[touchdesigner/01_Core_Concepts/Parameters|Parameters]].
5. **Palette browser (left dock)**: drag-and-drop library of pre-built components. Toggle with `l`.

## Pane Types

The same pane slot can host any of these views. Switch via the icon in the pane bar:

| Pane              | What it shows                               |
| ----------------- | ------------------------------------------- |
| Network Editor    | The default: operators wired into a network |
| Geometry Viewer   | A live 3D view of any SOP/Geo COMP          |
| TOP Viewer        | A full-pane view of any TOP's output        |
| CHOP Viewer       | Channel data plotted over time              |
| Parameters        | Floating parameter dialog as a docked pane  |
| Animation Editor  | Keyframe editor for the Animation COMP      |
| Textport and DATs | Python REPL plus DAT inspector              |
| Panel             | A live preview of a custom UI Panel COMP    |
| Browser           | An embedded web browser                     |

## Splitting and Linking Panes

The TouchDesigner window can be split into 2 or more panes. Use the **Pane Layout bar** at the top of the window to pick a multi-pane layout (vertical split, horizontal split, quad), then drag the divider to resize. Each pane is independent. You can have one Network Editor showing `/project1` while another shows `/project1/geo1`, and a third TOP-viewing your final composite.

The pane bar also has icons to:

- **Link panes**, so navigating one pane causes the linked pane to follow
- **Go fullscreen** on this pane
- **Jump back/forward** through pane history (like a browser)

## Network Path

The path bar shows where you are: `/project1/geo1/transform1`. Three ways to move around:

- Click a `/` segment in the path bar to jump up
- Press `i` to enter the selected COMP
- Press `u` to go up one level

## Dialogs Worth Knowing

Triggered from the **Dialogs** menu. Bind these to muscle memory:

| Dialog              | Shortcut                  | What it does                                                                                                                             |
| ------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Performance Monitor | `Alt+Y`                   | Per-frame cook times and bottlenecks. See [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring\|Performance Monitoring]] |
| Textport            | `Alt+T`                   | Python REPL plus log output                                                                                                              |
| Component Editor    | RMB → Customize Component | Add custom parameters. See [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters\|Custom Parameters]]                          |
| Errors              | `Alt+E`                   | List of all errors / warnings across the project                                                                                         |

> [!tip] On macOS, `Alt` is the Option key. TouchDesigner intentionally uses `Ctrl` (not `Cmd`) on macOS, which differs from most Mac apps. See [[touchdesigner/01_Core_Concepts/Common Shortcuts|Common Shortcuts]].

## What's Next

- [[touchdesigner/01_Core_Concepts/Network Editor|The Network Editor]]: deeper dive into the main pane
- [[touchdesigner/01_Core_Concepts/Common Shortcuts|Common Shortcuts]]: the muscle-memory list

---

[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
