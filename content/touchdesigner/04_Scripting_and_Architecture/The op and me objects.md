---
title: "The 'op' and 'me' Objects"
tags:
  - touchdesigner
  - td/architecture
  - scripting
date: 2026-03-01
---

`op` and `me` are the two Python names you'll type more than any others in TouchDesigner. Both are auto-imported, so you never need to import the `td` module to use them.

## `op()` : Find Any Operator

`op()` is a function that returns an `OP` object given a path or a name. The path can be absolute (rooted at `/`) or relative to the calling op.

| Form                          | Resolves to                                         |
| ----------------------------- | --------------------------------------------------- |
| `op('noise1')`                | A sibling in the same network as the calling op     |
| `op('./noise1')`              | Same as above, made explicit                        |
| `op('../noise1')`             | A sibling of the _parent_ (one level up)            |
| `op('/project1/geo1/noise1')` | Absolute path from project root                     |
| `op('noise*')`                | Returns the _first_ match for the wildcard pattern  |
| `ops('noise*')`               | Returns _every_ match as a list                     |
| `opex('noise1')`              | Same as `op()` but raises an exception if not found |

`op()` returns `None` when the path doesn't resolve. Use `opex()` if you'd rather get an exception (helpful inside scripts where a typo should fail loudly).

```python
n = op('noise1')
if n:
    print(n.par.amp.eval())
```

### Global OP Shortcuts (`op.NAME`)

You can give a COMP a Global OP Shortcut name (RMB → Common page → `Global OP Shortcut`). Once set, that COMP becomes reachable from anywhere in the project as `op.YourName`, no matter where it lives in the hierarchy.

```python
op.PROJECT          # the COMP whose Global OP Shortcut is "PROJECT"
op.PROJECT.par.tx
```

This is the preferred way to reference top-level singletons (your audio engine, your settings COMP, your render output).

## `me` : The Current Operator

`me` is whatever operator is currently running the code. In a parameter expression, `me` is the operator that owns the parameter. In a Text DAT script, `me` is the DAT itself. In an Extension method, `me` is the COMP the extension is attached to.

| Common access      | Returns                                           |
| ------------------ | ------------------------------------------------- |
| `me.name`          | The operator's name as a string                   |
| `me.path`          | Full path string                                  |
| `me.par.tx`        | A parameter on the current op                     |
| `me.par.tx.eval()` | Evaluated value of that parameter                 |
| `me.parent()`      | The parent COMP (no integer means level 1)        |
| `me.inputs`        | List of upstream connected ops                    |
| `me.children`      | List of contained ops (only meaningful on a COMP) |
| `me.digits`        | Trailing digits in the name (`'noise17'` → `17`)  |

The `me.digits` attribute is useful when you replicate a node and want each copy to behave slightly differently:

```python
# Inside an expression on a Constant CHOP, replicated as constant1, constant2, ...
me.digits * 0.1
```

## `parent()` and Parent Shortcuts

`parent()` walks up the component hierarchy.

| Form                      | Resolves to                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `parent()` or `parent(1)` | The immediate parent COMP                                          |
| `parent(2)`               | Grandparent                                                        |
| `parent.MyName`           | The nearest ancestor that has a **Parent Shortcut** named `MyName` |

Counting parents with `parent(2)` is brittle: the moment you nest your COMP one level deeper, every expression breaks. Parent Shortcuts solve that.

To set a Parent Shortcut, open the COMP's parameters → Common page → `Parent Shortcut` field, type a name like `Effect`. Now from anywhere inside that COMP or any descendant, `parent.Effect` always resolves to it.

```python
parent.Effect.par.Speed = 0.5     # set the wrapper's Speed param
parent.Effect.path                # absolute path to the wrapper
```

By default `/project1` ships with the Parent Shortcut `Project`, so `parent.Project` works from anywhere as the project-root reference.

## `iop` and `ipar` : Internal Shortcuts

When building a reusable component, you'll often want to give the _outside_ world a clean name for some internal op or parameter. Two more auto-imported helpers:

- **`iop`** : Internal Operator Shortcut. Defined on a COMP's Common page. From inside the COMP, `iop.Audio` resolves to the named internal op.
- **`ipar`** : Internal Parameter Shortcut. Same idea but pointing at a specific parameter.

These keep your inner network refactorable without breaking expressions written elsewhere inside the COMP.

## Common Gotchas

> [!warning] **`me` in a non-cooking script.** In a callback DAT script (`onCook`, `onValueChange`), `me` is the DAT containing the callback, _not_ the op being watched. Use the function arguments (often called `dat`, `chop`, `par`) for the watched op.

> [!warning] **Passing `me` vs evaluating it.** `me.par.tx` is a Par object reference. `me.par.tx.eval()` is the current numeric value. In an expression, both work because the result is auto-cast, but in a script you usually want the explicit `.eval()`.

> [!warning] **Wildcard surprise.** `op('noise*')` returns just the first match. To get all matches, use `ops('noise*')`.

## What's Next

- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|Python in TouchDesigner]]
- [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]]

---

[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
