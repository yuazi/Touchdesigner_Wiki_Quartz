---
tags:
  - touchdesigner
  - td/connectivity
  - advanced
  - glsl
  - rendering
date: 2026-03-01
---
# Introduction to GLSL in TouchDesigner

While TouchDesigner's built-in nodes (TOPs, SOPs, MATs) are incredibly powerful, writing custom **GLSL (OpenGL Shading Language)** code allows you to bypass the node network overhead and write highly optimized, bespoke algorithms that run natively on the GPU.

## What is a Shader?

A shader is simply a small program that runs very fast directly on the graphics card. In TouchDesigner, you primarily deal with three types:

1.  **Vertex Shader (`.vert`):** Runs once *per vertex* of a 3D model. Used to move, warp, or transform 3D points before drawing them. 
2.  **Fragment/Pixel Shader (`.frag`):** Runs once *per pixel* on the screen (or in a 2D texture). Used to calculate colors, lights, and 2D generative patterns.
3.  **Compute Shader (`.comp`):** Very advanced. Runs in arbitrary workgroups without being tied to traditional geometry pipelines. Phenomenal for simulating massive particle systems or fluid dynamics.

## The GLSL TOP (2D Image Processing)

The easiest way to start learning GLSL in TouchDesigner is the **GLSL TOP**. 
1. Create a GLSL TOP. 
2. It automatically generates a Pixel Shader DAT containing some starter code.
3. Click "Edit" on the DAT to open it in your external text editor (like VS Code).

A basic pixel shader looks like this:

```glsl
// This tells TouchDesigner what to output
out vec4 fragColor;

void main()
{
    // A vec4 is (Red, Green, Blue, Alpha)
    // If we define it as (1.0, 0.0, 0.0, 1.0), it will output solid red.
    
    // We can also retrieve UV coordinates (0 to 1 across the image)
    vec2 uv = vUV.st;
    
    // Create a color gradient using the UV coordinates
    vec4 color = vec4(uv.x, uv.y, 0.0, 1.0);
    
    fragColor = color;
}
```

## The GLSL MAT (3D Materials)

When you need custom lighting models, advanced displacement, or you are hitting the limits of the standard Phong MAT/PBR MAT, you use the **GLSL MAT**. 
- It requires both a Vertex Shader and a Pixel Shader.
- The easiest way to start is to build your material using a standard PBR MAT, click the "Output Shader" button locally on its parameter page, and it will spawn the GLSL equivalent network for you to study and modify.

## Uniforms and Samplers

The biggest advantage of GLSL in TD is how easily you can pass data *into* the shader from your noisy node networks:
- **Uniforms:** If you have an oscillating LFO CHOP channel, you can map it to a Uniform Variable on the "Vectors" page of the GLSL TOP/MAT. Your shader can then read that float, vec2, or vec3 directly.
- **Samplers:** You can connect up to 30 Input TOPs (images, noises, videos) to a GLSL TOP.  In the shader, you reference them using standard sampler functions (like `texture(sTD2DInputs[0], uv)`).
---
[[touchdesigner/05_Connectivity_and_Shaders/index|Back to Connectivity and Shaders]] | [[touchdesigner/index|Back to Main Page]]
