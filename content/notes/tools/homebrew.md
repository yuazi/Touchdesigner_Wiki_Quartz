---
title: Homebrew, the macOS Package Manager
tags:
  - cli
  - tools
  - macos
date: 2026-03-27
---

[Homebrew](https://brew.sh/) is the missing package manager for macOS (and Linux). It simplifies the installation of software that Apple (or your Linux system) didn't include.

## Installation

Install Homebrew by running the following command in your terminal:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, ensure it is in your `PATH` by adding it to your `.zshrc` or `.bash_profile`:

```sh
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Basic Usage

| Action              | Command                   |
| ------------------- | ------------------------- |
| Install a package   | `brew install <formula>`  |
| Install a GUI app   | `brew install --cask <app>`|
| Update Homebrew     | `brew update`             |
| Upgrade packages    | `brew upgrade`            |
| Search for packages | `brew search <query>`     |
| List installed      | `brew list`               |
| Uninstall           | `brew uninstall <name>`   |
| Health check        | `brew doctor`             |

## Brewfile (Infrastructure as Code)

A `Brewfile` allows you to manage all your dependencies in a single file. You can export your current setup with:

```sh
brew bundle dump
```

To install everything from an existing `Brewfile`:

```sh
brew bundle
```

### Example Brewfile

```ruby
tap "homebrew/bundle"
tap "homebrew/services"

# Core Utilities
brew "git"
brew "gh"
brew "node"
brew "python"
brew "ripgrep"
brew "fd"
brew "fzf"
brew "bat"
brew "eza"
brew "zoxide"
brew "starship"

# Development Tools
brew "neovim"
brew "tmux"

# Desktop Applications (Casks)
cask "ghostty"
cask "visual-studio-code"
cask "sioyek"
cask "raycast"
cask "discord"
cask "spotify"
```

## Maintenance

Keep your system clean by removing old versions of installed formulae:

```sh
brew cleanup
```

Check for potential issues:

```sh
brew doctor
```

---
[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
