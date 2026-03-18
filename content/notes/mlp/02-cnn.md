---
title: "L02 — Convolutional Neural Networks"
tags:
  - mlp
  - cnn
  - deep-learning
  - neural-networks
  - computer-vision
date: 2026-03-09
---

[[notes/mlp/01-introduction|Previous: L01: Introduction]] | [[notes/mlp/index|Back to MPL Index]] | [[notes/mlp/03-vision-cnn|Next: Vision CNNs]]

---

## Human Visual Perception

### The Human Eye

![[Lecture02_Pg006_The_Human_Eye.png]]

- Light passes through the **cornea** and **pupil**
- The pupil adjusts light incidence; the **lens** focuses light onto the **retina**
- The **fovea**: dense array of photoreceptors; receives light from objects looked at directly; area of highest visual acuity (hence saccades)
- The **optic nerve** carries information from the retina on to the brain

### Retina

![[Lecture02_Pg007_Retina.png]]

Hierarchy of cell layers:

- **Receptor cells** (rods/cones) transduce light
- **Horizontal cells** convey information laterally
- **Bipolar cells** pool photoreceptors and connect to horizontal cells
- **Amacrine cells** modulate signals
- **Ganglion cells** form the optic nerve

### Cell Types

![[Lecture02_Pg008_Cell_Types.png]]

**Photoreceptor cells** differ in sensitivity, number, location, response time, and wavelength.

**Retinal ganglion cells** have different populations (M, P, and K cells; intrinsic photosensitive cells) with different responses to contrast, color, shape, texture, and motion.

### Photoreceptors

![[Lecture02_Pg009_Photoreceptors.png]]

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

![[Lecture02_Pg010_Thalamus_And_The_Lgn.png]]

Optic nerves terminate in two **lateral geniculate nuclei (LGN)**:

- Part of the central nervous system; function mostly unknown → temporal de-correlation? [Dong and Atick, 1995]
- Segregates visual information into physically distinct pathways
- Acts as a "relay station" between retina and the visual cortex

### Visual Cortex

![[Lecture02_Pg011_Visual_Cortex.png]]

- Largest system in the brain: **40 × 10⁶ neurons**; active area of research, not fully understood
- **Cortical hierarchy**: V1 (striate/primary visual cortex) → V2–V8 (secondary visual areas)

### Two-Streams Hypothesis

![[Lecture02_Pg013_Two_Streams_Hypothesis.png]]

[Goodale and Milner, 1992; Norman, 2002]

- **Dorsal stream** (V1 → V2 → V5 → V6): the "where pathway" — visually guided action (eyes, head, limbs)
- **Ventral stream** (V1 → V2 → V4 → IT): the "what pathway" — representation of the visual world, visual memory, object identification and recognition

### Specificity vs. Invariance

![[Lecture02_Pg015_Specificity_Vs_Invariance.png]]

Goal: good classification performance requires a trade-off between:

- **Specificity** — sensitivity to fine detail
- **Invariance** — robustness to affine transformations and lighting changes

This trade-off directly impacts generalisation ability.

### Simple and Complex Cells

![[Lecture02_Pg016_Simple_And_Complex_Cells.png]]

[Hubel and Wiesel, 1959, 1962]

- **Simple cells**: respond to oriented edges/bars at a specific location
- **Complex cells**: respond to the same orientations regardless of exact location — position invariance

### Receptive Field

![[Lecture02_Pg018_Receptive_Field.png]]

- All receptors synapsing with a particular cell collectively form its **receptive field**
- Cells have excitatory/inhibitory regions → **on-center / off-center** cells
- Sensitive to contrast and orientation of a bar, edge, or gratings

### Hierarchical Organisation

![[Lecture02_Pg019_Hierarchical_Organisation.png]]

The visual system builds progressively more complex representations from low-level edge detectors to higher-level object descriptions.

### Invariance to Affine Transforms

![[Lecture02_Pg020_Invariance_To_Affine_Transforms.png]]

Neurons in the inferior temporal cortex show invariance to position, scale, and view [Logothetis et al., 1995] — a property that CNNs aim to replicate.

---

## History of Deep Learning

### HMAX Model

![[Lecture02_Pg022_Hmax_Model.png]]

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

![[Lecture02_Pg029_Neocognitron_1982.png]]

[Fukushima and Miyake, 1982] — an early CNN-like architecture with alternating S-layers and C-layers, directly implementing the Hubel-Wiesel hierarchy.

### LeNet-5 (1998)

![[Lecture02_Pg030_Lenet_5_1998.png]]

[LeCun et al., 1998] — convolutional + pooling + fully-connected layers; **~60,000 parameters**; trained on handwritten digit recognition.

### AlexNet (2012)

![[Lecture02_Pg031_Alexnet_2012.png]]

[Krizhevsky et al., 2012] — **~60,000,000 parameters**, trained on two GPUs. Evaluated on the large-scale ImageNet dataset [Deng et al., 2009] and dramatically outperformed prior methods.

### Fine-Grained Prediction

![[Lecture02_Pg033_Fine_Grained_Prediction.png]]

Beyond classification, CNNs were extended to dense predictions — object detection [Ren et al., 2015; Girshick, 2015; He et al., 2017] and scene labelling [Farabet et al., 2012].

---

## Deep Learning in a Nutshell

### Traditional Approach

![[Lecture02_Pg035_Traditional_Approach.png]]

Image features were often:

- Handcrafted and fixed
- Too general (not task-specific enough), or too specific (do not generalise well to other tasks)

### Trainable Features

![[Lecture02_Pg037_Trainable_Features.png]]

- **Parametrised feature extraction**: features are learned, not hand-coded
- Features should be efficient to compute and efficient to train (differentiable)
- **Joint training** of feature extraction and classification → "end-to-end system"

### Summary of Main Ideas

![[Lecture02_Pg038_Summary_Of_Main_Ideas.png]]

1. **Learning of features** across many layers
2. **Efficient and trainable systems** via differentiable building blocks
3. **Composition of deep architectures** via non-linear modules
4. **"End-to-end" training**: no differentiation between feature extraction and classification

---

## Convolutional Neural Networks

### Fully Connected Layer

![[Lecture02_Pg040_Fully_Connected_Layer.png]]

A 32×32×3 image flattened to 3072×1 is fed into a dense layer. This ignores all spatial structure and scales poorly.

### Convolutional Layer

![[Lecture02_Pg044_Convolutional_Layer.png]]

- A **filter** (kernel) slides across the spatial dimensions of the input
- Filters always **extend the full depth** of the input volume
- The filter computes a dot product at each spatial position → produces an **activation map** (also called a **feature map**)

> **Example — vertical edge filter**: imagine a 3×3 kernel whose left column has positive weights and right column has negative weights. When it slides over a photo, it activates strongly on transitions like a door frame, a window border, or the outline of a dog's ear, but stays near zero on flat sky or wall regions.

### Multiple Activation Maps

![[Lecture02_Pg048_Multiple_Activation_Maps.png]]

Using multiple filters in parallel produces multiple feature maps. For example, six 5×5 filters applied to a 32×32×3 input produce six separate activation maps of size 28×28, which stack into a volume of **28×28×6**.

### Key Idea

<!-- Review Needed: close slide match for 'Key Idea' (p49: 0.765, p50: 0.765) -->

![[Lecture02_Pg049_Key_Idea.png]]
![[Lecture02_Pg050_Key_Idea.png]]

<!-- Review Needed: close slide match for 'Key Idea' (p49: 0.827, p50: 0.827) -->

CNNs are a **sequence of convolutional layers interspersed with activation functions**. Each layer learns increasingly abstract representations.

### Weight Sharing

![[Lecture02_Pg051_Weight_Sharing.png]]

The same filter weights are applied at every spatial position. Advantages:

- Reduces the number of weights that must be learned
- Reduces model training time
- Makes feature search **insensitive to feature location**

### Visualisation

<!-- Review Needed: close slide match for 'Visualisation' (p52: 0.649, p53: 0.646) -->

![[Lecture02_Pg052_Visualisation.png]]
![[Lecture02_Pg053_Visualisation.png]]

<!-- Review Needed: close slide match for 'Visualisation' (p52: 0.656, p53: 0.653) -->

[Zeiler and Fergus, 2014] — visualising what each filter responds to shows that:

- **Early layers** learn edges, colors, and textures
- **Later layers** learn more complex object parts and eventually whole objects

### Brain/Neuron View

<!-- Review Needed: close slide match for 'Brain/Neuron View' (p54: 0.647, p55: 0.647) -->

![[Lecture02_Pg054_Brain_Neuron_View.png]]
![[Lecture02_Pg055_Brain_Neuron_View.png]]

<!-- Review Needed: close slide match for 'Brain/Neuron View' (p54: 0.615, p55: 0.615) -->

Each unit in a feature map is connected only to a local patch of the input (its **receptive field**). Units sharing a filter form a layer analogous to a sheet of simple cells in V1.

### Pooling Layer

![[Lecture02_Pg057_Pooling_Layer.png]]

- Makes representations **smaller and more manageable**
- Operates over each activation map **independently**

**Max pooling**: takes the maximum value in each pooling window — the most common form.

> **Example — max pooling**: if a 2×2 activation patch is $\begin{bmatrix}0.1 & 0.7 \\ 0.2 & 0.6\end{bmatrix}$, max pooling outputs `0.7`. If the strongest response shifts slightly within that same window, the pooled output stays almost unchanged, which is why pooling gives small translation invariance.

### Revolution of Depth

<!-- Review Needed: close slide match for 'Revolution of Depth' (p60: 0.660, p62: 0.660) -->

![[Lecture02_Pg060_Revolution_Of_Depth.png]]
![[Lecture02_Pg062_Revolution_Of_Depth.png]]

<!-- Review Needed: close slide match for 'Revolution of Depth' (p60: 0.653, p62: 0.653) -->

Increasing network depth has been the primary driver of performance improvements in image recognition.

### Case Study: VGG

![[Lecture02_Pg061_Case_Study_Vgg.png]]

[Simonyan and Zisserman, 2014]

- **Smaller filters** (only 3×3), **more layers**
- Due to depth: large receptive field despite smaller filters
- Due to smaller filters: fewer parameters

### Case Study: GoogLeNet

<!-- Review Needed: close slide match for 'Case Study: GoogLeNet' (p65: 0.772, p63: 0.727) -->

![[Lecture02_Pg065_Case_Study_Googlenet.png]]
![[Lecture02_Pg063_Case_Study_Googlenet.png]]

[Szegedy et al., 2015]

- 22 layers; efficient **"Inception" module** — "network within a network"
- No fully-connected layers; only **5 million parameters** (12× less than AlexNet)
- **Naïve Inception module**: applies 1×1, 3×3, and 5×5 convolutions in parallel → continuous increase in dimensionality
- **Final Inception module**: adds **1×1 convolutions for dimensionality reduction** (feature map pooling) before expensive convolutions

### Gradient Flow Problem

![[Lecture02_Pg067_Gradient_Flow_Problem.png]]

Ensuring sufficient gradient flow through very deep networks was a key challenge:

- **VGG**: first trained an 11-layer model to convergence, then added random layers in the middle
- **GoogLeNet**: used **auxiliary classifiers** to inject extra gradient into the lower layers

Shortly afterwards, **batch normalisation** was invented, removing the need for such hacks.

### Case Study: ResNet

![[Lecture02_Pg071_Case_Study_Resnet.png]]

[He et al., 2016]

A deeper network should perform at least as well as a shallower one — in theory, you could take a trained shallow network, copy its layers, and set the extra layers to the identity. But in practice, optimisers fail to find this.

**Residual connections** fix this:

$$y = F(x) + x$$

$F(x)$ is a **residual mapping** w.r.t. identity.

> **Example — learning a correction instead of a full mapping**: if earlier layers already detect a useful edge map, a later residual block only needs to learn a small change like "emphasize curved edges" or "suppress background texture". That is much easier than relearning the entire representation from scratch.

- If identity is optimal, it is easy to push $F(x)$ weights to 0
- If the optimal mapping is close to identity, it is easier to learn small fluctuations
- **Residual connections improve gradient flow**: at add-gates in the backward pass, the upstream gradient flows directly through the skip connection

Results:

- Deep ResNets can be trained without difficulty
- Deeper ResNets achieve lower training _and_ lower test error
- Trained in 2–3 weeks on an 8-GPU machine; faster than VGG at runtime despite being 8× deeper

### Case Study: DenseNet / FractalNet

![[Lecture02_Pg077_Case_Study_Densenet_Fractalnet.png]]

[Huang et al., 2017; Larsson et al., 2016]

**DenseNet**: layer $l_n$ receives feature maps from **all** preceding layers $l_0 \ldots l_{n-1}$ — maximises feature reuse and gradient flow.

**FractalNet**: a fractal-structured network that achieves depth without residual connections.

### Further Architectures

![[Lecture02_Pg078_Further_Architectures.png]]

- Wide ResNet [Zagoruyko and Komodakis, 2016]
- ResNeXt [Xie et al., 2017]
- CondenseNet [Huang et al., 2018]

Fully convolutional networks for dense prediction:

- HourGlass [Newell et al., 2016]
- U-Net [Ronneberger et al., 2015]

### PyTorch Implementation: LeNet-5

LeNet-5 is a classic CNN architecture for digit recognition. Below is its implementation in PyTorch.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

# 1. Define the LeNet-5 Architecture
# Inheriting from nn.Module allows PyTorch to track parameters
class LeNet5(nn.Module):
    def __init__(self):
        super().__init__()

        # --- FEATURE EXTRACTION (Convolutional Layers) ---

        # Layer 1: Conv2d(in_channels=1, out_channels=6, kernel_size=5)
        # Input: 28x28 grayscale image (1 channel)
        # Output: 6 feature maps, each 24x24 (due to no padding)
        self.conv1 = nn.Conv2d(1, 6, kernel_size=5)

        # Layer 2: Conv2d(in_channels=6, out_channels=16, kernel_size=5)
        # Input: 6 feature maps from previous layer (after pooling)
        # Output: 16 feature maps
        self.conv2 = nn.Conv2d(6, 16, kernel_size=5)

        # --- CLASSIFICATION (Fully Connected Layers) ---

        # After two 2x2 pooling layers, a 28x28 image becomes 4x4
        # Flattened input features = channels (16) * height (4) * width (4) = 256
        self.fc1 = nn.Linear(16 * 4 * 4, 120)
        self.fc2 = nn.Linear(120, 84)
        # Output layer: 10 neurons for the 10 digits (0-9)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        # Apply first convolution, then ReLU activation, then Max Pooling (2x2)
        # Resulting size: (28-5+1)/2 = 12x12
        x = F.max_pool2d(F.relu(self.conv1(x)), 2)

        # Apply second convolution, ReLU, and Max Pooling
        # Resulting size: (12-5+1)/2 = 4x4
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)

        # Flatten: transform 4D tensor (Batch, 16, 4, 4) -> 2D (Batch, 256)
        x = x.view(-1, 16 * 4 * 4)

        # Standard fully connected feed-forward passes
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))

        # Final output (logits) - CrossEntropyLoss will apply Softmax internally
        return self.fc3(x)
```

**Key PyTorch CNN Functions:**

- **`nn.Conv2d`**: Learns spatial filters. It preserves the local relationship between pixels.
- **`F.max_pool2d`**: Selects the maximum value in a small window, reducing spatial size and providing robustness to small translations.
- **`x.view(-1, ...)`**: Used to "flatten" the 2D feature maps into a 1D vector before passing them to traditional linear layers.

---

[[notes/mlp/01-introduction|Previous: L01: Introduction]] | [[notes/mlp/index|Back to MPL Index]] | [[notes/mlp/03-vision-cnn|Next: Vision CNNs]]
