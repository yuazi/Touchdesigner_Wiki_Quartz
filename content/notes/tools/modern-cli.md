---
title: Modern CLI Tools (eza, bat, fzf, thefuck)
tags:
  - cli
  - tools
  - productivity
  - terminal
date: 2025-03-23
---

A collection of modern command-line tools that replace or enhance traditional Unix commands like `ls`, `cat`, and `grep`.

## Tools Overview

### [eza](https://github.com/eza-community/eza)
A modern replacement for `ls`. It's written in Rust and provides more features and better defaults than the standard `ls`.

*   **Key Features**: Icons, colors by file type, git integration, and tree view.
*   **Aliased as**: `ls`, `ll`, `la`, `lla`, `lt`.

### [bat](https://github.com/sharkdp/bat)
A `cat` clone with syntax highlighting and Git integration.

*   **Key Features**: Syntax highlighting for a huge range of languages, automatic paging, and a better viewing experience than standard `cat`.
*   **Aliased as**: `cat`.

### [fzf](https://github.com/junegunn/fzf)
A general-purpose command-line fuzzy finder.

*   **Key Features**: Allows you to filter your command history, files, and more in real-time.
*   **Shortcuts**: `Ctrl + R` for history search, `Ctrl + T` for file search.

### [thefuck](https://github.com/nvbn/thefuck)
A magnificent app which corrects errors in previous console commands.

*   **Key Features**: Corrects typos, missing `sudo`, and other common CLI mistakes.
*   **Usage**: Just type `fuck` after a failed command.

---

## Configuration in `.zshrc`

These tools are configured and aliased to provide a seamless experience.

```zsh
# eza (The better ls)
alias ls='eza --icons --group-directories-first'
alias ll='eza -l --icons --group-directories-first'
alias la='eza -a --icons --group-directories-first'
alias lla='eza -la --icons --group-directories-first'
alias lt='eza --tree --icons'

# bat (The better cat)
alias cat='bat'

# thefuck (Fixes typos)
eval $(thefuck --alias)

# fzf (Fuzzy Finder)
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
```

---

## Shortcuts Summary

| Tool | Shortcut / Alias | Action |
| :--- | :--- | :--- |
| **eza** | `lt` | Display current directory as a **Tree** |
| **fzf** | `Ctrl + R` | **Fuzzy Search** your command history |
| **fzf** | `Ctrl + T` | **Find** any file and paste its path |
| **thefuck** | `fuck` | **Fix** the last misspelled command |
| **bat** | `cat <file>` | View file with **Syntax Highlighting** |

---
[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
