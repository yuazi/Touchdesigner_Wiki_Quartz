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

Solving Sudoku is a classic constraint satisfaction problem usually handled by backtracking or constraint propagation. I wanted to see if a neural network could learn the underlying rules of the game without being explicitly programmed with them, so I built **Sudoku Solver**.

This project serves as a practical exploration of graph-based architectures, applying concepts from my **[[notes/mlp/index|Machine Perception & Learning (MPL)]]** studies to non-Euclidean data structures.

It is a **Graph Neural Network (GNN)** that treats the Sudoku grid as a graph where each cell is a node and constraints (row, column, box) are edges. The model learns to predict the correct value for each empty cell through node classification.

---

## The Core Concept

The project frames Sudoku as a **node classification task** on a graph with 81 nodes. Each node is connected to 20 other nodes (8 in the same row, 8 in the same column, and 4 in the same 3x3 box).

The GNN uses message passing to propagate information between cells. Here is a conceptual look at the message passing step:

```python
import torch
import torch.nn as nn
from torch_geometric.nn import GCNConv

class SudokuGNN(nn.Module):
    def __init__(self, num_features, hidden_dim):
        super(SudokuGNN, self).__init__()
        self.conv1 = GCNConv(num_features, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.classifier = nn.Linear(hidden_dim, 10) # 0-9 values

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index).relu()
        return self.classifier(x)
```

---

## The Deep Dive: How it works

The solver moves beyond simple heuristics by learning the spatial relationships and constraints directly from data.

### 1. Graph Representation

The Sudoku board is represented as a fixed graph structure. Each of the 81 cells is a node, and edges represent the "conflicts" defined by Sudoku rules. This allows the network to "see" which cells affect each other simultaneously.

### 2. Node Classification

Instead of predicting the entire board at once, the network performs multi-class classification for each node. Given the initial clues as input features, the GNN refines its internal representations through multiple layers of message passing until it can confidently assign a value to every cell.

### 3. Training & Dataset

The model is trained on a large dataset of Sudoku puzzles and their solutions. It learns to minimize the cross-entropy loss between its predictions and the ground truth, effectively "learning" the rules of Sudoku through exposure to millions of solved examples.

---

## Project Structure

The project is organized for both training and inference:

- **`data/`**: Utilities for generating and loading Sudoku datasets.
- **`model/`**: The GNN architecture and message passing logic.
- **`train.py`**: The training loop, including loss functions and optimizers.
- **`solve.py`**: A CLI tool to solve any Sudoku puzzle using the trained model.

---

## Usage

Solve a puzzle from a string representation:

```bash
python solve.py --puzzle "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79"
```

---

## Getting Started

Sudoku Solver is built with Python and PyTorch Geometric.

```bash
git clone https://github.com/yuazi/sudoku_solver
cd sudoku_solver
pip install -r requirements.txt
```

---
[[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
