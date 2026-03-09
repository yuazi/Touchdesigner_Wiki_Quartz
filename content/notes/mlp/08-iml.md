---
title: "L08 — Interactive Machine Learning (IML)"
tags:
  - mlp
  - interactive-ml
  - active-learning
  - human-in-the-loop
  - annotation
date: 2026-03-09
---

## Lecture 08 — Interactive Machine Learning (IML)

[[notes/mlp/07-multimodal|← L07: Multimodal Learning]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/09-vae|Next: VAE →]]

---

## Introduction

### Automatic vs. Interactive ML

Most ML today is **automatic machine learning (aML)**: algorithms that interact with agents and optimize their learning *without* human involvement during training. This works great when you have large, clean, labeled datasets.

But sometimes you **still need a human in the loop**:

- **Small or multiple datasets** — not enough data for aML to be reliable
- **Rare events** — how do you get enough examples of a 1-in-10,000 failure?
- **NP-hard problems** — subspace clustering, protein folding, k-anonymisation, graph colouring

### Definition

> **Interactive Machine Learning (iML)** := algorithms that interact with agents (which can be humans) and that can optimise their learning behaviour through this interaction. — Holzinger, 2015

The human is seen as an agent involved in the **actual learning phase**, influencing measures such as distance or cost functions step by step — not just checking results at the end.

### Types of ML on a Spectrum

| Type | Labels | Human Role |
|------|--------|------------|
| **Unsupervised** | None | Check results at end |
| **Supervised** | All data labeled | Provide labels & features upfront |
| **Semi-supervised** | Some labeled, rest unlabeled | Label a small seed set |
| **Interactive (iML)** | Adaptive | Inform/correct the model during learning |

### Who Can Be "In the Loop"?

- A **single expert** (e.g. a radiologist annotating cancer scans)
- A **crowd** (e.g. Amazon Mechanical Turk workers)
- **Multiple heterogeneous agents** (domain experts + crowd + automated tools)
- **Nature-inspired agents** (evolutionary algorithms, etc.)

---

### Motivating Applications

#### Example 1: k-Anonymisation of Medical Data

87% of the US population can be **uniquely re-identified** by zip-code, gender, and date of birth (Sweeney, 2002). k-Anonymity requires transforming data so each record is indistinguishable from at least k−1 others. Finding the optimal transformation is NP-hard — a human expert can guide the search interactively.

#### Example 2: Protein Folding

Proteins are the building blocks of life; their 3D structure is determined by their amino acid sequence. Predicting that structure from sequence is an old, extremely hard problem. As of 2015, automatic ML methods did not work well enough. A human-in-the-loop could guide structure search.

> **Recent breakthrough**: AlphaFold (DeepMind, Jumper et al., 2021) achieved remarkable accuracy using deep learning, largely removing the need for human guidance — showing that when data is sufficient, aML can eventually surpass iML.

#### Example 3: Subspace Clustering

Patterns in high-dimensional data often live in **subsets of dimensions** (subspaces). Clustering in subspaces is non-convex and NP-hard, data is often noisy, and there's little prior knowledge about the low-dimensional structure. Human experts can:
- Identify **positive subspace clusters** (e.g. one homogeneous cluster of healthy patients)
- Identify **negative clusters** with obvious reasons for poor outcomes


---

## Semi-supervised Learning

### Setup

Given:
- $S_l = (x_1, y_1), (x_2, y_2), \ldots, (x_m, y_m)$ — labeled examples drawn i.i.d. from distribution $D$, with $y_i = c^*(x_i)$
- $S_u = x_1, \ldots, x_{m_u}$ — unlabeled examples drawn i.i.d. from $D$

**Goal**: find a classifier with small generalization error $\text{err}_D(h) = P(h(x) \neq c^*(x))$

### Key Insight

Unlabeled data is useful **only if** we have a belief not just about the form of the target function, but also about its **relationship with the underlying data distribution**.

Unlabeled data can:
- Reduce the search space
- Re-order functions in the search space according to our belief
- Bias the search toward functions consistent with the data manifold

*(Zhu and Goldberg, 2009)*

### Fundamental Questions (General Discriminative Model)

- How much unlabeled data is needed? — depends on complexity of $H$ and the compatibility notion
- Can unlabeled data reduce the number of labeled examples needed?
- Is the target function *compatible* with the data distribution? — helpfulness depends on this

> **Example**: Two concentric rings of data points (inner ring = class A, outer ring = class B). With only labeled data you might draw the wrong boundary; with unlabeled data you can "see" the ring structure and place the boundary between the rings.

---

## Active Learning

### Batch vs. Selective Sampling (Stream)

| Mode | Description |
|------|-------------|
| **Batch Active Learning** | Learner picks specific examples from a pool to label |
| **Selective Sampling (Online AL)** | A stream of unlabeled examples arrives; learner decides on-the-fly whether to query |

In both cases the **goal** is to use far fewer labeled examples than passive (random) learning by picking **informative** examples.

### Can Adaptive Querying Actually Help?

**Yes — exponentially so (sometimes).**

Consider learning a threshold classifier on the real line:
- **Passive supervised**: need $\Omega(1/\varepsilon)$ labels to find an $\varepsilon$-accurate threshold
- **Active learning**: only $O(\log 1/\varepsilon)$ labels needed — an **exponential improvement**

Binary search is the perfect analogy:

```
Range: [0, 1]    True threshold: 0.73

Query midpoint 0.5  → label is +  (threshold > 0.5)
Query midpoint 0.75 → label is -  (threshold < 0.75)
Query midpoint 0.625 → label is + (threshold > 0.625)
...

After k queries: threshold known to within 1/2^k — log(1/ε) queries suffice.
Passive learning needs 1/ε queries to get the same ε accuracy.
```

**In practice**: Observed on Newsgroups (20K documents) and CIFAR-10 (60K images) — active learning reaches the same accuracy with far fewer labels (Jain et al., 2010).

---

### Active SVM — Uncertainty Sampling in Practice

A common and effective technique (Tong & Koller, 2001; Schohn & Cohn, 2000):

**Algorithm**:
1. Maintain the current **max-margin separator** $w_t$ over all labeled points so far
2. At each step, **request the label of the example closest to the decision boundary** (smallest margin = most uncertain)
3. Retrain the SVM and update $w_t$

```python
from sklearn.svm import SVC
import numpy as np

model = SVC(kernel='rbf')
labeled_idx = np.random.choice(len(X_pool), size=10)  # seed

for _ in range(num_rounds):
    model.fit(X_pool[labeled_idx], y[labeled_idx])
    
    distances = np.abs(model.decision_function(X_pool))
    distances[labeled_idx] = np.inf  # exclude already labeled
    
    query_idx = np.argmin(distances)   # closest to boundary → most uncertain
    labeled_idx = np.append(labeled_idx, query_idx)
    # oracle labels X_pool[query_idx] ...
```

#### ⚠️ Sampling Bias Warning

Uncertainty sampling is **myopic and greedy**. Over time the queried sample becomes **less representative** of the true data distribution — the model excels near the boundary but may fail elsewhere. (Dasgupta, 2011)

**Main tension**: we want informative points (near boundary) *and* guarantees that the classifier performs well on truly random examples from the underlying distribution.

---

### Version Spaces

**Definition** (Mitchell, 1982):
- $X$ — feature/instance space; distribution $D$ over $X$; target $c^* \in H$
- **Realisable case**: $c^* \in H$
- **Version space** $VS(H)$: the part of $H$ consistent with all labels so far

$$h \in VS(H) \iff h(x_i) = c^*(x_i) \quad \forall i$$

The version space is bounded by:
- **GB** — maximally *general* positive hypothesis boundary (outer boundary)
- **SB** — maximally *specific* positive hypothesis boundary (inner boundary)

> **Example**: Data on a circle in $\mathbb{R}^2$; $H$ = homogeneous linear separators. After 3 positive and 3 negative labels placed on the circle, only separators that correctly divide those 6 points remain in the version space. Each new label eliminates more separators, shrinking the version space.

---

### Region of Disagreement

**Definition** (Cohn et al., 1992):

A point $x \in X$ is in the **region of disagreement** $DIS(VS(H))$ iff there exist $h_1, h_2 \in VS(H)$ such that $h_1(x) \neq h_2(x)$:

$$x \in DIS(VS(H)) \iff \exists h_1, h_2 \in VS(H), \; h_1(x) \neq h_2(x)$$

Outside the region of disagreement, **all hypotheses agree** — labeling such a point wastes the oracle's time.

---

### Disagreement-Based Active Learning

**Algorithm** (CAL — Cohn et al., 1992):
1. Query labels for a few random $x_i$; initialize version space $H_1 = H$
2. For $t = 1, 2, \ldots$:
   - Pick points at random from the current **region of disagreement** $DIS(H_t)$
   - Query their labels
   - Update version space: $H_{t+1} \leftarrow$ hypotheses in $H_t$ still consistent with new labels
3. Stop when the region of disagreement is small

**Why active?** We never waste labels querying outside $DIS(H_t)$ — only queries inside can update the version space.

> **Example**: Spam classifier with a linear decision boundary.
> - After 10 labels, the version space = all lines dividing those 10 emails correctly.
> - Region of disagreement = the "strip" of emails near the boundary where different consistent classifiers disagree.
> - We only query emails inside that strip, not emails far away that every consistent classifier already agrees on.

---

### Agnostic Active Learner — A² Algorithm

What if $c^* \notin H$? (The realistic case — noise, model mismatch.)

**A² algorithm** (Balcan, Beygelzimer, Langford, 2006):
1. Let $H_1 = H$
2. For $t = 1, 2, \ldots$:
   - Pick random points from $DIS(H_t)$, query their labels
   - **Throw out** any hypothesis you are *statistically confident* is suboptimal (using generalization bounds)
3. Avoids sampling bias by careful use of generalization bounds

**Guarantees**:
- **Safe**: never worse than passive learning
- Exponential improvement for threshold classifiers in low-noise settings
- For homogeneous linear separators in $\mathbb{R}^d$, uniform distribution, low noise: only $d^2 \log(1/\varepsilon)$ labels needed

---

## Other AL Techniques in Practice

### 1. Uncertainty Sampling

Query the example the model is **least confident** about.

$$x^* = \arg\min_x \max_c P(c \mid x) \quad \text{(least confidence)}$$

Or equivalently, maximise **entropy**:

$$x^* = \arg\max_x - \sum_c P(c \mid x) \log P(c \mid x)$$

> **Example**: 3-class image classifier (cat / dog / bird).
> - Image A: $P = [0.95, 0.03, 0.02]$ → entropy ≈ 0.24 → confident → **skip**
> - Image B: $P = [0.35, 0.34, 0.31]$ → entropy ≈ 1.58 → very uncertain → **query**

### 2. Maximal Diversity Sampling

Select a **batch** of points that maximally covers the feature space, so no two queries are near-duplicates. Useful when you must query a whole batch at once.

$$\text{select } B \text{ points s.t. every unlabeled point is close to at least one selected point}$$

### 3. Ensemble-Based Sampling (Query by Committee)

Train multiple diverse models (a "committee"). Query the example where they **disagree most**.

```python
# 3-model committee
predictions = [model.predict(X_unlabeled) for model in committee]
votes = np.stack(predictions, axis=1)  # (N, C)
# Disagreement = 1 - (max vote count / num committee members)
disagreement = np.apply_along_axis(
    lambda v: 1 - np.max(np.bincount(v)) / len(v),
    axis=1, arr=votes
)
query_idx = np.argmax(disagreement)
```

### 4. Density-Based Sampling

Don't just query uncertain points — query uncertain points that are also **representative** of the distribution. An uncertain but isolated point is not worth querying.

$$x^* = \arg\max_x \; \text{uncertainty}(x) \times \left(\frac{1}{U}\sum_{u} \text{sim}(x, x_u)\right)^\beta$$

The second term is the average similarity to all unlabeled points — a proxy for density.

---

## Graph-Based Active and Semi-supervised Methods

### Core Idea

Assume a **pairwise similarity function** exists and that very similar examples probably share the same label.

- Many **labeled** points → Nearest-Neighbour classifier
- Many **unlabeled** points → use them as "stepping stones" via **label propagation**

Unlabeled data can help **"glue" objects of the same class together** even when there is no direct edge between labeled points of the same class.

### Building the Graph

- **Nodes**: all examples (labeled + unlabeled)
- **Edges**: between very similar examples ($k$-NN or $\varepsilon$-ball with Gaussian similarity weights)
- Labeled nodes have fixed labels; unlabeled nodes get soft labels via propagation

Often used in a **transductive** setting: given $L \cup U$, output predictions on $U$ (not required to generalize to brand-new test points).

### Graph Partitioning Algorithms

| Method | Description |
|--------|-------------|
| **Minimum cut** (Blum & Chawla, 2001) | Hard partition: minimize total weight of cut edges |
| **Soft cut / Label propagation** (Zhu et al., 2003) | Smooth label function minimizing $\sum_{ij} w_{ij}(f(x_i) - f(x_j))^2$ |
| **Spectral partitioning** | Eigenvectors of the graph Laplacian |

### Semi-supervised Learning with Soft Cuts (Zhu et al., 2003)

Solve for a label function $f(x) \in [0, 1]$ that minimises:

$$\min_f \sum_{i,j} w_{ij}(f(x_i) - f(x_j))^2 \quad \text{subject to } f(x_i) = y_i \text{ for labeled nodes}$$

This is a **harmonic equation**: labels spread outward from labeled nodes, weighted by edge similarity. The solution can be found by solving a sparse linear system.

> **Example**: A document graph where edges connect articles sharing many keywords. Label 3 articles in a "sports" cluster as positive and 2 articles in a "finance" cluster as negative. Label propagation will assign positive labels to all sports articles and negative to all finance articles, flowing through the keyword-similarity edges.

### Active Learning with Label Propagation

**Naïve approach**: query the node with $f(x) \approx 0.5$ (most uncertain).

**Problem**: The uncertain node might be nearly **isolated** (just one edge) — labeling it won't propagate much information.

**Better — 1-step lookahead heuristic** (Fathi et al., 2011):

For each candidate node $s$ with current soft label $p$:
1. Assume the oracle answers $1$ with probability $p$, answers $0$ with probability $1 - p$
2. Run label propagation for each outcome, compute **average confidence** across all nodes
3. Query the node that maximises expected confidence:

$$\text{score}(s) = p \cdot \frac{1}{n}\sum_i \max(f_1(x_i), 1-f_1(x_i)) + (1-p) \cdot \frac{1}{n}\sum_i \max(f_0(x_i), 1-f_0(x_i))$$

This approach performs well for **video segmentation** (Fathi et al., 2011) where frames are nodes and edge weights come from visual similarity.

---

## Deep Active Learning

### Challenges

Classical active learning theory assumes a fixed, well-understood hypothesis class. DNNs break this:

1. **Overconfident softmax**: the softmax output of DNNs is typically overconfident — high probability outputs even on misclassified examples
2. **Batch selection**: large-scale training requires selecting a *batch* of images at once, not one at a time
3. **Mode collapse**: uncertainty heuristics may repeatedly select examples from the same class, severely imbalancing the training set

---

### MC Dropout — Bayesian Approximation

(Gal et al., 2017) In a Bayesian neural network, every weight is a distribution. Integrating over all parameters is intractable:

$$p(y = c \mid x) = \int p(y = c \mid x, \omega) \, p(\omega) \, d\omega$$

**Approximation via MC Dropout**:
- Apply **dropout at test time** (not just during training)
- Run $T$ forward passes with different dropout masks — each pass samples a "thinned" network
- Average predictions:

$$p(y \mid x) \approx \frac{1}{T} \sum_t p^t_c$$

The **variance across runs** captures uncertainty.

```python
model.train()  # keep dropout active at test time
T = 50

preds = np.stack([
    model(x).softmax(-1).detach().cpu().numpy()
    for _ in range(T)
])  # shape: (T, N, C)

mean_pred = preds.mean(axis=0)  # (N, C)
entropy = -(mean_pred * np.log(mean_pred + 1e-8)).sum(axis=1)  # (N,)
query_indices = entropy.argsort()[-batch_size:]
```

**High entropy** → every dropout run is confident about a *different* class → very uncertain → good to query.

---

### BALD — Bayesian Active Learning by Disagreement

(Gal et al., 2017) — more principled than pure entropy:

$$I(y; \omega \mid x, \mathcal{D}) = \underbrace{H(y \mid x, \mathcal{D})}_{\text{entropy of mean}} - \underbrace{\mathbb{E}_{p(\omega \mid \mathcal{D})}[H(y \mid x, \omega, \mathcal{D})]}_{\text{mean entropy of individual models}}$$

- **First term**: high if the *average* model output is uncertain
- **Second term**: penalises cases where *individual* models are also uncertain — we want models that are individually confident but *disagree* with each other

$$x^* = \arg\max_x \; I(y; \omega \mid x, \mathcal{D})$$

In practice with MC Dropout:

$$I \approx -\sum_c \left(\frac{1}{T}\sum_t p^t_c\right)\log\left(\frac{1}{T}\sum_t p^t_c\right) + \frac{1}{T}\sum_t\sum_c p^t_c \log p^t_c$$

> **Example**: Blurry image of a handwritten digit — looks like either 4 or 9.
> - Entropy: average of 50 dropout runs gives $[0.5, 0.5]$ (4 vs 9) → high uncertainty ✓
> - Expected entropy: each *individual* run says "definitely 4" or "definitely 9" → low — models are confident _individually_ but **disagree** → high BALD score → **query this image**

---

### Learning Loss for Active Learning

(Yoo & Kweon, 2019) — **predict which examples the model will get wrong**.

**Architecture**:
- Extract intermediate features from multiple layers of the main network
- A small auxiliary **loss prediction module** combines them and outputs a predicted loss for each unlabeled example
- Query examples with the **highest predicted loss**

**Challenge**: loss values change as the model trains. Instead of regressing the raw loss value, compare **pairs**:
- Split each batch of size $B$ into $B/2$ pairs
- For each pair, predict which image has the higher loss
- Train with a pairwise ranking loss (more stable)

---

### Mode Collapse in Active Learning

A critical failure mode: the uncertainty-based strategy keeps selecting the **same hard class**, resulting in a severely imbalanced training set.

**Observed on MNIST** (Pop & Fulop, 2018): After active learning with 1,000 queried images, the set contains many "hard" digits (4 vs 9 are easily confused) and very few "easy" digits (1, 0). The model then performs poorly on the easy digits.

---

### Batch-Aware Methods — Uncertainty vs. Diversity (BatchBALD)

(Kirsch, van Amersfoort, Gal — NeurIPS 2019)

**Problem**: Ranking all unlabeled examples by uncertainty and picking the top-$B$ grabs many **near-duplicate** images. Real datasets have many images that are visually almost identical — wasting the labeling budget.

**Solution**: Maximise the **joint mutual information** of the entire queried batch with the model parameters — this naturally penalises redundancy:

$$x_1^*, \ldots, x_B^* = \arg\max \; I(y_1, \ldots, y_B; \omega \mid x_1, \ldots, x_B, \mathcal{D})$$

Uncertainty alone grabs near-duplicates; diversity alone ignores which regions are actually uncertain. BatchBALD balances both.

---

## Summary

### Short Summary

- Active learning can deliver **exponential improvements** in label complexity, both in theory and practice
- Common heuristics (uncertainty sampling, active SVM) work but **beware of sampling bias**
- **Disagreement-based safe schemes** (A²) provide noise-robust guarantees
- **Graph methods** leverage data manifold structure for label propagation

### Techniques at a Glance

| Technique | Core Idea | Key Risk |
|-----------|-----------|----------|
| **Uncertainty sampling** | Query least-confident examples | Sampling bias |
| **Disagreement-based (A²)** | Query within version space's region of disagreement | Computationally expensive in general |
| **Maximal diversity / Core-Set** | Batch covering feature space | Ignores uncertainty |
| **Query by committee** | Query where committee disagrees most | Needs diverse committee |
| **Density-based** | Weight uncertainty by representativeness | Density estimation cost |
| **Graph label propagation** | Labels flow through similarity graph | Needs good similarity metric |
| **MC Dropout / BALD** | Bayesian uncertainty via multiple forward passes | $T$ forward passes per query round |
| **Learning Loss** | Predict which examples have high loss | Auxiliary module complexity |
| **BatchBALD** | Joint MI maximisation for batch acquisition | Computationally intensive |
| **Semi-supervised (soft cuts)** | Harmonic label propagation on unlabeled data | Requires compatible distribution assumption |

---

[[notes/mlp/07-multimodal|← L07: Multimodal Learning]] | [[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/09-vae|Next: VAE →]]
