---
title: "L03 — CNNs in Computer Vision"
tags:
  - mlp
  - cnn
  - deep-learning
  - neural-networks
  - computer-vision
  - object-detection
  - semantic-segmentation
date: 2026-03-09
---

[[notes/mlp/02-cnn|← L02: CNNs]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/04-rnn|Next: RNNs →]]

---

## Object Detection

### What is it?

- **Localise** instances using a bounding box $(x, y, \text{width}, \text{height})$
- **Classify** each bounding box (e.g., cat, tv)

### Why do we need it?

Robotics, assistive systems, self-driving cars, surveillance, medical applications.

---

### Classification vs. Regression — Recap

**Classification**: categorises data into a fixed set of classes (e.g., dog vs. cat). Common loss: categorical cross-entropy.

**Regression**: predicts a continuous numerical value (e.g., house price, bounding-box coordinates). Common loss: mean squared error.

> **Example — regression output**: a model taking a 224×224 image and outputting `[0.3, 0.5, 0.2, 0.4]` for a single box's $(x, y, w, h)$.  
> **Problem**: the number of objects varies per image, so the output size is variable — a fixed regression layer can't handle this directly.

---

### Detection as a Regression Problem

Use a regression model to detect objects — output: coordinates of the objects in the image.

**Problem**: need variable-sized outputs (different images contain different numbers of objects).

---

### Detection as a Classification Problem

Use a **sliding window**:

- Move a small window across the image at every position and scale
- Run a classifier on each patch to assign an object class

**Problem**: applying the classifier at all positions and scales is extremely time-consuming.

**Possible solutions**:

- Use a very fast classifier (e.g., HOG)
- Run the classifier only on some locations and scales → **region proposals**

---

### Region Proposal Methods

- **Blob Detection**: look for "blob-like" regions via, e.g., simple thresholding, Laplacian of Gaussian (LoG), Difference of Gaussians (DoG)
- **BING** (BInarised Normed Gradients) [Cheng et al., 2014]: uses gradient information and learned patterns; runs at 300 fps
- **Selective Search** [Uijlings et al., 2013]: bottom-up hierarchical grouping
  - Split image based on colour into initial regions
  - Iteratively merge neighbouring regions based on similarity
  - Produces a hierarchy of region proposals at multiple scales

> **Example — Selective Search**: an image of a dog on a grass field might first be segmented by colour into ~200 regions (brown patch = dog body, green = grass). Nearby similar regions merge iteratively until we have a small set of candidate boxes, one of which tightly covers the dog. This is much faster than dense sliding window search.

**Key idea**: fast + dense generic detection with selective search, then slow + sparse classification on just the proposals.

---

### R-CNN [Girshick et al., 2014]

**Region-based CNN** — only feeds proposed regions to a classifier.

**Training pipeline:**

1. **Pre-train** AlexNet on ImageNet (1,000 classes)
2. **Adapt** (fine-tune) the CNN to the detection task and the domain of warped proposal windows — reinitialise the last layer and fine-tune
3. **Train SVMs**: binary SVM per object class using `pool5` features of the fine-tuned AlexNet as inputs
4. **Train a bounding-box regressor**: input = `pool5` features of the proposed region; output = refined $(x, y, \text{width}, \text{height})$

> **Example flow**: ~2,000 region proposals per image, each warped to 227×227 and fed through AlexNet → `pool5` features → 20 SVMs (one per VOC class) + box regressor.

The lecture's result slide makes the core contribution visible: once proposals are cropped and passed through a fine-tuned CNN, the detector can localise many Pascal VOC objects quite tightly across very different categories. The tradeoff is efficiency: every proposal still requires its **own CNN forward pass**, which makes test-time inference extremely slow.

---

### Fast R-CNN [Girshick, 2015]

**Key improvement**: compute the CNN feature map **once for the whole image**, then extract per-proposal features from it.

**RoI Pooling**: project a region proposal onto the shared feature map → max-pool to a fixed-size output (e.g., 7×7), regardless of the proposal's input size.

- **Unified network**: single forward pass jointly optimises classification and bounding-box regression (multitask loss)
- Gradients **back-propagate through RoI Pooling** into the feature layers (just like normal MaxPool)
- Slight accuracy improvement from end-to-end training

**Downside**: the majority of runtime is still spent on region proposals (Selective Search is outside the network).

> **Example**: for a 600×1000 image, one CNN forward pass produces a feature map; 2,000 RoI Pooling operations each take ~6ms, whereas Selective Search takes ~2 seconds.

---

### Faster R-CNN [Ren et al., 2015]

Eliminates the external region proposal step by adding a **Region Proposal Network (RPN)** that runs on the same feature map as the detector.

#### Region Proposal Network (RPN)

- **Input**: feature map from the backbone CNN of size $C \times W \times H$
- **Output**: list of $p$ proposals + "objectness" score; output size $p \times 6$
- **Approach**: slide a small (mini) net over the feature map; at each position evaluate $k$ different window sizes for objectness → $\approx W \times H \times k$ proposals

**Anchors**:

- Initial reference boxes defined by aspect ratio and scale, centred at each sliding window position
- 3 scales × 3 aspect ratios = **9 anchors per position**
- `reg` head: regression of anchor coordinates; `cls` head: object / no-object score

> **Example**: for a 38×50 feature map (stride 16 from a 600×800 image) and 9 anchors, the RPN evaluates 38 × 50 × 9 = 17,100 candidate boxes per image.

**Labelling Anchors**:

- **Positive anchor**: highest IoU with a ground-truth box, OR IoU > 0.7
- **Negative anchor**: IoU < 0.3
- Other anchors do not contribute to training

> **IoU example**: if a predicted box and a ground-truth box have an intersection area of 30 and a union of 100, IoU = 0.3 → classified as negative.

**RPN Loss Function**:

$$L(p_i, t_i) = \frac{1}{N_\text{cls}} \sum_i L_\text{cls}(p_i, p_i^*) + \lambda \frac{1}{N_\text{reg}} \sum_i p_i^* \, L_\text{reg}(t_i, t_i^*)$$

- $L_\text{cls}$: classification loss (object vs. background)
- $L_\text{reg}$: regression loss on box coordinates
- $N_\text{cls}$: batch size; $N_\text{reg}$: number of positive anchors (~2,040)
- $\lambda$: balancing weight

**Result**: ~10× speedup over Fast R-CNN with no loss in accuracy.

#### The R-CNN Family at a Glance

The lecture's comparison slide highlights that the main progress from **R-CNN → Fast R-CNN → Faster R-CNN** is about eliminating repeated computation while preserving accuracy:

| Model            | Test time / image (with proposals) | Speedup | mAP (VOC 2007) |
| ---------------- | ---------------------------------- | ------- | -------------- |
| **R-CNN**        | 50 s                               | 1×      | 66.0           |
| **Fast R-CNN**   | 2 s                                | 25×     | 66.9           |
| **Faster R-CNN** | 0.2 s                              | 250×    | 66.9           |

So the big story is not that Faster R-CNN suddenly becomes much more accurate; it achieves **roughly the same detection quality with drastically less wasted computation**.

The COCO qualitative examples in the PDF also show that the Faster R-CNN pipeline scales beyond the cleaner Pascal VOC setting: it can detect many objects simultaneously in cluttered indoor and outdoor scenes, from kitchen items and trains to animals and street scenes.

---

### Segmentation Extension: Mask R-CNN [He et al., 2017]

Extends Faster R-CNN with an additional **instance-segmentation** head:

- The classification stage gains an extra branch for predicting a per-pixel binary mask
- Further improves object detection results alongside providing instance masks

---

### Single-Stage Detectors

Two-stage detectors are accurate but slow. Single-stage detectors skip the proposal step.

**SSD — Single Shot MultiBox Detector** [Liu et al., 2016]:

- Directly predicts class scores and box offsets (no RPN)
- Uses **default (anchor) boxes** for predictions
- Detects objects at **multiple scales** using feature maps from different layers
- Combines multi-scale predictions for improved accuracy over objects of varying sizes

**YOLO — You Only Look Once** [Redmon et al., 2016]:

- Divides the image into a grid (e.g., 13×13 for YOLOv3)
- Each grid cell predicts bounding boxes and class probabilities
- Processes images in a **single forward pass** → extremely fast
- Tends to miss small objects as it prioritises global context

> **Example — YOLO grid**: divide a 416×416 image into a 13×13 grid. Each of the 169 cells outputs 5 candidate boxes with (x, y, w, h, confidence) + 80 class scores. The whole prediction runs in one forward pass at ~45 FPS.

---

## Semantic Segmentation

### What is it?

**Classification at pixel-level**: assign each pixel an object class label (e.g., road, sky, person). Does **not** distinguish different instances of the same class.

> **Example — Pascal VOC**: an image with two people and a car would have every person-pixel labelled "person" and every car-pixel labelled "car" — both people share the same label colour.

It helps to separate the related tasks clearly:

| Task                      | Output                        | Example                                     |
| ------------------------- | ----------------------------- | ------------------------------------------- |
| **Image classification**  | One label for the whole image | "dog"                                       |
| **Object detection**      | One box + class per instance  | two dogs → two boxes                        |
| **Semantic segmentation** | One class per pixel           | both dogs share the same `dog` label region |
| **Instance segmentation** | One mask per object instance  | each dog gets its **own** mask              |

---

### Sliding Window Approach

Apply a patch classifier at every pixel location. **Problem**: inefficient — no sharing of computed features between overlapping patches; requires a multitude of forward passes.

---

### Fully Convolutional Networks (FCN) [Long et al., 2015]

- Convolution and pooling layers followed by **upsampling layers**
- Output layer dimension: $H \times W \times \#\text{Classes}$
- Each filter $c$ in the output layer gives the probability estimate of a pixel belonging to class $c$

> **Example**: a 224×224 image with 21 VOC classes → output tensor of shape 224×224×21. `argmax` over the class dimension gives the final per-pixel class map.

---

### In-Network Upsampling

#### Unpooling (Nearest-Neighbour)

Simply repeat (or tile) each value into the larger grid. Fast but blocky — no learned content.

#### Max Unpooling

During the forward max-pool, record the **switch positions** (which location held the max). During unpooling, place values back at those positions; all other locations are set to 0.

> **Example**: 2×2 region `[1, 3; 5, 2]` → max pool selects `5`, records position (1,0). During unpooling, `5` is placed at (1,0) and zeros fill the rest: `[0, 0; 5, 0]`.

#### Transposed Convolution (Learnable Upsampling)

- Insert zeros between input values (stride > 1 in the "input space"), then apply a learned convolution kernel
- The network **learns** how to upsample — can produce sharp, detailed outputs
- Also called "deconvolution" (though mathematically it is not a true deconvolution)

> **Example — stride-2 transposed conv**: a 2×2 input becomes 4×4 after inserting zeros between each input value, then a 3×3 learned filter sweeps over it.

---

### Learning Deconvolution Network [Noh et al., 2015]

- Multilayer network with alternating deconvolution and unpooling layers
- The **deconvolution network is a mirrored version of the CNN** (encoder → decoder)
- Two fully-connected layers join the encoder and decoder networks

---

### FCN Skip Connections

**Goal**: retain fine-grained spatial information from upper (shallower) layers.

- Coarse deep features carry semantic information; shallow features carry spatial detail
- Skip connections **sum** predictions from different depths before the final upsampling
- `FCN-32s` (single upsampling) < `FCN-16s` (one skip) < `FCN-8s` (two skips) in quality

> **Example**: the FCN-8s model adds the `pool3` prediction (fine spatial detail) to the `pool4` prediction, then to the `stride-32` prediction before the final 8× upsample — recovering sharper boundary detail than 32× upsampling alone.

---

### U-Net [Ronneberger et al., 2015]

- Pre-trained backbone not applicable for every domain (U-Net was developed for medical image segmentation)
- **Copies initial features to later network stages** (concatenation, not addition)

```
Encoder (contracting path):       Decoder (expanding path):
Conv → ReLU → MaxPool ──────────→ UpConv + [concatenate] → Conv
Conv → ReLU → MaxPool ──────────→ UpConv + [concatenate] → Conv
         (bottleneck)
```

- The encoder progressively reduces spatial size and increases channels (captures context)
- The decoder progressively restores spatial size, using concatenated encoder features for precise localisation
- Designed for settings with **very limited training data** (biomedical imaging)

> **Example**: in retinal vessel segmentation, the encoder path may halve spatial dims 4 times (from 572×572 to 36×36), while the decoder restores back to 388×388, concatenating high-res encoder activations at each step so the output mask retains vessel boundary detail.

---

### Mask R-CNN [He et al., 2017]

Extends Faster R-CNN with a branch for predicting an object segmentation mask **in parallel** with classification and box regression.

**Architecture changes**:

1. **ROI Align** replaces ROI Pooling (see below)
2. **Softmax** replaced by **Sigmoid** for the mask branch
3. Added mask head predicting a binary mask per class

**Loss**:

$$L = L_\text{cls} + L_\text{box} + L_\text{mask}$$

- $L_\text{cls}$: sigmoid cross-entropy for classification
- $L_\text{box}$: difference between ground truth and output coordinates
- $L_\text{mask}$: sigmoid cross-entropy between ground truth binary mask and prediction (not softmax — classes compete only via classification, not through the mask)

The qualitative Mask R-CNN result slide makes the distinction from semantic segmentation concrete: in sports, retail, and beach scenes, the model outputs **separate masks for different people or objects of the same class**, while keeping the masks aligned to object boundaries. That is the defining extra capability beyond "label every pixel as person/chair/umbrella".

---

### ROI Pooling vs. ROI Align

**ROI Pooling problem**: the CNN predicts floating-point coordinates $(x, y, w, h)$. ROI Pooling must quantise these to integers → introduces pixel misalignment, which breaks accurate segmentation.

**ROI Align** solution:

- Split the input feature map region into $H \times W$ bins
- For each bin, set 4 sample points at regular subpixel intervals
- **Bilinear interpolate** the feature values at each of the 4 points
- Max or average pool the 4 points to get the bin value

> **Example**: a proposal at $(10.7, 20.3, 5.6, 8.2)$ would be rounded to $(11, 20, 6, 8)$ in ROI Pooling, introducing quantisation error. ROI Align samples at the exact floating-point coordinates using bilinear interpolation, preserving pixel-to-pixel alignment — critical for mask quality.

|                      | ROI Pooling            | ROI Align                     |
| -------------------- | ---------------------- | ----------------------------- |
| Coordinates          | Rounded to integers    | Floating-point                |
| Alignment error      | Present (quantisation) | Eliminated (bilinear interp.) |
| Segmentation quality | Coarse                 | Precise                       |

---

## Take-Home Messages

- **Object Detection**: localise objects using bounding boxes
- **Two-stage approaches** (region proposals + classification): R-CNN → Fast R-CNN → Faster R-CNN
- **Single-stage approaches**: SSD, YOLO (faster, at some cost in accuracy)
- **Semantic segmentation**: classify each pixel (no instance distinction); **instance segmentation** additionally separates same-class objects
- **FCN, U-Net**: encoder–decoder models with learnable upsampling and skip connections
- **Mask R-CNN**: Faster R-CNN extended with an object segmentation branch + ROI Align

---

[[notes/mlp/02-cnn|← L02: CNNs]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/04-rnn|Next: RNNs →]]
