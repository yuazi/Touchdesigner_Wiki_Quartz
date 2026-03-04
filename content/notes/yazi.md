---
title: Yazi – Terminal File Manager
tags:
  - cli
  - tools
  - productivity
date: 2026-02-28
---

[Yazi](https://yazi-rs.github.io/) is a blazing-fast terminal file manager written in Rust, with a three-column Miller-columns layout (parent / current / preview).

Start it with:

```sh
yazi
```

Press `q` to quit, `F1` or `~` to open the help menu.

## Shell Wrapper

The recommended `y` shell wrapper changes the working directory of your shell when you quit Yazi. Add this to your `~/.zshrc` or `~/.bashrc`:

```sh
function y() {
    local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
    command yazi "$@" --cwd-file="$tmp"
    IFS= read -r -d '' cwd < "$tmp"
    [ "$cwd" != "$PWD" ] && [ -d "$cwd" ] && builtin cd -- "$cwd"
    rm -f -- "$tmp"
}
```

Then use `y` to start Yazi. Press `q` to quit and `cd` into the last directory, or `Q` to quit without changing directory.

---

## Shortcuts

### Navigation

| Key | Action |
|-----|--------|
| `h` / `←` | Leave current directory (go to parent) |
| `j` / `↓` | Move cursor down |
| `k` / `↑` | Move cursor up |
| `l` / `→` | Enter hovered directory |
| `g` ⇒ `g` | Move cursor to the top |
| `G` | Move cursor to the bottom |
| `K` | Seek up 5 units in the preview |
| `J` | Seek down 5 units in the preview |
| `z` | Cd to a directory or reveal a file via `fzf` |
| `Z` | Cd to a directory via `zoxide` |
| `g` ⇒ `Space` | Cd to a directory or reveal a file via interactive prompt |
| `Tab` | Show file information (spotter) |

### Selection

| Key | Action |
|-----|--------|
| `Space` | Toggle selection of hovered file/directory |
| `v` | Enter visual mode (selection mode) |
| `V` | Enter visual mode (unset mode) |
| `Ctrl + a` | Select all files |
| `Ctrl + r` | Inverse selection of all files |
| `Esc` | Cancel selection |

### File Operations

| Key | Action |
|-----|--------|
| `o` / `Enter` | Open selected files |
| `O` / `Shift + Enter` | Open selected files interactively |
| `y` | Yank selected files (copy) |
| `x` | Yank selected files (cut) |
| `p` | Paste yanked files |
| `P` | Paste yanked files (overwrite if destination exists) |
| `Y` or `X` | Cancel the yank status |
| `d` | Trash selected files |
| `D` | Permanently delete selected files |
| `a` | Create a file (end name with `/` to create a directory) |
| `r` | Rename selected file(s) |
| `.` | Toggle the visibility of hidden files |
| `;` | Run a shell command |
| `:` | Run a shell command (block until it finishes) |
| `-` | Symlink the absolute path of yanked files |
| `_` | Symlink the relative path of yanked files |
| `Ctrl + -` | Hardlink yanked files |

### Copy Paths

> `c` ⇒ `d` means: press `c`, then press `d`.

| Key | Action |
|-----|--------|
| `c` ⇒ `c` | Copy the file path |
| `c` ⇒ `d` | Copy the directory path |
| `c` ⇒ `f` | Copy the filename |
| `c` ⇒ `n` | Copy the filename without extension |

### Filter & Find & Search

| Key | Action |
|-----|--------|
| `f` | Filter files in the current directory |
| `/` | Find next file (incremental) |
| `?` | Find previous file (incremental) |
| `n` | Go to the next found |
| `N` | Go to the previous found |
| `s` | Search files by name using `fd` |
| `S` | Search files by content using `ripgrep` |
| `Ctrl + s` | Cancel the ongoing search |

### Sorting

> `,` ⇒ `a` means: press `,`, then press `a`.

| Key | Action |
|-----|--------|
| `,` ⇒ `m` | Sort by modified time |
| `,` ⇒ `M` | Sort by modified time (reverse) |
| `,` ⇒ `b` | Sort by birth time |
| `,` ⇒ `B` | Sort by birth time (reverse) |
| `,` ⇒ `e` | Sort by file extension |
| `,` ⇒ `E` | Sort by file extension (reverse) |
| `,` ⇒ `a` | Sort alphabetically |
| `,` ⇒ `A` | Sort alphabetically (reverse) |
| `,` ⇒ `n` | Sort naturally |
| `,` ⇒ `N` | Sort naturally (reverse) |
| `,` ⇒ `s` | Sort by size |
| `,` ⇒ `S` | Sort by size (reverse) |
| `,` ⇒ `r` | Sort randomly |

### Multi-Tab

| Key | Action |
|-----|--------|
| `t` | Create a new tab with CWD |
| `1` – `9` | Switch to the N-th tab |
| `[` | Switch to the previous tab |
| `]` | Switch to the next tab |
| `{` | Swap current tab with previous tab |
| `}` | Swap current tab with next tab |
| `Ctrl + c` | Close the current tab |

---

## Configuration Tips

Yazi's keybindings are configured in `~/.config/yazi/keymap.toml`. You can use `prepend_keymap` for higher priority or `append_keymap` for lower priority than the defaults.

### Bookmarks via `g` keys

```toml
[[mgr.prepend_keymap]]
on   = [ "g", "d" ]
run  = "cd ~/Downloads"
desc = "Cd to ~/Downloads"

[[mgr.prepend_keymap]]
on   = [ "g", "p" ]
run  = "cd ~/Pictures"
desc = "Cd to ~/Pictures"
```

### Disable a default keybinding

```toml
[[mgr.prepend_keymap]]
on  = [ "g", "c" ]
run = "noop"
```

---

> **Reference:** [Official Yazi Quick Start](https://yazi-rs.github.io/docs/quick-start) · [Keymap Reference](https://yazi-rs.github.io/docs/configuration/keymap)

---

[[notes/index|← Notes]]
