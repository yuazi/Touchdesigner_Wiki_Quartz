---
tags:
  - touchdesigner
  - optimization
---
# Cooking in TouchDesigner

"Cooking" is TouchDesigner's term for processing and evaluating a node.

## Push vs. Pull
By default, TouchDesigner evaluates backwards from nodes that "require" data.
- **Pull Workflow:** A Render TOP demands geometry from a Geometry COMP, which demands points from a Noise SOP. Only the nodes necessary for the final output are cooked.
- **Push Workflow:** Some connections force downstream nodes to cook, even if not explicitly requested by a renderer.
- The golden rule of optimization is: **Only cook what is necessary.**

## Bypassing and Nulls
- Use a **Null OP** at the end of a chain. This separates the generation logic from the output hook, making debugging and bypassing easier.
- Connecting or passing heavy structures (like huge tables or geometry) can cause slow cooks. If a piece of logic isn't needed, toggle the node's **Bypass** flag (the yellow arrow toggle).

## Chopping Logic
Avoid heavy nested logic during rendering. Cache static values and recompute only when variables genuinely change. Use **CHOP Execute** and **DAT Execute** scripts properly so Python only runs on specific value changes rather than every frame.

[[Index|Back to Home]]
