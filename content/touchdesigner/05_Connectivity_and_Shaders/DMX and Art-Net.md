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

## Pro-Tips

1. **Universe Management:** One DMX Universe has **512 channels**. If you are controlling RGB LEDs, that's only 170 pixels per universe (512 / 3).
2. **Refresh Rate:** Most lighting fixtures expect a 44Hz or 40Hz refresh rate. Ensure your TD network is optimized to maintain this speed.
3. **Visualization:** Always build a 3D visualization of your lights in TD (using **Instancing** and the **Geometry COMP**) before going to the physical site.

---
[[touchdesigner/05_Connectivity_and_Shaders/index|(y) Return to Connectivity & Shaders]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
