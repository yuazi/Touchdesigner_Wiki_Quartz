---
title: macOS Terminal Commands Reference
tags:
  - macos
  - cli
  - tools
date: 2026-04-19
---

A quick reference guide for essential macOS terminal commands, including built-in utilities and common shell operations.

## Navigation and File Operations

| Command | Description |
| ------- | ----------- |
| `pwd`   | Print Working Directory |
| `ls -la`| List all files with detailed info |
| `cd <dir>` | Change directory |
| `mkdir <name>` | Create a new directory |
| `touch <file>` | Create an empty file |
| `cp -r <src> <dest>` | Copy files/folders recursively |
| `mv <src> <dest>` | Move or rename files/folders |
| `rm -rf <path>` | Force remove files/folders (use with caution!) |

## macOS Specific Commands

| Command | Description |
| ------- | ----------- |
| `open <path>` | Open a file, directory, or URL with the default app |
| `open .` | Open the current directory in Finder |
| `pbcopy < file` | Copy file content to clipboard |
| `pbpaste > file` | Paste clipboard content to a file |
| `sw_vers` | Show macOS version information |
| `system_profiler` | Detailed system hardware/software information |
| `diskutil list` | List all disks and partitions |
| `mdfind <query>` | Search files using Spotlight from the terminal |
| `caffeinate` | Prevent macOS from sleeping |
| `screencapture -c` | Take a screenshot to the clipboard |

## Permissions and Ownership

| Command | Description |
| ------- | ----------- |
| `chmod 755 <file>` | Change file permissions |
| `chown <user>:<group> <file>` | Change file owner and group |
| `sudo <command>` | Execute a command with superuser privileges |

## Process Management

| Command | Description |
| ------- | ----------- |
| `top` | Monitor real-time system processes |
| `ps aux` | List all running processes |
| `kill <PID>` | Terminate a process by ID |
| `killall <name>` | Terminate all processes with a specific name |

## Network Utilities

| Command | Description |
| ------- | ----------- |
| `ping <host>` | Check network connectivity |
| `curl -O <url>` | Download a file via CLI |
| `ifconfig` | View network interface configuration |
| `ipconfig getifaddr en0` | Get local IP address for Wi-Fi |
| `dig <domain>` | DNS lookup utility |

---
[[notes/index|(y) Return to Notes]] | [[notes/tools/index|(y) Return to CLI & Tools]] | [[/index|(y) Return to Home]]
