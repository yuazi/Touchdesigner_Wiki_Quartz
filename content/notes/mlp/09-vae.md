---
title: "L09 — Generative AI & Variational Autoencoders (VAE)"
tags:
  - mlp
  - vae
  - generative-ai
  - latent-space
  - deep-learning
  - neural-networks
date: 2026-03-09
---

[[notes/mlp/08-iml|Previous: L08: Interactive ML]] | [[notes/mlp/index|Back to MPL Index]] | [[notes/mlp/10-gans|Next: GANs]]

> **Slide credits**: O. Hilliges @ ETHZ · Paul Liang & Louis-Philippe Morency @ CMU

---

## Introduction

### Supervised vs. Unsupervised Learning
|              | Supervised                       | Unsupervised                       |
| ------------ | -------------------------------- | ---------------------------------- |
| **Data**     | $(x, y)$ — labelled pairs        | $x$ — no labels                    |
| **Goal**     | Learn mapping $X \to y$          | Learn underlying structure of data |
| **Examples** | Image classification, regression | Clustering, generation             |

### Generative Modelling
![[Lec09_Pg008_Generative_Modelling.png]]


Given training data, we want to learn a **model** of the data and be able to sample from the same distribution.

$$p_{\text{model}}(x) \approx p_{\text{data}}(x)$$

What we want to do with $p_{\text{model}}(x)$:

- **Evaluate** $p_{\text{model}}(x)$ — realistic data should score high, fake data should score low
- **Sample** new $x \sim p_{\text{model}}(x)$ — e.g. generate realistic images

We may also want **conditional** generation $p(x|c)$, where $c$ is a category (e.g. "generate a face"), or even $p(x_2 | x_1, c)$ for style transfer (change style $c$ applied to image $x_1$).

### Latent Variable Models
![[Lec09_Pg015_Latent_Variable_Models.png]]


Images have huge variability: gender, eye colour, hair colour, pose, lighting, etc. Unless annotated, these **factors of variation** are not explicitly available — they are **latent**.

**Idea**: explicitly model these factors with latent variables $z$.

- Put a prior on $z$: $z \sim \mathcal{N}(0, I)$
- Model the data with: $p(x|z) = \mathcal{N}(\mu_\theta(z),\, \Sigma_\theta(z))$ where $\mu_\theta$ and $\Sigma_\theta$ are neural networks
- After training, $z$ should correspond to meaningful factors — hair colour, pose, etc.
- Given a new image $x$, extract features via $p(z|x)$ — useful for clustering and representation learning

> **Example**: two images of the same person smiling will map to nearby $z$ vectors; an image of a different person with the same pose will share some $z$ dimensions but differ in others.

### Maximum Likelihood Estimation (MLE)
![[Lec09_Pg019_Maximum_Likelihood_Estimation_Mle.png]]


Likelihood as a function of model parameters:

$$L(\theta) = \prod_i p(x_i | \theta) \quad \Longrightarrow \quad \log L(\theta) = \sum_i \log p(x_i | \theta)$$

MLE is the backbone of supervised deep learning — cross-entropy and least-squares are both MLE estimators. Generative models extend this to the _unsupervised_ setting.

### Taxonomy of Generative Models
![[Lec09_Pg022_Taxonomy_Of_Generative_Models.png]]


```
Generative Models
├── Explicit Density (define p(x) explicitly)
│   ├── Tractable density
│   │   ├── Auto-regressive  (PixelCNN, WaveNet)
│   │   └── Flow models      (RealNVP, Glow)
│   └── Approximate density
│       ├── VAE              (variational inference)
│       └── Diffusion models (DDPM, DDIM)
└── Implicit / Likelihood-free
    └── GANs (generator + discriminator)
```

**Explicit models** define $p(x)$ and evaluate likelihoods → MLE training.
**Implicit / likelihood-free models** (GANs) are highly expressive but the density function is not defined or is intractable — basis for adversarial training. [Goodfellow et al., 2014; Radford et al., 2016; Karras et al., 2018, 2019]

---

## Mixture of Gaussians (MoG)
![[Lec09_Pg024_Mixture_Of_Gaussians_Mog.png]]


A simple but instructive latent variable model.

$$z \sim \text{Categorical}(1 \ldots K), \qquad p(x | z=k) = \mathcal{N}(\mu_k, \Sigma_k)$$

**Generative process**:

1. Pick a mixture component by sampling $z \sim \text{Categorical}(\pi)$
2. Sample the data point from that Gaussian: $x \sim \mathcal{N}(\mu_z, \Sigma_z)$

**Marginal** (integrating out $z$):

$$p(x) = \sum_{z} p(x, z) = \sum_{k=1}^{K} p(z=k)\,\mathcal{N}(x;\,\mu_k,\Sigma_k)$$

Combining simple Gaussians gives a much more expressive, multi-modal density.

> **Example — MNIST clustering**: fit a MoG with $K=10$ components to MNIST pixels. The model often discovers clusters that roughly correspond to digit identities (0–9) without ever seeing labels. You can also sample new digit images from each cluster, but the quality is low because MoG cannot learn complex pixel-level features.

**Limitation**: MoG cannot learn rich features of the data (it cannot compute $p(z|x)$ in a meaningful, scalable way for high-dimensional $x$ like images).

---

## Autoencoders

### Architecture
![[Lec09_Pg031_Architecture.png]]


An **autoencoder** = encoder $f$ + decoder $g$.

```
x ──→ [Encoder f] ──→ z ──→ [Decoder g] ──→ x̂
       (compress)    latent    (reconstruct)
```

- Encoder $f$: projects input space $\mathcal{X}$ into a low-dimensional latent space $\mathcal{Z}$
- Decoder $g$: maps samples from $\mathcal{Z}$ back to $\mathcal{X}$
- Together $[g \circ f]$ approximates the identity on the data

**Training objective** — minimize reconstruction error:

$$\hat\theta_f, \hat\theta_g = \arg\min_{\theta_f, \theta_g} \sum_{n=1}^N \|x_n - g(f(x_n))\|^2$$

> **Linear special case**: if both $f$ and $g$ are linear, the optimal solution is **PCA** — the encoder learns the top-$d$ principal components.

### What Autoencoders Are Good At

- Dimensionality reduction and compression
- Denoising (train on corrupted input, reconstruct clean output)
- Representation learning: use $z$ for downstream classification or clustering

### Why Autoencoders Fail for Generation

After training, the latent space $\mathcal{Z}$ is **irregular and discontinuous** — points that decode to valid images cluster in disconnected islands. Sampling a random $z$ and decoding produces garbage.

> **Analogy**: imagine the library stacks were randomly assigned. Opening a random drawer is unlikely to give you a coherent book.

Fitting a simple Gaussian $f(x) \sim \mathcal{N}(\hat\mu, \hat\sigma I)$ over the encoded training points and sampling from it does _not_ work either — the density model is too simple to capture the true structure.

> **MNIST example**: plot the 2D latent codes of an autoencoder trained on MNIST. You'll see tight clusters per digit with large empty gaps between them. A random sample from $z$-space lands in the gaps → blurry or meaningless output.

---

## Variational Autoencoders (VAE)
![[Lec09_Pg041_Variational_Autoencoders_Vae.png]]


**Paper**: Kingma & Welling, _Auto-Encoding Variational Bayes_ (2014)

A **probabilistic** version of the autoencoder that allows genuine sampling of new, unseen data.

### From GMMs to VAEs
![[Lec09_Pg045_From_Gmms_To_Vaes.png]]


The VAE is essentially a MoG with a **neural network** replacing the fixed Gaussians:

|                          | MoG                            | VAE                                            |
| ------------------------ | ------------------------------ | ---------------------------------------------- |
| Prior on $z$             | $\text{Categorical}(\pi)$      | $\mathcal{N}(0, I)$                            |
| Likelihood $p(x \mid z)$ | $\mathcal{N}(\mu_k, \Sigma_k)$ | $\mathcal{N}(\mu_\theta(z), \Sigma_\theta(z))$ |
| Features                 | Fixed, hand-specified          | Learned by the network                         |

- Prior: $z \sim \mathcal{N}(0, I)$
- Decoder: $p(x|z) = \mathcal{N}(\mu_\theta(z),\, \Sigma_\theta(z))$ — $\mu_\theta, \Sigma_\theta$ are neural networks
- Even though $p(x|z)$ is a simple Gaussian, the **marginal** $p(x) = \int p(x|z)p(z)\,dz$ is much richer and more flexible

**MLE objective** on a dataset $\mathcal{D}$:

$$\log \prod_{x \in \mathcal{D}} p(x;\theta) = \sum_{x \in \mathcal{D}} \log p(x;\theta) = \sum_{x \in \mathcal{D}} \log \sum_z p(x, z;\theta)$$

The sum inside the log is **intractable** for continuous, high-dimensional $z$ — we need a smarter approach.

---

## Evidence Lower Bound (ELBO)

### Derivation via Jensen's Inequality
![[Lec09_Pg048_Derivation_Via_Jensen_S_Inequality.png]]


The log-likelihood with latent variables is hard:

$$\log p(x;\theta) = \log \sum_{z} p(x,z;\theta) = \log \sum_z \frac{q(z)}{q(z)} p(x,z;\theta) = \log \mathbb{E}_{z \sim q(z)}\!\left[\frac{p_\theta(x,z)}{q(z)}\right]$$

where $q(z)$ is any distribution we choose (it should be simple and tractable).

Since $\log$ is **concave**, Jensen's inequality gives:

$$\log \mathbb{E}_{z \sim q}\!\left[f(z)\right] \ge \mathbb{E}_{z \sim q}\!\left[\log f(z)\right]$$

Applying this with $f(z) = p_\theta(x,z)/q(z)$:

$$\log p(x;\theta) \ge \mathbb{E}_{z \sim q(z)}\!\left[\log \frac{p_\theta(x,z)}{q(z)}\right] =: \mathcal{L}(x;\theta,\phi) \quad \text{(ELBO)}$$

### Derivation via KL Divergence
![[Lec09_Pg052_Derivation_Via_Kl_Divergence.png]]


Starting from:

$$D_{KL}(q(z) \| p(z|x;\theta)) = -\sum_z q(z)\log p(z,x;\theta) + \log p(x;\theta) - H(q) \ge 0$$

Rearranging:

$$\log p(x;\theta) \ge \underbrace{\sum_z q(z)\log p(z,x;\theta) + H(q)}_{\text{ELBO}} = \mathcal{L}$$

Equality holds when $q = p(z|x)$ because $D_{KL} = 0$ in that case.

In general:

$$\boxed{\log p(x;\theta) = \mathcal{L}(x;\theta,\phi) + D_{KL}(q(z) \| p(z|x;\theta))}$$

The closer our chosen $q$ is to the true posterior $p(z|x)$, the tighter the ELBO is to the true likelihood.

### ELBO as Reconstruction + KL
![[Lec09_Pg049_Elbo_As_Reconstruction_Kl.png]]


Expanding the ELBO with $q_\phi(z|x)$ as the encoder:

$$\mathcal{L}(x;\theta,\phi) = \mathbb{E}_{q_\phi(z|x)}\!\Big[\log p_\theta(x,z) - \log q_\phi(z|x)\Big]$$

$$= \mathbb{E}_{q_\phi(z|x)}\!\Big[\log p_\theta(x|z)\Big] - D_{KL}\!\Big(q_\phi(z|x) \| p(z)\Big)$$

$$= \underbrace{\mathbb{E}_{q(z|x)}[\log p_\theta(x|z)]}_{\text{Reconstruction}} - \underbrace{D_{KL}(q_\phi(z|x) \| p(z))}_{\text{Regularisation}}$$

**Term 1 — Reconstruction loss**: how well does the decoder recover $x$ from $z$?

- Continuous data ($x \in \mathbb{R}^d$): $\|x - \hat{x}\|^2$ (MSE / Gaussian likelihood)
- Binary data (e.g. binarised MNIST): binary cross-entropy

**Term 2 — KL divergence**: how far is the posterior from the prior $\mathcal{N}(0,I)$?

For Gaussians ($q_\phi(z|x) = \mathcal{N}(\mu, \sigma^2 I)$, $p(z) = \mathcal{N}(0,I)$) this is **analytic**:

$$D_{KL} = -\frac{1}{2}\sum_{j=1}^{d}\left(1 + \log\sigma_j^2 - \mu_j^2 - \sigma_j^2\right)$$

> **Intuition**: The KL term acts as a regularizer pushing each $z_j$ dimension toward $\mathcal{N}(0,1)$. Without it, the encoder can "cheat" by mapping every input to a very narrow distribution (basically the non-generative autoencoder), defeating the purpose.

---

## Variational Inference
![[Lec09_Pg055_Variational_Inference.png]]


We introduce an **approximate posterior** $q_\phi(z|x)$ (the encoder) — a tractable distribution parametrised by $\phi$, e.g. a diagonal Gaussian:

$$q_\phi(z|x) = \mathcal{N}(\phi_1(x),\, \phi_2(x))$$

**Variational inference**: optimise $\phi$ so that $q_\phi(z|x)$ is as close as possible to the true posterior $p(z|x;\theta)$, while remaining simple to compute.

> **Example**: the true posterior $p(z|x)$ (shown in blue) might be a skewed non-Gaussian shape. The variational distribution $q_\phi$ (a Gaussian, shown in orange) is fit to approximate it. A poor choice (green) fails to capture the posterior's mass.

The key insight of VAEs is to **amortise** this inference: instead of running optimisation at test time for every $x$, train an encoder network $E_\phi$ that directly maps $x \to (\mu_\phi, \sigma_\phi)$ in a single forward pass.

---

## Learning the Parameters
![[Lec09_Pg065_Learning_The_Parameters.png]]


We jointly optimise decoder parameters $\theta$ and encoder parameters $\phi$ by maximising the ELBO:

$$\mathcal{L}(x;\theta,\phi) = \mathbb{E}_{q_\phi(z|x)}\!\Big[\log p_\theta(x|z)\Big] - D_{KL}\!\Big(q_\phi(z|x) \| p(z)\Big)$$

**Gradient w.r.t. $\theta$** (decoder — straightforward):

$$\nabla_\theta \mathcal{L} = \nabla_\theta \mathbb{E}_{q_\phi(z|x)}\!\big[\log p_\theta(x|z)\big] = \mathbb{E}_{q_\phi(z|x)}\!\big[\nabla_\theta \log p_\theta(x|z)\big] \approx \frac{1}{n}\sum_{i=1}^n \nabla_\theta \log p_\theta(x|z_i;\theta)$$

Since $\theta$ does not appear inside the expectation distribution, we can move the gradient inside freely.

**Gradient w.r.t. $\phi$** (encoder — tricky):

$$\nabla_\phi \mathcal{L} = \nabla_\phi \mathbb{E}_{q_\phi(z|x)}\!\big[\log p_\theta(x|z)\big] - \nabla_\phi D_{KL}$$

The expectation itself depends on $\phi$ (it is the distribution we sample $z$ from), so we cannot naively move $\nabla_\phi$ inside. This requires the **reparameterization trick**.

---

## The Reparameterization Trick

**Problem**: $z \sim q_\phi(z|x)$ is a stochastic sampling step — gradients cannot flow through it.

**Solution**: express the sample as a **deterministic** function of $(\phi, \varepsilon)$ where $\varepsilon$ is noise that doesn't depend on the parameters:

$$z = \mu_\phi(x) + \sigma_\phi(x) \odot \varepsilon, \qquad \varepsilon \sim \mathcal{N}(0, I)$$

Now the expectation becomes:

$$\mathbb{E}_{z \sim q_\phi}\!\big[r(z)\big] = \mathbb{E}_{\varepsilon \sim \mathcal{N}(0,I)}\!\big[r(\mu + \sigma \varepsilon)\big]$$

And the gradient moves inside cleanly:

$$\nabla_\phi \mathbb{E}_{q_\phi}\!\big[r(z)\big] = \mathbb{E}_\varepsilon\!\big[\nabla_\phi\, r(\mu + \sigma\varepsilon)\big] \approx \frac{1}{n}\sum_{i=1}^n \nabla_\phi\, r(\mu + \sigma\varepsilon_i)$$

The randomness ($\varepsilon$) is now **external** — gradients flow back through $\mu_\phi$ and $\sigma_\phi$ via standard backpropagation.

```
              ε ~ N(0,I)   ← external noise, no gradient
                  │
x ──→ Encoder ──→ μ, σ
                  │  z = μ + σ⊙ε
                  ↓
               Decoder ──→ x̂
                  ↓
               ELBO loss
```

> **Example**: without reparameterization, training a VAE on MNIST wouldn't converge — the KL term would not receive gradients back to the encoder. With reparameterization, the encoder learns to produce posteriors that both reconstruct well _and_ stay close to $\mathcal{N}(0,I)$.

---

## Generating Data
![[Lec09_Pg074_Generating_Data.png]]


At **training time**: requires both encoder and decoder (compute ELBO).

At **inference / generation time**: only the **decoder** is needed.

1. Sample $z \sim p(z) = \mathcal{N}(0, I)$
2. Pass through decoder: $\hat{x} = g_\theta(z)$

The KL regularization ensures this works — because the encoder is trained to push $q_\phi(z|x) \approx \mathcal{N}(0,I)$, any random $z$ from the prior decodes to a plausible image.

---

## Latent Space Properties
![[Lec09_Pg037_Latent_Space_Properties.png]]


Because the KL term regularizes $z$ toward $\mathcal{N}(0,I)$, the latent space has structure:

1. **Continuity**: nearby points in $z$ decode to visually similar outputs
2. **Completeness**: any $z \sim \mathcal{N}(0,I)$ decodes to something valid
3. **Smooth interpolation**: linearly interpolating between two $z$ codes gives a smooth visual transition

### Example: Face Interpolation

```
α = 0.0       α = 0.25      α = 0.50      α = 0.75      α = 1.0
z_A ──────────────────────────────────────────────────────→ z_B
[face A] → [blend 25%] → [blend 50%] → [blend 75%] → [face B]
```

With a standard autoencoder, decoding points between $z_A$ and $z_B$ would give noise. With a VAE, you get a smooth morphing sequence.

### Latent Space Arithmetic
Like word2vec arithmetic (`king − man + woman ≈ queen`), VAE latent codes support semantic arithmetic:

```
z("smiling woman") − z("neutral woman") + z("neutral man") ≈ z("smiling man")
```

---

## Autoencoder vs. VAE Latent Spaces
|                 | Regular Autoencoder      | VAE                          |
| --------------- | ------------------------ | ---------------------------- |
| Encoder output  | Single point $z$         | Distribution $(\mu, \sigma)$ |
| Latent space    | Irregular, discontinuous | Smooth, structured           |
| Random sampling | Mostly garbage           | Valid outputs                |
| Interpolation   | Discontinuous            | Smooth                       |

> **MNIST visualisation**: a regular AE has tight digit clusters with large empty gaps — random samples from the gaps are meaningless. A VAE has overlapping, smoothly-varying clusters — samples from anywhere produce recognisable (if blurry) digits.

---

## Applications

### Disentangled Representation Learning
![[Lec09_Pg079_Disentangled_Representation_Learning.png]]


**Goal**: learn a latent space where each dimension controls an independent, interpretable factor (e.g. one dimension = pose, another = lighting).

The **beta-VAE** [Higgins et al., 2017] adds a hyperparameter $\beta$ to weight the KL term:

$$\mathcal{L}_\beta(x) = \mathbb{E}_{q_\phi(z|x)}\!\big[\log p_\theta(x|z)\big] - \beta\, D_{KL}\!\big(q_\phi(z|x) \| p(z)\big)$$

- $\beta = 1$: recovers the standard VAE
- $\beta > 1$: imposes a stronger constraint, encouraging independent latent dimensions (disentanglement) at the cost of reconstruction quality

[Locatello et al., 2019] showed that unsupervised disentanglement is hard without inductive biases — there are many equally valid disentangled representations.

### Style Transfer (Text and Images)
![[Lec09_Pg082_Style_Transfer_Text_And_Images.png]]


VAEs disentangle **style** from **content** in the latent space. Applications:

- **Image style transfer**: given content image $x_1$ and style $c$, generate $p(x_2 | x_1, c)$. [Gatys et al., 2016]
- **Text style transfer**: encode a sentence, manipulate the style dimension (e.g. sentiment), decode back. [Shen et al., 2017]

### Handwriting Synthesis (Aksan et al., 2018)
![[Lec09_Pg086_Handwriting_Synthesis_Aksan_Et_Al_2018.png]]


A VAE trained on handwriting samples can:

- (A) Synthesize handwriting from typed text while giving users control over visual appearance (style)
- (B) Transfer style across handwriting samples
- (C) Edit handwritten samples at the word level

### Hand Pose Manifold (Tagliasacchi et al., 2015)
![[Lec09_Pg083_Hand_Pose_Manifold_Tagliasacchi_Et_Al.png]]


A VAE trained on hand pose data learns a smooth, compact manifold of valid hand configurations. Sampling from the manifold always produces a valid (anatomically plausible) hand pose — useful for 3D pose estimation from noisy depth sensors.

---

## Code: VAE in PyTorch (MNIST)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# ── Model ──────────────────────────────────────────────────
class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super().__init__()
        # Encoder: x → (μ, log σ²)
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc_mu = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)
        # Decoder: z → x̂
        self.fc3 = nn.Linear(latent_dim, hidden_dim)
        self.fc4 = nn.Linear(hidden_dim, input_dim)

    def encode(self, x):
        h = F.relu(self.fc1(x))
        return self.fc_mu(h), self.fc_logvar(h)

    def reparameterize(self, mu, logvar):
        # z = μ + σ⊙ε,  ε ~ N(0, I)
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)   # external noise — gradients do NOT flow here
        return mu + eps * std         # but DO flow through μ and σ

    def decode(self, z):
        h = F.relu(self.fc3(z))
        return torch.sigmoid(self.fc4(h))

    def forward(self, x):
        mu, logvar = self.encode(x.view(-1, 784))
        z = self.reparameterize(mu, logvar)
        return self.decode(z), mu, logvar

# ── Loss = Reconstruction + KL ──────────────────────────────
def elbo_loss(x_hat, x, mu, logvar):
    # Reconstruction: binary cross-entropy summed over pixels
    recon = F.binary_cross_entropy(x_hat, x.view(-1, 784), reduction='sum')
    # KL: -½ Σ(1 + log σ² - μ² - σ²)
    kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    return recon + kl

# ── Training loop ───────────────────────────────────────────
mnist = datasets.MNIST('.', download=True, transform=transforms.ToTensor())
loader = DataLoader(mnist, batch_size=128, shuffle=True)

model = VAE()
optimiser = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(20):
    total_loss = 0
    for x, _ in loader:
        x_hat, mu, logvar = model(x)
        loss = elbo_loss(x_hat, x, mu, logvar)
        optimiser.zero_grad()
        loss.backward()
        optimiser.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1:02d} | Loss: {total_loss/len(mnist):.2f}")

# ── Generation (only decoder needed) ───────────────────────
with torch.no_grad():
    z = torch.randn(16, 20)          # sample from prior N(0, I)
    samples = model.decode(z)        # decode to image space
    samples = samples.view(16, 1, 28, 28)
```

### Example: Latent Space Interpolation

```python
import torch

def interpolate(model, z_a, z_b, steps=10):
    """Linearly interpolate between two latent codes."""
    alphas = torch.linspace(0, 1, steps)
    frames = []
    with torch.no_grad():
        for alpha in alphas:
            z = (1 - alpha) * z_a + alpha * z_b
            frames.append(model.decode(z))
    return torch.stack(frames)   # shape: (steps, 784)

# Encode two MNIST digits into their latent means
x_a, x_b = mnist[0][0], mnist[7][0]
mu_a, _ = model.encode(x_a.view(1, -1))
mu_b, _ = model.encode(x_b.view(1, -1))

frames = interpolate(model, mu_a, mu_b)
# Plotting `frames` shows a smooth morph between the two digits
```

---

## Summary of VAEs
![[Lec09_Pg087_Summary_Of_Vaes.png]]


| Aspect            | Detail                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Pros**          | Relatively easy to train; explicit inference network $q(z \mid x)$; principled probabilistic framework; smooth latent space |
| **Cons**          | Blurry samples (MSE averages over uncertainty); ELBO is a lower bound (no exact likelihood)                                 |
| **vs. AE**        | Adds KL regularization → structured, sampleable latent space                                                                |
| **vs. GAN**       | More stable training; explicit likelihood; but lower sharpness                                                              |
| **vs. Diffusion** | Faster sampling; but lower sample quality                                                                                   |

**Why blurry?** Optimizing MSE reconstruction encourages the decoder to output the _mean_ of all possible reconstructions consistent with $z$, rather than a single sharp sample. This is the classic **regression-to-the-mean** problem.

---

## VAEs vs. Other Generative Models

| Model       | Latent Space           | Sample Quality      | Training Stability       |
| ----------- | ---------------------- | ------------------- | ------------------------ |
| Autoencoder | Unstructured           | Bad (gap problem)   | Stable                   |
| **VAE**     | Structured, continuous | OK (blurry)         | Stable                   |
| GAN         | Implicit               | Sharp, high quality | Unstable (mode collapse) |
| Diffusion   | Hierarchical noise     | Excellent           | Stable                   |

VAEs underpin many modern generative systems. Stable Diffusion, for instance, uses a **VAE** to compress images into a compact latent space and then runs the diffusion process there — combining stable VAE training with the sharpness of diffusion sampling. → [[notes/mlp/12-diffusion|Diffusion Models L12]]

---

[[notes/mlp/08-iml|Previous: L08: Interactive ML]] | [[notes/mlp/index|Back to MPL Index]] | [[notes/mlp/10-gans|Next: GANs]]
