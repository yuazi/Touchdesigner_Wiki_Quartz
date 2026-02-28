---
tags:
  - touchdesigner
  - td/connectivity
  - ndi
  - syphon
  - video
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

*Note: In TouchDesigner, the node is called `Syphon Spout` to support both OS types, but on Mac, it utilizes the Syphon protocol under the hood.*
---
[[05_Connectivity_and_Shaders/index|Back to Connectivity and Shaders]] | [[index|Back to Main Page]]
