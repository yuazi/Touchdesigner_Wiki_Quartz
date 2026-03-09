---
title: "Connecting Nodes"
tags:
  - touchdesigner
  - td/core
  - workflow
date: 2026-02-06
---

In TouchDesigner, you build networks by connecting operators.

## Left-to-Right Flow

- Most OPs have **inputs** (left) and **outputs** (right).
- Connect them by clicking the output and dragging to an input.

## Multi-Input OPs

- Some nodes like **Composite TOP** or **Math CHOP** can accept many inputs at once.
- Drag multiple outputs into their left side.

## In/Out OPs

- Use **In** and **Out** operators inside a Component (like a Base COMP) to define inputs/outputs on the Component node itself.

[[touchdesigner/01_Core_Concepts/index|↑ Back to Core Concepts]] | [[touchdesigner/index|↑ Back to TouchDesigner]]

---
