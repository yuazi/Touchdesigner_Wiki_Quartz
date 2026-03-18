---
title: "SlideLink: Context-Aware Lecture Note Automation"
tags:
  - tools
  - python
  - mlp
  - automation
  - nlp
date: 2026-03-14
---

Taking manual screenshots of lecture slides while writing notes is a massive waste of time. For the [[notes/mlp/index|Machine Perception & Learning]] course, I have hundreds of slides across 13+ lectures. Clicking back and forth between a PDF and Obsidian just to crop and name images felt like busywork, so I built **SlideLink** to handle it for me.

SlideLink is a domain-agnostic CLI tool that contextually aligns Markdown lecture notes with PDF course slides. It "reads" your notes, finds the most relevant slide in the corresponding PDF using NLP and visual heuristics, renders it as a high-res PNG, and inserts the link automatically.

## How it works

SlideLink uses a scoring system that combines semantic similarity with visual density analysis to find the right match without requiring an LLM or internet connection.

### 1. Semantic Search (TF-IDF)

At the core, it uses a **TF-IDF vectorizer** with `ngram_range=(1, 2)`. It converts the text in your notes (the context following a heading) and the text on every slide into vectors. It then calculates the **cosine similarity** between them to find the semantic match.

### 2. Math & LaTeX Aliases

Since many technical notes rely on math, SlideLink includes a **LaTeX alias system**. It maps common symbols to their textual equivalents (e.g., `\nabla` → "gradient"). The tool scans for these symbols in the Markdown and applies a **Math Bonus** to any slide containing either the symbol or its alias.

### 3. Visual Density Heuristics

To avoid matching slides that are just walls of text, SlideLink uses `PyMuPDF` to count images and vector paths on a page. It calculates a **Visual Signal** score based on:
- **Image Count**: Direct presence of figures.
- **Drawing Count**: Presence of vector graphics or diagrams.
- **Visual Area Ratio**: The total area occupied by visuals vs. the page area.

### 4. Safety & Review

If the gap between the top two slides is too narrow, SlideLink flags it for manual review. It also includes:
- **`--dry-run`**: Preview changes without modifying files.
- **`--revert`**: A dedicated command to strip all inserted images if you want to start fresh.

## Project Structure

Unlike the original script, SlideLink is a structured Python package:

- **`slidelink-run`**: The main entry point to process your notes.
- **`slidelink-revert`**: Reverts all changes made by the tool.
- **`config/`**: JSON-based configuration for LaTeX aliases and heading rules.

## CLI Usage

Process a subject directory:
```bash
slidelink-run --subject "mpl" --notes "./content/notes/mpl" --pdfs "./slides"
```

Revert changes:
```bash
slidelink-revert --notes "./content/notes/mpl"
```

## Installation

SlideLink is built with `PyMuPDF` for PDF handling and `scikit-learn` for NLP:

```bash
git clone https://github.com/yuazi/SlideLink
cd SlideLink
pip install -e .
```
