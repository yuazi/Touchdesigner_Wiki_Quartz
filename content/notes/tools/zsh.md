---
title: Zsh, Oh My Zsh, and Powerlevel10k
tags:
  - cli
  - tools
  - productivity
  - terminal
  - zsh
date: 2025-03-23
---

A powerful terminal setup using Zsh as the shell, Oh My Zsh for framework management, and Powerlevel10k for a highly informative and fast prompt.

## Components

### Zsh

The Z-shell (Zsh) is a powerful shell that can be used as an interactive login shell and as a shell script command processor. It is the default shell on macOS.

### Oh My Zsh (OMZ)

[Oh My Zsh](https://ohmyz.sh/) is an open-source, community-driven framework for managing your Zsh configuration. It comes bundled with thousands of helpful functions, helpers, plugins, and themes.

### Powerlevel10k (P10k)

[Powerlevel10k](https://github.com/romkatv/powerlevel10k) is a theme for Zsh. It emphasizes speed, flexibility, and out-of-the-box experience.

---

## My Configuration

The configuration is primarily handled in `~/.zshrc`.

### Instant Prompt

Powerlevel10k uses an "Instant Prompt" feature to make the shell start immediately, even if you have many plugins. This block must stay at the top of your `.zshrc`:

```zsh
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi
```

### Plugins

I use a mix of standard OMZ plugins and external tools:

```zsh
plugins=(git web-search sudo zoxide)
```

- **git**: Adds aliases and status info for Git.
- **web-search**: Search the web from the CLI (e.g., `google how to...`).
- **sudo**: Press `Esc` twice to add `sudo` to the previous command.
- **zoxide**: A smarter `cd` command.

### Essential Add-ons

These are sourced at the bottom of the `.zshrc` to ensure they don't interfere with the startup:

- **zsh-completions**: Adds thousands of extra completion rules.
- **zsh-autosuggestions**: Suggests commands as you type based on history.
- **zsh-syntax-highlighting**: Highlights valid/invalid commands in real-time.

---

## Key Shortcuts & Features

| Feature         | Key / Command    | Action                                                                                           |
| :-------------- | :--------------- | :----------------------------------------------------------------------------------------------- |
| **P10k Config** | `p10k configure` | Re-run the visual setup wizard                                                                   |
| **Autosuggest** | `Right Arrow`    | Accept the grey "ghost" suggestion                                                               |
| **Syntax**      | (Real-time)      | <span style="color:green">Green</span> for valid, <span style="color:red">Red</span> for invalid |
| **Sudo**        | `Esc` `Esc`      | Prepends `sudo` to the current line                                                              |

---

[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
