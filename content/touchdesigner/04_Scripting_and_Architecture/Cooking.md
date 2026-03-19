---
tags:
  - touchdesigner
  - td/architecture
  - optimization
date: 2026-02-21
---

# Cooking in TouchDesigner

"Cooking" is TouchDesigner's term for processing and evaluating a node.

## The Engine Architecture: Pull vs. Push

TouchDesigner evaluates its network dynamically every frame, but it fundamentally relies on a **"Pull" architecture** for most operations, with exceptions that act as a **"Push"**. Understanding this difference is the most important optimization concept in TD.

### The "Pull" (Request-Driven)

By default, nodes in TouchDesigner only cook (calculate) when their output is explicitly _requested_ by something else that needs it. This usually happens at the end of a chain.

- A **Render TOP** needs to draw a frame.
- It _pulls_ from the **Geometry COMP**, which _pulls_ from a **SOP**.
- It _pulls_ from a **Camera COMP**, which _pulls_ its translation from a **CHOP**.
- **\*Crucially:** If a node's output is not currently being used by a rendering node, an active viewer pane, or an export to a visible parameter, it simply stops cooking.\* It consumes zero CPU/GPU resources.

### The "Push" (Always Active)

Some nodes force an evaluation downstream regardless of whether the end result is being viewed or rendered.

- **CHOPs:** Moving data (like an LFO or Audio In) generally pushes data forward constantly because time-series data must be maintained frame-by-frame to be accurate.
- **Scripts & Callbacks:** Python scripts triggered by external events (OSC In, Timer CHOP completion) execute immediately when triggered.

The golden rule of optimization is: **Only cook what is necessary when it is necessary.**

## Bypassing and Nulls

- Use a **Null OP** at the end of a chain. This separates the generation logic from the output hook, making debugging and bypassing easier.
- Connecting or passing heavy structures (like huge tables or geometry) can cause slow cooks. If a piece of logic isn't needed, toggle the node's **Bypass** flag (the yellow arrow toggle).

## Chopping Logic

Avoid heavy nested logic during rendering. Cache static values and recompute only when variables genuinely change. Use **CHOP Execute** and **DAT Execute** scripts properly so Python only runs on specific value changes rather than every frame.

---
[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]]
