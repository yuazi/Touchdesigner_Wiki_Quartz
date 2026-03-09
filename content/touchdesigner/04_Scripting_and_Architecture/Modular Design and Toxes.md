---
tags:
  - touchdesigner
  - td/architecture
  - modular
  - python
  - tox
date: 2026-02-21
---

# Modular Design and Toxes

Keeping your networks clean, organized, and reusable.

## Toxes and Version Control (Git)

A `.tox` is a saved TouchDesigner component (like a Base COMP or Container COMP) that encapsulates a piece of your network.

- **Saving:** Right-click a COMP -> **Save Component .tox...**
- **External Loading:** On the COMP's _Common_ page, set the **External .tox** path.
- **Save on Quit:** Turn on `Save on Quit` so the `.tox` file updates automatically when you save your main project.
- **Git Best Practices:** TouchDesigner `.toe` (project) files are binary and terrible for Git version control. The standard practice is to build your project out of modular `External .tox` files. You commit the `.tox` files to Git, allowing multiple developers to work on different modules simultaneously without merge conflicts on the main `.toe` file.

## Parameter Promotion (Custom Parameters)

To make your `.tox` modules reusable, you shouldn't have to dive inside them to change settings.

1. Right-click your COMP and select **Customize Component...**
2. In the dialog, you can create custom sliders, toggles, and menus.
3. Dive inside the COMP, and use a **Parameter CHOP** or Python expressions to map these custom parameters to the nodes inside.

## Python Extensions

When your module needs complex logic or state management, loose script nodes become messy.

- **Extensions** are Python classes attached directly to a COMP.
- Right-click a COMP -> **Customize Component...** -> Go to the _Extension Code_ section and type a name (e.g., `MyModuleExt`). Click "Add".
- This attaches a Python DAT containing a class. Any functions or variables defined in this class become natively accessible as properties of that COMP.
- Example: If your extension has a function `def Fire(self):`, you can call `op('myComp').Fire()` from anywhere in the project.

## Organization Best Practices

- Use **Base COMPs** to group related logic.
- Avoid "spaghetti" wiring across levels (don't drag wires constantly in and out of COMPs). Use `Select` OPs, `In/Out` OPs, or **Global OP Shortcuts** to establish clear data highways between your modules.

[[touchdesigner/04_Scripting_and_Architecture/index|↑ Back to Scripting & Architecture]] | [[touchdesigner/index|↑ Back to TouchDesigner]]

---
