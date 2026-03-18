---
tags:
  - touchdesigner
  - td/recipes
  - feedback
  - top
  - okamirufu
date: 2026-03-18
---

# Recipe: Chromatic Aberration Feedback

The signature post-processing technique used by [Okamirufu Vizualizer](https://www.youtube.com/@OkamirufuV) to give generative visuals a "rendered," high-end feel. It uses time-delayed RGB splitting to create movement-based color separation.

> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Time-based caching and feedback loops.

---

## Part 1: Movement-Based RGB Split

Instead of a static lens effect, this technique separates colors based on time, making fast-moving objects "ghost" in different colors.

1.  **Cache TOP:** Take your final **Render TOP** and connect it to a **Cache TOP**.
    - **Cache Size** → `20`.
2.  **Select TOPs:** Create three **Select TOPs** pointing to your Cache TOP.
    - Select 1: Set **Cache Index** to `0` (current frame).
    - Select 2: Set **Cache Index** to `-5`.
    - Select 3: Set **Cache Index** to `-10`.
3.  **Reorder TOP:** Connect all three Select TOPs to a **Reorder TOP**.
    - **Output Red** → `Input 1` (Red).
    - **Output Green** → `Input 2` (Green).
    - **Output Blue** → `Input 3` (Blue).
4.  **The Result:** You now have an RGB split that only appears when objects move.

---

## Part 2: Growth Feedback Loop

To make the visuals "bloom" and grow over time:

1.  **Feedback TOP:** Connect your Reorder TOP to a **Feedback TOP**.
2.  **Transform TOP:** Add a **Transform TOP** after the feedback.
    - **Scale** → `1.005`.
    - **Rotate** → `0.1`.
3.  **Level TOP:** Add a **Level TOP** after the transform.
    - **Opacity** → `0.98`.
4.  **Blur TOP:** Add a **Blur TOP** after the level.
    - **Filter Size** → `2` (Small).
5.  **Composite TOP:** Connect your Reorder TOP and the Blur TOP to a **Composite TOP**.
    - **Operation** → `Screen` or `Add`.
6.  **Close the Loop:** Drag the Composite TOP back onto the **Feedback TOP**.

---

## Part 3: Final Polishing

1.  **Luma Blur TOP:** Connect your composite to a **Luma Blur TOP** for a final soft glow.
2.  **HSV Adjust TOP:** Use this to boost **Saturation** and slightly shift the **Hue** for a more psychedelic feel.

---

## Troubleshooting

- **"It's getting too bright!"** — Lower the **Opacity** on your Level TOP or the **Brightness** of the feedback.
- **"The trails aren't moving."** — Make sure the **Transform TOP** has a non-zero **Scale** or **Rotate**.

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
