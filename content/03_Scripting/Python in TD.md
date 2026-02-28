---
tags:
  - touchdesigner
  - scripting
---
# Python in TouchDesigner

TouchDesigner integrates Python 3 deeply into its core. You can use Python to control parameters, manage logic, and build custom tools.

## The 'op' Object
`op('/project1/geo1')` - This is how you reference any operator in your network.

## The 'me' Object
`me` - Refers to the operator where the script is currently running. Very useful for relative references.

## Expressions in Parameters
Instead of a static number, you can click the parameter name and type:
- `me.time.frame` (Current frame number)
- `absTime.seconds` (Time since the project started)
- `op('null1')['chan1']` (The value of 'chan1' in the operator 'null1')

## Common Tasks
- **Driving Parameters:** Drag a CHOP channel onto a parameter and select "CHOP Reference".
- **Accessing Tables:** `op('table1')[row, col]`

[[Index|Back to Home]]
