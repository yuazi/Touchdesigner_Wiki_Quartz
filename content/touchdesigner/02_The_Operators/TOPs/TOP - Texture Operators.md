---
tags:
  - touchdesigner
  - td/operators
  - operators
  - top
date: 2026-02-11
---

# TOP - Texture Operators

TOPs ("Texture Operators") are TouchDesigner's family for 2D image work: video playback, generative imagery, compositing, and any GPU-side pixel manipulation. Per the wiki: "Texture Operators... are image operators that provide real-time, GPU-based compositing and image manipulation," and "all calculations for TOPs are performed on the system's GPU."

That GPU residency is what makes TOPs fast. Filters and composites that would crawl on the CPU run at video rate because each pixel is processed by a separate GPU thread. The trade-off is that the values you see on the cook timer for a TOP often understate the real GPU cost (more on that below).

## TOP Categories

The wiki itself only formally lists a "Sweet 16" of commonly-used TOPs (Movie File In, Ramp, Level, Transform, Over, Text, Blur, Composite, Render, CHOP to, Resolution, Crop, Select, Reorder, Cache, Displace). Practically the family groups into:

- **Generators** make pixels from nothing: Constant, Noise, Ramp, Circle, Text, Movie File In, Video Device In, NDI In, Render, **Render Simple** (2025+)
- **Filters** modify a single input: Blur, Level, Threshold, Edge, Monochrome, Transform, Crop, Lookup, Displace
- **Composites** combine multiple inputs: Composite, Over, Add, Multiply, Layer, Layout, Cross, Switch, **Layer Mix** (2025+)
- **Bridges** convert across families: CHOP to TOP, SOP to TOP (via render), POP to TOP, TOP to CHOP, Texture 3D
- **Outputs** send pixels outside: Movie File Out, Touch Out, NDI Out, Syphon/Spout Out, Video Device Out, Screen
- **AI / Hardware** (2025+): **NVIDIA RTX Video TOP** (AI super-resolution and SDR to HDR conversion via the NVIDIA RTX Video SDK; requires an RTX-series GPU)

> [!tip] Layer Mix vs Composite TOP
> **Layer Mix TOP** (2025+) is the modern choice when you need a proper layer stack with per-layer blend modes and opacity controls — like Photoshop layers. The older **Composite TOP** handles the same blending math but treats all inputs as equals with a single operation. Use Layer Mix for multi-layer designs; use Composite when a single operation across N inputs is enough.

> [!tip] Render Simple TOP
> **Render Simple TOP** (2025+) renders POP or SOP geometry to a texture without requiring a separate Camera COMP or Light COMP. It is intentionally lightweight — no shadow maps, no multi-pass — and is the fastest way to get a quick render of a POP network. When you need full control (cameras, lights, render passes), use the standard **Render TOP** instead.

> [!info] 3D Texture and 2D Array Support (TD 2025+)
> Most standard TOPs now natively process 3D textures and 2D texture arrays without conversion: Add, Blur, Composite, Displace, Feedback, HSV Adjust, Level, Multiply, Noise, Over, Threshold, and about 20 more. Previously, 3D texture work required workarounds; you can now pipe a Texture 3D TOP through a standard filter chain directly.

## Pixel Formats

Set on the Common page of every TOP. The choice is a precision/cost trade.

| Format           | Bits per channel | Range                    | Use it for                                                                |
| ---------------- | ---------------- | ------------------------ | ------------------------------------------------------------------------- |
| **8-bit fixed**  | 8 (32 / pixel)   | clamped to [0,1]         | Default. Anything destined for an 8-bit display.                          |
| **16-bit fixed** | 16 (64 / pixel)  | clamped to [0,1]         | Smoother gradients in 8-bit-bound output. Same clamp.                     |
| **16-bit float** | 16 (64 / pixel)  | any value, ±             | HDR composites, normal maps, intermediate buffers, feedback loops.        |
| **32-bit float** | 32 (128 / pixel) | any value, ± (high prec) | When you need precise math: GPGPU work, deep displacement, instance data. |

Per the wiki: "Fixed point formats, regardless of if they are 8 or 16 bit, can only represent values between 0 and 1... Floating point formats can represent very large values and very small values, both negative and positive." Picking 16- or 32-bit float on every TOP isn't free; bandwidth is the dominant TOP cost so step up only when math demands it (HDR, feedback, packed data).

## Resolution

Every TOP has Resolution and Output Resolution on the Common page. By default a filter inherits from its input; setting Custom Resolution forces a specific size. There's also a Resolution Menu (`resmenu`) preset list. The Resolution dimensions field is enabled only when the resolution mode is Custom.

Halving Resolution from 1920x1080 to 960x540 cuts GPU work to a quarter, since cost scales with pixel count. That's the most reliable single optimization for TOP-heavy networks.

## GPU Cook Times Lie

The cook times you see in the Performance Monitor for TOPs are **not** the GPU's actual processing time. The GPU runs asynchronously, so what TouchDesigner records is mostly the dispatch and waiting overhead. For real GPU profiling, use the Probe Palette tool (it tracks GPU and CPU times separately, drawn as diamonds vs circles), or step out to RenderDoc / Nvidia Nsight. See [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|Performance Monitoring]].

## Common Gotchas

- **Pre-multiplied alpha.** Most TOPs assume premultiplied RGBA. A non-premultiplied source feeding into a Composite TOP will give halo edges; run it through a Premultiply TOP first.
- **sRGB vs linear.** GPU compositing math is linear. Movie File In / Texture loads can do an sRGB-to-linear conversion via the Read sRGB toggle; matching this end-to-end avoids a washed-out output.
- **Pixel format mismatch in feedback loops.** A Feedback TOP at 8-bit fixed clamps every multiplied value to [0,1]; bright accumulation will look posterized or vanish. Switch the loop to 16- or 32-bit float.
- **Render TOP cooks every camera move.** Even if the geometry is static, moving the camera marks the Render TOP dirty. Don't expect "static = free."
- **Cross-family bridges have a cost.** CHOP to TOP and TOP to CHOP move data across the GPU/CPU boundary. Free to wire, not free to cook.

## Related Nodes

- [[Render TOP]]: the GPU pass that turns a Geo COMP + Camera + Light into a TOP
- [[Constant CHOP]] (CHOP to TOP): the bridge for piping CHOP data into a texture
- [[touchdesigner/03_Rendering_and_Output/Feedback Loops|Feedback Loops]]: TOP feedback patterns
- [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|Performance Monitoring]]: Probe and Performance Monitor for finding GPU bottlenecks

---

[[Render TOP|(y-) Next Page: Render TOP]]

---

[[touchdesigner/02_The_Operators/TOPs/index|(y) Return to TOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
