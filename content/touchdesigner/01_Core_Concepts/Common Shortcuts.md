---
title: "Common Shortcuts"
tags:
  - touchdesigner
  - td/core
  - workflow
date: 2026-02-06
---

The shortcuts below are the high-frequency ones worth committing to muscle memory. TouchDesigner has many more (see the [official Application Shortcuts page](https://docs.derivative.ca/Application_Shortcuts) for the full list).

> [!note] **macOS:** TouchDesigner uses `Ctrl`, _not_ `Cmd`, for its keyboard shortcuts on macOS. This is intentional and differs from most Mac apps. `Alt` translates to the Option (`⌥`) key.

## Network Navigation

| Key       | Action                                       |
| --------- | -------------------------------------------- |
| `Tab`     | Open the Operator Create Dialog              |
| `i`       | Enter the selected COMP                      |
| `u`       | Go up one level to the parent                |
| `Enter`   | Enter the selected COMP (alternative to `i`) |
| `Esc`     | Cancel current action                        |
| `h`       | Frame home (fit network to view)             |
| `Shift+h` | Frame the selected node                      |
| `f`       | Frame all nodes                              |
| `o`       | Toggle network overview                      |

## Operator Manipulation

| Key                            | Action                                                                    |
| ------------------------------ | ------------------------------------------------------------------------- |
| `a`                            | Toggle Viewer Active on selected nodes (`Alt+a` for momentary all-active) |
| `p`                            | Toggle the Parameter dialog                                               |
| `c`                            | Toggle the Color palette                                                  |
| `s`                            | Toggle wire style (splines vs straight lines)                             |
| `Middle Mouse`                 | Show operator info/status overlay                                         |
| `Ctrl+A`                       | Select all                                                                |
| `Ctrl+C` / `Ctrl+V` / `Ctrl+X` | Copy / paste / cut                                                        |
| `Del`                          | Delete selected                                                           |

## Dialogs and Panes

| Key                 | Action                                          |
| ------------------- | ----------------------------------------------- |
| `Alt+T`             | Open Textport (Python REPL + log)               |
| `Alt+Y`             | Open Performance Monitor                        |
| `Alt+H`             | Open Help                                       |
| `Alt+1` ... `Alt+9` | Switch the active pane to a different view type |
| `Alt+\`             | Stow pane                                       |
| `Alt+Z`             | Close pane                                      |
| `F1`                | Toggle Designer ↔ Perform mode                  |

## Timeline

| Key           | Action                           |
| ------------- | -------------------------------- |
| `Space`       | Play / pause the global timeline |
| `Right Arrow` | Step forward one frame           |
| `Left Arrow`  | Step back one frame              |
| `Ctrl+Space`  | Toggle global cooking            |

There is no keyboard shortcut to reset the timeline to frame 1. Use the Reset transport button in the Timeline bar.

## File Operations

| Key                       | Action                               |
| ------------------------- | ------------------------------------ |
| `Ctrl+N`                  | New project                          |
| `Ctrl+O`                  | Open `.toe`                          |
| `Ctrl+S` / `Ctrl+Shift+S` | Save / Save As                       |
| `Ctrl+I`                  | Import file into the current network |

## Customization

Application shortcuts can be edited and customized in TouchDesigner's preferences. There are also two related but distinct shortcut systems:

- **Panel Shortcuts**: keyboard hooks you wire into custom Panel COMPs you build yourself
- **Operator Shortcuts**: not keyboard shortcuts at all, but Python references like `op.PROJECT` and `parent().Some` for accessing components from anywhere. See [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]]

---

> [!tip]- 📚 Learning Path · Stage 1 - Foundations · step 8 of 44
> [[touchdesigner/01_Core_Concepts/Viewer Active Mode|(y-) ← Prev: Viewer Active Mode]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-1/Basic VJ Mixer|(y-) Next: Basic VJ Mixer →]]

---

[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
