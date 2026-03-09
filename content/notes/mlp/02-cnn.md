---
title: "L02 — Convolutional Neural Networks"
tags:
  - mlp
  - cnn
  - deep-learning
  - computer-vision
date: 2026-03-09
---

[[notes/mlp/01-introduction|← L01: Introduction]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/03-vision-cnn|Next: Vision CNNs →]]

---

## Human Visual Perception

### The Human Eye

- Light passes through the **cornea** and **pupil**
- The pupil adjusts light incidence; the **lens** focuses light onto the **retina**
- The **fovea**: dense array of photoreceptors; receives light from objects looked at directly; area of highest visual acuity (hence saccades)
- The **optic nerve** carries information from the retina on to the brain

### Retina

Hierarchy of cell layers:

- **Receptor cells** (rods/cones) transduce light
- **Horizontal cells** convey information laterally
- **Bipolar cells** pool photoreceptors and connect to horizontal cells
- **Amacrine cells** modulate signals
- **Ganglion cells** form the optic nerve

### Cell Types

**Photoreceptor cells** differ in sensitivity, number, location, response time, and wavelength.

**Retinal ganglion cells** have different populations (M, P, and K cells; intrinsic photosensitive cells) with different responses to contrast, color, shape, texture, and motion.

### Photoreceptors

|                  | Rods      | Cones     |
| ---------------- | --------- | --------- |
| Sensitivity      | +         | −         |
| Number           | 90 × 10⁶  | 4.5 × 10⁶ |
| Location         | periphery | center    |
| Response time    | −         | +         |
| Wavelength range | +         | −         |
| # Pigments       | 1         | 3         |
| # Photons needed | 1         | 10–100    |

- **Rods**: night vision
- **Cones**: colour vision and fine details

### Thalamus and the LGN

Optic nerves terminate in two **lateral geniculate nuclei (LGN)**:

- Part of the central nervous system; function mostly unknown → temporal de-correlation? [Dong and Atick, 1995]
- Segregates visual information into physically distinct pathways
- Acts as a "relay station" between retina and the visual cortex

### Visual Cortex

- Largest system in the brain: **40 × 10⁶ neurons**; active area of research, not fully understood
- **Cortical hierarchy**: V1 (striate/primary visual cortex) → V2–V8 (secondary visual areas)

### Two-Streams Hypothesis

[Goodale and Milner, 1992; Norman, 2002]

- **Dorsal stream** (V1 → V2 → V5 → V6): the "where pathway" — visually guided action (eyes, head, limbs)
- **Ventral stream** (V1 → V2 → V4 → IT): the "what pathway" — representation of the visual world, visual memory, object identification and recognition

### Specificity vs. Invariance

Goal: good classification performance requires a trade-off between:

- **Specificity** — sensitivity to fine detail
- **Invariance** — robustness to affine transformations and lighting changes

This trade-off directly impacts generalisation ability.

### Simple and Complex Cells

[Hubel and Wiesel, 1959, 1962]

- **Simple cells**: respond to oriented edges/bars at a specific location
- **Complex cells**: respond to the same orientations regardless of exact location — position invariance

### Receptive Field

- All receptors synapsing with a particular cell collectively form its **receptive field**
- Cells have excitatory/inhibitory regions → **on-center / off-center** cells
- Sensitive to contrast and orientation of a bar, edge, or gratings

### Hierarchical Organisation

The visual system builds progressively more complex representations from low-level edge detectors to higher-level object descriptions.

### Invariance to Affine Transforms

Neurons in the inferior temporal cortex show invariance to position, scale, and view [Logothetis et al., 1995] — a property that CNNs aim to replicate.

---

## History of Deep Learning

### HMAX Model

[Riesenhuber and Poggio, 2000; Serre et al., 2007]

- Models the "immediate object recognition" process (first few hundred milliseconds — before top-down influences such as attention shifts or eye movements)
- Alternates between **S-units** and **C-units**; many iterations allow construction of complex objects from low-level features

**S-cell** (simple cell) response — tuned to specific stimuli with typically small receptive fields:

$$y = \exp\!\left(-\frac{1}{2\sigma^2} \sum_{j=1}^{n_{S_k}} (w_j - x_j)^2\right)$$

- $\sigma$ defines the sharpness of the bell-shaped tuning
- $w$ are the trainable parameters

**C-cell** (complex cell) response — combines output from multiple S-units to increase invariance and receptive field:

$$y = \max_{j=1 \ldots n_{C_k}} x_j$$

- Response corresponds to the strongest of its afferents — a **pooling operation**

### Neocognitron (1982)

[Fukushima and Miyake, 1982] — an early CNN-like architecture with alternating S-layers and C-layers, directly implementing the Hubel-Wiesel hierarchy.

### LeNet-5 (1998)

[LeCun et al., 1998] — convolutional + pooling + fully-connected layers; **~60,000 parameters**; trained on handwritten digit recognition.

### AlexNet (2012)

[Krizhevsky et al., 2012] — **~60,000,000 parameters**, trained on two GPUs. Evaluated on the large-scale ImageNet dataset [Deng et al., 2009] and dramatically outperformed prior methods.

### Fine-Grained Prediction

Beyond classification, CNNs were extended to dense predictions — object detection [Ren et al., 2015; Girshick, 2015; He et al., 2017] and scene labelling [Farabet et al., 2012].

---

## Deep Learning in a Nutshell

### Traditional Approach

Image features were often:

- Handcrafted and fixed
- Too general (not task-specific enough), or too specific (do not generalise well to other tasks)

### Trainable Features

- **Parametrised feature extraction**: features are learned, not hand-coded
- Features should be efficient to compute and efficient to train (differentiable)
- **Joint training** of feature extraction and classification → "end-to-end system"

### Summary of Main Ideas

1. **Learning of features** across many layers
2. **Efficient and trainable systems** via differentiable building blocks
3. **Composition of deep architectures** via non-linear modules
4. **"End-to-end" training**: no differentiation between feature extraction and classification

---

## Convolutional Neural Networks

### Fully Connected Layer

A 32×32×3 image flattened to 3072×1 is fed into a dense layer. This ignores all spatial structure and scales poorly.

### Convolutional Layer

- A **filter** (kernel) slides across the spatial dimensions of the input
- Filters always **extend the full depth** of the input volume
- The filter computes a dot product at each spatial position → produces an **activation map** (also called a **feature map**)

### Multiple Activation Maps

Using multiple filters in parallel produces multiple feature maps. For example, six 5×5 filters applied to a 32×32×3 input produce six separate activation maps of size 28×28, which stack into a volume of **28×28×6**.

### Key Idea

CNNs are a **sequence of convolutional layers interspersed with activation functions**. Each layer learns increasingly abstract representations.

### Weight Sharing

The same filter weights are applied at every spatial position. Advantages:

- Reduces the number of weights that must be learned
- Reduces model training time
- Makes feature search **insensitive to feature location**

### Visualisation

[Zeiler and Fergus, 2014] — visualising what each filter responds to shows that:

- **Early layers** learn edges, colors, and textures
- **Later layers** learn more complex object parts and eventually whole objects

### Brain/Neuron View

Each unit in a feature map is connected only to a local patch of the input (its **receptive field**). Units sharing a filter form a layer analogous to a sheet of simple cells in V1.

### Pooling Layer

- Makes representations **smaller and more manageable**
- Operates over each activation map **independently**

**Max pooling**: takes the maximum value in each pooling window — the most common form.

### Revolution of Depth

Increasing network depth has been the primary driver of performance improvements in image recognition.

### Case Study: VGG

[Simonyan and Zisserman, 2014]

- **Smaller filters** (only 3×3), **more layers**
- Due to depth: large receptive field despite smaller filters
- Due to smaller filters: fewer parameters

### Case Study: GoogLeNet

[Szegedy et al., 2015]

- 22 layers; efficient **"Inception" module** — "network within a network"
- No fully-connected layers; only **5 million parameters** (12× less than AlexNet)
- **Naïve Inception module**: applies 1×1, 3×3, and 5×5 convolutions in parallel → continuous increase in dimensionality
- **Final Inception module**: adds **1×1 convolutions for dimensionality reduction** (feature map pooling) before expensive convolutions

### Gradient Flow Problem

Ensuring sufficient gradient flow through very deep networks was a key challenge:

- **VGG**: first trained an 11-layer model to convergence, then added random layers in the middle
- **GoogLeNet**: used **auxiliary classifiers** to inject extra gradient into the lower layers

Shortly afterwards, **batch normalisation** was invented, removing the need for such hacks.

### Case Study: ResNet

[He et al., 2016]

A deeper network should perform at least as well as a shallower one — in theory, you could take a trained shallow network, copy its layers, and set the extra layers to the identity. But in practice, optimisers fail to find this.

**Residual connections** fix this:

$$y = F(x) + x$$

$F(x)$ is a **residual mapping** w.r.t. identity.

- If identity is optimal, it is easy to push $F(x)$ weights to 0
- If the optimal mapping is close to identity, it is easier to learn small fluctuations
- **Residual connections improve gradient flow**: at add-gates in the backward pass, the upstream gradient flows directly through the skip connection

Results:

- Deep ResNets can be trained without difficulty
- Deeper ResNets achieve lower training _and_ lower test error
- Trained in 2–3 weeks on an 8-GPU machine; faster than VGG at runtime despite being 8× deeper

### Case Study: DenseNet / FractalNet

[Huang et al., 2017; Larsson et al., 2016]

**DenseNet**: layer $l_n$ receives feature maps from **all** preceding layers $l_0 \ldots l_{n-1}$ — maximises feature reuse and gradient flow.

**FractalNet**: a fractal-structured network that achieves depth without residual connections.

### Further Architectures

- Wide ResNet [Zagoruyko and Komodakis, 2016]
- ResNeXt [Xie et al., 2017]
- CondenseNet [Huang et al., 2018]

Fully convolutional networks for dense prediction:

- HourGlass [Newell et al., 2016]
- U-Net [Ronneberger et al., 2015]

---

[[notes/mlp/01-introduction|← L01: Introduction]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/03-vision-cnn|Next: Vision CNNs →]]
