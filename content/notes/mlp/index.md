---
title: Machine Perception & Learning (MPL)
tags:
  - mlp
  - machine-learning
  - deep-learning
  - notes
date: 2026-03-10
---

This is my study hub for the MPL master's course. Each lecture gets its own page with explanations, key concepts, math, and examples I worked through to actually understand the material — not just memorize it.

I use the [[work/slidelink|SlideLink]] tool I built to automatically align these notes with the lecture slides.

---

## How to Use These Notes

- **Reading linearly** works well — each lecture builds on the previous.
- Each page has a **mental model** section (big picture first), then details.
- Look for the **Example** blocks to build intuition.
- Math is included where needed, but always paired with plain-English explanations.

---

## Lectures

| Topic                                                               | Core Idea                                      | Example Model / Use Case                        |
| :------------------------------------------------------------------ | :--------------------------------------------- | :---------------------------------------------- |
| [[/notes/mlp/01-introduction|(y-01) Introduction]]                  | What is ML? Loss, optimization, training loops | Logistic Regression (Iris dataset)              |
| [[/notes/mlp/02-cnn|(y-02) Convolutional Neural Networks]]          | Spatial feature extraction with filters        | Simple CNN (MNIST digit recognition)            |
| [[/notes/mlp/03-vision-cnn|(y-03) Vision CNNs]]                     | AlexNet, VGG, ResNet, EfficientNet             | ResNet-50 (ImageNet classification)             |
| [[/notes/mlp/04-rnn|(y-04) Recurrent Neural Networks]]              | Sequences, LSTMs, GRUs, vanishing gradients    | LSTM (Sentiment analysis / Stocks)              |
| [[/notes/mlp/05-transformer|(y-05) Transformers]]                   | Attention is all you need                      | BERT / GPT (Machine Translation)                |
| [[/notes/mlp/06-vit|(y-06) Vision Transformer (ViT)]]               | Patches + Transformers = vision                | ViT-Base (Large-scale visual recognition)       |
| [[/notes/mlp/07-multimodal|(y-07) Multimodal Learning]]             | CLIP, image+text, cross-modal alignment        | CLIP (Zero-shot image classification)           |
| [[/notes/mlp/08-iml|(y-08) Interactive Machine Learning]]           | Humans in the loop                             | Active Learning / GNN (Sudoku solver)           |
| [[/notes/mlp/09-vae|(y-09) Generative AI & VAE]]                    | Latent spaces and variational inference        | VAE (Face generation / Reconstruction)          |
| [[/notes/mlp/10-gans|(y-10) GANs]]                                  | Generator vs. Discriminator                    | StyleGAN (Synthetic high-res faces)             |
| [[/notes/mlp/11-rl|(y-11) Reinforcement Learning]]                  | Rewards, policies, Q-learning                  | Q-Learning / PPO (Game playing / Atari)         |
| [[/notes/mlp/12-diffusion|(y-12) Diffusion Models]]                 | Denoising as generation                        | Stable Diffusion (Text-to-image generation)     |
| [[/notes/mlp/13-xai|(y-13) Explainable AI (XAI)]]                   | Why did the model decide that?                 | Grad-CAM / SHAP (Debugging model bias)          |

---

## Applied MLP: Case Studies

Practical applications of theory to real-world technical problems.

### [[work/sudokusolver|(y-) Case Study: The Sudoku GNN]]

**Core Idea:** Most neural networks work on **Euclidean data** (grids of pixels or sequences of text). Sudoku is better represented as a **Graph**, where the rules of the game define the edges (connections) between cells.

#### **Mental Model: Message Passing as Constraint Propagation**

- In traditional Sudoku solvers, you look at a cell and "propagate" the constraints from its row, column, and box to eliminate possibilities.
- In a GNN, this is exactly what **Message Passing** does. Each node (cell) sends its current "state" (clues and predictions) to its neighbors. After a few rounds of updates, each node has "seen" enough of the board to make a classification.

#### **💡 Intuition: Why use a Graph instead of a CNN?**

- A **CNN** is limited by its receptive field; it can only "see" a small 3x3 or 5x5 area at a time.
- A **GNN** with explicit edges for rows and columns has a **receptive field of 1** for all constraints. This "shortcut" for relational reasoning makes the learning problem significantly easier.

---

## Quick Reference: Key Concepts

| Concept           | Where It Appears                                                                               |
| :---------------- | :--------------------------------------------------------------------------------------------- |
| Backpropagation   | [[/notes/mlp/01-introduction|L01]], [[/notes/mlp/02-cnn|L02]]                                  |
| Attention         | [[/notes/mlp/05-transformer|L05]], [[/notes/mlp/06-vit|L06]], [[/notes/mlp/07-multimodal|L07]] |
| Latent Space      | [[/notes/mlp/09-vae|L09]], [[/notes/mlp/10-gans|L10]], [[/notes/mlp/12-diffusion|L12]]         |
| Sequential Data   | [[/notes/mlp/04-rnn|L04]], [[/notes/mlp/05-transformer|L05]]                                   |
| Generative Models | [[/notes/mlp/09-vae|L09]], [[/notes/mlp/10-gans|L10]], [[/notes/mlp/12-diffusion|L12]]         |

---
[[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
