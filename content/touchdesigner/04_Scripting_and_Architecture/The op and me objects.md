---
tags:
  - touchdesigner
  - td/architecture
  - scripting
date: 2026-03-01
---
# The 'op' and 'me' Objects

These are the most common Python objects you will use.

## op()
Used to find other operators.
- `op('null1')` - Looks in the same network level.
- `op('../null1')` - Looks in the parent level.
- `op('/project1/null1')` - Absolute path from the root.

## me
Refers to the operator where the code is written.
- `me.parent()` - Reference the component containing this node.
- `me.name` - Get the name of the current node.
---
[[touchdesigner/04_Scripting_and_Architecture/index|Back to Scripting & Architecture]] | [[touchdesigner/index|Back to TouchDesigner]]

---
[[touchdesigner/04_Scripting_and_Architecture/index|Back to Scripting & Architecture]]
