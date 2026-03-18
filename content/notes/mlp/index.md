---
title: Machine Perception & Learning (MPL)
tags:
  - mlp
  - machine-learning
  - deep-learning
  - notes
date: 2026-03-10
---

## Machine Perception & Learning

This is my study hub for the MPL master's course. Each lecture gets its own page with explanations, key concepts, math, and examples I worked through to actually understand the material — not just memorize it.

I use the [[work/slidelink|SlideLink]] tool I built to automatically align these notes with the lecture slides.

[[notes/index|Return to Notes]] | [[index|Return to Home]]

---

## Lectures

| #   | Topic                                     | Core Idea                                      |
| --- | ----------------------------------------- | ---------------------------------------------- |
| 01  | [Introduction](./01-introduction)         | What is ML? Loss, optimization, training loops |
| 02  | [Convolutional Neural Networks](./02-cnn) | Spatial feature extraction with filters        |
| 03  | [Vision CNNs](./03-vision-cnn)            | AlexNet, VGG, ResNet, EfficientNet             |
| 04  | [Recurrent Neural Networks](./04-rnn)     | Sequences, LSTMs, GRUs, vanishing gradients    |
| 05  | [Transformers](./05-transformer)          | Attention is all you need                      |
| 06  | [Vision Transformer (ViT)](./06-vit)      | Patches + Transformers = vision                |
| 07  | [Multimodal Learning](./07-multimodal)    | CLIP, image+text, cross-modal alignment        |
| 08  | [Interactive Machine Learning](./08-iml)  | Humans in the loop                             |
| 09  | [Generative AI & VAE](./09-vae)           | Latent spaces and variational inference        |
| 10  | [GANs](./10-gans)                         | Generator vs. Discriminator                    |
| 11  | [Reinforcement Learning](./11-rl)         | Rewards, policies, Q-learning                  |
| 12  | [Diffusion Models](./12-diffusion)        | Denoising as generation                        |
| 13  | [Explainable AI (XAI)](./13-xai)          | Why did the model decide that?                 |

---

## How to Use These Notes

- **Reading linearly** works well — each lecture builds on the previous.
- Each page has a **mental model** section (big picture first), then details.
- Look for the **Example** blocks to build intuition.
- Math is included where needed, but always paired with plain-English explanations.

---

## Quick Reference: Key Concepts

| Concept           | Where It Appears                                                 |
| ----------------- | ---------------------------------------------------------------- |
| Backpropagation   | [L01](./01-introduction), [L02](./02-cnn)                        |
| Attention         | [L05](./05-transformer), [L06](./06-vit), [L07](./07-multimodal) |
| Latent Space      | [L09](./09-vae), [L10](./10-gans), [L12](./12-diffusion)         |
| Sequential Data   | [L04](./04-rnn), [L05](./05-transformer)                         |
| Generative Models | [L09](./09-vae), [L10](./10-gans), [L12](./12-diffusion)         |
