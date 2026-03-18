---
tags:
  - touchdesigner
  - td/connectivity
  - ndi
  - syphon
  - video
  - io
date: 2026-02-26
---

# NDI and Syphon (Video Sharing)

Sharing real-time video textures between applications without using excessive CPU.

## NDI (Network Device Interface)

Video over IP. Useful for sending video to/from other computers on the same network. It is cross-platform.

- **Video Stream In TOP:** Select NDI source.
- **Video Stream Out TOP:** Send NDI stream.

## Syphon (macOS) / Spout (Windows)

Zero-latency GPU memory sharing on the same machine. Since you are on macOS, you will use **Syphon**.

- **Syphon Spout In TOP:** Receive video from another app (like Resolume or MadMapper) on your Mac.
- **Syphon Spout Out TOP:** Send your TouchDesigner video output to another app.

_Note: In TouchDesigner, the node is called `Syphon Spout` to support both OS types, but on Mac, it utilizes the Syphon protocol under the hood._

---

[[touchdesigner/05_Connectivity_and_Shaders/index|(y) Return to Connectivity & Shaders]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
