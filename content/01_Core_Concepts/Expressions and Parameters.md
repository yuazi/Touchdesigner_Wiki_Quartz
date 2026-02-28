---
tags:
  - touchdesigner
  - td/core
  - expressions
  - scripting
---
# Expressions and Parameters

Every parameter in TouchDesigner has **four modes**, switchable by clicking the small mode indicator to the left of the parameter field:

| Mode | Colour | Description |
|---|---|---|
| **Constant** | Grey | A plain, unchanging value you type in. |
| **Expression** | Green | A Python expression evaluated every cook. |
| **Export** | Purple | A CHOP or DAT export drives this value externally. |
| **Bind** | Orange | Two-way sync with another parameter. |

Right-click any parameter → **Set to Expression** (or press `=` in the field) to enter expression mode.

---

## Time References

These are the most commonly used time variables in expressions:

| Expression | Returns |
|---|---|
| `absTime.seconds` | Seconds elapsed since the project opened |
| `absTime.frame` | Absolute frame count since project opened |
| `me.time.seconds` | Seconds within the local component's timeline |
| `me.time.frame` | Frame within the local timeline |
| `me.time.rate` | The cook rate (FPS) of the local timeline |
| `iop.Geometry1.par.tx` | The `tx` parameter on a sibling node `Geometry1` |

**Example:** Make a node's X-translate oscillate at 0.5 Hz:
```python
math.sin(absTime.seconds * math.pi) * 5
```

---

## Referencing Other Operators

```python
# Get a CHOP channel value
op('lfo1')['chan1']

# Get a CHOP channel by index
op('noise1')[0]

# Get a DAT cell
op('table1')[1, 2]        # row 1, column 2
op('table1')['Name', 1]  # row with label 'Name', column 1

# Get another node's parameter value
op('geo1').par.tx.val

# Use 'me' to reference siblings relative to the current node
op(me.path + '/../sibling')[0]
```

---

## The `me` Object

`me` always refers to the **operator the script is running inside**. It's more reliable than hardcoded paths because it works wherever you copy the node.

```python
me.parent()          # The parent COMP
me.parent().par.w    # A parameter of the parent
me.inputs[0]         # First connected input
me.outputs           # List of all connected outputs
me.digits            # The trailing number in a node's name (e.g. 3 in 'lfo3')
me.name              # Node name as a string
me.path              # Full path e.g. /project1/base1/lfo1
```

---

## The `parent()` Shortcut

Instead of writing `op(me.path + '/../')`, use:
```python
parent()         # One level up
parent(2)        # Two levels up
parent().par.Inputtex  # A custom parameter on the parent
```

---

## Useful Expression Tricks

**Map a range (e.g. LFO -1→1 to 0→1):**
```python
(op('lfo1')['chan1'] + 1) / 2
```

**Conditional expression:**
```python
1 if op('button1')['chan1'] > 0.5 else 0
```

**Smoothstep (using numpy, available in TD):**
```python
x = op('lfo1')['chan1']
x * x * (3 - 2 * x)
```

---

## Common Gotchas
- **Green background on a parameter field** means expression mode is active — it's not an error.
- Division by zero in an expression **silently evaluates to 0** rather than crashing.
- `absTime.seconds` keeps counting even when playback is paused. Use `me.time.seconds` for timeline-relative time.
- Using `op('path')` with an absolute path is fragile. Prefer relative references or `me` / `parent()`.

[[Index|Back to Core Concepts]]
