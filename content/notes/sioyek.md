---
title: Sioyek – Keyboard-Driven PDF Reader
tags:
  - tools
  - productivity
  - pdf
date: 2026-03-06
---

[Sioyek](https://sioyek.info/) is a fast, keyboard-driven PDF viewer designed for reading research papers and technical documents. It focuses on distraction-free reading with powerful navigation, smart highlights, and deep linking features that most PDF readers lack.

## Installation

Install via Homebrew on macOS:

```sh
brew install --cask sioyek
```

Or download the latest release from [github.com/ahrm/sioyek/releases](https://github.com/ahrm/sioyek/releases).

---

## Key Features

- **Keyboard-first navigation** — nearly every action has a keybind, no mouse required
- **Smart jump / portal system** — create persistent two-way links between locations in a document (or across documents)
- **Marks** — set named single-character bookmarks and jump back instantly
- **Highlights** — annotate text with color-coded highlights that persist across sessions
- **Search** — full-text search across the open document with chapter scoping
- **Table of contents sidebar** — quickly jump to any chapter or section
- **Link following** — keyboard-activate hyperlinks and footnote references inside PDFs
- **Overview window** — peek at a link target in a floating overlay without losing your current place
- **Visual mark (ruler)** — right-click to place a reading ruler that highlights the current line and masks everything above/below; move it line-by-line with `j`/`k`
- **Presentation mode** — pages snap to fill the screen; movement keys advance whole pages
- **Synctex support** — bidirectional sync with LaTeX editors (jump from PDF to source and back)
- **Multiple windows** — open several documents or views simultaneously
- **Custom keybinds** — fully remappable via a plain-text `keys_user.config` file
- **Dark mode / custom colors** — invert colors or define custom background/foreground themes

---

## Default Keybinds (macOS)

> Sequences like `gg` mean press `g` twice. Sequences like `gb` mean press `g` then `b`.  
> `<number>gg` means type a number first, then `gg` (e.g. `42gg` jumps to page 42).

### Navigation

| Key                              | Action                                                      |
| -------------------------------- | ----------------------------------------------------------- |
| `Space` / `PageDown`             | Scroll down one screen                                      |
| `Shift+Space` / `PageUp`         | Scroll up one screen                                        |
| `gg`                             | Go to the beginning of the document                         |
| `G` / `End`                      | Go to the end of the document                               |
| `<number>gg`                     | Go to page _number_ (e.g. `42gg`)                           |
| `Home`                           | Open "go to page" number prompt                             |
| `gc`                             | Go to the next chapter                                      |
| `gC`                             | Go to the previous chapter                                  |
| `^`                              | Jump to left side of page (ignoring white margins)          |
| `$`                              | Jump to right side of page (ignoring white margins)         |
| `zz`                             | Jump to top-right of page (useful for two-column documents) |
| `+`                              | Zoom in                                                     |
| `-`                              | Zoom out                                                    |
| `=` / `F9`                       | Fit page to screen width                                    |
| `F10`                            | Fit page to screen width (smart — ignores margins)          |
| `Backspace` / `Ctrl+Left`        | Go back (previous location in history)                      |
| `Shift+Backspace` / `Ctrl+Right` | Go forward (next location in history)                       |
| `Ctrl+PageDown`                  | Next page (one full page forward)                           |
| `Ctrl+PageUp`                    | Previous page (one full page back)                          |
| `r`                              | Rotate document clockwise                                   |
| `R`                              | Rotate document counter-clockwise                           |
| `Ctrl+T`                         | Open a new Sioyek window                                    |
| `Ctrl+W`                         | Close the current Sioyek window                             |

### Opening Documents

| Key            | Action                                                           |
| -------------- | ---------------------------------------------------------------- |
| `o`            | Open a file picker dialog                                        |
| `Ctrl+O`       | Open an embedded file picker inside Sioyek                       |
| `Ctrl+Shift+O` | Open embedded file picker rooted at the current file's directory |
| `O`            | Open a searchable list of previously opened documents            |

### Search

| Key                | Action                                 |
| ------------------ | -------------------------------------- |
| `/` or `Ctrl+F`    | Search the document                    |
| `c/` or `c Ctrl+F` | Search within the current chapter only |
| `n`                | Jump to next search result             |
| `N`                | Jump to previous search result         |

### Visual Mark (Ruler)

The "ruler" in Sioyek is called the **visual mark**. It highlights the current line and dims everything above and below it — useful for staying focused on a single line of dense text.

**How to use it:**

1. **Right-click** anywhere on the PDF to place the visual mark on that line.
2. Press `j` / `↓` to move it down one line, `k` / `↑` to move it up.
3. Press `F7` to toggle **visual scroll mode** — in this mode the mouse wheel also moves the visual mark line-by-line instead of scrolling the page.

| Key         | Action                                                         |
| ----------- | -------------------------------------------------------------- |
| Right-click | Place visual mark on that line                                 |
| `j` / `↓`   | Move visual mark down one line                                 |
| `k` / `↑`   | Move visual mark up one line                                   |
| `F7`        | Toggle visual scroll mode (mouse wheel drives the visual mark) |

**Ruler appearance settings** (in `prefs_user.config`):

| Setting                           | Default           | Description                                                                        |
| --------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `visual_mark_color`               | `0.0 0.0 0.0 0.1` | RGBA color of the dimming mask                                                     |
| `ruler_mode`                      | `1`               | `1` = mask above **and** below the line; `0` = mask only below                     |
| `ruler_padding`                   | `1.0`             | Vertical padding (in points) added above/below the highlighted line                |
| `ruler_x_padding`                 | `5.0`             | Horizontal padding added to the left/right of the highlighted line                 |
| `visual_mark_next_page_fraction`  | `0.75`            | Where on screen the mark sits when it triggers a page scroll (0 = top, 1 = center) |
| `visual_mark_next_page_threshold` | `0.25`            | How close to the bottom the mark must get before the page auto-scrolls             |

### Marks

| Key           | Action                                               |
| ------------- | ---------------------------------------------------- |
| `m <char>`    | Set a named mark at the current position (e.g. `ma`) |
| `` ` <char>`` | Jump to a named mark (e.g. `` `a``)                  |

### Bookmarks

| Key  | Action                                 |
| ---- | -------------------------------------- |
| `b`  | Add a bookmark at the current location |
| `db` | Delete the nearest bookmark            |
| `gb` | Open bookmarks list (current document) |
| `gB` | Open bookmarks list (all documents)    |

### Highlights

Select text with the mouse first, then press the shortcut.

| Key   | Action                                        |
| ----- | --------------------------------------------- |
| `h`   | Add a highlight (uses current highlight type) |
| `dh`  | Delete the highlight under the cursor         |
| `gh`  | Open highlights list (current document)       |
| `gH`  | Open highlights list (all documents)          |
| `gnh` | Jump to next highlight                        |
| `gNh` | Jump to previous highlight                    |

### Portals (Persistent Links)

Portals are two-way spatial links between locations — useful for jumping between a figure and the text that references it, or linking across documents.

| Key                | Action                                                             |
| ------------------ | ------------------------------------------------------------------ |
| `p`                | Enter portal creation mode (press again at destination to confirm) |
| `P` or `Shift+Tab` | Edit the nearest portal (update its destination)                   |
| `gp` or `Tab`      | Jump to the nearest portal's destination                           |
| `dp`               | Delete the nearest portal                                          |
| `F12`              | Toggle the portal helper window                                    |

### Links & Keyboard Selection

| Key      | Action                                                                           |
| -------- | -------------------------------------------------------------------------------- |
| `f`      | Enter link-follow mode — highlights all links on the page for keyboard selection |
| `F`      | Smart jump — follow the most semantically relevant link under cursor             |
| `v`      | Select text using the keyboard                                                   |
| `l`      | Open definition overview (in visual scroll mode)                                 |
| `Ctrl+]` | Go to definition                                                                 |
| `]`      | Create a portal to the definition                                                |

### Table of Contents

| Key | Action                 |
| --- | ---------------------- |
| `t` | Open table of contents |

### Miscellaneous

| Key      | Action                                                                       |
| -------- | ---------------------------------------------------------------------------- |
| `:`      | Open command palette                                                         |
| `q`      | Quit Sioyek                                                                  |
| `Ctrl+C` | Copy selected text to clipboard                                              |
| `s`      | Search selected text in external search engine (Google Scholar by default)   |
| `F1`     | Toggle PDF link highlighting                                                 |
| `F4`     | Toggle SyncTeX mode (right-click jumps to LaTeX source)                      |
| `F5`     | Toggle presentation mode (pages fit full screen, movement skips whole pages) |
| `F6`     | Toggle mouse drag mode (drag pans the view instead of selecting text)        |
| `F7`     | Toggle visual scroll mode (scroll wheel moves the visual mark line by line)  |
| `F8`     | Toggle dark mode (invert colors)                                             |
| `F11`    | Toggle fullscreen                                                            |

---

## Configuration

Sioyek stores its config files in:

| File           | Location (macOS)                                         |
| -------------- | -------------------------------------------------------- |
| `prefs.config` | `~/Library/Application Support/sioyek/prefs_user.config` |
| `keys.config`  | `~/Library/Application Support/sioyek/keys_user.config`  |

> The `_user` variants are the files you edit. The base `prefs.config` and `keys.config` inside the app bundle contain the defaults and are overridden by your `_user` files.

You can open them quickly from within Sioyek using the command palette (`:`) and searching for `open_prefs` or `open_keys`.

### Example `prefs_user.config`

```
background_color          0.15 0.15 0.15
text_highlight_color      0.9  0.9  0.2
dark_mode_contrast        0.85
search_url_g              https://www.google.com/search?q=
```

### Example `keys_user.config`

Remap any action by writing `<action_name>  <new_key>` (the base key name syntax uses `<C->` for Ctrl, `<A->` for Alt, `<S->` for Shift):

```
screen_down     j
screen_up       k
next_page       <right>
previous_page   <left>
```

See the full list of action names in the [official documentation](https://github.com/ahrm/sioyek/blob/main/pdf_viewer/keys.config).

---

## SyncTeX (LaTeX Integration)

Sioyek supports bidirectional SyncTeX. To jump from PDF → source, set your inverse-search command in `prefs.config`:

```
# For Neovim via neovim-remote:
inverse_search_command  nvr --remote-send ":e %1 | :%2<CR>"

# For VS Code:
inverse_search_command  code --goto "%1:%2"
```

Then `Ctrl+Click` on any text in the PDF to jump to the corresponding source line.

[[notes/index|↑ Back to Notes]]

---
