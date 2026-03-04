---
tags:
  - touchdesigner
  - td/architecture
  - scripting
date: 2026-02-21
---
[[touchdesigner/04_Scripting_and_Architecture/index|Back to Scripting & Architecture]]

# Custom Parameters

One of TouchDesigner's most powerful features is the ability to add your own parameters to any Component.

## How to Create
1. Right-click on a **Component** (like a Base COMP).
2. Select **Customize Component**.
3. Type a name and click **Add Parameter**.
4. Choose the type (Float, Int, Toggle, Menu, etc.).

## Why use them?
- Create clean "Master Control" panels for your project.
- Expose only the settings you need without digging into deep networks.
- Use Python expressions like `parent().par.MyCustomParameter` inside your child nodes.
---
[[touchdesigner/04_Scripting_and_Architecture/index|Back to Scripting & Architecture]] | [[touchdesigner/index|Back to TouchDesigner]]
