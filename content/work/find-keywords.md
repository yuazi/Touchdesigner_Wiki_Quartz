---
title: How I automated my lecture notes (Find Keywords)
tags:
  - tools
  - python
  - mlp
  - automation
date: 2026-03-14
---

Taking manual screenshots of lecture slides while writing notes is a massive waste of time. For the [[mlp/index|Machine Perception & Learning]] course, I have hundreds of slides across 13+ lectures. Clicking back and forth between a PDF and Obsidian just to crop and name images felt like busywork, so I wrote `find_keywords.py` to handle it for me.

The script "reads" my notes, finds the most relevant slide in the corresponding PDF, renders it as a high-res PNG, and inserts the link automatically.

## How it actually works

I didn't want it to just guess based on titles, so I built a scoring system that uses a few different signals to find the right match.

### 1. Semantic Search (TF-IDF)

At the core, it uses a **TF-IDF vectorizer** with `ngram_range=(1, 2)`. It converts the text in my notes (the 5 lines following a heading) and the text on every slide into vectors. It then calculates the **cosine similarity** between them to find the semantic match. This is weighted at **70%** of the total score.

### 2. Math & LaTeX Aliases

Since these are ML notes, the math is often the most important part. I mapped common LaTeX symbols to their textual equivalents:

- `\nabla` → "gradient", "grad", "∇"
- `\sigma` → "sigmoid", "σ"
- `\mathcal{L}` → "loss", "objective"

The script scans for these symbols in my Markdown and gives a **Math Bonus** to any slide containing either the symbol or its alias.

### 3. Visual Density Heuristics

I only want slides that actually show something useful (diagrams, graphs, etc.). The script uses `PyMuPDF` to count images and vector paths on a page. It calculates a **Visual Signal** score:

- **Image Count**: Weighted at 0.35
- **Drawing Count**: Weighted at 0.04
- **Visual Area Ratio**: Total area of images/drawings vs. the page area.

If a slide is just a wall of text with no visual signal, it’s usually skipped.

### 4. Tie-breaking & Review

If the gap between the top two slides is less than **0.045**, the script flags it for manual review. It inserts an HTML comment in the Markdown:
`<!-- Review Needed: close slide match for 'Heading Text' (p12: 0.582, p13: 0.579) -->`

## Simplified Logic

If you want to build something similar, the core idea is just using `scikit-learn` to find the "distance" between your note's context and a list of slide texts. Here is a stripped-down version of the matching logic:

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

# Example usage:
note = "Implementing backpropagation in a multi-layer perceptron"
slides = [
    "Introduction to Neural Networks",
    "Backpropagation algorithm and chain rule for MLPs",
    "Convolutional layers and filters"
]

idx, score = find_best_slide(note, slides)
print(f"Match: '{slides[idx]}' with score {score:.3f}")
```

## Usage

I usually run it in "dry run" mode first to see what it _would_ do without touching my files:

```bash
python find_keywords.py --dry-run
```

If the matches look good, I run it normally. It handles the rendering (at **300 DPI**) into `content/pictures/mpl/` and updates the Markdown links on the fly.

## Dependencies

You'll need `PyMuPDF` for PDF handling and `scikit-learn` for the vectorization:

```bash
python3 -m pip install PyMuPDF scikit-learn
```
