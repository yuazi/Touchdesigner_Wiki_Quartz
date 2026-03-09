---
title: "L13 — Explainable AI (XAI)"
tags:
  - mlp
  - xai
  - explainability
  - interpretability
  - deep-learning
date: 2026-03-09
---

[[notes/mlp/12-diffusion|← L12: Diffusion]] | [[notes/mlp/index|↑ MPL Index]]

---

## Motivation

Model understanding is critical in domains involving high-stakes decisions. Without it, models remain opaque black boxes that can fail silently and destructively.

**Why model understanding matters**:

| Reason                 | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| **Debugging**          | Diagnose why a model misbehaves                                    |
| **Bias detection**     | Identify unfair patterns across demographic groups                 |
| **Recourse**           | Tell individuals what they could change to get a different outcome |
| **Trust calibration**  | Know when (and when not) to trust a prediction                     |
| **Deployment vetting** | Assess whether a model is safe for real-world use                  |

**Motivating example — Wolf vs. Husky classifier**: A model achieves 90% accuracy distinguishing wolves from huskies. LIME reveals the classifier is actually a _snow detector_ — wolves appear on snowy backgrounds and huskies on grass. The model learned a spurious correlation, not the actual concept. XAI exposes this before deployment.

---

## Achieving Model Understanding

Two approaches exist:

### Approach 1 — Inherently Interpretable Models

Build a model that is interpretable by design: decision trees, rule lists, linear classifiers, scoring systems [Letham et al., 2015; Lakkaraju et al., 2016].

- _If Education ≤ High School → Salary ≤ 50k_ (a rule list)
- Transparent, auditable, but may sacrifice predictive power

### Approach 2 — Post-hoc Explanations

Train a powerful black-box model first, then explain its predictions after the fact [Ribeiro et al., 2016, 2018].

- Works on any model you don't control (e.g., a proprietary API)
- Does not modify the model

**Rule of thumb**: If you can build an interpretable model that is adequately accurate — do it. Post-hoc explanations are second best, but sometimes the only option.

---

## Local vs. Global Explanations

|                | Local                                                                  | Global                                                         |
| -------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Scope**      | One prediction                                                         | Entire model behaviour                                         |
| **Use case**   | Verify an individual decision is made for the right reasons            | Detect big-picture biases across subgroups; vet for deployment |
| **Definition** | Interpretable description of model behaviour in a target neighbourhood | Interpretable description of complete model behaviour          |

---

## Taxonomy of Post-hoc Explanation Methods

```
Post-hoc Explainability
├── Local
│   ├── Feature importances (LIME, SHAP)
│   ├── Rule-based (Anchors)
│   ├── Saliency maps (Input gradient, Grad-CAM, LRP, ...)
│   ├── Prototypes / Example-based (influence functions, activation maximisation)
│   └── Counterfactuals
└── Global
    ├── Collection of local explanations (SP-LIME)
    ├── Representation-based (Network Dissection, TCAV)
    └── Model distillation / summaries of counterfactuals
```

---

## Feature Importances — LIME

**Authors**: Ribeiro et al. (2016)

**Key idea**: Approximate the model _locally_ around one prediction with a simple, sparse linear model. Being model-agnostic means it works on any black-box without requiring access to internals.

### Algorithm

1. Given input $x$, generate $N$ perturbed variants by randomly masking features (superpixels for images, words for text, values for tabular data)
2. Query the black-box for predictions on all $N$ variants
3. Weight each variant by its proximity to $x$
4. Fit a weighted sparse linear model on (variants, predictions)
5. Linear model coefficients = feature importances for this prediction

```python
import lime
import lime.lime_image
from skimage.segmentation import mark_boundaries

explainer = lime.lime_image.LimeImageExplainer()
explanation = explainer.explain_instance(
    image,
    model.predict,          # any callable black-box
    top_labels=1,
    hide_color=0,
    num_samples=1000
)
image_exp, mask = explanation.get_image_and_mask(
    label=explanation.top_labels[0],
    positive_only=True,
    num_features=5,
    hide_rest=False
)
```

**Wolf vs. Husky example**: LIME shows the model highlights snow (background) rather than the animal's body when classifying a wolf — revealing the spurious feature.

**Properties**:

- Model-agnostic, works on any black box
- Faithful only _locally_ near $x$, not globally
- Explanations can be **unstable**: similar inputs may yield very different explanations due to random perturbation sampling

---

## Rule-Based Explanations — Anchors

**Authors**: Ribeiro et al. (2018)

Anchors answer a different question from LIME: instead of _"what features were most important?"_, they ask _"what is a sufficient condition for this prediction?"_

> **Definition**: An anchor is a rule such that the model's prediction is the same (with high probability) whenever the rule holds, regardless of what the rest of the features are.

**Salary prediction example**:

| Method  | Output                                                     |
| ------- | ---------------------------------------------------------- |
| LIME    | Feature weights — _age: +0.3, education: +0.5_             |
| Anchors | Rule — _If Education ≤ High School → Predict Salary ≤ 50k_ |

The anchor is interpretable as a human-readable condition that _reliably_ reproduces the model's prediction in its neighbourhood.

---

## Saliency Maps

Saliency maps answer: _"Which parts of the input were most relevant for the model's prediction?"_

Also called: feature attribution maps, heatmaps.

### 1. Input Gradient (Vanilla Saliency)

Compute the gradient of the class-specific logit $F_i(x)$ with respect to the input $x$:

$$\text{Saliency} = \nabla_x F_i(x) \in \mathbb{R}^d$$

Visualise as a heatmap. Large magnitude = high influence.

```python
model.eval()
x.requires_grad_(True)
output = model(x)
output[0, target_class].backward()
saliency = x.grad.data.abs().max(dim=0).values  # collapse channels
```

**Challenges**:

- Visually noisy and hard to interpret
- **Gradient saturation**: in flat regions of the loss landscape, gradients vanish even when the feature truly matters

### 2. SmoothGrad

Average the input gradient over $N$ noisy copies of the input to reduce noise:

$$\text{SmoothGrad}(x) = \frac{1}{N} \sum_{i=1}^N \nabla_{x+\epsilon_i} F(x + \epsilon_i)$$

where $\epsilon_i \sim \mathcal{N}(0, \sigma^2)$. Produces cleaner, more interpretable maps.

### 3. Gradient × Input

Element-wise product of the input gradient and the input itself:

$$\text{GradInput}(x) = \nabla_x F(x) \odot x$$

Accounts for the magnitude of the input feature, not just its sensitivity.

### 4. Guided Backpropagation

Modify the backward pass through ReLUs: zero out gradient entries that are either _negative_ OR whose forward activation was _negative_:

$$R^l_i = (f^l_i > 0) \cdot (R^{l+1}_i > 0) \cdot R^{l+1}_i$$

This produces sharper, less noisy maps compared to vanilla gradients.

### 5. Layer-wise Relevance Propagation (LRP)

Propagate a "relevance" score from the output back through the network iteratively, using conservation rules. Different propagation rules can be specified per layer type. Heatmapping.org provides visualisations.

### 6. Grad-CAM

**Authors**: Selvaraju et al. (2017)

Grad-CAM produces a _spatial heatmap_ showing which regions of the image mattered, using the last convolutional layer's feature maps.

**Algorithm**:

1. Forward pass → feature maps $A^k$ at the last conv layer (shape $H' \times W' \times K$)
2. Compute gradient of class $c$ score w.r.t. feature maps: $\frac{\partial y^c}{\partial A^k_{ij}}$
3. Global average pool the gradients → importance weight per channel:
   $$\alpha_k^c = \frac{1}{Z} \sum_i \sum_j \frac{\partial y^c}{\partial A^k_{ij}}$$
4. Weighted combination + ReLU (keep only positive contributions to class $c$):
   $$\text{Grad-CAM}^c = \text{ReLU}\!\left(\sum_k \alpha_k^c A^k\right)$$
5. Upsample to input image size → overlay as heatmap

```python
def grad_cam(model, x, target_class):
    features, grads = None, None

    def fwd(m, inp, out):
        nonlocal features; features = out
    def bwd(m, gi, go):
        nonlocal grads; grads = go[0]

    h_f = model.layer4.register_forward_hook(fwd)
    h_b = model.layer4.register_backward_hook(bwd)

    model(x)[0, target_class].backward()
    weights = grads.mean(dim=(2, 3), keepdim=True)
    cam = (weights * features).sum(1).relu()
    cam = F.interpolate(cam.unsqueeze(1), x.shape[-2:], mode='bilinear')

    h_f.remove(); h_b.remove()
    return cam
```

**Variants**:

| Variant             | Improvement                                                     |
| ------------------- | --------------------------------------------------------------- |
| **Grad-CAM++**      | Better localisation when multiple instances of a class exist    |
| **Score-CAM**       | Perturbation-based, no gradients needed                         |
| **Guided Grad-CAM** | Combines Grad-CAM with Guided Backprop for pixel-precise detail |

**Additional saliency methods**: CAM [Zhou et al., 2016], Meaningful Perturbation [Fong & Vedaldi, 2017], RISE [Petsiuk et al., 2018], DeepLIFT [Shrikumar et al., 2017], Expected Gradients [Erion et al., 2019].

---

## Prototypes / Example-based Explanations

**Key idea**: Explain a model not with feature weights but with _example inputs_ — real or synthetic — that illuminate its behaviour.

Key questions:

1. Which training samples maximally influence the test loss?
2. Which inputs are the model most likely to misclassify?
3. Which input maximally activates a given internal neuron?

### Influence Functions [Koh & Liang, 2017]

Identify which training examples had the most influence on a given test prediction.

> **Example**: For a misclassified test image, the most influential training sample might be a mislabelled image with a very similar appearance — explaining why the model was confused.

### Activation Maximisation / Feature Visualisation

Starting from random noise, optimise an image via gradient descent to maximally activate a specific neuron or class output [Olah et al., 2017]:

$$x^* = \arg\max_x f_k(x) - \lambda \|x\|^2$$

```python
# Maximise activation of neuron k in a target layer
x = torch.randn(1, 3, 224, 224, requires_grad=True)
optimizer = torch.optim.Adam([x], lr=0.1)

for step in range(500):
    optimizer.zero_grad()
    activation = model.features(x).mean()   # target neuron/layer
    loss = -activation + 1e-4 * x.norm()    # regularise to avoid noise
    loss.backward()
    optimizer.step()
```

This reveals what _concept_ each neuron is detecting. See [distill.pub/2017/feature-visualization] for examples at scale.

---

## Counterfactual Explanations

**Key question**: _"What is the minimum change to the input to flip the model's decision?"_

This provides **recourse** — actionable feedback to individuals affected by a model's decision.

> **Example**: "Your loan application was denied. If you increased your annual income by €15K and paid your credit card bills on time for three months, it would be approved."

Counterfactuals are fundamentally different from saliency: saliency says _"this feature mattered"_; counterfactuals say _"change this feature to get a different outcome"_.

### 1. Minimum Distance Counterfactuals [Wachter et al., 2017]

$$x^{CF} = \arg\min_{x'} \; d(x, x') \quad \text{s.t.} \quad f(x') = y'$$

Using **normalised Manhattan distance** penalises the total number of changes, favouring small perturbations over many large ones. The candidate CF1 vs. CF2 choice depends on which direction $A$ or $B$ you move $x$ along — the metric governs this.

### 2. Feasible and Least-Cost Counterfactuals [Ustun et al., 2019]

A bare minimum-distance counterfactual can suggest impossible changes (e.g., "change your race"). Adding actionability constraints:

$$x^{CF} = \arg\min_{x' \in \mathcal{A}} \; \text{cost}(x, x') \quad \text{s.t.} \quad f(x') = y'$$

- $\mathcal{A}$ = set of actionable counterfactuals (user-defined)
- Cost = total log-percentile shift (changes from a high percentile are more expensive)
- For black-box or non-linear classifiers: generate a LIME local linear approximation first, then apply this framework

### 3. Causally Feasible Counterfactuals [Mahajan et al., 2019; Karimi et al., 2020]

Changing one feature can be impossible without changing causally downstream features (e.g., changing _income_ should also change _debt-to-income ratio_). Use a **Structural Causal Model (SCM)**:

$$x^{CF} = \arg\min_{x'} \; d_{\text{causal}}(x, x') \quad \text{s.t.} \quad f(x') = y'$$

Implementation: solve via a variational autoencoder; requires access to model gradients. In practice, partial knowledge of the causal graph also works well.

### 4. Further Considerations

| Consideration               | Details                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **Data manifold closeness** | Counterfactual should lie on the training distribution, not in an unrealistic region |
| **Sparsity**                | Prefer counterfactuals that change few features (L0/L1 penalty on changed features)  |
| **Model access**            | Black-box vs. gradient-based → affects which algorithm to use                        |

---

## Global Explanations

### Collection of Local Explanations — SP-LIME

**Problem**: LIME explains one prediction at a time. You can't manually inspect thousands of local explanations.

**SP-LIME** (Submodular Pick LIME) selects $k$ representative and diverse local explanations to summarise the model's global behaviour.

**Criteria**:

- **Representative**: the $k$ instances should collectively cover the most important features
- **Diverse**: explanations should not be redundant

**Method**: Greedy submodular optimisation over an explanation matrix (rows = instances, columns = features). Provably near-optimal and model-agnostic.

```
All instances → LIME for each → explanation matrix (N × F)
                                        ↓
                         Greedy submodular pick of k rows
                                        ↓
               k representative, diverse explanations shown to user
```

### Representation-based — Network Dissection [Bau et al., 2017]

Determine what human-interpretable concepts are encoded by individual neurons (convolutional filters).

**Procedure**:

1. Collect a broad set of human-labelled visual concepts (colour, texture, part, scene, object)
2. For each concept, gather the response of every hidden unit (filter) to those concept examples
3. Quantify the alignment of each hidden unit–concept pair using IoU

> **Example**: Filter 47 in layer conv5 may have IoU = 0.72 with the concept "wheel" — meaning this neuron consistently fires on wheels.

### Representational Similarity

Key questions: How similar are representations across layers of the same model? How similar are representations across different models?

See CKA [Kornblith et al., 2019] and SVCCA [Raghu et al., 2017] for techniques.

---

## SHAP — SHapley Additive exPlanations

**Authors**: Lundberg & Lee (2017)

SHAP gives every feature a contribution score using **Shapley values** from cooperative game theory. The Shapley value of feature $i$ is its average marginal contribution across all possible orderings of features:

$$\phi_i = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F|-|S|-1)!}{|F|!}\bigl[f(S \cup \{i\}) - f(S)\bigr]$$

**Analogy**: Features are players; the Shapley value is how much credit each player deserves for the team's total score, averaged fairly over all possible coalition orderings.

### Axiomatic Guarantees

| Property       | Meaning                                                                            |
| -------------- | ---------------------------------------------------------------------------------- |
| **Efficiency** | $\sum_i \phi_i = f(x) - \mathbb{E}[f(x)]$ — values account for the full prediction |
| **Symmetry**   | Features with equal contributions receive equal values                             |
| **Dummy**      | Feature with zero marginal contribution → zero Shapley value                       |
| **Linearity**  | Values are additive when games are combined                                        |

### DeepSHAP

Approximates Shapley values for neural networks using backpropagation (combines DeepLIFT with SHAP theory):

```python
import shap
import torchvision.models as models

model = models.vgg16(pretrained=True).eval()
# background = representative sample from training distribution
background = train_images[:50]
explainer = shap.DeepExplainer(model, background)
shap_values = explainer.shap_values(x_test)
shap.image_plot(shap_values, x_test)
# Red pixels = pushed prediction toward class; blue = away
```

---

## Concept-Based Explanations — TCAV

**Authors**: Kim et al. (2018)  
**TCAV** = Testing with Concept Activation Vectors

Instead of per-pixel saliency, explain in terms of human-meaningful **concepts** (e.g., "striped texture", "has ears", "is green").

### Algorithm

1. Collect positive and negative examples for a concept $c$ (e.g., images with vs. without stripes)
2. Train a linear classifier on layer $l$'s activations for those examples → the decision boundary direction is the **Concept Activation Vector (CAV)**
3. Compute the directional derivative of class $k$'s output along the CAV direction
4. **TCAV score** = fraction of class $k$ inputs where moving along the CAV increases the class probability

$$\text{TCAV}_{k,c,l} = \frac{|\{x \in X_k : S_{k,c,l}(x) > 0\}|}{|X_k|}$$

```python
# Pseudocode
cav_direction = train_cav_probe(concept_positives, concept_negatives, layer=l)
scores = []
for x in class_k_inputs:
    act = get_activations(model, x, layer=l)
    grad = get_class_gradient(model, x, class=k, layer=l)
    scores.append((grad @ cav_direction) > 0)
tcav_score = mean(scores)
```

> **Example — Diabetic Retinopathy diagnosis**: A model's TCAV scores might show it strongly relies on the concept "microaneurysms" (TCAV ≈ 0.85) and less on "general redness" (TCAV ≈ 0.4), aligning with clinical knowledge.

> **Example — Zebra classification**: "Striped texture" scores TCAV ≈ 0.9, "has four legs" scores ≈ 0.4.

---

## Probing Classifiers

Do the internal representations of a neural network encode specific concepts?

Train a **linear probe** on frozen layer $l$ representations to predict a human-defined concept:

```
text input → [Frozen BERT layer l] → linear probe → P(concept)
```

If a _linear_ probe achieves high accuracy, the concept is **linearly decodable** from that layer's representation.

> **Example**: Train a probe on BERT layer 8 to predict part-of-speech tags. High accuracy → layer 8 encodes syntactic structure. Layer 12 probes for coreference tend to be more accurate than layer 2 probes, suggesting deeper layers encode more abstract structure.

---

## Explanations in Different Modalities

### Structured / Tabular Data

Common in: disease diagnosis (weight, age, glucose), credit scoring (income, previous crimes), recommender systems.

**Challenges**:

- Mixed variable types (categorical, ordinal, continuous) require different similarity/perturbation functions
- Gradients may not be meaningful for discrete inputs
- Datasets can be very high-dimensional (e.g., a user × movie matrix)

**Recommended methods**: LIME, Anchors, rule-based explanations, counterfactuals. Saliency maps are generally _not_ meaningful here.

### Computer Vision

Applicable methods: all gradient-based saliency (Input Gradient, Guided Backprop, Integrated Gradients, Grad-CAM), TCAV for concept-level explanations.

**Example — Bone age prediction**: Integrated gradients on an X-ray highlights the growth plates of the wrist bones — the same regions a radiologist would examine. TCAV for diabetic retinopathy confirms the model focuses on retinal microaneurysms.

### Natural Language Processing

**Challenges**:

- Discrete input space: gradients not directly applicable or interpretable
- Not all token-substitution perturbations are grammatical or meaningful
- Task format varies: classification, span selection, text generation

**Useful tools**: [Captum](https://captum.ai), [LIT (Language Interpretability Tool)](https://github.com/PAIR-code/lit), [AllenNLP Interpret](https://allennlp.org/interpret), [TextAttack](https://github.com/QData/TextAttack), Anchors, LIME for text.

---

## Evaluation of Explanations

How do we know if an explanation is _good_? This is non-trivial — explanations exist for human consumers, so evaluation requires human studies.

Three evaluation goals [Doshi-Velez & Kim, 2017]:

### 1. Understand Behaviour

**Deletion / Insertion tests** [Qi et al., 2020]: Remove (or add) features in order of importance and measure the change in model prediction. A good explanation should identify features whose removal causes a sharp accuracy drop.

- _Deletion_: mask top-$k$ features → model performance should drop rapidly
- _Insertion_: start from blank and add top-$k$ features → performance should rise rapidly

**Training data influence**: Add/remove influential training examples (ranked by explanation method) and observe effect on test loss [Ghorbani & Zou, 2019].

**Prediction simulation**: Can a user predict the model's output on a new instance, given prior predictions and their explanations? [Ribeiro et al., 2018; Hase & Bansal, 2020; Poursabzi-Sangdeh et al., 2021]

### 2. Useful for Debugging

- **Detecting bugs**: Create a deliberately buggy classifier; check if users can identify the bug given explanations [Ribeiro et al., 2016]
- **Comparing classifiers**: Given two explanations, can users correctly identify which model is better?
- **Fixing features**: Can users improve the model by identifying and correcting problematic features?
- **Finding labelling errors**: Add noisy (mislabelled) training instances; can users find and re-label them using the explanation? [Koh & Liang, 2017]

### 3. Help Make Decisions

**Human-AI collaboration**: Are explanations useful for tasks where the algorithm alone is unreliable?

> **Deception detection example** [Lai & Tan, 2019]: Classify fake online reviews. Humans alone perform modestly; AI alone has its own error pattern. Do explanations improve decision accuracy when humans act on AI recommendations?

---

## Summary

| Method                  | Scope          | Model-Agnostic | Output                                |
| ----------------------- | -------------- | -------------- | ------------------------------------- |
| Input Gradient          | Local          | ✗              | Pixel heatmap                         |
| SmoothGrad              | Local          | ✗              | Smoothed heatmap                      |
| Grad-CAM                | Local          | ✗              | Spatial region map                    |
| LRP                     | Local          | ✗              | Layerwise heatmap                     |
| LIME                    | Local          | ✓              | Feature importances (sparse linear)   |
| Anchors                 | Local          | ✓              | Sufficient condition rule             |
| Counterfactuals         | Local          | ✓              | "What-if" recourse                    |
| Influence functions     | Local          | ✗              | Training example attribution          |
| Activation Maximisation | Global         | ✗              | Neuron-activating prototype           |
| SP-LIME                 | Global         | ✓              | $k$ representative local explanations |
| Network Dissection      | Global         | ✗              | Neuron–concept alignment scores       |
| SHAP / DeepSHAP         | Local + Global | ✓              | Shapley value attributions            |
| TCAV                    | Global         | ✗              | Concept sensitivity score per layer   |
| Probing                 | Global         | ✗              | Concept decodability per layer        |

**Key takeaways**:

1. If an interpretable model achieves sufficient accuracy, prefer it over post-hoc explanations
2. No single explanation method is complete — use multiple
3. A convincing-looking explanation can still be wrong (gradient saturation, spurious correlations)
4. Always validate explanations against domain knowledge (does this make sense to an expert?)
5. Evaluation requires both automatic metrics (deletion/insertion) and human studies (debugging, simulation)

---

[[notes/mlp/12-diffusion|← L12: Diffusion]] | [[notes/mlp/index|↑ MPL Index]]
