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

## Applied MLP: Case Studies

Applying the theoretical blocks of MLP to specific technical problems.

### [[work/sudokusolver|(y-) Case Study: The Sudoku GNN]]

**Core Idea:** Most neural networks work on **Euclidean data** (grids of pixels or sequences of text). Sudoku is better represented as a **Graph**, where the rules of the game define the edges (connections) between cells.

#### **Mental Model: Message Passing as Constraint Propagation**

- In traditional Sudoku solvers, you look at a cell and "propagate" the constraints from its row, column, and box to eliminate possibilities.
- In a GNN, this is exactly what **Message Passing** does. Each node (cell) sends its current "state" (clues and predictions) to its neighbors. After a few rounds of updates, each node has "seen" enough of the board to make a classification.

#### **💡 Intuition: Why use a Graph instead of a CNN?**

- A **CNN** looks for spatial patterns in local neighborhoods (3x3 squares). While Sudoku has 3x3 boxes, a cell is also constrained by cells far away in the same row or column.
- A **GNN** allows us to explicitly define these "far away" relationships as direct edges. The network doesn't have to "learn" that rows and columns matter; we give it that structure for free, allowing it to focus on learning the **logic** of the game.

---

## Lectures

| #   | Topic                                                    | Core Idea                                      |
| :-- | :------------------------------------------------------- | :--------------------------------------------- |
| 01  | [[notes/mlp/01-introduction\|(y-) Introduction]]         | What is ML? Loss, optimization, training loops |
| 02  | [[notes/mlp/02-cnn\|(y-) Convolutional Neural Networks]] | Spatial feature extraction with filters        |
| 03  | [[notes/mlp/03-vision-cnn\|(y-) Vision CNNs]]            | AlexNet, VGG, ResNet, EfficientNet             |
| 04  | [[notes/mlp/04-rnn\|(y-) Recurrent Neural Networks]]     | Sequences, LSTMs, GRUs, vanishing gradients    |
| 05  | [[notes/mlp/05-transformer\|(y-) Transformers]]          | Attention is all you need                      |
| 06  | [[notes/mlp/06-vit\|(y-) Vision Transformer (ViT)]]      | Patches + Transformers = vision                |
| 07  | [[notes/mlp/07-multimodal\|(y-) Multimodal Learning]]    | CLIP, image+text, cross-modal alignment        |
| 08  | [[notes/mlp/08-iml\|(y-) Interactive Machine Learning]]  | Humans in the loop                             |
| 09  | [[notes/mlp/09-vae\|(y-) Generative AI & VAE]]           | Latent spaces and variational inference        |
| 10  | [[notes/mlp/10-gans\|(y-) GANs]]                         | Generator vs. Discriminator                    |
| 11  | [[notes/mlp/11-rl\|(y-) Reinforcement Learning]]         | Rewards, policies, Q-learning                  |
| 12  | [[notes/mlp/12-diffusion\|(y-) Diffusion Models]]        | Denoising as generation                        |
| 13  | [[notes/mlp/13-xai\|(y-) Explainable AI (XAI)]]          | Why did the model decide that?                 |

---

## How to Use These Notes

- **Reading linearly** works well — each lecture builds on the previous.
- Each page has a **mental model** section (big picture first), then details.
- Look for the **Example** blocks to build intuition.
- Math is included where needed, but always paired with plain-English explanations.

---

## Quick Reference: Key Concepts

| Concept           | Where It Appears                                                                               |
| :---------------- | :--------------------------------------------------------------------------------------------- |
| Backpropagation   | [[notes/mlp/01-introduction\|L01]], [[notes/mlp/02-cnn\|L02]]                                  |
| Attention         | [[notes/mlp/05-transformer\|L05]], [[notes/mlp/06-vit\|L06]], [[notes/mlp/07-multimodal\|L07]] |
| Latent Space      | [[notes/mlp/09-vae\|L09]], [[notes/mlp/10-gans\|L10]], [[notes/mlp/12-diffusion\|L12]]         |
| Sequential Data   | [[notes/mlp/04-rnn\|L04]], [[notes/mlp/05-transformer\|L05]]                                   |
| Generative Models | [[notes/mlp/09-vae\|L09]], [[notes/mlp/10-gans\|L10]], [[notes/mlp/12-diffusion\|L12]]         |

---
[[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
