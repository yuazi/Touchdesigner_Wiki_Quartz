---
title: "05_shading_models — BRDFs, Phong, and Physically-Based Rendering"
tags:
  - rtg
  - shading
  - brdf
  - pbr
  - lighting
date: 2026-05-12
---
[[notes/lectures/realtimegraphics/04_cg_primer|Back: (y-04) Graphics Primer]] | [[notes/lectures/realtimegraphics/06_textures|Next: (y-06) Textures]] | [[notes/lectures/realtimegraphics/index|RTG Index]]

## Mental Model First: Where Does the Pixel Colour Come From?

- **Rasterisation gives us *which* pixel, shading decides *what colour*.** Every shading model is an answer to one integral: how much of the incoming light from every direction is reflected toward the camera.
- **A BRDF is a recipe, not a law.** Empirical models (Lambert, Phong, Blinn-Phong) approximate the look. Physically-based models (Cook-Torrance, Disney) derive the recipe from microscale geometry and the Fresnel split.
- **Energy conservation matters.** A material that reflects more than 100% of the light it receives looks wrong on screen and breaks global illumination further down the pipeline.

---

## 1. The Rendering Equation & BRDF

### Rendering Equation
![[pictures/realtimegraphics/05/L05_Pg-04.jpg]]

<p class="image-caption">L05_Pg-04: Outgoing radiance is emitted light plus the hemispherical integral of incoming radiance weighted by the BRDF.</p>

$$ L(\mathbf{x}, \boldsymbol{\omega}_o) = L_e(\mathbf{x}, \boldsymbol{\omega}_o) + \int_\Omega L(\mathbf{x}, \boldsymbol{\omega}_i)\, f_r(\mathbf{x}, \boldsymbol{\omega}_i, \boldsymbol{\omega}_o)\, d\boldsymbol{\omega}_i $$

- **Emitted light** ($L_e$): the surface acts as a source.
- **Reflected light** (integral): every direction $\boldsymbol{\omega}_i$ on the hemisphere $\Omega$ contributes some incoming radiance, scaled by the **BRDF** $f_r$.

### BRDF Definition
![[pictures/realtimegraphics/05/L05_Pg-05.jpg]]

<p class="image-caption">L05_Pg-05: The BRDF describes how a surface at location x reflects light from incoming direction omega_i into outgoing direction omega_o.</p>

The Bidirectional Reflectance Distribution Function $f_r(\mathbf{x}, \boldsymbol{\omega}_i, \boldsymbol{\omega}_o)$ is the per-surface, per-direction reflectance.

### BRDF Properties
![[pictures/realtimegraphics/05/L05_Pg-06.jpg]]

<p class="image-caption">L05_Pg-06: Three properties any physical BRDF must satisfy.</p>

1. **Reciprocity**: $f_r(\mathbf{x}, \boldsymbol{\omega}_1, \boldsymbol{\omega}_2) = f_r(\mathbf{x}, \boldsymbol{\omega}_2, \boldsymbol{\omega}_1)$. Swapping light and view directions yields the same response.
2. **Energy conservation**: $\int_\Omega f_r(\mathbf{x}, \boldsymbol{\omega}_i, \boldsymbol{\omega}_o)\, d\boldsymbol{\omega}_i \le 1$ for every $\boldsymbol{\omega}_o$. No surface reflects more energy than it receives.
3. **Positivity**: $f_r \ge 0$.

---

## 2. Light Source Models

### Light Sources in Real-Time
![[pictures/realtimegraphics/05/L05_Pg-08.jpg]]

<p class="image-caption">L05_Pg-08: Real-time shading replaces the hemispherical integral with a small sum over analytical lights, reducing cost from O(n^infinity) to O(n).</p>

- **Local shading**: only direct illumination.
- **Analytical lights** (point, directional, spot) replace the area-light integral with a single direction per pixel.

### Point Light
![[pictures/realtimegraphics/05/L05_Pg-09.jpg]]

<p class="image-caption">L05_Pg-09: Infinitesimally small source; light arrives at every surface point from a single direction toward the light position p_l.</p>

### Directional Light
![[pictures/realtimegraphics/05/L05_Pg-10.jpg]]

<p class="image-caption">L05_Pg-10: Infinitely far source; the same direction d everywhere in the scene. Used for sunlight.</p>

### Spot Light
![[pictures/realtimegraphics/05/L05_Pg-11.jpg]]

<p class="image-caption">L05_Pg-11: Point light whose emission is constrained to a cone with inner angle theta_i and outer angle theta_o.</p>

---

## 3. Empirical Models: Lambert & Phong

### Lambert (Diffuse)
![[pictures/realtimegraphics/05/L05_Pg-12.jpg]]

<p class="image-caption">L05_Pg-12: Perfectly diffuse reflector. Scatters incoming light equally in every direction; appearance depends only on surface orientation.</p>

### Lambert Shading Computation
![[pictures/realtimegraphics/05/L05_Pg-13.jpg]]

<p class="image-caption">L05_Pg-13: Lambert reduces the integral to a single dot product with the light direction.</p>

$$ L_o = c_d \circ \max(\mathbf{n} \cdot \mathbf{l}, 0) \circ I_L $$

- $c_d$: diffuse reflectance (albedo).
- $I_L$: irradiance from the light.
- $\circ$: component-wise (RGB) product.

### Phong Model
![[pictures/realtimegraphics/05/L05_Pg-15.jpg]]

<p class="image-caption">L05_Pg-15: Phong adds an emissive, a diffuse, and a specular term. The specular lobe is centred on the reflection direction.</p>

$$ L_o = \mathbf{c}_e + \mathbf{c}_d \circ \cos\theta_i + \mathbf{c}_s \circ \cos^m\alpha_r \circ \mathbf{B}_L $$

- $\mathbf{c}_e$: emissive colour, $\mathbf{c}_d$: diffuse, $\mathbf{c}_s$: specular, $m$: specular power, $\mathbf{B}_L$: light colour.

### Reflection Vector
![[pictures/realtimegraphics/05/L05_Pg-16.jpg]]

<p class="image-caption">L05_Pg-16: Mirror reflection of the light direction about the surface normal.</p>

$$ \mathbf{r} = 2\mathbf{n}(\mathbf{n} \cdot \mathbf{l}) - \mathbf{l} $$

All vectors are assumed normalised. The Phong specular term peaks when the view vector $\mathbf{v}$ aligns with $\mathbf{r}$.

### Phong Fragment Shader
![[pictures/realtimegraphics/05/L05_Pg-20.jpg]]

<p class="image-caption">L05_Pg-20: GLSL fragment shader computing the Phong specular per pixel from the reflection vector.</p>

### Phong Shading Properties
![[pictures/realtimegraphics/05/L05_Pg-21.jpg]]

<p class="image-caption">L05_Pg-21: Phong is phenomenological. Highlights are always circular and energy conservation is ignored.</p>

### 💡 Intuition: Why Phong Looks "Plastic"
Real materials concentrate the specular lobe more strongly along the half-vector direction at grazing angles. Phong's cosine of the reflection angle has no such dependence on viewing geometry, so highlights stay perfectly round and the material reads as smooth plastic regardless of the light position.

---

## 4. Blinn-Phong & Energy Conservation

### Highlight Shape
![[pictures/realtimegraphics/05/L05_Pg-22.jpg]]

<p class="image-caption">L05_Pg-22: Phong vs Blinn-Phong highlights. Blinn-Phong elongates the highlight at grazing angles.</p>

### Normalization
![[pictures/realtimegraphics/05/L05_Pg-23.jpg]]

<p class="image-caption">L05_Pg-23: Larger specular power m should give smaller but more intense highlights. Unnormalised Phong loses energy as m grows; the normalised form keeps total reflected energy constant.</p>

### Energy Conservation
![[pictures/realtimegraphics/05/L05_Pg-24.jpg]]

<p class="image-caption">L05_Pg-24: Tweaking specular intensity by hand (left, right) violates conservation. An energy-conserving model keeps reflected light at most equal to incoming light for every outgoing direction.</p>

### Blinn-Phong Model
![[pictures/realtimegraphics/05/L05_Pg-25.jpg]]

<p class="image-caption">L05_Pg-25: Blinn-Phong replaces the reflection vector with the half-vector h = (v + l) / |v + l| and approximates energy conservation.</p>

$$ f_r = \frac{\mathbf{c}_d}{\pi} + \frac{m + 8}{8\pi}\, \mathbf{c}_s\, \cos^m\theta_h $$

### Blinn-Phong Vertex Shader
![[pictures/realtimegraphics/05/L05_Pg-26.jpg]]

<p class="image-caption">L05_Pg-26: Vertex shader passing world-space position and normal to the fragment stage.</p>

### Blinn-Phong Fragment Shader
![[pictures/realtimegraphics/05/L05_Pg-27.jpg]]

<p class="image-caption">L05_Pg-27: Fragment shader implementing the normalised Blinn-Phong BRDF.</p>

---

## 5. Physically-Based Rendering

### From Phenomenology to Physics
![[pictures/realtimegraphics/05/L05_Pg-34.jpg]]

<p class="image-caption">L05_Pg-34: PBR derives shading from simplified physics. All light-matter interaction is emission, scattering, or absorption.</p>

### Absorption vs Scattering
![[pictures/realtimegraphics/05/L05_Pg-36.jpg]]

<p class="image-caption">L05_Pg-36: Photons that enter a medium are either absorbed (energy becomes heat) or scattered (energy changes direction). The mixture defines surface appearance.</p>

### Fresnel Laws
![[pictures/realtimegraphics/05/L05_Pg-39.jpg]]

<p class="image-caption">L05_Pg-39: At a boundary between two media with different phase speeds, part of the wave is specularly reflected and part is transmitted.</p>

### Fresnel Equations
![[pictures/realtimegraphics/05/L05_Pg-40.jpg]]

<p class="image-caption">L05_Pg-40: R_s and R_p give the reflectance for the two polarisations; the transmitted fraction is T = 1 - R.</p>

### Schlick's Approximation
![[pictures/realtimegraphics/05/L05_Pg-41.jpg]]

<p class="image-caption">L05_Pg-41: Cheap closed-form fit to the Fresnel curve. R_0 is the reflectance at normal incidence.</p>

$$ R = R_0 + (1 - R_0)\,(1 - \cos\theta_i)^5 $$

### Surface Roughness
![[pictures/realtimegraphics/05/L05_Pg-42.jpg]]

<p class="image-caption">L05_Pg-42: Metals are poorly described by a diffuse lobe. Instead we model the statistical distribution of microscale surface orientation.</p>

---

## 6. Microfacets & Cook-Torrance

### Microfacets
![[pictures/realtimegraphics/05/L05_Pg-43.jpg]]

<p class="image-caption">L05_Pg-43: The surface is modelled as a collection of tiny mirrors with varying orientation.</p>

### Half-Vector
![[pictures/realtimegraphics/05/L05_Pg-44.jpg]]

<p class="image-caption">L05_Pg-44: Only microfacets whose normal is the half-vector reflect light from l to v.</p>

$$ \mathbf{h} = \frac{\mathbf{l} + \mathbf{v}}{\lVert \mathbf{l} + \mathbf{v} \rVert} $$

### Microfacet Distribution
![[pictures/realtimegraphics/05/L05_Pg-45.jpg]]

<p class="image-caption">L05_Pg-45: The Beckmann distribution D(n, h, m) gives the fraction of microfacets oriented in direction h. Roughness parameter m controls spread.</p>

### Geometric Attenuation
![[pictures/realtimegraphics/05/L05_Pg-47.jpg]]

<p class="image-caption">L05_Pg-47: Shadowing prevents light from reaching some microfacets; masking blocks reflected light from reaching the camera.</p>

### Cook-Torrance Model
![[pictures/realtimegraphics/05/L05_Pg-49.jpg]]

<p class="image-caption">L05_Pg-49: Cook-Torrance combines microfacet distribution D, Fresnel reflectance F, and geometric attenuation G.</p>

$$ f_r(\mathbf{l}, \mathbf{v}) = \frac{D(\mathbf{h})\, F(\mathbf{l}, \mathbf{v})\, G(\mathbf{l}, \mathbf{v})}{4\,(\mathbf{n} \cdot \mathbf{v})\,(\mathbf{n} \cdot \mathbf{l})} $$

### 💡 Intuition: D, F, G in One Sentence Each
- **D** says how many microfacets are aimed at the camera right now.
- **F** says how much of the light hitting those microfacets bounces off (rather than entering the material).
- **G** says how many of those bounces actually escape after dodging the neighbours.

---

## 7. Advanced BRDFs

### Anisotropic Reflection
![[pictures/realtimegraphics/05/L05_Pg-53.jpg]]

<p class="image-caption">L05_Pg-53: Reflection depends on the in-plane viewing direction, not just inclination. Brushed metal is the canonical example.</p>

### Retro-Reflection
![[pictures/realtimegraphics/05/L05_Pg-54.jpg]]

<p class="image-caption">L05_Pg-54: Deep micro-cavities bounce light back toward the source. Pottery and the lunar surface look brighter near their silhouettes for this reason.</p>

### Disney BRDF
![[pictures/realtimegraphics/05/L05_Pg-55.jpg]]

<p class="image-caption">L05_Pg-55: A layered model originally built for animated films, now widely used in real-time engines. Combines diffuse, specular, subsurface scattering, clearcoat, and sheen, and blends dielectric and metallic responses.</p>

---

### Applied Exam Focus
- **Rendering equation**: be able to write it and explain each term (emission, hemispherical integral, BRDF).
- **BRDF properties**: reciprocity, energy conservation, positivity.
- **Lambert vs Phong vs Blinn-Phong**: which depend on the view direction, which conserve energy, which use the half-vector.
- **Reflection vector**: $\mathbf{r} = 2\mathbf{n}(\mathbf{n} \cdot \mathbf{l}) - \mathbf{l}$, and half-vector $\mathbf{h} = (\mathbf{l} + \mathbf{v}) / \lVert \mathbf{l} + \mathbf{v} \rVert$.
- **Fresnel and Schlick**: know the Schlick formula and what $R_0$ is.
- **Cook-Torrance**: $f_r = DFG / (4(\mathbf{n} \cdot \mathbf{v})(\mathbf{n} \cdot \mathbf{l}))$ and the role of D, F, G.

## Self-Check

1. What makes Lambert shading view-independent and Phong shading view-dependent?

> [!success]- Answer
> Lambert's diffuse term uses only $\max(\mathbf{n} \cdot \mathbf{l}, 0)$, which depends on the surface normal and the light direction but not on the camera. Phong adds a specular term $\cos^m \alpha_r$ that compares the reflection vector $\mathbf{r}$ to the view vector $\mathbf{v}$, so the highlight position changes as the camera moves.

2. Write the reflection vector and the half-vector, and explain which model uses which.

> [!success]- Answer
> Reflection: $\mathbf{r} = 2\mathbf{n}(\mathbf{n} \cdot \mathbf{l}) - \mathbf{l}$. Half-vector: $\mathbf{h} = (\mathbf{l} + \mathbf{v}) / \|\mathbf{l} + \mathbf{v}\|$. Phong specular uses $\cos^m \alpha_r$ with $\alpha_r$ the angle between $\mathbf{r}$ and $\mathbf{v}$. Blinn-Phong replaces that with $\cos^m \theta_h$ where $\theta_h$ is the angle between $\mathbf{n}$ and $\mathbf{h}$, which produces more realistic elongated highlights at grazing angles.

3. Why does naive Phong violate energy conservation, and how does Blinn-Phong fix it?

> [!success]- Answer
> Increasing the specular power $m$ in unnormalized Phong shrinks the lobe but does not boost its peak proportionally, so total reflected energy drops as the highlight tightens. Blinn-Phong includes the normalization factor $(m+8)/(8\pi)$ so a tighter lobe gets a higher peak, keeping the integrated outgoing energy bounded by the incoming energy.

4. State Schlick's approximation and identify what $R_0$ represents.

> [!success]- Answer
> $R(\theta) = R_0 + (1 - R_0)(1 - \cos\theta_i)^5$. $R_0$ is the Fresnel reflectance at normal incidence, the fraction of light reflected when the view direction equals the surface normal. Schlick interpolates from $R_0$ at $\theta = 0$ to nearly $1$ at grazing angles using a cheap fifth-power term.

5. In the Cook-Torrance BRDF $f_r = \frac{D F G}{4(\mathbf{n} \cdot \mathbf{v})(\mathbf{n} \cdot \mathbf{l})}$, what does each of $D$, $F$, $G$ represent?

> [!success]- Answer
> $D$ is the microfacet normal distribution: the fraction of microfacets whose orientation equals the half-vector $\mathbf{h}$. $F$ is the Fresnel term: how much light those microfacets actually reflect. $G$ is the geometric attenuation: the fraction of microfacets that are neither shadowed from the light nor masked from the view. Their product divided by the foreshortening factors gives the per-pixel specular response.

6. State and interpret the three properties any physical BRDF must satisfy.

> [!success]- Answer
> (1) **Reciprocity**: $f_r(\mathbf{x}, \boldsymbol{\omega}_1, \boldsymbol{\omega}_2) = f_r(\mathbf{x}, \boldsymbol{\omega}_2, \boldsymbol{\omega}_1)$ — swapping light and view gives the same reflectance, which Helmholtz's principle of reversibility requires. (2) **Energy conservation**: $\int_\Omega f_r(\mathbf{x}, \boldsymbol{\omega}_i, \boldsymbol{\omega}_o) \cos\theta_i \, d\boldsymbol{\omega}_i \le 1$ — no surface reflects more energy than it receives. (3) **Positivity**: $f_r \ge 0$ — negative radiance is unphysical. Any BRDF that breaks these (e.g. unnormalized Phong as the specular power grows) produces wrong-looking results and breaks global illumination further down the pipeline.

7. What is anisotropic reflection, and why can Cook-Torrance with a single roughness parameter not represent it?

> [!success]- Answer
> Anisotropic reflection means the BRDF depends on the *in-plane* viewing direction, not just the angle between view and normal. Brushed metal is the canonical example: the highlight stretches along the grain direction and tightens perpendicular to it. A single roughness $m$ gives an isotropic Beckmann distribution that only depends on $\theta_h$ — the angle between normal and half-vector — so it cannot distinguish "along the grain" from "across the grain". Anisotropic BRDFs introduce two roughness parameters (tangent and bitangent) and a tangent frame per pixel.

8. What does the Disney BRDF combine, and why has it become a real-time standard?

> [!success]- Answer
> Disney's "principled" BRDF was originally designed for *Wreck-It Ralph* and bundles a small number of artist-controllable parameters (base colour, metallic, roughness, specular, anisotropy, clearcoat, sheen, subsurface) that interpolate between dielectric and metallic responses with a single energy-conserving model. It became standard in real-time engines (Unreal, Unity, Frostbite) because it gives artists physically plausible results without exposing the underlying $D$, $F$, $G$, BRDF maths — the engine handles the layered specular, diffuse, and subsurface terms, while the artist works with a handful of slider parameters that map cleanly to real-world material properties.

---
[[notes/lectures/realtimegraphics/index|(y) Back to RTG Index]]
