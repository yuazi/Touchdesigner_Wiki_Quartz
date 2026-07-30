---
tags:
  - touchdesigner
  - td/connectivity
  - artnet
  - dmx
  - lighting
  - io
date: 2026-02-26
---

# DMX and Art-Net (Lighting)

Controlling physical lighting fixtures and LEDs from TouchDesigner using standard protocols.

## DMX

DMX (Digital Multiplex) is the standard digital communication protocol used to control stage lighting and effects.

- **DMX Out CHOP:** Use this to send data to USB-to-DMX interfaces (like Enttec).
- **DMX In CHOP:** Use this to receive data from a physical lighting console to control your TD scene.

## Art-Net / sACN

Sending DMX data over Ethernet (UDP). This is the preferred method for high-count pixel systems (e.g., thousands of LEDs).

- **Art-Net:** Widely used, but can be less efficient than sACN for very large installations due to its broadcast nature. In TD, set the **'Local Address'** and the target **'Network Address'**.
- **sACN:** Uses multicast, making it more scalable for complex network environments.

## DMX via POPs (TD 2025+)

TouchDesigner 2025 added a GPU-native DMX path that complements the CHOP approach above.

- **DMX Fixture POP:** Define a single fixture's channel profile (pan, tilt, color, dimmer, strobe, etc.) as a POP. Combine multiple Fixture POPs for a full rig.
- **DMX Out POP:** Connects to one or more DMX Fixture POPs, merges their universes, and transmits to DMX USB (FTDI), Art-Net, sACN, or KiNET hardware in one node.

**When to use POPs vs CHOPs:**

| Scenario                                     | Recommended path                                                                 |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| Simple rig, a few fixtures                   | **DMX Out CHOP** - less setup, easier to debug                                   |
| Large LED array / pixel-mapped installation  | **DMX Out POP** - stays on GPU, scales to thousands of points                    |
| Generative lighting driven by POP simulation | **DMX Out POP** - attributes flow directly from POP chain without CPU round-trip |

## Pro-Tips

1. **Universe Management:** One DMX Universe has **512 channels**. If you are controlling RGB LEDs, that's only 170 pixels per universe (512 / 3).
2. **Refresh Rate:** Most lighting fixtures expect a 44Hz or 40Hz refresh rate. Ensure your TD network is optimized to maintain this speed.
3. **Visualization:** Always build a 3D visualization of your lights in TD (using **Instancing** and the **Geometry COMP**) before going to the physical site.

---

> [!tip]- 📚 Learning Path · Stage 7 - Connectivity & Shaders · step 39 of 44
> [[touchdesigner/05_Connectivity_and_Shaders/NDI and Syphon|(y-) ← Prev: NDI and Syphon]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-3/Hand Tracking Tutorial|(y-) Next: Complete Hand Tracking Walkthrough →]]

---

[[touchdesigner/05_Connectivity_and_Shaders/index|(y) Return to Connectivity & Shaders]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
