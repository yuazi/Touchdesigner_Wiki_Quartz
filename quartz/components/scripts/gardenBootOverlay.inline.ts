const GARDEN_BOOT_SESSION_KEY = "gardenBooted"
const GARDEN_BOOT_OVERLAY_ID = "garden-boot-overlay"
const GARDEN_BOOT_TYPE_SPEED_MS = 12
const GARDEN_BOOT_GROUP_GAP_MS = 420
const GARDEN_BOOT_FINAL_PROMPT_DELAY_MS = 700
const GARDEN_BOOT_EXIT_BG_FADE_MS = 500
const GARDEN_BOOT_CURSOR_CHAR = "\u258c"
const GARDEN_BOOT_GROUPS = [
  [
    "[lavender](y)usage BIOS v1.0[/lavender]",
    "Memory       : [accent]16384K[/accent] \u2014 OK",
    "Signal state : [accent]STRANGE ATTRACTOR[/accent]",
  ],
  [
    "Mounting nodes...",
    "Primary      : [accent]TouchDesigner.wiki[/accent]",
    "Secondary    : [accent]Notes \u00b7 Calendar \u00b7 Work[/accent]",
  ],
  [
    "Compiling wikilinks...",
    "Seeding      : [accent]BACKLINKS.SYS[/accent]",
    "Graph status : [accent]ALIVE[/accent]",
  ],
  ["[lavender]Entering (y)usage Garden...[/lavender]"],
]
const GARDEN_BOOT_PROMPT_LINE = "[dim]press any key or click to enter  [/dim]"

type GardenBootTone = "normal" | "accent" | "lavender" | "dim"

type GardenBootSegment = {
  tone: GardenBootTone
  text: string
}

function hasGardenBooted() {
  try {
    return sessionStorage.getItem(GARDEN_BOOT_SESSION_KEY) === "true"
  } catch {
    return false
  }
}

function markGardenBooted() {
  try {
    sessionStorage.setItem(GARDEN_BOOT_SESSION_KEY, "true")
  } catch {
    // Ignore storage failures and still dismiss the overlay.
  }
}

function parseGardenBootMarkup(line: string): GardenBootSegment[] {
  const pattern = /\[(accent|lavender|dim)\]([\s\S]*?)\[\/\1\]/g
  const segments: GardenBootSegment[] = []
  let cursor = 0

  for (const match of line.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > cursor) {
      segments.push({ tone: "normal", text: line.slice(cursor, start) })
    }

    segments.push({ tone: match[1] as Exclude<GardenBootTone, "normal">, text: match[2] })
    cursor = start + match[0].length
  }

  if (cursor < line.length) {
    segments.push({ tone: "normal", text: line.slice(cursor) })
  }

  return segments.filter((segment) => segment.text.length > 0)
}

function waitForGardenBoot(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted || ms <= 0) {
      resolve()
      return
    }

    const onAbort = () => {
      window.clearTimeout(timer)
      resolve()
    }

    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort)
      resolve()
    }, ms)

    signal.addEventListener("abort", onAbort, { once: true })
  })
}

async function typeGardenBootSegments(
  lineEl: HTMLElement,
  segments: GardenBootSegment[],
  signal: AbortSignal,
) {
  for (const segment of segments) {
    if (signal.aborted) {
      return
    }

    const node =
      segment.tone === "normal" ? document.createTextNode("") : document.createElement("span")

    if (node instanceof HTMLSpanElement) {
      node.className = `garden-boot-segment tone-${segment.tone}`
    }

    lineEl.appendChild(node)

    for (const char of segment.text) {
      if (signal.aborted) {
        return
      }

      node.textContent += char
      await waitForGardenBoot(GARDEN_BOOT_TYPE_SPEED_MS, signal)
    }
  }
}

async function typeGardenBootPrompt(logEl: HTMLElement, signal: AbortSignal) {
  const lineEl = document.createElement("div")
  lineEl.className = "garden-boot-line"
  logEl.appendChild(lineEl)

  await typeGardenBootSegments(lineEl, parseGardenBootMarkup(GARDEN_BOOT_PROMPT_LINE), signal)
  if (signal.aborted) {
    return
  }

  const cursor = document.createElement("span")
  cursor.className = "garden-boot-cursor"
  cursor.textContent = GARDEN_BOOT_CURSOR_CHAR
  lineEl.appendChild(cursor)
}

async function runGardenBootSequence(logEl: HTMLElement, signal: AbortSignal) {
  let previousGroup: HTMLElement | null = null

  for (let groupIndex = 0; groupIndex < GARDEN_BOOT_GROUPS.length; groupIndex += 1) {
    if (signal.aborted) {
      return
    }

    if (previousGroup) {
      previousGroup.classList.add("is-past")
    }

    const groupEl = document.createElement("div")
    groupEl.className = "garden-boot-group"
    logEl.appendChild(groupEl)

    for (const line of GARDEN_BOOT_GROUPS[groupIndex]) {
      const lineEl = document.createElement("div")
      lineEl.className = "garden-boot-line"
      groupEl.appendChild(lineEl)
      await typeGardenBootSegments(lineEl, parseGardenBootMarkup(line), signal)
    }

    previousGroup = groupEl

    if (groupIndex < GARDEN_BOOT_GROUPS.length - 1) {
      await waitForGardenBoot(GARDEN_BOOT_GROUP_GAP_MS, signal)
    }
  }

  await waitForGardenBoot(GARDEN_BOOT_FINAL_PROMPT_DELAY_MS, signal)
  await typeGardenBootPrompt(logEl, signal)
}

function initGardenBootOverlay() {
  const existingOverlay = document.getElementById(GARDEN_BOOT_OVERLAY_ID)
  if (hasGardenBooted()) {
    existingOverlay?.remove()
    return
  }

  if (!document.body) {
    return
  }

  if (existingOverlay instanceof HTMLElement && existingOverlay.dataset.bootMounted === "true") {
    return
  }

  const previousOverflow = document.body.style.overflow
  const overlay =
    existingOverlay instanceof HTMLDivElement ? existingOverlay : document.createElement("div")
  overlay.id = GARDEN_BOOT_OVERLAY_ID
  overlay.dataset.bootMounted = "true"
  overlay.removeAttribute("style")

  if (overlay.parentElement !== document.body) {
    document.body.appendChild(overlay)
  }

  const shell = document.createElement("div")
  shell.className = "garden-boot-shell"

  const log = document.createElement("div")
  log.className = "garden-boot-log"

  shell.appendChild(log)
  overlay.replaceChildren(shell)
  document.body.style.overflow = "hidden"

  const controller = new AbortController()
  let exited = false

  const exitOverlay = () => {
    if (exited) {
      return
    }

    exited = true
    controller.abort()
    markGardenBooted()
    window.removeEventListener("keydown", exitOverlay)
    overlay.removeEventListener("click", exitOverlay)
    overlay.classList.add("is-exiting")

    window.setTimeout(() => {
      document.body.style.overflow = previousOverflow
      overlay.remove()
    }, GARDEN_BOOT_EXIT_BG_FADE_MS)
  }

  window.addEventListener("keydown", exitOverlay)
  overlay.addEventListener("click", exitOverlay, { passive: true })
  runGardenBootSequence(log, controller.signal)
}

document.addEventListener("nav", initGardenBootOverlay)
initGardenBootOverlay()
