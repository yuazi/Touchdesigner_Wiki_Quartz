---
title: Ghostty, a Terminal Emulator
tags:
  - cli
  - tools
  - terminal
date: 2026-03-02
---

[Ghostty](https://ghostty.org/) is a fast native terminal emulator written in Zig. It supports GPU rendering, fits nicely into the OS, and works well right out of the box.

## Installation

On macOS, download the app from [ghostty.org](https://ghostty.org/) or install via Homebrew:

```sh
brew install --cask ghostty
```

## Configuration

Ghostty uses a plain text config file located at:

```
~/.config/ghostty/config
```

Example configuration:

```
font-family = "JetBrains Mono"
font-size = 14
theme = catppuccin-mocha
window-padding-x = 8
window-padding-y = 8
```

## Key Features

- **GPU rendering:** via Metal (macOS) and OpenGL/Vulkan (Linux)
- **Native UI:** uses window decorations and menus that feel at home on the platform
- **Split panes:** horizontal and vertical splits are built in
- **Tabs:** native tab support
- **Ligature support:** full font ligature rendering
- **True color & undercurl:** modern terminal capability support
- **Shell integration:** automatic shell prompts, cursor shape, and working directory tracking

## Splits & Tabs

| Action             | Keybind (macOS)    |
| ------------------ | ------------------ |
| New window         | `Cmd+N`            |
| New tab            | `Cmd+T`            |
| Close surface      | `Cmd+W`            |
| Previous tab       | `Cmd+Shift+[`      |
| Next tab           | `Cmd+Shift+]`      |
| Split vertically   | `Cmd+D`            |
| Split horizontally | `Cmd+Shift+D`      |
| Focus split left   | `Cmd+Option+Left`  |
| Focus split right  | `Cmd+Option+Right` |
| Focus split up     | `Cmd+Option+Up`    |
| Focus split down   | `Cmd+Option+Down`  |
| Increase font size | `Cmd++`            |
| Decrease font size | `Cmd+-`            |
| Reset font size    | `Cmd+0`            |

## Themes

Ghostty ships with many built in themes. List them with:

```sh
ghostty +list-themes
```

Set a theme in config:

```
theme = nord
```

## Shell Integration

Ghostty automatically integrates with common shells (bash, zsh, fish). It tracks the current working directory, marks prompt zones, and reports exit codes. No manual setup required for supported shells.

---
[[notes/index|(y) Return to Notes]]
