---
tags:
  - touchdesigner
  - td/recipes
  - mixing
  - recipes
  - vj
---
# Recipe: Basic A/B VJ Mixer

This recipe demonstrates how to mix between two different generative scenes (or videos) using a single crossfader, which is the foundation of any live visual performance setup.

## The Network Chain

1.  **Source A:** Create a visually interesting TOP chain (e.g., a `Noise TOP` generating a cloudy pattern).
2.  **Source B:** Create a completely different TOP chain (e.g., a `Movie File In TOP` playing a geometric loop).
3.  **The Mixer:** Create a `Cross TOP`.
4.  Connect Source A into input 1 of the Cross TOP.
5.  Connect Source B into input 2 of the Cross TOP.

## The Control Logic

1.  Create a **Slider COMP** anywhere in your network. 
2.  Dive into the Slider COMP, and right-click -> "View" on the `null1` or `out1` CHOP to open a floating panel that shows the slider changing from 0 to 1 when you drag it.
3.  **To bind it:** 
    - Select your `Cross TOP`.
    - Find the *Cross* parameter.
    - Right-click the parameter name -> select *Binding Menu* -> *Bind CHOP...*
    - Drag the channel name (usually `v1`) from the floating slider panel onto the *Cross* parameter.

Now, as you drag the UI slider left to right, your output will smoothly fade between Source A and Source B.

## Adding Spice: Effects
Between the `Cross TOP` and your final `Out TOP`, insert a few effects you want to trigger live:
*   A `Level TOP` to control master brightness/contrast.
*   An `Edge TOP` or `Feedback` loop that you can toggle on or off during drops in the music.
---
[[06_Recipes_and_Projects/index|Back to Recipes and Projects]] | [[touchdesigner/index|Back to Main Page]]
