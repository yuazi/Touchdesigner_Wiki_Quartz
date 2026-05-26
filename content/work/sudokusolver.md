---
title: "Solving Sudoku with GNNs"
tags:
  - work
  - projects
  - python
  - pytorch
  - gnn
  - ai
date: 2026-03-11
github: https://github.com/yuazi/sudoku_solver
---

[View on GitHub](https://github.com/yuazi/sudoku_solver)

**Sudoku Solver** is a PyTorch experiment that models Sudoku boards as graphs and trains a graph neural network to predict digits through message passing. The project also includes a practical CLI layer with validation, visualizations, tests, and an exact fallback path when the neural prediction is invalid.

---

## What It Demonstrates

- Graph construction for 9x9 Sudoku boards with 81 nodes and 1,620 directed constraint edges.
- A message-passing GNN with shared MLP messages, summed aggregation, GRU updates, and per-cell digit logits.
- Training over all GNN iterations, not only the final prediction.
- CLI validation before model loading, including length checks, invalid characters, contradictory givens, and clue preservation.
- Unit tests for validation behavior, clue preservation, solution checking, and CLI errors.

---

## Graph Representation

Each Sudoku cell is a node. Two nodes are connected when they share a row, column, or 3x3 box. That lets the model propagate constraints between related cells through message passing.

| Concept | Value                              |
| ------- | ---------------------------------- |
| Nodes   | `81` cells                         |
| Edges   | `1,620` directed constraint edges  |
| Input   | digit index, where `0` means empty |
| Output  | logits for digits `1` through `9`  |

---

## Solver Flow

1. Normalize the puzzle string so `.` becomes `0`.
2. Reject invalid puzzles before loading model weights.
3. Run the trained GNN for `n_iters` message-passing steps.
4. Preserve all fixed givens in the final prediction.
5. Validate rows, columns, boxes, and givens.
6. If the neural output is invalid, attempt exact backtracking fallback.

---

## Getting Started

```bash
git clone https://github.com/yuazi/sudoku_solver
cd sudoku_solver
python3 -m pip install -r requirements.txt
python3 -m unittest discover -s tests -v
```

Train a checkpoint:

```bash
python3 train.py
```

Solve a puzzle:

```bash
python3 solve.py "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
```

---

[[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
