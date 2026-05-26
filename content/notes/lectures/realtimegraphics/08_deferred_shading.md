---
title: "08_deferred_shading — Deferred Shading, G-Buffers, and Visibility Buffers"
tags:
  - rtg
  - deferred-shading
  - g-buffer
  - lighting
  - rendering
date: 2026-05-15
---

[[notes/lectures/realtimegraphics/06_textures|Back: (y-06) Textures]] | [[notes/lectures/realtimegraphics/09_special_effects|Next: (y-09) Image-Space Special Effects]] | [[notes/lectures/realtimegraphics/index|RTG Index]]

## Mental Model First: Decouple Geometry From Lighting

- **Forward rendering shades every fragment, including ones that get overwritten.** With many lights or expensive fragment shaders, the wasted work is the bottleneck.
- **Deferred rendering splits the frame into two passes.** Pass 1 writes per-pixel material attributes into a set of screen-sized buffers (the G-Buffer). Pass 2 reads the G-Buffer and computes lighting once per visible pixel.
- **The G-Buffer is the contract between geometry and lighting.** Whatever the lighting model needs (position, normal, albedo, specular, roughness) must be written there. Everything else is wasted bandwidth.
- **Decoupling enables optimization, but introduces costs.** No more overdraw in shading, but G-Buffers eat memory and bandwidth, transparency breaks, and MSAA needs special handling.
- **The Visibility Buffer pushes the idea further.** Store just enough to identify the triangle, then fetch and interpolate attributes on demand inside the shading pass.

---

## 1. Forward Rendering and Its Limits

![[pictures/realtimegraphics/08/L08_Pg-03.jpg]]

<p class="image-caption">L08_Pg-03: Forward rendering is intuitive and handles multiple materials easily but pays for overdraw.</p>

Forward rendering shades every fragment that the rasterizer emits. Its advantages are pedagogical and practical: the pipeline is intuitive, each draw call can carry its own material shader, and combining different materials is natural.

The dominant disadvantage is **overdraw**. Fragments that end up occluded by later draws still ran their full fragment shader. With many light sources, the per-fragment lighting loop multiplies that wasted work. This is exactly the case modern scenes hit: hundreds of lights, expensive PBR shaders, depth complexity well above one.

---

## 2. The Deferred Rendering Idea

![[pictures/realtimegraphics/08/L08_Pg-04.jpg]]

<p class="image-caption">L08_Pg-04: Deferred rendering decouples shading from scene complexity by recording visible-surface attributes first, then lighting them.</p>

Deferred rendering decouples shading cost from scene complexity. The pipeline becomes:

1. **Geometry pass**: rasterize the scene, but instead of running a lighting shader, write each visible surface's shading attributes (position, normal, albedo, specular, roughness, ...) into several screen-sized buffers collectively called the **G-Buffer**.
2. **Shading pass**: cover the screen with a single fullscreen quad (or fullscreen triangle), and for each pixel read the G-Buffer and compute lighting exactly once.

Overdraw disappears from the shading stage. Depth-test in pass 1 ensures only the nearest surface contributes, and pass 2 runs lighting only for pixels that ended up visible.

### 💡 Intuition

Forward says "for each triangle, for each pixel it covers, shade it". Deferred says "for each pixel, find the surface that ended up visible there, then shade it". Reordering the loops is the entire trick.

---

## 3. G-Buffer Construction

![[pictures/realtimegraphics/08/L08_Pg-05.jpg]]

<p class="image-caption">L08_Pg-05: The G-Buffer is a set of screen-sized textures written simultaneously through Multiple Render Targets.</p>

A G-Buffer is a collection of screen-sized textures, each storing one channel of per-pixel material data. The choice of channels depends on the lighting model: a Blinn-Phong G-Buffer is small, a full PBR G-Buffer is large.

Implementation details:

- **Multiple Render Targets (MRT)** let one fragment shader write to up to eight color attachments in a single pass.
- **Common space matters**: positions and normals must be stored in a single, consistent coordinate frame, typically world space or view space, so the shading pass can mix them with any light.
- **Depth** comes for free from the depth buffer attached to the same framebuffer.

The G-Buffer is therefore a flat, per-pixel material database keyed by screen coordinate.

---

## 4. The Lighting Pass and Its Inputs

![[pictures/realtimegraphics/08/L08_Pg-08.jpg]]

<p class="image-caption">L08_Pg-08: A Blinn-Phong G-Buffer typically carries position, specular albedo, diffuse albedo, and normals.</p>

For Blinn-Phong, four buffers are enough: **position**, **diffuse albedo**, **specular albedo**, and **normal**. Each is a screen-sized texture indexed by pixel.

In the shading pass:

- the vertex shader emits a flat surface that covers the whole screen (a quad of two triangles, or a single oversized triangle that is slightly faster because there is no shared edge),
- the fragment shader samples each G-Buffer at the current pixel,
- it then evaluates the lighting equation as usual.

The Blinn-Phong contribution per light is

$$ \mathbf{Diffuse} = A_d \cdot L_d \cdot (\mathbf{N}\cdot\mathbf{L}), \qquad \mathbf{Specular} = A_s \cdot L_s \cdot (\mathbf{N}\cdot\mathbf{H})^p $$

with $\mathbf{H} = \frac{\mathbf{L}+\mathbf{V}}{\|\mathbf{L}+\mathbf{V}\|}$ and $\mathbf{L} = \frac{\mathbf{P}_{\text{light}}-\mathbf{P}_{\text{surface}}}{\|\mathbf{P}_{\text{light}}-\mathbf{P}_{\text{surface}}\|}$. Modern engines often replace the fullscreen quad with a compute shader so neighbouring pixels can share work.

![[pictures/realtimegraphics/08/L08_Pg-09.jpg]]

<p class="image-caption">L08_Pg-09: Sponza rendered deferred: G-Buffer channels feed a single lighting pass to produce the final image.</p>

The Sponza example shows the data flow concretely: four G-Buffer textures plus light data combine into a lighting buffer, which is then composed into the final image.

---

## 5. Transparency Breaks Deferred Shading

![[pictures/realtimegraphics/08/L08_Pg-10.jpg]]

<p class="image-caption">L08_Pg-10: The G-Buffer stores one depth per pixel, so transparent surfaces cannot be captured directly.</p>

A G-Buffer records exactly **one** depth per pixel, namely the nearest visible surface. Transparent objects need contributions from multiple surfaces along the view ray, so they cannot live in a standard G-Buffer.

The pragmatic workaround used in every shipping engine is hybrid rendering:

- render opaque geometry with the deferred pipeline,
- then run an extra forward pass for transparent objects, back-to-front, blending into the lit image.

GTA V is the canonical example: opaque world deferred, glass, particles, smoke forward.

---

## 6. The Bill: Why Deferred Has Costs

![[pictures/realtimegraphics/08/L08_Pg-11.jpg]]

<p class="image-caption">L08_Pg-11: Deferred shading trades overdraw for memory, transparency, MSAA, and material-variety headaches.</p>

The classical list of deferred shading issues:

- **Transparency** needs a separate forward pass.
- **G-Buffer memory** is large because every channel is a full-resolution screen texture.
- **Many lights** are still expensive if every light loops over every pixel.
- **Multiple materials** complicate the layout: shaders must share one G-Buffer format or branch on material ID.
- **Anti-aliasing** (MSAA) is awkward because lighting is computed after rasterization. Modern pipelines use post-process AA (FXAA, TAA, DLSS) instead.

The next sections address each of these.

### 🧠 Deep Dive: Memory Consumption

![[pictures/realtimegraphics/08/L08_Pg-14.jpg]]

<p class="image-caption">L08_Pg-14: Four 4K textures at 16 bytes per pixel is 2 GB of G-Buffer, and at 60 Hz that is 120 GB/s of bandwidth.</p>

A single RGBA32F texture is 16 bytes per pixel. At 4K resolution ($3840 \times 2160 \approx 8.3$ M pixels), one such texture is about 132 MB. Four of them weigh in around 530 MB; at 60 Hz they consume roughly 120 GB/s of memory bandwidth just for the G-Buffer.

For context, an RTX 5090 has 1800 GB/s and a PS5 has 500 GB/s. The G-Buffer alone can chew a meaningful fraction of total bandwidth, which is why production layouts aggressively pack channels and use lower-precision formats.

---

## 7. Reconstructing Position From Depth

![[pictures/realtimegraphics/08/L08_Pg-15.jpg]]

<p class="image-caption">L08_Pg-15: World-space position is reconstructed from depth and screen coordinates, saving one full G-Buffer texture.</p>

Storing a full RGBA32F world position is the most wasteful slot in the G-Buffer because it duplicates data already implicit in the depth buffer. The trick is to **reconstruct** it instead:

1. read the non-linear depth at the pixel,
2. build a normalized view ray from the pixel's screen coordinates (e.g. `gl_FragCoord`),
3. linearize depth to get the distance along that ray, recovering view-space position,
4. multiply by the inverse `ViewProjection` matrix to get world-space position.

This eliminates one entire 16-byte-per-pixel channel from the G-Buffer, paid back in a handful of ALU operations during the lighting pass.

---

## 8. Albedo and a Real Production G-Buffer

The albedo buffer needs less precision than position. Monitors output 8 bits per channel, so storing diffuse albedo as RGBA8 is enough, and the alpha slot can be reused for a scalar specular intensity. The result is a compact RGBA8 texture instead of an RGBA32F.

![[pictures/realtimegraphics/08/L08_Pg-17.jpg]]

<p class="image-caption">L08_Pg-17: Uncharted 4 packs PBR material data into two 16-bit RGBA textures, with extra textures only when materials demand them.</p>

Uncharted 4 (El Garawany, SIGGRAPH 2016) is a useful real-world reference. The base G-Buffer is two RGBA16 textures carrying albedo, normals, roughness, metallic, AO, sun shadow factors, and translucency. Complex materials (sheen, dominant direction for hair, thin-wall translucency) trigger additional textures, but only where they are needed. Production layouts are usually the result of a hard fight between artists wanting more channels and engine programmers protecting bandwidth.

---

## 9. Deferred Lighting: A Third Pass to Shrink the G-Buffer

![[pictures/realtimegraphics/08/L08_Pg-18.jpg]]

<p class="image-caption">L08_Pg-18: Deferred lighting splits the work into three passes: minimal G-Buffer, light buffer, then final shading.</p>

**Deferred lighting** (sometimes called light pre-pass) is a variant designed to shrink the G-Buffer further:

1. **Pass 1**: minimal G-Buffer with only positions, normals, and specular intensity. No albedo.
2. **Pass 2**: evaluate the lighting equation per pixel without albedo, accumulating diffuse and specular intensity into a light buffer. To fit in four channels, store just a scalar specular intensity alongside RGB diffuse light.
3. **Pass 3**: render the scene a second time, this time multiplying albedo by the pre-computed light buffer to produce final colors.

The cost is a second geometry pass; the benefit is a much smaller G-Buffer and the ability to give each material full control of its albedo and shading in pass 3. It was popular on memory-constrained consoles.

---

## 10. Light Pass Optimization With Bounding Geometry

![[pictures/realtimegraphics/08/L08_Pg-21.jpg]]

<p class="image-caption">L08_Pg-21: Point lights are drawn as instanced spheres sized by intensity; only fragments inside the sphere are shaded for that light.</p>

A fullscreen lighting pass loops over every light for every pixel, which scales badly with light count. Most lights, though, have finite range. The optimization:

- **Directional lights** still need a fullscreen pass because they affect every pixel.
- **Point lights** are bounded by a sphere; **spot lights** by a cone. Draw the bounding geometry, and the fragment shader runs only for pixels the volume covers.

For a point light with peak color $C = \max(R,G,B)$, contribution falls below $1/256$ (below the 8-bit threshold) at

$$ \frac{C \cdot \text{Intensity}}{r^2} = \frac{1}{256} \implies r = 16 \sqrt{C \cdot \text{Intensity}} $$

so radius can be derived directly from intensity. A single sphere mesh is stored on the GPU; instancing transforms position and radius per light.

Two practical issues:

- **Blending** must be additive (`VK_BLEND_OP_ADD` in Vulkan) so each light's contribution accumulates.
- **Camera inside the volume** breaks naive back-face culling. The fix is to cull front faces instead, which also clips surfaces behind the volume that should not be lit. The drawback is overdraw and repeated G-Buffer access where volumes overlap.

---

## 11. The Visibility Buffer

![[pictures/realtimegraphics/08/L08_Pg-23.jpg]]

<p class="image-caption">L08_Pg-23: A Visibility Buffer stores only depth and primitive ID, then fetches attributes on demand during shading.</p>

The **Visibility Buffer** (sometimes "deferred texturing") is a more aggressive G-Buffer redesign. Pass 1 writes only:

- depth (32 bit),
- primitive ID (32 bit),
- optionally barycentric coordinates of the hit point.

That is the minimum needed to identify which triangle a pixel saw. The shading pass then has two flavors:

1. **On-the-fly interpolation**: a per-pixel compute shader looks up the triangle's vertex attributes using the primitive ID, interpolates them with the barycentric coordinates, and shades.
2. **Worklist pass**: scan the buffer, build per-material work lists of pixel IDs, and dispatch one shading pass per material via `DrawIndirect`.

The barycentric reconstruction is the standard $P = u \cdot A + v \cdot B + (1 - u - v) \cdot C$ interpolation, evaluated for whichever vertex attributes the shader actually needs.

### 🧠 Deep Dive: When Visibility Buffers Win

A G-Buffer always pays for every channel of every pixel, even channels a particular pixel does not use. A Visibility Buffer fetches each attribute only when shading needs it, so its memory footprint is essentially fixed at 64 bits per pixel regardless of how rich the material model becomes. The cost shifts to ALU and texture cache pressure in the shading pass, which on modern GPUs is often the cheaper resource. This makes Visibility Buffers attractive for high-resolution, material-heavy renderers; engines like Unreal's Nanite path use the same idea.

---

## 12. Normal Encoding Tricks

Normals deserve their own section because they appear in almost every G-Buffer and a careless encoding wastes bandwidth or destroys precision.

### XY + Sign

![[pictures/realtimegraphics/08/L08_Pg-28.jpg]]

<p class="image-caption">L08_Pg-28: Storing only X and Y of a normalized normal lets the shader reconstruct Z, but the sign must be carried separately.</p>

A normalized normal satisfies $x^2 + y^2 + z^2 = 1$, so $z$ can be reconstructed from $x$ and $y$ via $z = \pm\sqrt{1 - (x^2 + y^2)}$. The catch is the sign: in view space, perspective projection can produce surfaces whose normal has $N_z < 0$ even though they are visible. So the sign needs an extra bit of storage somewhere in the G-Buffer.

### Best-fit Normals

![[pictures/realtimegraphics/08/L08_Pg-29.jpg]]

<p class="image-caption">L08_Pg-29: Best-fit normals trade unit length for quantization fit; reconstruction is just renormalization.</p>

Kaplanyan's best-fit normals (SIGGRAPH 2010) drop the requirement that stored normals be unit length. Instead, for each direction a scaling factor is precomputed that minimizes the quantization error after packing into a low-precision texture. The lookup factor is stored in a cube map indexed by direction. At decode time the stored value is simply normalized.

The result is dramatically better visual quality at the same bit depth than naive low-precision normals, particularly on glossy surfaces where specular highlights are sensitive to small normal errors.

---

### Applied Exam Focus

- **Forward vs deferred**: forward overdraws shading work, deferred decouples shading from geometry by writing a G-Buffer in pass 1 and lighting it in pass 2.
- **G-Buffer contents**: position (or reconstructed from depth), world-space normal, diffuse albedo, specular albedo or roughness/metallic, written via Multiple Render Targets.
- **Transparency**: cannot live in a G-Buffer because depth is single-valued; engines run a forward pass after deferred shading for transparent objects.
- **Memory and bandwidth**: a 4K RGBA32F texture is roughly 132 MB; four of them at 60 Hz is around 120 GB/s, a significant fraction of GPU bandwidth.
- **Position reconstruction**: skip the position buffer, recover view-space position from depth plus screen coordinates plus inverse projection.
- **Deferred lighting variant**: three passes (minimal G-Buffer, light buffer, final shading) trade a second geometry pass for a smaller G-Buffer and per-material albedo control.
- **Light bounding volumes**: point lights as spheres, spot lights as cones; radius from $r = 16\sqrt{C \cdot \text{Intensity}}$; additive blending; front-face culling when the camera is inside the volume.
- **Visibility Buffer**: store only depth and primitive ID, reconstruct attributes in the shading pass through barycentric interpolation; smaller and more material-flexible than a G-Buffer.
- **Normal encodings**: XY + sign halves the storage but needs the Z sign; best-fit normals minimize quantization error by relaxing unit length.

## Self-Check

1. Why does deferred shading scale better than forward shading when there are many lights?

> [!success]- Answer
> Forward shading runs the full lighting equation for every fragment of every drawn surface, even fragments that turn out to be hidden later. Deferred shading first writes geometry attributes into a G-Buffer (one pass over geometry), then runs the lighting equation in screen space once per visible pixel. The lighting cost no longer multiplies with overdraw and instead scales with screen pixels and lights.

2. Why does transparency break a standard deferred pipeline, and how do production engines work around it?

> [!success]- Answer
> A G-Buffer stores attributes for exactly one surface per pixel, namely the nearest one. Transparent surfaces need contributions from multiple surfaces along the view ray, so they cannot be encoded directly. The workaround is hybrid rendering: opaque objects go through the deferred path, then a separate forward pass renders transparent objects back-to-front, blending into the lit image.

3. Why is the position channel typically reconstructed from depth instead of stored explicitly?

> [!success]- Answer
> An RGBA32F world-position texture is 16 bytes per pixel, around 132 MB at 4K, and the data is already implicit in the depth buffer plus screen coordinates plus the inverse view-projection matrix. Reconstructing it costs a few ALU operations in the lighting pass but saves an entire G-Buffer slot's memory and bandwidth.

4. How is the radius of a point-light bounding sphere chosen, and why is it used?

> [!success]- Answer
> A point light's contribution falls as $C \cdot \text{Intensity} / r^2$. Setting that below $1/256$ (the 8-bit threshold) gives $r = 16 \sqrt{C \cdot \text{Intensity}}$. Drawing the sphere mesh restricts the lighting pass to pixels actually inside the light's effective range, so the per-light cost stops scaling with the full screen.

5. What does a Visibility Buffer store, and why does it scale better than a G-Buffer for material-rich scenes?

> [!success]- Answer
> A Visibility Buffer stores only what is needed to identify the visible triangle at each pixel: depth and primitive ID, optionally barycentric coordinates. The shading pass looks up vertex attributes through the primitive ID and interpolates them on demand. Memory is essentially fixed regardless of material complexity, so engines with many material channels (Unreal's Nanite path, for example) benefit because they no longer pay for every channel of every pixel up front.

6. Why does the lecture present the deferred lighting variant (three-pass) when the standard two-pass deferred shading already works?

> [!success]- Answer
> Deferred lighting splits work into three passes — a minimal G-Buffer of positions, normals, and specular intensity; a lighting pass that accumulates diffuse and specular intensity into a light buffer without albedo; and a second geometry pass that multiplies albedo by the pre-computed light buffer. The benefit is a much smaller G-Buffer (no albedo channel) and per-material flexibility in the final pass, where each material can apply its own shading on top of the cached lighting. The cost is one extra geometry pass. This was popular on memory-constrained consoles (PS3, Xbox 360) where every G-Buffer channel mattered.

7. How is XY + sign normal encoding different from best-fit normals, and what tradeoffs does each make?

> [!success]- Answer
> **XY + sign** stores only $x$ and $y$ of a unit normal and reconstructs $z = \pm\sqrt{1 - x^2 - y^2}$ from the unit-length constraint, with one extra bit somewhere in the G-Buffer carrying the sign of $z$ (needed because perspective can produce visible surfaces with $N_z < 0$ in view space). It halves storage but the reconstruction has poor precision near $z = 0$ where the square root flattens. **Best-fit normals** (Kaplanyan 2010) drop the unit-length requirement entirely; for each direction, a precomputed scaling factor — looked up in a cube map indexed by direction — minimizes quantization error when the normal is packed into a low-precision texture. At decode time the stored value is just renormalized. Best-fit normals give dramatically better visual quality at the same bit depth, especially on glossy surfaces where small normal errors visibly distort specular highlights.

---

[[notes/lectures/realtimegraphics/06_textures|Back: (y-06) Textures]] | [[notes/lectures/realtimegraphics/09_special_effects|Next: (y-09) Image-Space Special Effects]] | [[notes/lectures/realtimegraphics/index|RTG Index]]
