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
[[notes/mlp/index|Back to MPL Index]] | [[notes/mlp/02-cnn|Next: (y-02) CNNs]]

## Mental Model First

- This lecture introduces the full training loop: represent the input, measure how wrong the model is with a **loss**, then use gradients to improve the weights.
- A hidden layer is best thought of as a **feature builder**. Early layers turn raw numbers into useful intermediate patterns; later layers combine those patterns into decisions.
- Backpropagation is not "the network thinking backwards." It is just a systematic way of assigning **credit and blame** to each parameter.
- If one question guides your reading, let it be this: **how do simple mathematical blocks become a trainable system that improves from data?**

## Introduction

**Machine perception** is the capability of a computer system to interpret data in a manner similar to the way humans use their senses to relate to the world around them.

**Machine learning** provides systems with the ability to automatically learn and improve from experience **without being explicitly programmed**.

I use the [[work/slidelink|SlideLink]] tool I built to automatically align these notes with the original lecture slides.

This course is **in-depth, hands-on, and advanced** — it assumes prior exposure to machine learning, deep learning, reinforcement learning, or computer vision.

---

## Refresher: Neural Networks

![[Lecture01_Pg041_Refresher_Neural_Networks_Architectures.png]]

<p class="image-caption">A compact refresher on feed-forward network structure: inputs, hidden layers, and outputs.</p>


### The Perceptron

The basic unit of a neural network:

$$y = \sigma(w^\top x + b)$$

where:

- $w$ = weight vector
- $x$ = input
- $b$ = bias
- $\sigma$ = activation function

### Multi-Layer Perceptron (MLP)

![[Lecture01_Pg030_Multi_Layer_Perceptron_Mlp.png]]

<p class="image-caption">A basic MLP with layers stacked on top of each other.</p>

```text
raw input x
    |
    v
[Layer 1: simple features]
    |
    v
[Layer 2: feature combinations]
    |
    v
[Output layer]
    |
    v
prediction y_hat
```

<p class="image-caption">ASCII view: an MLP keeps rewriting the input into more useful features until the final prediction becomes easy.</p>

With $X^{(0)} = X$, for each layer $l = 1, \dots, L$:

$$X^{(l)} = \sigma\!\left(W^{(l)\top} X^{(l-1)} + b^{(l)}\right)$$

The network output is $f(X;\, W, b) = X^{(L)}$.

### 💡 Intuition: What a Hidden Layer Is Really Doing

A hidden layer is easier to understand if you stop thinking about "neurons" and think about **new coordinates**.

- The raw input $x$ might be pixels, sensor values, or tabular features.
- The first hidden layer asks many small questions about that input: "is there an edge here?", "is this value unusually large?", "do these two features occur together?"
- The next layer works on those answers instead of the raw input directly.

So the network is gradually **rewriting the problem into a space where the final decision becomes easier**. Classification is often hard in pixel space, but much easier in a learned feature space.

### Why Activation Functions?

![[Lecture01_Pg093_Why_Activation_Functions_Clean.png]]

<p class="image-caption">Nonlinear activations are what let us learn complex patterns.</p>

Moving from a linear classifier $f = Wx$ to a 2-layer network:

$$f = W_2 \max(0,\, W_1 x), \quad x \in \mathbb{R}^D,\; W_1 \in \mathbb{R}^H \times D,\; W_2 \in \mathbb{R}^C \times H$$

Or a 3-layer network:

$$f = W_3 \max(0,\, W_2 \max(0,\, W_1 x))$$

**Without** a non-linear activation: $f = W_2 W_1 x = W_3 x$ — we collapse back to a linear classifier. Non-linearity is essential.

### Brain Analogy — Be Careful

![[Lecture01_Pg039_Brain_Analogy_Be_Careful.png]]

<p class="image-caption">The brain analogy is a good start, but real neurons are way more complex.</p>

Biological neurons ≠ artificial neurons:

- There are many different types of biological neurons
- Synapses are not a single weight but a complex non-linear dynamical system
- The firing-rate code may not adequately model inter-neuron communication
- Dendrites can perform complex non-linear computations

### Universal Approximation Theorem

![[Lecture01_Pg052_Universal_Approximation_Theorem.png]]

<p class="image-caption">The math says even a shallow network can model any continuous function.</p>

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

![[Lecture01_Pg002_Optimisation.png]]

<p class="image-caption">Optimizing is just about finding the weights that make the loss as small as possible.</p>

The loss function $L(W)$ quantifies the quality of any set of weights $W$. The goal of optimisation is to find $W$ that **minimises** $L(W)$.

$$L(W) = \frac{1}{n} \sum_{i=1}^{n} L_i(W)$$

### Gradient Descent

![[Lecture01_Pg080_Gradient_Descent.png]]

<p class="image-caption">Gradient descent works by taking small steps downhill to find the minimum.</p>

**Strategy 1 — Random search**: bad idea in practice.

**Strategy 2 — Follow the slope (gradient descent)**:

In one dimension, the derivative is:
$$\frac{\partial f(x)}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

In multiple dimensions, the gradient is the vector of partial derivatives along each dimension. The direction of **steepest descent** is the negative gradient.

![[Lecture01_Pg061_Gradient_Descent_Math.png]]

<p class="image-caption">Gradient descent steps "downhill" using the negative slope to find the minimum loss.</p>

Update rule (starting from $W_0$):
$$W_{t+1} = W_t - \alpha_t \nabla f(W_t)$$

```text
current weights W_t
      |
      v
compute loss L(W_t)
      |
      v
compute gradient grad L(W_t)
      |
      v
take small step in the opposite direction
      |
      v
updated weights W_(t+1)
```

<p class="image-caption">ASCII view: each gradient-descent step measures the current slope, then nudges the weights a little downhill.</p>

```python
while True:
    weights_grad = evaluate_gradient(loss_fun, data, weights)
    weights += -step_size * weights_grad
```

### Numerical vs. Analytic Gradient

![[Lecture01_Pg072_Numerical_Vs_Analytic_Gradient.png]]

<p class="image-caption">Comparing numerical and analytic gradients for speed and accuracy.</p>

| Type          | Description                                       | Properties                            |
| ------------- | ------------------------------------------------- | ------------------------------------- |
| **Numerical** | $\frac{f(W+h) - f(W)}{h}$, computed per dimension | Approximate, slow, easy to write      |
| **Analytic**  | Exact derivative via calculus/backprop            | Exact, fast, error-prone to implement |

**In practice**: always use the **analytic gradient**, but verify your implementation with a **gradient check** using the numerical gradient.

### Batch Training

![[Lecture01_Pg077_Batch_Training.png]]

<p class="image-caption">Batch training looks at every single sample before making one update.</p>

Process **all** $n$ training samples, then update weights once based on $L(W) = \frac{1}{n}\sum_{i=1}^n L_i(W)$.

| Upsides                                          | Downsides                                       |
| ------------------------------------------------ | ----------------------------------------------- |
| Fewer updates → higher computational efficiency  | Stable gradient may cause premature convergence |
| Stable error gradient → more stable convergence  | Requires entire training dataset in memory      |
| Separates prediction and update → parallelisable | Very slow for large datasets                    |

### Stochastic Gradient Descent (SGD)

![[Lecture01_Pg080_Stochastic_Gradient_Descent_Sgd.png]]

<p class="image-caption">SGD updates the weights after every single example it sees.</p>

Randomly choose **one** training sample $x_i$, update weights based on $L_i(W)$.

| Upsides                                                    | Downsides                                               |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| Frequent updates → insight into model performance          | Computationally more expensive per epoch                |
| Easy to understand and implement                           | Noisy gradient → parameters jump around (high variance) |
| Higher update frequency → faster learning on some problems | Hard for the algorithm to settle on a minimum           |
| Noisy updates can escape local minima → robustness         |                                                         |

### Mini-Batch Training

![[Lecture01_Pg082_Mini_Batch_Training.png]]

<p class="image-caption">Mini-batches give us a nice balance between speed and stable updates.</p>


![[Lecture01_Pg083_Mini_Batch_Training.png]]

<p class="image-caption">This second mini-batch slide makes the tradeoff explicit: cheaper updates than full batch, but less noise than pure SGD.</p>


Process a **subset** $M \subset \{1, \dots, n\}$ of samples:

$$L_M(W) = \frac{1}{|M|} \sum_{i \in M} L_i(W)$$

Seeks a balance between the robustness of SGD and the efficiency of batch gradient descent. **Most common implementation in deep learning.**

| Upsides                                                  | Downsides                                          |
| -------------------------------------------------------- | -------------------------------------------------- |
| Higher update frequency than batch → avoids local minima | Requires an extra hyperparameter (mini-batch size) |
| More computationally efficient than SGD                  | Error must be accumulated across mini-batches      |
| Doesn't require all data in memory                       |                                                    |

### Backpropagation

![[Lecture01_Pg084_Backpropagation.png]]

<p class="image-caption">Backprop uses the chain rule to figure out how much each weight contributed to the error.</p>

How do we compute gradients for nodes in **hidden layers**? → **Backpropagation** applies the chain rule repeatedly from the output back to each parameter.

### Computational Graphs

![[Lecture01_Pg085_Computational_Graph.png]]

<p class="image-caption">Computational graphs turn complex math into a sequence of simple, doable steps.</p>

**Key idea**: decompose complex computations into a sequence of atomic assignments.

Example: $f(x, y, z) = (x + y) \cdot z$

```text
x ──┐
    +──→ q ──┐
y ──┘         * ──→ f
z ────────────┘
```

<p class="image-caption">ASCII view: computational graphs turn one complicated expression into simple local operations that each know how to pass gradients backward.</p>

- **Forward pass**: takes a training sample $(x, y)$ as input and computes loss $L = -\log p_\text{model}(y \mid x, w)$
- **Backward pass**: computes gradients $\nabla_w L$ via the chain rule

**Worked example** with $x = -2,\; y = 5,\; z = -4$:

- $q = x + y = 3$
- $f = q \cdot z = -12$
- $\frac{\partial f}{\partial z} = q = 3$; $\frac{\partial f}{\partial q} = z = -4$
- $\frac{\partial f}{\partial x} = \frac{\partial f}{\partial q} \cdot 1 = -4$; $\frac{\partial f}{\partial y} = -4$

### 💡 Intuition: Finding Your Way in the Dark

Imagine you are at the top of a mountain (the current loss) at night. You can't see the bottom, but you can feel the slope of the ground under your feet.

- **The Gradient:** The direction of the steepest slope.
- **Gradient Descent:** Taking a small step in the opposite direction (downward).
- **Learning Rate:** How big your step is.
  - Too small? It takes forever to get home.
  - Too large? You might jump over the valley and end up on another mountain peak.

### 🧠 Deep Dive: Backpropagation Pattern Intuition

During the backward pass, each gate acts as a "gradient router":

1.  **Add Gate (+):** It is a **Distributor**. It sends the same gradient to both branches.
2.  **Mul Gate (\*):** It is a **Scaler**. It scales the gradient by the value of the _other_ branch.
3.  **Max Gate:** It is a **Switch**. It sends all the gradient to the branch that won, and zero to the others.

**Why is this helpful?**

- If your gradient is vanishing, you can look at your multiplication gates. If one branch is very small, it will kill the signal for the other branch.
- This is exactly why we normalize weights and use BatchNorm: to keep the values in a range where the "Scalers" (multiplication gates) don't shrink the signal to zero.

---

### Patterns in Backward Flow

![[Lecture01_Pg090_Patterns_In_Backward_Flow.png]]

![[Lecture01_Pg089_Patterns_In_Backward_Flow.png]]

<p class="image-caption">Together these two slides summarize how gradients propagate through addition, multiplication, and max operations.</p>

| Gate         | Role                 | Behaviour                                                                         |
| ------------ | -------------------- | --------------------------------------------------------------------------------- |
| **Add gate** | Gradient distributor | Passes the upstream gradient equally to **both** inputs                           |
| **Max gate** | Gradient router      | Passes the upstream gradient to whichever input was **larger**; zero to the other |
| **Mul gate** | Gradient scaler      | Passes upstream gradient × the **other** input's value                            |

---

## Activation Functions

### Sigmoid

![[Lecture01_Pg103_Sigmoid_Clean.png]]

<p class="image-caption">Sigmoid squashes everything between 0 and 1, but it can make gradients disappear.</p>

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

![[Lecture01_Pg115_Tanh_Clean.png]]

<p class="image-caption">Tanh is zero-centered, but it still has the same saturation problems as sigmoid.</p>

$$\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$$

- Squashes numbers to $[-1, 1]$ → **zero-centred** ✓
- Still kills gradients when saturated ✗
- Preferred over sigmoid in hidden layers, but ReLU is better

### ReLU

![[Lecture01_Pg093_Relu_Clean.png]]

<p class="image-caption">ReLU is fast and efficient, but watch out for "dead" neurons that stop learning.</p>

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

![[Lecture01_Pg115_Leaky_Relu_Prelu.png]]

<p class="image-caption">Leaky ReLU keeps a small slope for negative values so neurons never truly die.</p>

$$f(x) = \max(0.01x,\; x)$$

_(Maas et al., 2013; He et al., 2015)_

- All benefits of ReLU ✓
- Does **not** saturate in the negative region → will not "die" ✓
- **Parametric Rectifier (PReLU)**: replace the fixed $0.01$ slope with a learnable parameter $\alpha$: $\max(\alpha x, x)$

### ELU (Exponential Linear Unit)

![[Lecture01_Pg093_Elu_Exponential_Linear_Unit.png]]

<p class="image-caption">ELU gives you the best of ReLU but with smoother activations for negative inputs.</p>

$$f(x) = \begin{cases} x & \text{if } x > 0 \\ \alpha(e^x - 1) & \text{if } x \le 0 \end{cases} \qquad (\text{default: } \alpha = 1)$$

_(Clevert et al., 2016)_

- All benefits of ReLU ✓
- Closer to **zero-mean outputs** compared to Leaky ReLU ✓
- Negative saturation adds some **robustness to noise** ✓
- Computation requires `exp()` ✗

### Maxout

![[Lecture01_Pg118_Maxout.png]]

<p class="image-caption">Maxout picks the best of several linear functions to create flexible activation shapes.</p>

$$f(x) = \max(w_1^\top x + b_1,\; w_2^\top x + b_2)$$

_(Goodfellow et al., 2013)_

- Generalises ReLU (set $w_1 = b_1 = 0$) and Leaky ReLU
- Linear regime: **does not saturate**, **does not die** ✓
- Does **not** have the basic dot-product + non-linearity form → doubles the number of parameters ✗

### In Practice (TLDR)

![[Lecture01_Pg119_In_Practice_Tldr.png]]

<p class="image-caption">Some quick advice on which activation functions to use in practice.</p>

> - Use **ReLU**. Be careful with your learning rates.
> - Try **Leaky ReLU**, **Maxout**, or **ELU** to squeeze out marginal gains.
> - **Don't use sigmoid or tanh** in hidden layers.

---

## Weight Initialisation

### All-Zero / Constant Init

![[Lecture01_Pg126_All_Zero_Constant_Init.png]]

<p class="image-caption">Initializing everyone to the same value causes "symmetry" and breaks learning.</p>

If all weights are the same value, all neurons compute **identical gradients** → they all update identically → the network never differentiates. This is the **symmetry problem**.

### Small Random Numbers — `W = 0.01 * randn(Din, Dout)`

![[Lecture01_Pg126_Small_Random_Numbers_W_0_01.png]]

<p class="image-caption">Tiny initial weights can make the signal fade away as it goes deeper.</p>

Works okay for small networks, but **not** for deep ones:

- Activations tend to **zero** in deeper layers
- Gradients $\frac{\partial L}{\partial W} \to 0$ → **no learning**

### Larger Random Numbers — `W = 0.05 * randn(Din, Dout)` (with tanh)

![[Lecture01_Pg126_Larger_Random_Numbers_W_0_05.png]]

<p class="image-caption">Large initial weights will saturate your activations and stall the training.</p>

- Almost all neurons/activations **saturate** (outputs ≈ ±1)
- Gradients are again ≈ 0 → **no learning**

### Xavier / Glorot Initialisation (2010)

![[Lecture01_Pg138_Xavier_Glorot_Initialisation_2010.png]]

<p class="image-caption">Xavier initialization keeps the signal steady as it passes through the network.</p>

$$\text{std} = \frac{1}{\sqrt{D_\text{in}}}$$

**Derivation**: let $y = \sum_{j=1}^{D_\text{in}} x_j w_j$. We want $\text{Var}(y) = \text{Var}(x_i)$.

Assuming all $x_i$ and $w_j$ are i.i.d. and zero-mean:

$$\text{Var}(y) = D_\text{in} \cdot \text{Var}(x_i) \cdot \text{Var}(w_i)$$

Setting $\text{Var}(y) = \text{Var}(x_i)$ gives $\text{Var}(w_i) = \frac{1}{D_\text{in}}$.

Activations are nicely scaled across all layers. **Assumes a zero-centred activation function (e.g. tanh).**

### Kaiming / MSRA Initialisation — for ReLU (He et al., 2015)

![[Lecture01_Pg138_Kaiming_Msra_Initialisation_For_Relu_He.png]]

<p class="image-caption">Kaiming initialization is the go-to choice when you’re using ReLU.</p>

$$\text{std} = \sqrt{\frac{2}{D_\text{in}}}$$

Xavier breaks down for ReLU because ReLU is not zero-centred (it zeros out half the inputs). The factor of 2 compensates for the half that ReLU kills. With Kaiming init, activations are nicely scaled for all layers.

> For convolutional layers: $D_\text{in} = \text{filter\_size}^2 \times \text{input\_channels}$

---

## Batch Normalisation

Batch Normalisation was introduced to make deep networks easier to optimise (Ioffe and Szegedy, 2015). The original motivation was to reduce **internal covariate shift**: as lower layers change during training, the distribution seen by higher layers also changes. In practice, BatchNorm also makes training **less sensitive to weight initialisation** and typically stabilises optimisation.

### BatchNorm Formula

For a mini-batch $B = \{x_1, \dots, x_m\}$, BatchNorm computes

$$
\mu_B = \frac{1}{m}\sum_{i=1}^{m} x_i
\qquad\text{and}\qquad
\sigma_B^2 = \frac{1}{m}\sum_{i=1}^{m} (x_i - \mu_B)^2
$$

then normalises each activation:

$$
\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \varepsilon}}
$$

and finally applies a learnable scale and shift:

$$
y_i = \gamma \hat{x}_i + \beta
$$

The parameters $\gamma$ and $\beta$ are learned, so the network can recover any useful mean or variance if needed.

### Train Time vs. Test Time

| Phase         | Statistics used                                   | Behaviour                                             |
| ------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Training**  | Mean/variance of the current mini-batch           | Adds some noise, which can act as mild regularisation |
| **Inference** | Running mean/variance accumulated during training | Deterministic behaviour                               |

For convolutional layers, BatchNorm is usually applied **per channel**, averaging over batch and spatial dimensions.

### Why Does It Help?

BatchNorm often helps because it:

- makes the loss landscape **smoother**
- allows **higher learning rates**
- reduces sensitivity to poor initialisation
- improves gradient flow in deeper networks

> **Example**: A deep CNN that becomes unstable with a large learning rate can often train cleanly once each `Conv` layer is followed by BatchNorm.

### PyTorch Example

```python
import torch.nn as nn

block = nn.Sequential(
    nn.Conv2d(3, 64, kernel_size=3, padding=1, bias=False),
    nn.BatchNorm2d(64),
    nn.ReLU(inplace=True),
    nn.MaxPool2d(2),
)
```

A common pattern is:

$$
\text{Conv} \rightarrow \text{BatchNorm} \rightarrow \text{ReLU}
$$

---

## Regularisation

### Why Regularise?

A model **overfits** when it fits the training data too closely, including noise and accidental patterns, but fails to generalise to unseen data. This is the classic **bias-variance tradeoff**:

- **High bias**: model is too simple → underfitting
- **High variance**: model is too flexible → overfitting

Regularisation adds constraints or noise so that the learned model generalises better.

### L2 Regularisation / Weight Decay

L2 regularisation adds a penalty on large weights:

$$
\mathcal{L}_\text{total} = \mathcal{L}_\text{data} + \lambda \|W\|_2^2
$$

This encourages weights to stay small and smooths the fitted function. In deep learning, L2 regularisation is usually implemented as **weight decay** in the optimiser.

### L1 Regularisation

L1 regularisation uses

$$
\mathcal{L}_\text{total} = \mathcal{L}_\text{data} + \lambda \|W\|_1
$$

Unlike L2, L1 encourages many weights to become exactly zero, so it tends to produce **sparser** models.

### PyTorch: Weight Decay and Early Stopping

```python
# 1. Weight Decay (L2 Regularization)
# Added directly as a parameter in the optimizer.
# This penalizes large weight values to improve generalization.
optimizer = torch.optim.Adam(model.parameters(), lr=0.01, weight_decay=1e-3)
```

**Explanation:**

- **`weight_decay`**: In PyTorch optimizers, this parameter implements **L2 Regularization** by adding a penalty proportional to the squared magnitude of weights to the loss, preventing them from growing too large.
- **Early Stopping**: A heuristic that stops training when validation performance stops improving for a fixed number of epochs (`patience`).

### Dropout

Dropout randomly zeros activations during training (Srivastava et al., 2014). If $h$ is a hidden representation and $m_i \sim \text{Bernoulli}(1-p)$, then

$$
\tilde{h} = m \odot h
$$

where $p$ is the dropout rate.

Intuition:

- each mini-batch sees a slightly different sub-network
- neurons cannot rely too strongly on any single other neuron
- this reduces co-adaptation and improves generalisation

```text
training pass 1:  [x] -> [h1] [h2] [h3] [h4] -> y
                           X         X

training pass 2:  [x] -> [h1] [h2] [h3] [h4] -> y
                      X              X

different units are dropped each time, so no hidden unit can become a crutch
```

<p class="image-caption">ASCII view: dropout exposes the model to a different thinned sub-network on each pass, which discourages brittle co-adaptation.</p>

Classically, activations are scaled at test time by $(1-p)$. In modern libraries such as PyTorch, **inverted dropout** is used instead: activations are scaled during training, so evaluation needs no extra rescaling.

### Data Augmentation

Data augmentation is another form of regularisation: random crops, flips, colour jitter, noise, etc. It does not directly penalise the weights, but it makes the learning problem harder to overfit.

## Summary of Common Regularisers

| Method                | Main effect                                  | Typical outcome                      |
| --------------------- | -------------------------------------------- | ------------------------------------ |
| **L2 / weight decay** | Penalises large weights                      | Smoother, more stable models         |
| **L1**                | Encourages sparsity                          | Many weights become zero             |
| **Dropout**           | Randomly removes activations during training | More robust hidden representations   |
| **Data augmentation** | Increases effective data diversity           | Better generalisation to new samples |

> **Example**: If training accuracy keeps rising but validation accuracy stalls, adding weight decay and dropout is often a good first fix before changing the architecture.

### Practical Guidance

A good default recipe is:

- **weight decay** for most models
- **dropout** in fully connected heads or smaller datasets
- **data augmentation** for vision tasks

In practice, **weight decay + dropout** is a strong baseline regularisation combination.

### PyTorch Implementation: Multi-Layer Perceptron (MLP)

![[Lecture01_Pg030_Pytorch_Implementation_Multi_Layer_Perceptron_Mlp.png]]

<p class="image-caption">A straightforward way to build an MLP using PyTorch.</p>

Below is a practical implementation of a simple MLP in PyTorch.

```python
import torch
import torch.nn as nn

# 1. Define the MLP Architecture
# All PyTorch models must inherit from nn.Module
class MLP(nn.Module):
    def __init__(self, n_inputs=1):
        super().__init__()
        # nn.Sequential executes layers in the order they are added
        self.net = nn.Sequential(
            # Linear layer: computes out = x * weight^T + bias
            # Maps input features to 10 hidden features
            nn.Linear(n_inputs, 10),

            # Tanh activation function provides non-linearity
            nn.Tanh(),

            # Output layer: maps 10 hidden features back to 1 output
            nn.Linear(10, 1),
        )

    def forward(self, x):
        # Defines the computation performed at every call
        return self.net(x)

# 2. Setup Training
model = MLP()
# Adam is an adaptive optimizer; lr is the learning rate
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
# MSELoss (Mean Squared Error) is the standard loss for regression
criterion = nn.MSELoss()

# 3. Training Loop
model.train() # Set the model to training mode
for epoch in range(200):
    # STEP 1: Clear existing gradients from the last step
    optimizer.zero_grad()

    # STEP 2: Forward pass - get model predictions
    outputs = model(x)

    # STEP 3: Compute the loss (error)
    loss = criterion(outputs, targets)

    # STEP 4: Backpropagation - calculate gradients for all parameters
    loss.backward()

    # STEP 5: Optimization - update weights based on gradients
    optimizer.step()
```

**Key PyTorch Concepts:**

- **`nn.Module`**: The base class for all neural network modules. Your model must inherit from it to utilize PyTorch's parameter tracking.
- **`nn.Sequential`**: A container that wraps layers in a sequence, automatically passing the output of one to the next.
- **`forward()`**: Defines the computation performed at every call. You don't call this directly; use `model(x)`.
- **`optimizer.zero_grad()`**: Crucial step to clear gradients from the previous iteration; otherwise, they accumulate across batches.
- **`loss.backward()`**: Triggers **Autograd** to compute the gradient of the loss with respect to all model parameters using the chain rule.

### Logistic Regression (Scikit-Learn)

While not PyTorch, **Scikit-Learn** is the industry standard for traditional ML baselines.

```python
from sklearn.linear_model import LogisticRegression

# 1. Create the Model
# max_iter is the limit on solver iterations for convergence
model = LogisticRegression(max_iter=1000)

# 2. Train the Model (fit to data)
# X_train: features, y_train: labels
model.fit(X_train, y_train)

# 3. Evaluate Performance
# returns the mean accuracy on the test data
accuracy = model.score(X_test, y_test)
```

**Concepts:**

- **`fit()`**: The standard Scikit-Learn method for training a model on data.
- **`score()`**: Returns the mean accuracy on the given test data and labels.

---



![[Lecture01_Pg101_Saturated_Neurons_Kill_The_Gradients.png]]

<p class="image-caption">The fullest version of this slide shows the sigmoid saturation cases explicitly, making the zero-gradient failure mode much clearer.</p>
## Summary

1. ML = automatically learning from data without explicit programming
2. Neural nets = stacked linear transformations + non-linearities
3. Optimisation = minimise the loss via gradient descent
4. Backpropagation = efficient gradient computation via the chain rule through computational graphs
5. Activation functions: **use ReLU** (avoid sigmoid/tanh in hidden layers)
6. Weight initialisation: **Xavier** for tanh networks, **Kaiming** for ReLU networks
7. BatchNorm normalises activations and makes optimisation more stable
8. Regularisation improves generalisation; strong defaults are **weight decay + dropout**

---

## References

- Ioffe, Szegedy (2015) — Batch normalization: Accelerating deep network training by reducing internal covariate shift. _ICML_.
- Srivastava, Hinton, Krizhevsky, Sutskever, Salakhutdinov (2014) — Dropout: A simple way to prevent neural networks from overfitting. _JMLR_, 15:1929–1958.

### ⚠️ Common Pitfalls: Why Neural Networks Can Fail

1.  **Linear Collapse**: If you forget to add a non-linear activation (like ReLU) between your layers, your deep network just becomes one giant linear transformation ($W_3 W_2 W_1 x = W_{total} x$). It's just a linear model with extra steps!
2.  **The Symmetry Problem**: If you initialize all your weights to zero, every neuron in a hidden layer will calculate the exact same gradient and perform the exact same update. The network will never learn distinct features. **Always use Kaiming or Xavier initialization.**
3.  **The Sigmoid Trap**: Don't use sigmoid in deep hidden layers. When $x$ is very large or very small, the gradient is almost zero ($\approx 0.0001$). This is the **Vanishing Gradient** problem—the signal dies before it can reach the early layers.
4.  **Learning Rate Extremes**: If your learning rate is too high, the loss will explode. If it's too low, the model might get stuck in a tiny local minimum and take days to train. **Always check your loss curve.**

### Applied Exam Focus
- **Loss Functions**: Use **MSE** for regression and **Cross-Entropy** for classification. Cross-Entropy penalizes confident wrong answers more heavily.
- **Activation Choice**: Default to **ReLU** for hidden layers. Avoid **Sigmoid/Tanh** in deep networks due to the **vanishing gradient** problem (gradients $\approx 0$ when saturated).
- **Initialization**: Always use **Kaiming (He)** initialization when using ReLU to keep the variance of activations stable across layers.

---
[[notes/mlp/index|Back to MPL Index]] | [[notes/mlp/02-cnn|Next: (y-02) CNNs]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
