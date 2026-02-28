---
tags:
  - touchdesigner
  - workflow
---
# Connecting Nodes

In TouchDesigner, you build networks by connecting operators.

## Left-to-Right Flow
- Most OPs have **inputs** (left) and **outputs** (right).
- Connect them by clicking the output and dragging to an input.

## Multi-Input OPs
- Some nodes like **Composite TOP** or **Math CHOP** can accept many inputs at once.
- Drag multiple outputs into their left side.

## In/Out OPs
- Use **In** and **Out** operators inside a Component (like a Base COMP) to define inputs/outputs on the Component node itself.

[[Index|Back to Home]]
