---
title: "15_virtual_textures  -  Virtual Textures"
tags:
  - rtg
  - virtual-textures
  - clipmap
  - megatexture
  - nanite
  - rendering
date: 2026-07-11
---

[[notes/lectures/realtimegraphics/14_visibility|Back: (y-14) Visibility]] | [[notes/lectures/realtimegraphics/index|RTG Index]]

## Mental Model First: Virtual Memory, but for Texels

- **A world-sized texture never fits in GPU memory, and it never has to.** At any moment the camera only sees a tiny subset of texels at any given resolution, so the trick is to keep only that subset resident.
- **The mechanism is literally virtual memory**: split the texture into pages (tiles), translate virtual to physical addresses with a page table (lookup texture), and service page faults (tile faults) by streaming the missing tiles from disk.
- **Clipmaps are the terrain-shaped special case**: each mipmap level stores only a window around the viewer, with each coarser level covering twice the area at half the detail, updated with wrap-around as the viewer moves.
- **The same virtualization applies to geometry.** Geometry clipmaps tessellate terrain on the GPU from height-map textures, and Nanite virtualizes triangle clusters the same way it virtualizes texels: load on demand, straight from SSD to GPU.

---

## 1. The Texture LOD Problem

![[pictures/realtimegraphics/15/L15_Pg-03.jpg]]

<p class="image-caption">L15_Pg-03: Lots of detail needs lots of memory, but at any moment only the red parts of the mip pyramid are actually needed  -  high detail close to the viewer, low detail far away.</p>

Recall the **mipmap**: an image pyramid ("mip" from _multum in parvo_, much in little) for fast minification filtering. The problem it does not solve: lots of detail needs lots of memory. A high-resolution texture over a large world would need its full pyramid in memory, yet the view needs **high detail only for close objects and low detail for far objects**. Only a small subset of each mip level (the red regions on the slide) is actually required at any time. Keeping everything else resident is pure waste.

## 2. Clipmaps

![[pictures/realtimegraphics/15/L15_Pg-04.jpg]]

<p class="image-caption">L15_Pg-04: The clipmap (Tanner et al. 98) stores per mip level only a small window around the viewer; level n-1 covers twice the area of level n at roughly half the detail.</p>

For terrain textures the needed subset has a predictable shape: a window **surrounding the viewer**. The **clipmap** [Tanner et al. 98] exploits this: each mipmap level saves only a small part of the texture around the viewer, where level $n-1$ covers **twice the area** of level $n$ at roughly **half the detail**. Stacked, these windows provide exactly the resolution falloff perspective projection wants: finest texels underfoot, coarser rings further out.

![[pictures/realtimegraphics/15/L15_Pg-07.jpg]]

<p class="image-caption">L15_Pg-07: Wrap-around updates  -  as the viewer moves, the old region is invalidated and the newly exposed region is streamed from disk, with whole levels validated or invalidated as needed.</p>

When the viewer moves, the clipmap is refreshed with **wrap-around updates**: invalidate the old region, update the newly exposed region from disk, and invalidate or validate whole levels if required. The wrap-around (toroidal) addressing means the window never has to be physically scrolled in memory.

## 3. Virtual Memory for Textures

![[pictures/realtimegraphics/15/L15_Pg-05.jpg]]

<p class="image-caption">L15_Pg-05: The three components of virtual memory  -  pages (the actual memory), a page table (virtual-to-real address translation), and a page fault function that triggers loading of missing pages.</p>

Clipmaps are terrain-specific. The general solution copies the operating system's **virtual memory** design, which has three components:

- **Pages**: the actual memory, in fixed-size chunks.
- **Page table**: translates virtual addresses to real addresses.
- **Page fault function**: triggered on access to a missing page, loads it.

![[pictures/realtimegraphics/15/L15_Pg-06.jpg]]

<p class="image-caption">L15_Pg-06: Tiled virtual textures  -  a sparsely resident texture pyramid managed as a quadtree, a lookup texture as page table, and a physical page texture holding the resident tiles.</p>

**Tiled virtual textures** map these components one-to-one:

- The large texture is split into **tiles** (= pages), organized as a **quadtree over a sparsely resident texture pyramid**.
- A **lookup texture** (= page table) translates virtual texture coordinates into the **physical page texture** where resident tiles actually live.
- An **additional render pass** determines the **tile faults** (= page faults): which tiles the current frame needed but were not resident.

![[pictures/realtimegraphics/15/L15_Pg-09.jpg]]

<p class="image-caption">L15_Pg-09: The tile fault pass renders texture requests to a low-resolution buffer and traverses the tile quadtree breadth-first to schedule loads.</p>

The **tile fault pass** renders the texture requests of the visible scene into a **low-resolution buffer** (which tile, which mip level per pixel), then traverses the quadtree **breadth-first** to schedule the missing tiles for loading. Coarse parents load before fine children, so something displayable is always resident and detail refines as the streaming catches up.

### 💡 Intuition

id Software's megatexture in Rage is the canonical shipped example: the whole game world is one giant virtual texture, and artists paint it as if memory were infinite. The renderer's contract is weaker than the OS's, though: a page fault in an OS must block, while a tile fault just means this frame samples the parent mip and the detail pops in a few frames later. That tolerance for stale data is what makes texture virtualization real-time friendly.

## 4. Geometry Clipmaps

![[pictures/realtimegraphics/15/L15_Pg-10.jpg]]

<p class="image-caption">L15_Pg-10: Geometry clipmaps (Losasso et al. 04)  -  height values are looked up from textures and triangles are created on the fly in the geometry or tessellation shader.</p>

The clipmap idea transfers from texels to vertices. **Geometry clipmaps** [Losasso et al. 04] store the terrain **height map in textures** and perform **tessellation on the GPU**: triangles are created on the fly in the geometry or tessellation shader, at a density that follows the clipmap rings around the viewer. Geometry stops being a stored mesh and becomes a decoded, viewer-centered representation of a texture.

![[pictures/realtimegraphics/15/L15_Pg-12.jpg]]

<p class="image-caption">L15_Pg-12: Adding high-resolution detail on top of the streamed terrain patches  -  the coarse patch structure carries the far field while procedural or streamed detail refines the near field.</p>

The terrain is organized in **patches**, with high-resolution detail added near the viewer on top of the streamed coarse structure, mirroring how the texture clipmap layers its windows.

## 5. Nanite Revisited: Everything Virtualized

![[pictures/realtimegraphics/15/L15_Pg-13.jpg]]

<p class="image-caption">L15_Pg-13: Unreal Engine 5 Nanite combines every performance technique of the last three lectures  -  virtualized textures, view-dependent LOD, last-frame occlusion culling, visibility buffer shading, compute-shader rasterization of small triangles, and DirectStorage streaming with GPU decompression.</p>

Unreal Engine 5's **Nanite** is the synthesis of lectures 13 through 15, a combination of performance techniques for very large scenes:

- **Detail textures, shadow maps, etc. all use virtualized textures** (this lecture).
- **View-dependent LOD** controls the amount of geometry (lecture 13).
- **Occlusion culling**: simple but effective, render first what was visible in the last frame, giving an efficient form of early-z culling (lecture 14).
- **Visibility buffer and deferred shading** control the shading load.
- **Small triangles are rasterized with a compute shader**, which is faster than the hardware rasterizer for pixel-sized triangles.
- **Data is loaded on demand, directly from SSD to GPU** (DirectStorage).
- **Decompression after loading uses Lempel-Ziv hardware on the GPU.**

This combination is what the slogan **"the end of polycounts"** means: with geometry, textures, and visibility all virtualized and streamed on demand, the asset budget is no longer the polygon count of the scene but the pixels of the frame, the output-sensitive ideal of lecture 14.

---

### Applied Exam Focus

- **Problem**: mipmapped world-scale textures need too much memory, but only small parts of each level are needed (fine near, coarse far).
- **Clipmap** (Tanner et al. 98): per mip level store only a window around the viewer; level $n-1$ covers twice the area of level $n$ at half detail; maintained with wrap-around updates (invalidate old region, stream new region, validate/invalidate levels).
- **Virtual memory components**: pages (memory), page table (virtual-to-real translation), page fault function (loads missing pages).
- **Tiled virtual textures**: tiles = pages in a quadtree over a sparse texture pyramid; lookup texture = page table pointing into the physical page texture; extra render pass detects tile faults.
- **Tile fault pass**: render texture requests to a low-res buffer, breadth-first quadtree traversal, coarse before fine.
- **Geometry clipmaps** (Losasso et al. 04): height lookup from textures, triangles created on the fly in the geometry/tessellation shader, terrain patches plus near-field detail.
- **Nanite**: virtualized textures everywhere, view-dependent LOD, last-frame occlusion culling, visibility buffer + deferred shading, compute-shader rasterization of small triangles, DirectStorage SSD-to-GPU streaming, Lempel-Ziv GPU decompression. "The end of polycounts."

## Self-Check

1. Why is a fully resident mipmap pyramid wasteful for a large world texture?

> [!success]- Answer
> At any moment the view needs high detail only for close surfaces and low detail for far surfaces, so only a small region of each mip level is actually sampled. A fully resident pyramid keeps every texel of every level in memory even though the vast majority can never be accessed from the current viewpoint. Lots of detail needs lots of memory, but the needed working set is tiny.

2. Describe the clipmap: what is stored per level, and how is it updated as the viewer moves?

> [!success]- Answer
> A clipmap (Tanner et al. 98) stores per mipmap level only a small window of the texture surrounding the viewer, where level n-1 covers twice the area of level n at roughly half the detail. As the viewer moves, wrap-around updates invalidate the old region, stream the newly exposed region from disk, and validate or invalidate entire levels as required; toroidal addressing avoids physically scrolling the window in memory.

3. Map the three components of OS virtual memory onto tiled virtual textures.

> [!success]- Answer
> Pages become tiles of the large texture, held in a physical page texture and organized as a quadtree over a sparsely resident texture pyramid. The page table becomes a lookup texture that translates virtual texture coordinates to the physical location of the resident tile. The page fault function becomes the tile fault mechanism: an additional render pass detects accesses to non-resident tiles and triggers their loading.

4. How does the tile fault pass work, and why does it traverse breadth-first?

> [!success]- Answer
> The scene's texture requests are rendered into a low-resolution buffer recording which tile and mip level each pixel needs; the tile quadtree is then traversed breadth-first to schedule missing tiles. Breadth-first order loads coarse parent tiles before fine children, so a usable (if blurry) texel is always resident and the image refines as streaming catches up, instead of holes appearing while a deep tile loads.

5. What are geometry clipmaps?

> [!success]- Answer
> Geometry clipmaps (Losasso et al. 04) apply the clipmap idea to terrain geometry: the height map is stored in textures and looked up on the GPU, and triangles are created on the fly in the geometry or tessellation shader with density following viewer-centered clipmap rings. Terrain is managed as patches with additional high-resolution detail near the viewer, so geometry is decoded from texture data on demand rather than stored as a mesh.

6. List the techniques Nanite combines and explain the slogan "the end of polycounts."

> [!success]- Answer
> Nanite combines virtualized textures for detail textures and shadow maps, view-dependent LOD to control geometry amount, simple occlusion culling that first renders what was visible last frame as an efficient early-z pass, a visibility buffer with deferred shading to control shading load, compute-shader rasterization for small triangles (faster than the hardware rasterizer), on-demand streaming directly from SSD to GPU via DirectStorage, and Lempel-Ziv decompression in GPU hardware. Because geometry, textures, and visibility are all virtualized and streamed on demand, cost scales with the pixels of the frame rather than with the polygon count of the source assets, so the traditional polygon budget stops being the limit.

---

[[notes/lectures/realtimegraphics/14_visibility|Back: (y-14) Visibility]] | [[notes/lectures/realtimegraphics/index|RTG Index]]
