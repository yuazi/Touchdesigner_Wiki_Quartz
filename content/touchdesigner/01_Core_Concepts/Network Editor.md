---
title: "The Network Editor"
tags:
  - touchdesigner
  - td/core
  - interface
date: 2026-02-06
---
[[touchdesigner/01_Core_Concepts/index|Core Concepts]]

The **Network Editor** is the main canvas where you build, connect, and manage your Operator networks. Almost everything you do in TouchDesigner happens here.

> **macOS notes:**
> - `Alt` = the `Option` key.
> - `Ctrl` shortcuts on Windows translate to `Cmd` (Command) on Mac keyboards.
> - `MMB` = middle mouse button. On a trackpad: two-finger scroll to zoom, two-finger swipe to pan.
> - `RMB` = right-click. On a trackpad: two-finger tap.

## Navigation

| Action | How |
|---|---|
| Pan | `LMB` drag in empty space (primary); two-finger swipe on trackpad |
| Zoom | Scroll wheel / two-finger scroll; or `MMB` drag left/right |
| Home view (fit all nodes) | `H` key |
| Frame selected nodes | `F` key |
| Toggle Viewer Active (selected node) | `A` key |
| Go into a COMP | `Double-click` it |
| Go up one level | `U` key, or `Esc` |
| Jump to root | `Shift + U` |

## Creating Operators
- Press **`Tab`** anywhere in the Network Editor to open the **OP Create Dialog**.
- Start typing the node name to filter. Click or press `Enter` to place.
- Alternatively, right-click in the empty network area.

## The Node Flags
Each node has small flags in its corners that control its behaviour:

| Flag | Icon position | Effect |
|---|---|---|
| **Viewer** | Bottom-left | Shows a live preview thumbnail inside the node |
| **Cook** | Bottom-right (orange) | Forces the node to always cook, even if nothing downstream needs it |
| **Display** | Right side (blue) | Determines which SOP/TOP/COMP is rendered to the viewer |
| **Bypass** | Top-left | Passes input through unchanged (like a mute) |
| **Lock** | Top-right | Freezes the output so it stops updating |
| **Clone Immune** | Top-left (on COMPs) | Prevents the node from being overridden by a master clone |

## Bookmarks
Right-click (two-finger tap on trackpad) on empty space → **Add Bookmark** to save the current view position and zoom level. Access bookmarks from the **Bookmarks menu** or with `Ctrl + 1–9`. Essential for large networks.

## Comments and Notes
- **`Shift + C`** — Add a Comment annotation (floating text label).
- **`Shift + S`** — Add a colored background Subnet box to group and document nodes visually.
- Right-click a node → **Add Comment** to attach a note directly to a node.

## The Info OP
**Middle-click (MMB)** while hovering over any node to open the **Info popup**. This shows:
- Cook time (ms)
- Resolution (for TOPs)
- Channel count and sample rate (for CHOPs)
- Error messages

This is your first debugging tool.

## Wiring Tips
- **`Ctrl + click + drag`** an output wire to fan it out to multiple destinations.
- Hold **`Alt (⌥)`** while connecting a wire to an existing connection to **insert** the new node between two existing ones.
- Wires can be hidden by right-clicking (two-finger tap) a connector → **Hide Wire**.

## Common Gotchas
- **"Why isn't my node cooking?"** — Check the Cook flag and make sure something downstream is actually requesting the output.
- **"I can't see my changes"** — Make sure the Viewer flag (bottom-left) is turned on.
- **"My network is huge and slow"** — Use `/` to search within the network. Collapse modules into COMPs with `Ctrl + Shift + C` (Network Box).

---
[[touchdesigner/01_Core_Concepts/index|Back to Core Concepts]] | [[touchdesigner/index|Back to Main Page]]
