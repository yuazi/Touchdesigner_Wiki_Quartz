---
title: "SlideLink: Automating Lecture Notes"
tags:
  - tools
  - python
  - mlp
  - automation
  - nlp
date: 2026-03-14
github: https://github.com/yuazi/SlideLink
---

[View on GitHub](https://github.com/yuazi/SlideLink)

Taking manual screenshots of lecture slides while writing notes is a massive waste of time.
 For the [[/notes/lectures/mlp/index|Machine Perception & Learning]] course, I have hundreds of slides across 13+ lectures. Clicking back and forth between a PDF and Obsidian just to crop and name images felt like busywork, so I built **SlideLink** to handle it for me.

SlideLink is a domain-agnostic CLI tool that contextually aligns Markdown lecture notes with PDF course slides. It "reads" your notes, finds the most relevant slide in the PDF using NLP and visual heuristics, renders it as a high-res PNG, and inserts the link automatically.

---

## The Core Concept

If you want to build something similar without an LLM, the core idea is **Vectorization**—turning text into numbers to find the "distance" between your note's context and a list of slide texts. Here is a stripped-down example of the matching logic using `scikit-learn`:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def find_best_slide(note_context, slides):
    # Vectorize both the note and all slides
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))

    # Fit on all slides and transform the note context
    slide_matrix = vectorizer.fit_transform(slides)
    query_vec = vectorizer.transform([note_context])

    # Calculate cosine similarity
    scores = cosine_similarity(query_vec, slide_matrix).ravel()

    # Return index of the best match
    return scores.argmax(), scores.max()

# Example:
note = "Implementing backpropagation in a multi-layer perceptron"
slides = [
    "Introduction to Neural Networks",
    "Backpropagation algorithm and chain rule for MLPs",
    "Convolutional layers and filters"
]

idx, score = find_best_slide(note, slides)
print(f"Match: '{slides[idx]}' with score {score:.3f}")
```

---

## The Deep Dive: How it works

To make it robust enough for real-world academic use, SlideLink uses a scoring system that combines three distinct signals.

### 1. Semantic Search (TF-IDF)

At the core, it uses a **TF-IDF vectorizer** with `ngram_range=(1, 2)`. It converts the text in your notes (the context following a heading) and the text on every slide into vectors. It then calculates the **cosine similarity** between them to find the semantic match.

The core logic leverages **Transformers** to align semantic meaning between text and visual slide content. See [[/notes/lectures/mlp/05-transformer|L05: Transformers]] for the underlying architecture.

### 2. Math & LaTeX Aliases

Since many technical notes rely on math, SlideLink includes a **LaTeX alias system**. It maps common symbols to their textual equivalents (e.g., `\nabla` → "gradient"). The tool scans for these symbols in the Markdown and applies a **Math Bonus** to any slide containing either the symbol or its alias.

### 3. Visual Density Heuristics

To avoid matching slides that are just walls of text, SlideLink uses `PyMuPDF` to count images and vector paths on a page. It calculates a **Visual Signal** score based on image count, drawing count, and visual area ratio.

---

## Workflow & Safety

![[pictures/work/slidelink/terminal_real.png]]

<p class="image-caption">SlideLink in action: scanning notes, remapping LaTeX, and performing semantic matches across lecture slides.</p>

SlideLink is designed to be safe to run on an existing vault.

- **Dry Runs**: Use `--dry-run` to preview changes without modifying any files.
- **Safety Flags**: If the gap between the top two slides is too narrow, SlideLink flags it for manual review.
- **Full Reversion**: A dedicated `slidelink-revert` command strips all inserted images if you want to start fresh.

---

## Getting Started

SlideLink is a structured Python package. You'll need `PyMuPDF` for PDF handling and `scikit-learn` for the NLP logic.

```bash
git clone https://github.com/yuazi/SlideLink
cd SlideLink
pip install -e .
```

---
[[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
