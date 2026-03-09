---
title: "L12 — Diffusion Models"
tags:
  - mlp
  - diffusion
  - generative-ai
  - ddpm
  - stable-diffusion
date: 2026-03-09
---

[[notes/mlp/11-rl|← L11: RL]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/13-xai|Next: XAI →]]

> **Course**: Machine Perception and Learning for Collaborative Intelligent Systems  
> **Lecturer**: Prof. Dr. Andreas Bulling, University of Stuttgart, WS 2025/2026

---

## Last Lecture Recap — VAEs and GANs

### Variational Autoencoders (VAEs)

- Probabilistic version of autoencoders.
- Allows sampling from the learned model to generate new, unseen samples.
- Puts a prior on the latent $z$: $z \sim \mathcal{N}(0, I)$
- Decoder: $p(x|z) = \mathcal{N}(\mu_\theta(z),\, \Sigma_\theta(z))$ where $\mu_\theta$ and $\Sigma_\theta$ are neural networks.

**Example**: VAE trained on MNIST. Sample $z \sim \mathcal{N}(0, I)$ and decode it through $\mu_\theta(z)$ to get a plausible digit image — never seen during training.

### Generative Adversarial Networks (GANs)

- **Generator**: try to fool the discriminator by generating real-looking images.
- **Discriminator**: try to distinguish between real and fake images.

|               | VAEs                              | GANs                                                      |
| ------------- | --------------------------------- | --------------------------------------------------------- |
| Training      | Relatively easier                 | Many tricks needed (mode collapse, adversarial objective) |
| Inference     | Explicit encoder $q(z\|x)$        | Implicit generative model                                 |
| Image quality | More blurry (reconstruction loss) | Sharper (discriminator loss)                              |

---

## This Lecture — Generative Models III

1. Diffusion Models: Discrete Time
2. Diffusion Models: Continuous Time
3. Diffusion Model Application: GLIDE (Nichol et al., 2022)

Diffusion models have **emerged as the most powerful generative models**, outperforming GANs across image synthesis, super-resolution, text-to-image, video, 3D, and molecule generation.

---

## Diffusion Models: Discrete Time

### Basic Idea

Diffusion models define two processes:

- **Forward diffusion**: gradually add noise to the input until only white noise remains.
- **Reverse denoising**: learn to generate data by iteratively denoising.

```
Forward:  x_0 (real) ──noise──► x_1 ──noise──► ... ──noise──► x_T (pure noise)
Reverse:  x_T (noise) ──denoise──► x_{T-1} ──► ... ──denoise──► x_0 (generated)
```

> **Example**: Start with a photo of a dog. After T=1000 Gaussian noise steps, the image becomes indistinguishable from random Gaussian noise. A neural network trained to reverse this process can then go from noise back to a realistic dog photo.

---

### Forward Diffusion Process

The forward process starts at $t = 0$ and **adds Gaussian noise incrementally** via a Markov chain:

$$q(x_t | x_{t-1}) = \mathcal{N}\!\left(x_t;\; \sqrt{1-\beta_t}\, x_{t-1},\; \beta_t \mathbf{I}\right)$$

- $\beta_t$ is the **variance schedule** — a hyperparameter controlling how much noise to add at step $t$.
- The process continues until $t = T$, where only white noise remains.
- This is an **information-destroying** Markov process.

The **joint distribution** over the entire forward trajectory:

$$q(x_{1:T}|x_0) = \prod_{t=1}^{T} q(x_t|x_{t-1})$$

#### Noise Schedule Intuition

| Timestep $t$ | Effect                                                           |
| ------------ | ---------------------------------------------------------------- |
| Small $t$    | Mostly washes out **high frequencies** (fine details)            |
| Large $t$    | Destroys **low-frequency content** (main structure of the image) |

> **Example**: At $t = 100$ a face image starts looking blurry (details lost). At $t = 800$ only a rough blob is visible. At $t = 1000$ it is pure noise.

---

### Sampling from the Forward Distribution — Closed Form

You do **not** need to simulate step-by-step. The reparameterization trick gives a closed form:

Define $\alpha_t = 1 - \beta_t$ and $\bar{\alpha}_t = \prod_{i=1}^{t} \alpha_i$. Then:

$$x_t = \sqrt{\bar\alpha_t}\, x_0 + \sqrt{1 - \bar\alpha_t}\, \varepsilon, \quad \varepsilon \sim \mathcal{N}(0, I)$$

Or equivalently:

$$q(x_t | x_0) = \mathcal{N}\!\left(x_t;\; \sqrt{\bar\alpha_t}\, x_0,\; (1-\bar\alpha_t)\mathbf{I}\right)$$

As $t \to \infty$: $\bar\alpha_t \to 0$, so $q(x_T | x_0) \approx \mathcal{N}(0, I)$ — pure noise.

```python
# Example: jump to any noisy step in one shot
def forward_sample(x0, t, alpha_bar):
    eps = torch.randn_like(x0)
    x_t = alpha_bar[t].sqrt() * x0 + (1 - alpha_bar[t]).sqrt() * eps
    return x_t, eps
```

> **Why this matters**: Training doesn't require running the full chain — sample a random $t$, perturb $x_0$ directly, and train on that.

---

### How Does the Distribution Change?

During forward diffusion, the **marginal distribution** $q(x_t)$ is smoothed gradually toward $\mathcal{N}(0, I)$:

- Each step acts as a drift toward the mean + a diffusion (spread) term.
- In 2D (Sohl-Dickstein et al., 2015): a non-Gaussian data distribution smoothly becomes a Gaussian blob after many steps.

---

### Generative Learning by Reversing the Diffusion Process

To generate data, start from noise and reverse:

1. Sample $x_T \sim \mathcal{N}(0, I)$.
2. Iteratively sample $x_{t-1} \sim q(x_{t-1}|x_t)$ for $t = T, T-1, \ldots, 1$.

Using Bayes' rule:

$$q(x_{t-1}|x_t) = \frac{q(x_t|x_{t-1}) \cdot q(x_{t-1})}{q(x_t)}$$

**Problem**: this requires access to the entire dataset (intractable). Also, if the timesteps are small enough, $q(x_{t-1}|x_t)$ is approximately Gaussian — so we can **train a neural network to approximate it**.

---

### Parametric Reverse Model

We use a **parametric model** $p_\theta$ to approximate the reverse process:

$$p(x_T) = \mathcal{N}(x_T;\, 0, I)$$

$$p_\theta(x_{t-1}|x_t) = \mathcal{N}\!\left(x_{t-1};\; \mu_\theta(x_t, t),\; \sigma_t^2 I\right)$$

The joint reverse distribution:

$$p_\theta(x_{0:T}) = p(x_T) \prod_{t=1}^{T} p_\theta(x_{t-1}|x_t)$$

---

### Reverse Conditional Gaussian and Training Objective

The reverse conditional $q(x_{t-1}|x_t)$ has no analytical closed form. However, **Ho, Jain and Abbeel (2020)** derived the following approximation for the reverse mean:

$$\tilde{\mu}_t(x_t, t) \approx \frac{1}{\sqrt{\tilde\alpha_t}} \left(x_t - \frac{1-\tilde\alpha_t}{\sqrt{1-\bar\alpha_t}}\, \varepsilon_t\right)$$

where $\varepsilon_t \sim \mathcal{N}(0, I)$ is the noise introduced at step $t$.

Since we don't know $\varepsilon_t$ at inference time, we **train a neural network** $\theta(x_t, t)$ to predict it:

$$\mathcal{L}(\theta) = \|\varepsilon_t - \theta(x_t, t)\|_2^2$$

This is a **simple MSE loss** — predict the noise added, nothing more.

```python
# DDPM training loop (Ho et al., 2020)
for x0 in dataloader:
    t   = torch.randint(0, T, (x0.shape[0],))   # random timestep
    eps = torch.randn_like(x0)                    # true noise

    # Closed-form noisy sample
    x_t = sqrt_alpha_bar[t] * x0 + sqrt_one_minus_alpha_bar[t] * eps

    # Predict the noise with the U-Net
    eps_pred = unet(x_t, t)

    # Minimize MSE
    loss = F.mse_loss(eps_pred, eps)
    loss.backward()
    optimizer.step(); optimizer.zero_grad()
```

> **Intuition**: The model learns "what noise was added to get this blurry image?" By subtracting the predicted noise, it recovers a cleaner version — one step of denoising.

---

### Training Procedure — U-Net Architecture

The denoiser network $\theta(x_t, t)$ takes a noisy image and predicts an image (the noise).

**The U-Net** (Ronneberger et al., 2015) is a natural choice:

```
Input: noisy image (H × W × C)
          │
   ┌──────┴──────┐
   │  Encoder    │  Conv + ResBlocks + Self-Attention
   │  (downsample)│
   └──────┬──────┘
          │
   Bottleneck (self-attention)
          │
   ┌──────┴──────┐
   │  Decoder    │  Conv + ResBlocks + Self-Attention
   │  (upsample) │← skip connections from encoder
   └──────┬──────┘
          │
Output: predicted noise (H × W × C)
```

- The **same network** is shared across all timesteps.
- Time $t$ is encoded as **sinusoidal features** (like transformer positional encodings) and injected into every ResBlock.

> **Example**: At $t = 500$, the U-Net receives a half-noisy cat image and predicts the noise component. At $t = 10$, it receives an almost-clean image and predicts a small residual noise.

---

### Diffusion Hyperparameters — The Noise Schedule

Forward: $\mathcal{N}(x_t;\, \sqrt{1-\beta_t}\, x_{t-1},\, \beta_t I)$ — Reverse: $\mathcal{N}(x_{t-1};\, \mu_\theta(x_t, t),\, \sigma_t^2 I)$

- $\beta_t$ and $\sigma_t^2$ control the variance of the forward and backward processes.
- In many papers $\beta_t$ follows a **linear schedule** and $\sigma_t^2 = \beta_t$.
- More advanced schedules exist (e.g., Kingma et al., 2021 — cosine schedule).

```python
# Linear beta schedule example
T    = 1000
beta = torch.linspace(1e-4, 0.02, T)          # β_1 ... β_T
alpha     = 1 - beta
alpha_bar = torch.cumprod(alpha, dim=0)        # ᾱ_t
```

> **Why the schedule matters**: too aggressive $\beta_t$ destroys signal too quickly; too gentle leaves structure at $t = T$, breaking the Gaussian assumption.

---

### Connection to VAEs

Diffusion models are a **special form of hierarchical VAEs**:

|                       | Standard VAE             | Diffusion Model                                        |
| --------------------- | ------------------------ | ------------------------------------------------------ |
| Encoder (posterior)   | Learned $q_\phi(z\|x)$   | Fixed forward process $q(x_{1:T}\|x_0)$                |
| Decoder               | Learned $p_\theta(x\|z)$ | Shared network $p_\theta(x_{t-1}\|x_t)$ across all $t$ |
| Latent dimensionality | Smaller than input       | **Same** as input                                      |
| Training objective    | ELBO                     | Very similar variational lower bound                   |

---

## Diffusion Models: Continuous Time

### SDE Formulation (Song et al., 2021)

As the number of timesteps $T \to \infty$, the discrete Markov chain becomes a **Stochastic Differential Equation (SDE)**:

$$dx = f(x, t)\,dt + g(t)\,dw$$

- $f(x, t)$: deterministic **drift** term
- $g(t)\,dw$: stochastic **diffusion** term (Brownian motion)

### Time Reversal

SDE time reversal yields an elegant analytical form for the **reverse (generative) SDE**:

$$dx_t = \left[f(x,t) - g^2(t)\, \nabla_x \log p_t(x)\right] dt + g(t)\, dw$$

The term $\nabla_x \log p_t(x)$ is the **score function** — the gradient of the log data density at noise level $t$. This is precisely what the denoiser network learns to estimate.

> **Why this matters**: Expressing diffusion as an SDE opens access to the full toolkit of stochastic calculus — ODE solvers, higher-order integrators, and theoretical convergence guarantees. It unifies DDPM, DDIM (which is a probability-flow ODE), and score-based models under one framework.

---

## Discussion: Advantages and Disadvantages

### Advantages

- **High diversity**: covers the data distribution well, unlike mode-collapsing GANs.
- **High quality**: samples are comparable to or better than GANs.
- **Flexible conditioning**: easily conditioned on images, text, or class labels.

### Disadvantages

- **Slow generation**: requires many forward passes through the network ($T = 1000$ steps by default).
- **Less meaningful latents**: latent variables have the same dimensionality as the data — harder to interpret or manipulate.

---

## The Generative Trilemma

Most generative models can excel at only **two of three** desirable properties:

```
             HIGH QUALITY
                  △
                 /|\
                / | \
               /  |  \
              /   |   \
FAST SAMPLING ──────────── HIGH DIVERSITY
                             (mode coverage)
```

| Model            | Quality   | Diversity            | Speed         |
| ---------------- | --------- | -------------------- | ------------- |
| GANs             | ✅ High   | ❌ Mode collapse     | ✅ 1 pass     |
| VAEs             | ⚠️ Blurry | ✅ Good              | ✅ 1 pass     |
| Diffusion (DDPM) | ✅ High   | ✅ Full distribution | ❌ 1000 steps |

Diffusion dominates quality and coverage but sacrifices speed — motivating DDIM, consistency models, and flow matching.

---

## Are We Done? — Open Challenges

- Research on key diffusion model elements is ongoing.
- **Accelerating the diffusion process** remains a central challenge.
- Many small update steps are needed to keep the reverse process invertible.

---

## Latent Diffusion Models (Rombach et al., 2022)

### Motivation — The Scaling Problem

Diffusion models **do not scale well with image resolution**. A 512×512×3 pixel image has ~786K dimensions, making direct pixel-space diffusion computationally expensive.

Observation (Ho et al., 2020): most "bits" in an image encode fine-grained **perceptual detail**, not semantic content. Running the full generative process in pixel space wastes computation on imperceptible differences.

The lecture motivates this with a **rate-distortion view**: fine-grained perceptual details consume most of the bit budget, while the more semantically meaningful structure can often be modeled in a much smaller latent space. Latent diffusion therefore splits the problem into:

- **Perceptual compression**: let an autoencoder preserve visually important detail
- **Semantic compression**: let diffusion model the higher-level structure in latent space

Two common strategies:

1. Downsample → process at smaller scale → upsample.
2. **Translate to latent space → run diffusion in latent space → decode back.**

### Architecture

$$x_0 \xrightarrow{\text{VAE Encoder}} z_0 \xrightarrow{\text{Add noise}} z_T \xrightarrow{\text{Denoiser } \varepsilon_\theta(z_t, t, c)} \hat{z}_0 \xrightarrow{\text{VAE Decoder}} \hat{x}_0$$

- The VAE encoder maps input data to a **compressed embedding** (e.g., 64×64×4 for a 512×512 image — 96× smaller).
- Denoising diffusion is applied in the **latent space**.
- A patch-based adversarial discriminator is added on top of the reconstruction loss for **perceptual compression**.
- The VAE decoder reconstructs the final image from the denoised latent.

```
Text Prompt c ─────────────────────────────── (cross-attention)
                                                      │
x_0 →[VAE Enc]→ z_0 →[Noise]→ z_T →[U-Net]→ ẑ_0 →[VAE Dec]→ x̂_0
```

### Two-Stage Training

Latent diffusion is trained in **two stages**:

1. **Train the autoencoder first** so that $x \to z \to \hat{x}$ preserves perceptually relevant content
2. **Train the diffusion model on latents** $z$ instead of pixels

In the lecture slides, the first stage is not just plain reconstruction: a **patch-based adversarial discriminator** is added on top of the reconstruction / perceptual objective so the latent space keeps visually important details while staying compressed.

### Advantages of Latent Diffusion

| Benefit                      | Explanation                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| **Compressed latent space**  | Train diffusion in low-resolution latent → computationally efficient                         |
| **Regularized/smooth space** | Easier denoising task, faster sampling than pixel-space                                      |
| **Flexibility**              | The autoencoder can be adapted to images, video, text, graphs, 3D point clouds, meshes, etc. |

> **Example — Stable Diffusion**: A 512×512 image is encoded into a 64×64×4 latent. All 1000 denoising steps happen in this small latent space, then a single decoder pass produces the final image. This enables high-quality image generation on a consumer GPU.

---

## Application: GLIDE (Nichol et al., 2022)

### Overview

**GLIDE** = Guided Language-to-Image Diffusion

- 3.5 billion parameter text-conditional diffusion model.
- Supports two guidance strategies: **CLIP guidance** and **classifier-free guidance**.

### CLIP Guidance (Radford et al., 2021)

CLIP is a large model that takes an image $x$ and a text $c$ and outputs a **similarity score**.

- The CLIP gradient $\nabla_x \mathcal{L}_\text{CLIP}(f(x_t), g(c))$ points in the direction of images that better match the text.
- This gradient steers the diffusion process during inference.

The combined objective:

$$\nabla_x \mathcal{L} = \nabla_x \mathcal{L}_\text{data}(x_t, c) + s \cdot \nabla_x \mathcal{L}_\text{CLIP}(f(x_t), g(c))$$

- $s$ is the guidance strength.
- $f$ = image encoder, $g$ = text encoder.

> **Example**: When generating "a red apple on a wooden table", the CLIP gradient nudges each denoising step toward images whose visual features are more similar to that text description.

### GLIDE Training

The lecture's training slide clarifies how **classifier-free guidance** is enabled: during training, GLIDE is randomly asked to denoise **with text conditioning** and **without text conditioning**. That means the same network learns both:

- a generic unconditional denoiser
- a prompt-conditioned denoiser

The difference between these two predictions becomes the direction that is later amplified at inference time.

### Classifier-Free Guidance (Ho & Salimans, 2022)

**Problem**: Conditional generation doesn't always follow the text prompt closely enough.

**Solution**: Train one model for both conditional and unconditional generation. Randomly **drop the text condition** during training (replace $c$ with $\varnothing$). At inference, extrapolate away from the unconditional direction:

$$\hat\varepsilon = \varepsilon_\theta(x_t, t, \varnothing) + w \cdot \left[\varepsilon_\theta(x_t, t, c) - \varepsilon_\theta(x_t, t, \varnothing)\right]$$

- $w$ is the **guidance scale**.
- $w = 1$: no guidance (pure conditional).
- $w > 1$: amplify the conditional signal → stronger prompt adherence, less diversity.

The lecture explicitly notes that **the best GLIDE results are obtained with classifier-free guidance**, rather than the external CLIP-guided variant.

```python
# Classifier-free guidance at inference
eps_uncond = model(x_t, t, cond=None)          # unconditional prediction
eps_cond   = model(x_t, t, cond=text_emb)      # conditional prediction
eps_guided = eps_uncond + w * (eps_cond - eps_uncond)  # guided prediction
```

> **Example**:
>
> - $w = 1.0$ → "a painting of a sunset" produces a vague, diverse sunset.
> - $w = 7.5$ → the prompt is followed closely, boats and horizon are clearly visible.
> - $w = 15$ → very strong adherence but may produce over-saturated artifacts.

### GLIDE Editing Results

GLIDE is not only a text-to-image generator from scratch; the lecture's editing slide shows it can perform **text-guided local edits** while preserving the rest of the image. The examples include:

- inserting **zebras into an empty field**
- editing a painting into **"a girl hugging a corgi on a pedestal"**
- changing a person's hair to **red**
- replacing a masked table region with **a vase of flowers**

This is the same general diffusion machinery applied in an **editing / inpainting-style** setting: keep most of the scene fixed, but regenerate the masked region so it becomes consistent with the prompt.

---

## Summary

| Concept                      | Key Detail                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Forward process**          | Markov chain: add Gaussian noise step-by-step until $x_T \approx \mathcal{N}(0,I)$                             |
| **Closed-form noisy sample** | $x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\varepsilon$ — jump to any $t$ directly               |
| **Reverse process**          | Parametric Gaussian: $p_\theta(x_{t-1}\|x_t) = \mathcal{N}(\mu_\theta(x_t,t), \sigma_t^2 I)$                   |
| **Training loss**            | $\mathcal{L}(\theta) = \|\varepsilon - \theta(x_t, t)\|_2^2$ — simple noise prediction MSE                     |
| **Network**                  | U-Net with ResBlocks + self-attention; time $t$ injected via sinusoidal embeddings                             |
| **Noise schedule**           | $\beta_t$ (linear or cosine) controls how fast structure is destroyed                                          |
| **Connection to VAEs**       | Diffusion = hierarchical VAE with fixed encoder, shared decoder                                                |
| **Continuous time**          | SDE: $dx = f(x,t)dt + g(t)dw$; reverse uses score $\nabla_x \log p_t(x)$                                       |
| **Generative trilemma**      | Diffusion: high quality + high diversity, but slow                                                             |
| **Latent diffusion**         | Two-stage setup: perceptually compress with an autoencoder, then diffuse in VAE latent space                   |
| **CLIP guidance**            | Gradient of CLIP similarity steers denoising toward text description                                           |
| **Classifier-free guidance** | Train with and without text, then amplify $(\varepsilon_\text{cond} - \varepsilon_\text{uncond})$ by scale $w$ |
| **GLIDE editing**            | Text-guided masked edits preserve global scene context while changing selected regions                         |

---

[[notes/mlp/11-rl|← L11: RL]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/13-xai|Next: XAI →]]
