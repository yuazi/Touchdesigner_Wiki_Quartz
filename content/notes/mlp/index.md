---
title: y\ Machine Perception & Learning (MPL)
tags:
  - mlp
  - machine-learning
  - deep-learning
  - notes
date: 2026-03-10
---

This is my study hub for the MPL master's course. Each lecture gets its own page with explanations, key concepts, math, and examples I worked through to actually understand the material — not just memorize it.

I use the [[work/slidelink|SlideLink]] tool I built to automatically align these notes with the lecture slides.

[[notes/index|Return to Notes]] | [[index|Return to Home]]

---

## y\ Lectures

| #   | Topic                                     | Core Idea                                      |
| --- | ----------------------------------------- | ---------------------------------------------- |
| 01  | [[notes/mlp/01-introduction|(y-) Introduction]]         | What is ML? Loss, optimization, training loops |
| 02  | [[notes/mlp/02-cnn|(y-) Convolutional Neural Networks]] | Spatial feature extraction with filters        |
| 03  | [[notes/mlp/03-vision-cnn|(y-) Vision CNNs]]            | AlexNet, VGG, ResNet, EfficientNet             |
| 04  | [[notes/mlp/04-rnn|(y-) Recurrent Neural Networks]]     | Sequences, LSTMs, GRUs, vanishing gradients    |
| 05  | [[notes/mlp/05-transformer|(y-) Transformers]]          | Attention is all you need                      |
| 06  | [[notes/mlp/06-vit|(y-) Vision Transformer (ViT)]]      | Patches + Transformers = vision                |
| 07  | [[notes/mlp/07-multimodal|(y-) Multimodal Learning]]    | CLIP, image+text, cross-modal alignment        |
| 08  | [[notes/mlp/08-iml|(y-) Interactive Machine Learning]]  | Humans in the loop                             |
| 09  | [[notes/mlp/09-vae|(y-) Generative AI & VAE]]           | Latent spaces and variational inference        |
| 10  | [[notes/mlp/10-gans|(y-) GANs]]                         | Generator vs. Discriminator                    |
| 11  | [[notes/mlp/11-rl|(y-) Reinforcement Learning]]         | Rewards, policies, Q-learning                  |
| 12  | [[notes/mlp/12-diffusion|(y-) Diffusion Models]]        | Denoising as generation                        |
| 13  | [[notes/mlp/13-xai|(y-) Explainable AI (XAI)]]          | Why did the model decide that?                 |

---

## y\ How to Use These Notes

- **Reading linearly** works well — each lecture builds on the previous.
- Each page has a **mental model** section (big picture first), then details.
- Look for the **Example** blocks to build intuition.
- Math is included where needed, but always paired with plain-English explanations.

---

## y\ Quick Reference: Key Concepts

| Concept           | Where It Appears                                                 |
| ----------------- | ---------------------------------------------------------------- |
| Backpropagation   | [[notes/mlp/01-introduction|L01]], [[notes/mlp/02-cnn|L02]]                        |
| Attention         | [[notes/mlp/05-transformer|L05]], [[notes/mlp/06-vit|L06]], [[notes/mlp/07-multimodal|L07]] |
| Latent Space      | [[notes/mlp/09-vae|L09]], [[notes/mlp/10-gans|L10]], [[notes/mlp/12-diffusion|L12]]         |
| Sequential Data   | [[notes/mlp/04-rnn|L04]], [[notes/mlp/05-transformer|L05]]                         |
| Generative Models | [[notes/mlp/09-vae|L09]], [[notes/mlp/10-gans|L10]], [[notes/mlp/12-diffusion|L12]]         |
