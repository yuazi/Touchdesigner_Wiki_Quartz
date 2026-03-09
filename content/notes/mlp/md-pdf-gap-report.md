---
title: "MLP Markdown vs PDF Gap Report"
tags:
  - mlp
  - audit
  - notes
date: 2026-03-09
draft: true
---

## Scope

This report compares each `content/notes/mlp/*.md` lecture note against its corresponding PDF in `content/notes/mlp/pdfs/`.

Focus:
- Missing substantive lecture content in the Markdown notes
- Presence is checked against the full Markdown body, not only the section headings

Usually ignored as low priority:
- "Last lecture", "next lecture", references, slide-credit pages
- Course admin pages unless the note is meant to preserve course logistics

---

## Summary

After a stricter second pass, most Markdown files are much closer to their PDFs than the first draft suggested.

Largest gaps:
- `01-introduction.md`
- `12-diffusion.md`
- `03-vision-cnn.md`
- `06-vit.md`

Smallest gaps:
- `02-cnn.md`
- `04-rnn.md`
- `05-transformer.md`
- `07-multimodal.md`
- `09-vae.md`
- `11-rl.md`
- `13-xai.md`

---

## Per-file Findings

### `01-introduction.md`

Missing from the Markdown:
- Nearly all course logistics content: lecturers, TAs, communication policy, schedule, registration, exercises, submissions, exam, plagiarism, AI-tool policy, recommended reading, project opportunities
- Introductory motivation / course-content framing from the PDF
- Course schedule overview

Low-priority omissions:
- Appendix
- Reference slides

### `02-cnn.md`

No substantive content gap identified.

Low-priority omissions:
- A "further reading" slide
- "Next lecture"
- Reference slides

### `03-vision-cnn.md`

Missing from the Markdown:
- The "fast dense detection + slow sparse classification" framing slide for R-CNN
- R-CNN result slides
- The dedicated R-CNN family comparison slide ("All the R-CNNs")
- COCO qualitative-result slides
- Mask R-CNN loss and result slides

Mostly already covered in the Markdown:
- ROI Align
- Learnable upsampling / deconvolution
- U-Net

### `04-rnn.md`

No substantive content gap identified.

Low-priority omissions:
- Further reading
- "Next lecture"
- Reference slides

### `05-transformer.md`

No substantive content gap identified.

Low-priority omissions:
- "Next lecture"
- Reference slides

### `06-vit.md`

Missing from the Markdown:
- DETR subslides that are separate in the PDF but only partly folded into the Markdown:
  - backbone and positional encoding
  - encoder / decoder split
  - output embedding and prediction
  - architectural similarity slide
  - combined loss slide
  - result and qualitative-result slides
- DINO-specific result slides:
  - multiview-loss emphasis
  - result comparisons
  - qualitative results

Already covered in the Markdown:
- DETR overall architecture and matching
- DINO motivation, setup, loss, and mode-collapse prevention

### `07-multimodal.md`

No substantive content gap identified.

### `08-iml.md`

Missing from the Markdown:
- Introductory application/framing slides that are not preserved in the notes:
  - recommender systems
  - autonomous vehicles
  - industrial applications
  - big-data framing
  - several "who is in the loop?" examples as separate slides
- The explicit "(theoretical) guarantees" slide title

Already covered in the Markdown:
- uncertainty sampling
- diversity / committee / BALD / batch-aware methods
- active-learning methods section overall

### `09-vae.md`

No substantive content gap identified.

### `10-gans.md`

Missing from the Markdown:
- Only the VAE recap framing slides appear to be absent from the Markdown body

Already covered in the Markdown:
- Wasserstein distance / WGAN
- gaze-estimation and gaze-redirection case study

### `11-rl.md`

Missing from the Markdown:
- Only a few slide-level items are not reproduced literally:
  - the exact MDP definition slide
  - a standalone value-iteration pseudocode slide

Already covered in the Markdown:
- TD learning
- SARSA
- DQN
- actor-critic
- TRPO / PPO
- Atari / AlphaGo / StarCraft examples

### `12-diffusion.md`

Missing from the Markdown:
- The initial VAE/GAN recap framing slides
- A few intermediate derivation slides that are not preserved explicitly:
  - basic-idea slide title
  - stochastic transformation
  - parameter-choice / parameter-sharing slide wording
- Some GLIDE details shown as dedicated slides in the PDF:
  - CLIP-guidance slide
  - training slide
  - editing-results slide

Already covered in the Markdown:
- continuous-time / SDE view
- latent diffusion
- GLIDE overview
- classifier-free guidance

### `13-xai.md`

Missing from the Markdown:
- A few slide-level items only:
  - structured-data motivation / technique slides as separate named sections
  - the top-level lecture-title wording used in the PDF

Already covered in the Markdown:
- LIME and examples
- Anchors
- SmoothGrad and other saliency methods
- representation-based explanations
- counterfactuals

---

## Priority Order for Updating the Markdown Notes

If you want to close the biggest gaps first, update these files in this order:

1. `01-introduction.md`
2. `12-diffusion.md`
3. `03-vision-cnn.md`
4. `06-vit.md`
5. `08-iml.md`

The remaining files are already close to the PDFs at the body-content level.
