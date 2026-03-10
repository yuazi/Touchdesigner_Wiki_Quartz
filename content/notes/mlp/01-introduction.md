---
title: "L01 — Introduction to Machine Learning"
tags:
  - mlp
  - machine-learning
  - deep-learning
  - introduction
  - neural-networks
date: 2026-03-09
---

[[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/02-cnn|Next: CNNs →]]

---

## Introduction

**Machine perception** is the capability of a computer system to interpret data in a manner similar to the way humans use their senses to relate to the world around them.

**Machine learning** provides systems with the ability to automatically learn and improve from experience **without being explicitly programmed**.

This course is **in-depth, hands-on, and advanced** — it assumes prior exposure to machine learning, deep learning, reinforcement learning, or computer vision.

---

## Refresher: Neural Networks

### The Perceptron

The basic unit of a neural network:

$$y = \sigma(w^\top x + b)$$

where:

- $w$ = weight vector
- $x$ = input
- $b$ = bias
- $\sigma$ = activation function

### Multi-Layer Perceptron (MLP)

With $X^{(0)} = X$, for each layer $l = 1, \dots, L$:

$$X^{(l)} = \sigma\!\left(W^{(l)\top} X^{(l-1)} + b^{(l)}\right)$$

The network output is $f(X;\, W, b) = X^{(L)}$.

### Why Activation Functions?

Moving from a linear classifier $f = Wx$ to a 2-layer network:

$$f = W_2 \max(0,\, W_1 x), \quad x \in \mathbb{R}^D,\; W_1 \in \mathbb{R}^{H \times D},\; W_2 \in \mathbb{R}^{C \times H}$$

Or a 3-layer network:

$$f = W_3 \max(0,\, W_2 \max(0,\, W_1 x))$$

**Without** a non-linear activation: $f = W_2 W_1 x = W_3 x$ — we collapse back to a linear classifier. Non-linearity is essential.

### Brain Analogy — Be Careful

Biological neurons ≠ artificial neurons:

- There are many different types of biological neurons
- Synapses are not a single weight but a complex non-linear dynamical system
- The firing-rate code may not adequately model inter-neuron communication
- Dendrites can perform complex non-linear computations

### Universal Approximation Theorem

Given a non-linear (e.g. sigmoid) activation function $\sigma \in C^\infty(\mathbb{R})$, for any continuous function $f \in C(I^m)$ and any $\varepsilon > 0$, there exist $N$, constants $\nu_i, b_i \in \mathbb{R}$, and vectors $w_i \in \mathbb{R}^m$ such that:

$$f(x) \approx g(x) = \sum_{i=1}^{N} \nu_i\, \sigma(w_i^\top x + b_i), \qquad |g(x) - f(x)| < \varepsilon \quad \forall x \in I^m$$

_(Original proof: Hornik et al., 1989; formal statement: Cybenko, 1989)_

**Key intuition — building a "bump" function:**

1. Increase weight $w$ until $\sigma(w^\top x + b)$ becomes a step function; step position $s = -b/w$
2. Two neurons (with step positions $s_1$, $s_2$) combine to form a "bump" of height $h$
3. Many such bump pairs can approximate any shape

**Critical caveats:**

- Networks with a single hidden layer need **exponentially wide** layers → in practice, deeper networks work better
- The theorem guarantees **expressiveness**, not **learnability** — it says nothing about whether gradient descent will find those weights

---

## Optimisation

The loss function $L(W)$ quantifies the quality of any set of weights $W$. The goal of optimisation is to find $W$ that **minimises** $L(W)$.

$$L(W) = \frac{1}{n} \sum_{i=1}^{n} L_i(W)$$

### Gradient Descent

**Strategy 1 — Random search**: bad idea in practice.

**Strategy 2 — Follow the slope (gradient descent)**:

In one dimension, the derivative is:
$$\frac{\partial f(x)}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

In multiple dimensions, the gradient is the vector of partial derivatives along each dimension. The direction of **steepest descent** is the negative gradient.

Update rule (starting from $W_0$):
$$W_{t+1} = W_t - \alpha_t \nabla f(W_t)$$

```python
while True:
    weights_grad = evaluate_gradient(loss_fun, data, weights)
    weights += -step_size * weights_grad
```

### Numerical vs. Analytic Gradient

| Type          | Description                                       | Properties                            |
| ------------- | ------------------------------------------------- | ------------------------------------- |
| **Numerical** | $\frac{f(W+h) - f(W)}{h}$, computed per dimension | Approximate, slow, easy to write      |
| **Analytic**  | Exact derivative via calculus/backprop            | Exact, fast, error-prone to implement |

**In practice**: always use the **analytic gradient**, but verify your implementation with a **gradient check** using the numerical gradient.

### Batch Training

Process **all** $n$ training samples, then update weights once based on $L(W) = \frac{1}{n}\sum_{i=1}^n L_i(W)$.

| Upsides                                          | Downsides                                       |
| ------------------------------------------------ | ----------------------------------------------- |
| Fewer updates → higher computational efficiency  | Stable gradient may cause premature convergence |
| Stable error gradient → more stable convergence  | Requires entire training dataset in memory      |
| Separates prediction and update → parallelisable | Very slow for large datasets                    |

### Stochastic Gradient Descent (SGD)

Randomly choose **one** training sample $x_i$, update weights based on $L_i(W)$.

| Upsides                                                    | Downsides                                               |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| Frequent updates → insight into model performance          | Computationally more expensive per epoch                |
| Easy to understand and implement                           | Noisy gradient → parameters jump around (high variance) |
| Higher update frequency → faster learning on some problems | Hard for the algorithm to settle on a minimum           |
| Noisy updates can escape local minima → robustness         |                                                         |

### Mini-Batch Training

Process a **subset** $M \subset \{1, \dots, n\}$ of samples:

$$L_M(W) = \frac{1}{|M|} \sum_{i \in M} L_i(W)$$

Seeks a balance between the robustness of SGD and the efficiency of batch gradient descent. **Most common implementation in deep learning.**

| Upsides                                                  | Downsides                                          |
| -------------------------------------------------------- | -------------------------------------------------- |
| Higher update frequency than batch → avoids local minima | Requires an extra hyperparameter (mini-batch size) |
| More computationally efficient than SGD                  | Error must be accumulated across mini-batches      |
| Doesn't require all data in memory                       |                                                    |

### Backpropagation

How do we compute gradients for nodes in **hidden layers**? → **Backpropagation** applies the chain rule repeatedly from the output back to each parameter.

### Computational Graphs

**Key idea**: decompose complex computations into a sequence of atomic assignments.

Example: $f(x, y, z) = (x + y) \cdot z$

```
x ──┐
    +──→ q ──┐
y ──┘         * ──→ f
z ────────────┘
```

- **Forward pass**: takes a training sample $(x, y)$ as input and computes loss $L = -\log p_\text{model}(y \mid x, w)$
- **Backward pass**: computes gradients $\nabla_w L$ via the chain rule

**Worked example** with $x = -2,\; y = 5,\; z = -4$:

- $q = x + y = 3$
- $f = q \cdot z = -12$
- $\frac{\partial f}{\partial z} = q = 3$; $\frac{\partial f}{\partial q} = z = -4$
- $\frac{\partial f}{\partial x} = \frac{\partial f}{\partial q} \cdot 1 = -4$; $\frac{\partial f}{\partial y} = -4$

### Patterns in Backward Flow

| Gate         | Role                 | Behaviour                                                                         |
| ------------ | -------------------- | --------------------------------------------------------------------------------- |
| **Add gate** | Gradient distributor | Passes the upstream gradient equally to **both** inputs                           |
| **Max gate** | Gradient router      | Passes the upstream gradient to whichever input was **larger**; zero to the other |
| **Mul gate** | Gradient scaler      | Passes upstream gradient × the **other** input's value                            |

---

## Activation Functions

### Sigmoid

$$\sigma(x) = \frac{1}{1 + e^{-x}} = \frac{e^x}{e^x + 1}$$

Squashes numbers to $[0, 1]$. Can be interpreted as a saturating "firing rate" of a neuron.

**Three problems:**

1. **Saturated neurons kill the gradients**
   - $\frac{\partial \sigma}{\partial x} = \sigma(x)(1 - \sigma(x))$
   - When $x = -10$: $\sigma(x) \approx 0 \;\Rightarrow\; \frac{\partial \sigma}{\partial x} \approx 0$
   - When $x = 10$: $\sigma(x) \approx 1 \;\Rightarrow\; \frac{\partial \sigma}{\partial x} \approx 0$
   - Gradient vanishes → no learning signal propagates back

2. **Sigmoid outputs are not zero-centred**
   - Outputs always in $(0, 1)$, so all upstream inputs to the next layer are positive
   - The gradient $\frac{\partial L}{\partial w_i}$ will all have the **same sign** as the upstream gradient → zig-zagging weight updates
   - Mini-batches or zero-mean data can partially mitigate this

3. **`exp()` is computationally expensive**

### Tanh

$$\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$$

- Squashes numbers to $[-1, 1]$ → **zero-centred** ✓
- Still kills gradients when saturated ✗
- Preferred over sigmoid in hidden layers, but ReLU is better

### ReLU

$$f(x) = \max(0, x)$$

_(Krizhevsky et al., 2012; Nair and Hinton, 2010)_

| Property                            | Value                                                              |
| ----------------------------------- | ------------------------------------------------------------------ |
| Saturates in + region?              | No ✓                                                               |
| Computationally efficient?          | Yes ✓                                                              |
| Converges faster than sigmoid/tanh? | ~6× faster ✓                                                       |
| Zero-centred output?                | No ✗                                                               |
| Dead neurons?                       | Yes — a ReLU unit can permanently output 0 if it never activates ✗ |

**Fix for dead ReLU**: initialise ReLU neurons with slightly positive biases (e.g. 0.01).

### Leaky ReLU / PReLU

$$f(x) = \max(0.01x,\; x)$$

_(Maas et al., 2013; He et al., 2015)_

- All benefits of ReLU ✓
- Does **not** saturate in the negative region → will not "die" ✓
- **Parametric Rectifier (PReLU)**: replace the fixed $0.01$ slope with a learnable parameter $\alpha$: $\max(\alpha x, x)$

### ELU (Exponential Linear Unit)

$$f(x) = \begin{cases} x & \text{if } x > 0 \\ \alpha(e^x - 1) & \text{if } x \le 0 \end{cases} \qquad (\text{default: } \alpha = 1)$$

_(Clevert et al., 2016)_

- All benefits of ReLU ✓
- Closer to **zero-mean outputs** compared to Leaky ReLU ✓
- Negative saturation adds some **robustness to noise** ✓
- Computation requires `exp()` ✗

### Maxout

$$f(x) = \max(w_1^\top x + b_1,\; w_2^\top x + b_2)$$

_(Goodfellow et al., 2013)_

- Generalises ReLU (set $w_1 = b_1 = 0$) and Leaky ReLU
- Linear regime: **does not saturate**, **does not die** ✓
- Does **not** have the basic dot-product + non-linearity form → doubles the number of parameters ✗

### In Practice (TLDR)

> - Use **ReLU**. Be careful with your learning rates.
> - Try **Leaky ReLU**, **Maxout**, or **ELU** to squeeze out marginal gains.
> - **Don't use sigmoid or tanh** in hidden layers.

---

## Weight Initialisation

### All-Zero / Constant Init

If all weights are the same value, all neurons compute **identical gradients** → they all update identically → the network never differentiates. This is the **symmetry problem**.

### Small Random Numbers — `W = 0.01 * randn(Din, Dout)`

Works okay for small networks, but **not** for deep ones:

- Activations tend to **zero** in deeper layers
- Gradients $\frac{\partial L}{\partial W} \to 0$ → **no learning**

### Larger Random Numbers — `W = 0.05 * randn(Din, Dout)` (with tanh)

- Almost all neurons/activations **saturate** (outputs ≈ ±1)
- Gradients are again ≈ 0 → **no learning**

### Xavier / Glorot Initialisation (2010)

$$\text{std} = \frac{1}{\sqrt{D_\text{in}}}$$

**Derivation**: let $y = \sum_{j=1}^{D_\text{in}} x_j w_j$. We want $\text{Var}(y) = \text{Var}(x_i)$.

Assuming all $x_i$ and $w_j$ are i.i.d. and zero-mean:

$$\text{Var}(y) = D_\text{in} \cdot \text{Var}(x_i) \cdot \text{Var}(w_i)$$

Setting $\text{Var}(y) = \text{Var}(x_i)$ gives $\text{Var}(w_i) = \frac{1}{D_\text{in}}$.

Activations are nicely scaled across all layers. **Assumes a zero-centred activation function (e.g. tanh).**

### Kaiming / MSRA Initialisation — for ReLU (He et al., 2015)

$$\text{std} = \sqrt{\frac{2}{D_\text{in}}}$$

Xavier breaks down for ReLU because ReLU is not zero-centred (it zeros out half the inputs). The factor of 2 compensates for the half that ReLU kills. With Kaiming init, activations are nicely scaled for all layers.

> For convolutional layers: $D_\text{in} = \text{filter\_size}^2 \times \text{input\_channels}$

---

## Summary

1. ML = automatically learning from data without explicit programming
2. Neural nets = stacked linear transformations + non-linearities
3. Optimisation = minimise the loss via gradient descent
4. Backpropagation = efficient gradient computation via the chain rule through computational graphs
5. Activation functions: **use ReLU** (avoid sigmoid/tanh in hidden layers)
6. Weight initialisation: **Xavier** for tanh networks, **Kaiming** for ReLU networks

---

[[notes/mlp/index|↑ MPL Index]] | [[notes/mlp/02-cnn|Next: CNNs →]]
