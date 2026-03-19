---
title: "The Evolutionary Keyboard"
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

Standard keyboard layouts like QWERTY were designed to prevent mechanical typewriter jams, not for modern ergonomics. Most "improved" layouts like Dvorak or Colemak are better, but they are still one size fits all. I wanted a way to find a layout that was perfectly optimized for _my_ specific typing patterns, so I built **Keyboard AI**.

Keyboard AI is a Python CLI tool that learns character patterns from a text corpus and uses an evolutionary algorithm to search for the most ergonomic layout possible for that specific body of writing.

---

## The Core Concept

The project treats keyboard optimization as a search problem. It starts with a population of random layouts and "evolves" them over generations. Each layout is scored based on physical effort, finger travel, and comfortable typing patterns like rolls.

Here is a simplified version of the evolutionary loop:

```python
import random

def evolve_layout(current_layout, corpus_stats):
    # Create a slightly mutated version of the layout
    new_layout = current_layout.copy()
    a, b = random.sample(range(len(new_layout)), 2)
    new_layout[a], new_layout[b] = new_layout[b], new_layout[a]

    # Keep it only if it scores better
    if score(new_layout, corpus_stats) < score(current_layout, corpus_stats):
        return new_layout
    return current_layout

# Optimization loop
layout = list("qwertyuiopasdfghjkl;zxcvbnm,./")
for generation in range(10000):
    layout = evolve_layout(layout, my_corpus_stats)
```

---

## The Deep Dive: How it works

To find a truly ergonomic layout, the tool needs to understand both the language and the human hand.

### 1. Linguistic Analysis

The tool builds **unigram, bigram, and trigram** statistics from your provided text. It knows which letters you use most, which pairs appear together (like "th" or "er"), and which sequences are common. This allows the optimizer to place frequent letters in the easiest spots.

### 2. The Ergonomic Model

The scoring engine accounts for several physical factors:

- **Key Effort**: How hard is it to reach a specific key from the home row?
- **Finger Penalties**: Index fingers are stronger than pinkies.
- **Hand Alternation**: It is faster to type when you switch hands between letters.
- **Finger Rolls**: It feels better when you type keys in a sequence moving toward the center of the hand.
- **Row Jumps**: Avoid moves where a finger has to jump over the home row.

### 3. Evolutionary Search

Instead of checking every possible layout (which is mathematically impossible), the tool uses a population search with **elites, crossover, and mutation**. It keeps the best performers from each generation and mixes their "DNA" to find even better combinations.

---

## Project Structure

The tool is built as a modular Python package with clear separation of concerns:

- **`corpus.py`**: Handles loading text and generating N gram statistics.
- **`layout.py`**: Manages layout state, mutations, and crossovers.
- **`scoring.py`**: The "brain" that calculates the ergonomic cost of a layout.
- **`optimizer.py`**: The search engine that runs the evolutionary loop.
- **`cli.py`**: Provides the `train`, `score`, and `show` commands.

---

## CLI Usage

Train a new model from a text file:

```bash
keyboard-ai train --corpus my_writing.txt --output my_model.json
```

Score an existing layout (like Colemak) against your stats:

```bash
keyboard-ai score --layout colemak --model my_model.json
```

---

## Getting Started

Keyboard AI is available as a Python CLI. It includes a sample corpus so you can start optimizing immediately.

```bash
git clone https://github.com/yuazi/keyboard-AI
cd keyboard-AI
pip install -e .
```

---
[[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
