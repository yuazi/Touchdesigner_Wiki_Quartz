---
title: "Live AI Painting with TouchDiffusion"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - ai
  - streamdiffusion
  - generative
date: 2026-06-18
---

This is the technique everyone is posting in 2026: feed any image, webcam, or generative network into a **real-time Stable Diffusion** model and watch TouchDesigner repaint it 15 to 30 times a second. Wave your hand and it becomes brushstrokes of flowers. Point the camera at your face and it becomes an oil painting that moves when you do.

> [!info] Before You Start
>
> - You need an **NVIDIA GPU** (RTX 2060 or newer; the more VRAM the better).
> - Download the **TouchDiffusion** plugin by olegchomp: [GitHub releases](https://github.com/olegchomp/TouchDiffusion).
> - This plugin wraps **StreamDiffusion**, a pipeline tuned for low-latency, frame-by-frame generation.

> [!warning] On a Mac? (read this first)
> TouchDiffusion and local StreamDiffusion need an NVIDIA GPU, so they will **not** run on Apple Silicon. As of 2026 the Mac path is to run the model in the cloud: **Hosted StreamDiffusion via Daydream**, or DotSimulate's **StreamDiffusionTD** in cloud mode. The TouchDesigner side (inputs, prompts, compositing) is identical to the steps below; only the engine lives on a remote GPU. Everything else in this chapter runs natively on macOS.

---

> [!note] Two main routes in 2026
> There are two well-supported StreamDiffusion integrations: **TouchDiffusion** (olegchomp, free, used here) and **StreamDiffusionTD** (DotSimulate, Patreon, the one most pros reference, with local or cloud modes). They work almost identically. A third route is piping frames out to a **ComfyUI** pipeline over a TCP/Spout bridge for heavier multi-model setups. Pick TouchDiffusion to start for free; graduate to StreamDiffusionTD or ComfyUI when you want more control.

## 1. Install TouchDiffusion

1.  Download and unzip the release. Run the installer script (`install.bat`) so it builds the Python environment and downloads the TensorRT engine.
2.  This step takes a while the first time. It is compiling the model into an optimized engine for your specific GPU.
3.  Open the example `.toe` once the install finishes, then drag the `TouchDiffusion.tox` into a fresh project.

> [!tip] Why TensorRT?
> Plain Stable Diffusion takes seconds per image. TensorRT plus StreamDiffusion's frame-batching trick gets you to real time. The trade-off is the long one-time compile.

---

## 2. Feed It a Source

The plugin has one image input. Whatever TOP you wire in becomes the "structure" the AI paints over.

1.  Add a **Video Device In TOP** (your webcam) or a **Movie File In TOP**.
2.  Resize it to the model resolution with a **Resolution TOP** set to `512x512`.
3.  Wire that into the TouchDiffusion input.

---

## 3. Write the Prompt

1.  Click the TouchDiffusion node and open its parameters.
2.  In **Prompt**, describe the painting you want, for example: `lush watercolor field of wildflowers, soft morning light, dreamy`.
3.  Set **Strength** (denoise) around `0.5`. Lower keeps your webcam recognizable; higher lets the AI take over completely.
4.  Set **Seed** to any number to lock a consistent style.

> [!tip] The magic ratio
> Strength `0.35` to `0.55` is the sweet spot for live performance. It keeps your motion readable while still looking fully AI-painted.

---

## 4. Make It Romantic

Swap the webcam for something personal:

1.  Drop in a **Movie File In TOP** of a video clip of the two of you.
2.  Use a prompt like `oil painting, golden hour, impressionist, tender`.
3.  Add a **Bloom TOP** and a subtle **Film Grain** after the output for a gallery finish.

---

## Troubleshooting

- **"The install failed."** - Almost always a Python or CUDA mismatch. Use the exact TouchDesigner build the plugin's README recommends and run the installer as administrator.
- **"It's only 4 FPS."** - Drop the resolution to `512x512`, reduce the number of denoise steps, and close other GPU apps. Real time needs the TensorRT engine, not the raw PyTorch path.
- **"The image flickers wildly."** - Lower the strength, and feed a smoother source (add a **Lag** or slight **Blur TOP** before the input).

---

## Next Steps

- **Animate the prompt:** Use a **DAT** to swap prompt text on a timer so the painting drifts between themes.
- **Audio-react the strength:** Bind the denoise strength to a bass envelope (see [[touchdesigner/05_Connectivity_and_Shaders/Audio Reactivity|Audio Reactivity]]) so the painting "melts" on the drop.
- **Combine with pose:** See [[touchdesigner/08_Trending_2026/ControlNet Pose to Art|ControlNet Pose-to-Art]] to steer the composition with your body.

---

## Parameter Tuning & Behavior

| Parameter              | Behavior                                                                         |
| :--------------------- | :------------------------------------------------------------------------------- |
| **Strength / Denoise** | Higher = AI dominates and ignores your input; Lower = your webcam shows through. |
| **Steps**              | Higher = more detail but slower; Lower = faster, looser, more painterly.         |
| **Seed**               | Fixed = consistent style frame to frame; Random = ever-shifting look.            |
| **Prompt weight**      | Higher = literal interpretation; Lower = loose, dreamy abstraction.              |

## Network Architecture

```text
[ SOURCE ]                     [ Video Device In TOP ] (webcam / clip)
                                      │
                                      ▼
[ RESIZE ]                     [ Resolution TOP ] (512x512)
                                      │
                                      ▼
[ AI ENGINE ]                  [ TouchDiffusion.tox ]
                               (Prompt + Strength + Seed)
                                      │
                                      ▼
[ POLISH ]                     [ Bloom TOP ] ──▶ [ Film Grain ] ──▶ [ OUT ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
