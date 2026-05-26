---
title: "Keyboard AI"
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
github: https://github.com/yuazi/keyboard-AI
---

[View on GitHub](https://github.com/yuazi/keyboard-AI)

**Keyboard AI** is a Python CLI that learns character patterns from a text corpus and searches for keyboard layouts with lower ergonomic cost. The goal is not to claim a universal best layout, but to explore how corpus statistics and a scoring model can drive layout search.

---

## What It Demonstrates

- Corpus ingestion from files, stdin, or a bundled sample text.
- Unigram, bigram, and trigram statistics for layout scoring.
- Evolutionary search with configurable generation count, population size, elite count, mutation strength, and random seed.
- Ergonomic scoring for key effort, same-finger movement, row jumps, hand alternation, rolls, and redirects.
- Saved model JSON output plus export helpers for Karabiner and QMK-style configs.
- Regression tests for corpus statistics, optimization behavior, saved-model round trips, and CLI flows.

---

## The Core Idea

The project treats keyboard layout design as a search problem. Each candidate layout is scored against a corpus, then the optimizer keeps stronger candidates and mutates/crosses them over to search nearby layouts.

```python
def train_layout(corpus, initial_layout, optimizer):
    population = optimizer.initialize(initial_layout)
    for _ in range(optimizer.generations):
        scored = optimizer.score(population, corpus)
        elites = optimizer.select_elites(scored)
        population = optimizer.recombine_and_mutate(elites)
    return optimizer.best_layout
```

---

## CLI Usage

Train from a text file:

```bash
keyboard-ai train --corpus my_writing.txt --output model.json
```

Train from pasted text:

```bash
keyboard-ai train --stdin
```

Score an existing layout:

```bash
keyboard-ai score --layout qwertyuiopasdfghjklzxcvbnm --corpus my_writing.txt
```

---

## Getting Started

```bash
git clone https://github.com/yuazi/keyboard-AI
cd keyboard-AI
pip install -e .
python3 -m unittest discover -s tests -v
```

---

[[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
