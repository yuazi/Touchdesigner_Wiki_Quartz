---
title: "Parameters"
tags:
  - touchdesigner
  - td/core
  - workflow
---
# Parameters

Every operator has a **Parameter Window** (Press `P` to toggle). This is where you configure what the node does.

## Parameter Modes
1. **Constant (Gray):** A static value you type in.
2. **Expression (Blue):** A Python script that calculates the value.
3. **Export (Green):** A value being pushed from a CHOP (using "CHOP Export"). Think *green for CHOPs*.
4. **Binding (Purple):** A bi-directional link between two parameters.

## Best Practices
- Use **Expressions** for simple logic.
- Use **CHOP Exports** for high-performance data driving (it's faster than expressions for many channels).
- Use **Binding** when building user interfaces or custom components, allowing parameters to be controlled by a script, a CHOP, or a UI element simultaneously.
---
[[touchdesigner/01_Core_Concepts/index|Back to Core Concepts]] | [[touchdesigner/index|Back to Main Page]]
