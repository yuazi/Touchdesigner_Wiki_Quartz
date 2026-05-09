---
title: "Python in TouchDesigner"
tags:
  - touchdesigner
  - td/architecture
  - scripting
  - python
date: 2026-02-21
---

TouchDesigner ships with Python 3 baked in. Almost every parameter, callback, and DAT can run Python, and a handful of objects (`op`, `me`, `parent`, `absTime`, ...) are auto-imported into every script and expression so you never need to import the `td` module yourself.

## Where Python Lives

Python shows up in five places. Pick the one that matches what you're doing:

| Location                  | When to use it                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Parameter expressions** | A single one-liner that recalculates each cook. Click a parameter's mode button to blue, type the expression. See [[touchdesigner/01_Core_Concepts/Expressions and Parameters\|Expressions and Parameters]]. |
| **Text DATs**             | Reusable scripts and modules. Run with the `Run Script` pulse, or import as a module.                                                                                                                        |
| **Callback DATs**         | React to TouchDesigner events. Four flavors: `Execute DAT`, `OP Execute DAT`, `CHOP Execute DAT`, `Parameter Execute DAT`.                                                                                   |
| **Script OPs**            | Define an operator's own behavior via `onCook(scriptOp)` callback. Used in `Script CHOP`, `Script TOP`, `Script SOP`, `Script DAT`.                                                                          |
| **Extensions**            | Custom Python classes attached to a COMP that add methods callable as `op('myComp').MyMethod()`.                                                                                                             |
| **Textport**              | Live REPL for testing snippets and inspecting state. Open with `Alt+T`.                                                                                                                                      |

## Auto-Imported Globals (the `td` module)

Every Python context in TouchDesigner has these names available without import:

| Name                                           | What it is                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `op`                                           | Operator finder. Call as `op('name')` or `op('/abs/path')` to fetch any op.                       |
| `me`                                           | The operator currently being evaluated.                                                           |
| `parent`                                       | The parent COMP. `parent()`, `parent(2)`, `parent.MyComp`.                                        |
| `iop`                                          | Internal Operator Shortcut. Lets a COMP expose internal ops via short names.                      |
| `ipar`                                         | Internal Parameter Shortcut. Same idea for parameters.                                            |
| `root`                                         | The topmost root op (`/`).                                                                        |
| `project`                                      | The current project session.                                                                      |
| `ext`                                          | Extension lookup, e.g. `ext.MyExtension.method()`.                                                |
| `tdu`                                          | TouchDesigner utility functions (`tdu.Position`, `tdu.remap`, ...).                               |
| `mod`                                          | Module-on-demand: `mod('myModule').func()` reaches into a Text DAT as if it were a Python module. |
| `absTime`                                      | Absolute application time, independent of the timeline.                                           |
| `families`                                     | Dict of operator families to their op types.                                                      |
| `licenses`, `monitors`, `sysinfo`, `ui`, `app` | Reflection on the running TouchDesigner.                                                          |
| `run`                                          | Schedule deferred execution.                                                                      |
| `debug`                                        | Like `print()` but prefixes with op + line info.                                                  |

See [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]] for a deeper dive on the most-used three.

## DAT Callback Types

Every callback DAT exposes a different set of functions you implement. Drop one and it scaffolds the function signatures for you.

| Callback DAT            | Fires on                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| `Execute DAT`           | Project lifecycle (`onStart`, `onCreate`, `onExit`, frame events)              |
| `OP Execute DAT`        | Watch one or many ops for events: `onCook`, `onPanelExecute`, `onChange`       |
| `CHOP Execute DAT`      | A specific CHOP's channels changing: `onValueChange`, `onOffToOn`, `onWhileOn` |
| `Parameter Execute DAT` | A specific parameter's value, expression, or mode changing                     |

Example: a Parameter Execute DAT watching a Pulse parameter to trigger an action.

```python
# Parameter Execute DAT, watching myComp.par.Reset (a Pulse)
def onPulse(par):
    print(f'reset fired on {par.owner}')
    op('feedback1').par.reset.pulse()
    return
```

## Common Patterns

```python
# Read a parameter (evaluated)
op('transform1').par.tx.eval()

# Write a parameter (constant mode auto-set)
op('transform1').par.tx = 1.0

# Set an expression
op('transform1').par.ty.expr = 'absTime.frame * 0.1'

# Pulse a Pulse parameter
op('myComp').par.Reload.pulse()

# Read a CHOP channel
op('analyze1')['rms']        # the Channel object
op('analyze1')['rms'][0]     # the current sample value

# Read a table cell
op('table1')[0, 'name']      # by row index + column name
op('table1')[3, 2]           # by row, col index

# Iterate children of a COMP
[c.name for c in op('/project1').children]

# Schedule deferred work (in milliseconds)
run("op('flash1').par.opacity = 1.0", delayMilliSeconds=500)

# Persistent storage on an op
me.store('lastVal', 42)
me.fetch('lastVal', default=0)
```

## Expression vs. DAT: Which to Use

- **Use an expression** when the value should refresh every cook from a small piece of state (current frame, another parameter, a CHOP sample). Cheap, no setup.
- **Use a DAT script** when the logic is more than one line, has side effects (writing to multiple ops, calling APIs, mutating state), or runs in response to an event.

> [!tip] Expressions evaluate every cook of the parameter's owner. A heavy expression on a parameter that cooks 60 times a second will cost you. For per-frame logic, prefer an `Execute DAT`'s `onFrameStart` callback or driving the parameter via a CHOP Export.

## Debugging

- `print(x)` and `debug(x)` both write to the **Textport** (`Alt+T`).
- The **Errors dialog** (`Alt+E`) collects every active error and warning across the project, with clickable paths.
- An **Error DAT** can subscribe to a specific op's errors and pipe them into a panel.
- A red `!` on an op means it has an error; hover for the message.

## What's Next

- [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]]
- [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]]
- [[touchdesigner/01_Core_Concepts/Expressions and Parameters|Expressions and Parameters]]

---

[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
