---
title: Keyboard AI
tags:
  - work
  - projects
  - archive
  - python
  - cli
  - keyboard
  - optimization
  - ergonomics
  - ai
date: 2026-03-11
---

Keyboard AI is a small Python CLI project for learning character patterns from text and searching for keyboard layouts that score better for that corpus. It is less about claiming a universal "best" layout and more about optimizing a layout against a specific scoring model and a specific body of writing.

---

## What it does

- Builds unigram, bigram, and trigram statistics from a corpus
- Scores a layout with an ergonomic model that accounts for key effort, same-finger and same-hand penalties, row jumps, repetitions, and redirects, while rewarding hand alternation and finger rolls
- Runs an evolutionary search to improve a layout over generations
- Exposes three CLI commands: `train`, `score`, and `show`

The tool can learn from text files, pasted terminal input with `--stdin`, or the bundled sample corpus. Training can optionally save a JSON model, and saved runs can be resumed later.

---

## How it works

The repo is split into a few focused modules:

```text
corpus.py     -> corpus loading and n-gram statistics
layout.py     -> layout normalization, mutation, crossover, and slot mapping
scoring.py    -> ergonomic analysis and score breakdown
optimizer.py  -> population search, elite selection, crossover, and mutation schedule
cli.py        -> train / score / show commands
```

`scoring.py` turns a layout into slot positions and accumulates costs and bonuses across unigrams, bigrams, and trigrams. `optimizer.py` then uses that score inside a seeded evolutionary loop with elites, crossover, mutation, and adaptive mutation strength (`sigma`) to search for better layouts.

---

## Current shape

- Packaged as a Python project with a `keyboard-ai` CLI entry point
- Includes a bundled sample corpus for quick runs without external files
- Saves optimization results as JSON when `--output` is provided, and can resume from a saved model later
- Has a `unittest` suite that covers corpus stats, optimizer improvement on a biased corpus, model save/load round-tripping, and CLI flows for `train` and `score`

---

## Related

- [GitHub Repo](https://github.com/yuazi/keyboard-AI)

[[index|Return to Work]]

---
