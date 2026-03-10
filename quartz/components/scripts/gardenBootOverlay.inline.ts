import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import {
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceRadial,
  forceSimulation,
} from "d3"
import { FullSlug, SimpleSlug, simplifySlug } from "../../util/path"

const GARDEN_BOOT_SESSION_KEY = "gardenBooted"
const GARDEN_BOOT_OVERLAY_ID = "garden-boot-overlay"
const GARDEN_BOOT_GRAPH_STAGE_COUNT = 4
const GARDEN_BOOT_GRAPH_ROTATION_DEG_PER_MS = 0.0012
const GARDEN_BOOT_TYPE_SPEED_MS = 12
const GARDEN_BOOT_GROUP_GAP_MS = 420
const GARDEN_BOOT_FINAL_PROMPT_DELAY_MS = 700
const GARDEN_BOOT_EXIT_BG_FADE_MS = 500
const GARDEN_BOOT_CURSOR_CHAR = "\u258c"
const GARDEN_BOOT_SVG_NS = "http://www.w3.org/2000/svg"
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

type GardenBootGraphNode = {
  id: SimpleSlug
  isTag: boolean
  degree: number
  radius: number
  stage: number
  halo: boolean
} & SimulationNodeDatum

type GardenBootGraphLink = {
  source: GardenBootGraphNode
  target: GardenBootGraphNode
  sourceId: SimpleSlug
  targetId: SimpleSlug
  isTagLink: boolean
  stage: number
} & SimulationLinkDatum<GardenBootGraphNode>

type GardenBootGraphNodeRecord = {
  data: GardenBootGraphNode
  translate: SVGGElement
  wrap: SVGGElement
  halo: SVGCircleElement
  renderX: number
  renderY: number
  reveal: number
  targetReveal: number
  phase: number
  driftRadius: number
  driftSpeed: number
}

type GardenBootGraphEdgeRecord = {
  data: GardenBootGraphLink
  line: SVGLineElement
  source: GardenBootGraphNodeRecord
  target: GardenBootGraphNodeRecord
  reveal: number
  targetReveal: number
  phase: number
  pulseSpeed: number
}

type GardenBootGraphState = {
  layer: HTMLDivElement
  currentStage: number
  nodeRecords: GardenBootGraphNodeRecord[]
  edgeRecords: GardenBootGraphEdgeRecord[]
  simulation?: Simulation<GardenBootGraphNode, GardenBootGraphLink>
  stop: () => void
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let t = Math.imul(state ^ (state >>> 15), state | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createGardenBootSvgEl<K extends keyof SVGElementTagNameMap>(
  tagName: K,
): SVGElementTagNameMap[K] {
  return document.createElementNS(GARDEN_BOOT_SVG_NS, tagName)
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

async function buildGardenBootGraphData() {
  const data = new Map<SimpleSlug, ContentDetails>(
    Object.entries<ContentDetails>(await fetchData).map(([slug, details]) => [
      simplifySlug(slug as FullSlug),
      details,
    ]),
  )

  const nodes = new Map<SimpleSlug, GardenBootGraphNode>()
  const rawLinks: Array<{ sourceId: SimpleSlug; targetId: SimpleSlug; isTagLink: boolean }> = []
  const rawLinkKeys = new Set<string>()

  for (const [pageId] of data) {
    nodes.set(pageId, {
      id: pageId,
      isTag: false,
      degree: 0,
      radius: 0,
      stage: GARDEN_BOOT_GRAPH_STAGE_COUNT,
      halo: false,
    })
  }

  for (const [pageId, details] of data) {
    for (const outgoingLink of details.links ?? []) {
      const targetId = outgoingLink
      if (!data.has(targetId)) {
        continue
      }

      const key = pageId < targetId ? `${pageId}::${targetId}` : `${targetId}::${pageId}`
      if (rawLinkKeys.has(key)) {
        continue
      }

      rawLinkKeys.add(key)
      rawLinks.push({ sourceId: pageId, targetId, isTagLink: false })
    }

    for (const tag of details.tags ?? []) {
      const tagId = simplifySlug(`tags/${tag}` as FullSlug)
      if (!nodes.has(tagId)) {
        nodes.set(tagId, {
          id: tagId,
          isTag: true,
          degree: 0,
          radius: 0,
          stage: GARDEN_BOOT_GRAPH_STAGE_COUNT,
          halo: false,
        })
      }

      const key = pageId < tagId ? `${pageId}::${tagId}` : `${tagId}::${pageId}`
      if (rawLinkKeys.has(key)) {
        continue
      }

      rawLinkKeys.add(key)
      rawLinks.push({ sourceId: pageId, targetId: tagId, isTagLink: true })
    }
  }

  for (const { sourceId, targetId } of rawLinks) {
    nodes.get(sourceId)!.degree += 1
    nodes.get(targetId)!.degree += 1
  }

  const sortedNodes = [...nodes.values()].sort((nodeA, nodeB) => {
    const weightA = nodeA.degree + (nodeA.isTag ? 0.75 : 0)
    const weightB = nodeB.degree + (nodeB.isTag ? 0.75 : 0)
    return weightB - weightA
  })

  sortedNodes.forEach((node, index) => {
    const rank = index / Math.max(sortedNodes.length - 1, 1)
    let stage = GARDEN_BOOT_GRAPH_STAGE_COUNT
    if (rank <= 0.08) {
      stage = 0
    } else if (rank <= 0.26) {
      stage = 1
    } else if (rank <= 0.55) {
      stage = 2
    } else if (rank <= 0.82) {
      stage = 3
    }

    node.stage = stage
    node.radius = node.isTag
      ? 2.8 + Math.sqrt(node.degree) * 0.45
      : 2.4 + Math.sqrt(node.degree) * 0.78
    node.halo = !node.isTag && (stage <= 1 || node.degree >= 7)
  })

  const links: GardenBootGraphLink[] = rawLinks.map(({ sourceId, targetId, isTagLink }) => {
    const source = nodes.get(sourceId)!
    const target = nodes.get(targetId)!
    return {
      sourceId,
      targetId,
      source,
      target,
      isTagLink,
      stage: Math.max(source.stage, target.stage),
    }
  })

  return {
    nodes: [...nodes.values()],
    links,
  }
}

function createGardenBootGraphLayer(): GardenBootGraphState {
  const layer = document.createElement("div")
  layer.className = "garden-boot-graph-layer"

  return {
    layer,
    currentStage: -1,
    nodeRecords: [],
    edgeRecords: [],
    stop() {},
  }
}

function syncGardenBootGraphStage(graphState: GardenBootGraphState, reheat = false) {
  const stage = clamp(graphState.currentStage, 0, GARDEN_BOOT_GRAPH_STAGE_COUNT)
  graphState.nodeRecords.forEach((record) => {
    record.targetReveal = record.data.stage <= stage ? 1 : 0
  })
  graphState.edgeRecords.forEach((record) => {
    record.targetReveal = record.data.stage <= stage ? 1 : 0
  })

  if (reheat && graphState.simulation) {
    graphState.simulation.alpha(0.48).restart()
  }
}

function setGardenBootGraphStage(graphState: GardenBootGraphState, stage: number) {
  const nextStage = clamp(stage, 0, GARDEN_BOOT_GRAPH_STAGE_COUNT)
  const changed = graphState.currentStage !== nextStage
  graphState.currentStage = nextStage
  graphState.layer.dataset.stage = String(nextStage)

  if (graphState.nodeRecords.length === 0) {
    return
  }

  syncGardenBootGraphStage(graphState, changed)
}

async function hydrateGardenBootGraphLayer(graphState: GardenBootGraphState, signal: AbortSignal) {
  const { nodes, links } = await buildGardenBootGraphData()
  if (signal.aborted) {
    return
  }

  let width = window.innerWidth
  let height = window.innerHeight
  const random = createSeededRandom(43)

  for (const node of nodes) {
    node.x = width / 2 + (random() - 0.5) * 40
    node.y = height / 2 + (random() - 0.5) * 40
    node.vx = (random() - 0.5) * 0.2
    node.vy = (random() - 0.5) * 0.2
  }

  const svg = createGardenBootSvgEl("svg")
  svg.classList.add("garden-boot-graph")
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice")
  svg.setAttribute("aria-hidden", "true")

  const sceneGroup = createGardenBootSvgEl("g")
  const edgeGroup = createGardenBootSvgEl("g")
  const nodeGroup = createGardenBootSvgEl("g")
  sceneGroup.append(edgeGroup, nodeGroup)
  svg.append(sceneGroup)
  graphState.layer.replaceChildren(svg)

  const nodeRecordById = new Map<SimpleSlug, GardenBootGraphNodeRecord>()

  for (const node of nodes) {
    const translate = createGardenBootSvgEl("g")
    translate.setAttribute(
      "transform",
      `translate(${(node.x ?? width / 2).toFixed(2)} ${(node.y ?? height / 2).toFixed(2)})`,
    )

    const wrap = createGardenBootSvgEl("g")
    wrap.classList.add("garden-boot-graph-node-wrap")
    wrap.setAttribute("transform", "scale(0.34)")

    if (node.halo) {
      wrap.classList.add("is-core")
    }

    const halo = createGardenBootSvgEl("circle")
    halo.classList.add("garden-boot-graph-halo")
    halo.setAttribute("cx", "0")
    halo.setAttribute("cy", "0")
    halo.setAttribute("r", (node.radius * 2.35).toFixed(2))
    wrap.appendChild(halo)

    const circle = createGardenBootSvgEl("circle")
    circle.classList.add("garden-boot-graph-node")
    circle.setAttribute("cx", "0")
    circle.setAttribute("cy", "0")
    circle.setAttribute("r", node.radius.toFixed(2))

    if (node.isTag) {
      circle.classList.add("is-ring")
    } else if (node.halo) {
      circle.classList.add("is-hub")
    } else if (node.degree <= 1) {
      circle.classList.add("is-muted")
    } else {
      circle.classList.add("is-accent")
    }

    wrap.appendChild(circle)
    translate.appendChild(wrap)
    nodeGroup.appendChild(translate)

    const record: GardenBootGraphNodeRecord = {
      data: node,
      translate,
      wrap,
      halo,
      renderX: node.x ?? width / 2,
      renderY: node.y ?? height / 2,
      reveal: 0,
      targetReveal: 0,
      phase: random() * Math.PI * 2,
      driftRadius: node.isTag ? 0.5 + random() * 0.9 : 1.1 + random() * 1.6,
      driftSpeed: 0.0002 + random() * 0.00018,
    }

    graphState.nodeRecords.push(record)
    nodeRecordById.set(node.id, record)
  }

  for (const link of links) {
    const line = createGardenBootSvgEl("line")
    line.classList.add("garden-boot-graph-edge")

    if (link.isTagLink) {
      line.classList.add("is-tag-link")
    }

    line.setAttribute("stroke-width", link.isTagLink ? "0.8" : "1.05")
    edgeGroup.appendChild(line)

    graphState.edgeRecords.push({
      data: link,
      line,
      source: nodeRecordById.get(link.sourceId)!,
      target: nodeRecordById.get(link.targetId)!,
      reveal: 0,
      targetReveal: 0,
      phase: random() * Math.PI * 2,
      pulseSpeed: 0.001 + random() * 0.0008,
    })
  }

  const simulation = forceSimulation(nodes)
    .force(
      "charge",
      forceManyBody<GardenBootGraphNode>().strength((node) =>
        node.isTag ? -42 - node.degree * 0.65 : -78 - node.degree * 1.45,
      ),
    )
    .force(
      "link",
      forceLink<GardenBootGraphNode, GardenBootGraphLink>(links)
        .id((node) => node.id)
        .distance((link) => (link.isTagLink ? 24 : 36))
        .strength((link) => (link.isTagLink ? 0.18 : 0.09)),
    )
    .force("center", forceCenter(width / 2, height / 2))
    .force(
      "collide",
      forceCollide<GardenBootGraphNode>()
        .radius((node) => node.radius + 2)
        .iterations(2),
    )
    .force(
      "radial",
      forceRadial(Math.min(width, height) * 0.24, width / 2, height / 2).strength(0.032),
    )
    .alpha(1)
    .alphaDecay(0.03)
    .alphaTarget(0.03)
    .velocityDecay(0.28)

  graphState.simulation = simulation

  const handleResize = () => {
    width = window.innerWidth
    height = window.innerHeight
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    simulation.force("center", forceCenter(width / 2, height / 2))
    simulation.force(
      "radial",
      forceRadial(Math.min(width, height) * 0.24, width / 2, height / 2).strength(0.032),
    )
    simulation.alpha(0.32).restart()
  }

  let active = true
  let frameId = 0

  const renderFrame = (time: number) => {
    if (!active) {
      return
    }

    const simulationAlpha = simulation.alpha()
    const rotation = time * GARDEN_BOOT_GRAPH_ROTATION_DEG_PER_MS
    sceneGroup.setAttribute(
      "transform",
      `rotate(${rotation.toFixed(3)} ${(width / 2).toFixed(2)} ${(height / 2).toFixed(2)})`,
    )

    for (const record of graphState.nodeRecords) {
      record.reveal += (record.targetReveal - record.reveal) * 0.09

      const driftWeight = 0.35 + (1 - Math.min(simulationAlpha, 0.15) / 0.15) * 0.65
      const ambientX =
        Math.cos(time * record.driftSpeed + record.phase) *
        record.driftRadius *
        record.reveal *
        driftWeight
      const ambientY =
        Math.sin(time * record.driftSpeed * 0.88 + record.phase * 1.14) *
        record.driftRadius *
        record.reveal *
        driftWeight
      const x = (record.data.x ?? width / 2) + ambientX
      const y = (record.data.y ?? height / 2) + ambientY
      const scale = 0.36 + record.reveal * 0.64

      record.renderX = x
      record.renderY = y
      record.translate.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
      record.wrap.setAttribute("transform", `scale(${scale.toFixed(3)})`)
      record.wrap.style.opacity = record.reveal.toFixed(3)

      if (record.data.halo) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.0011 + record.phase)
        const haloScale = 0.9 + pulse * 0.42 + (1 - record.reveal) * 0.38
        const haloOpacity = record.reveal * 0.24 * (0.78 + pulse * 0.46)
        record.halo.setAttribute("transform", `scale(${haloScale.toFixed(3)})`)
        record.halo.style.opacity = haloOpacity.toFixed(3)
      } else {
        record.halo.style.opacity = "0"
      }
    }

    for (const record of graphState.edgeRecords) {
      const visibilityTarget = Math.min(
        record.targetReveal,
        record.source.reveal,
        record.target.reveal,
      )
      record.reveal += (visibilityTarget - record.reveal) * 0.095

      const startX = record.source.renderX
      const startY = record.source.renderY
      const endX = record.target.renderX
      const endY = record.target.renderY
      const reach = 0.08 + record.reveal * 0.92
      const drawX = lerp(startX, endX, reach)
      const drawY = lerp(startY, endY, reach)
      const pulse = 0.5 + 0.5 * Math.sin(time * record.pulseSpeed + record.phase)

      record.line.setAttribute("x1", startX.toFixed(2))
      record.line.setAttribute("y1", startY.toFixed(2))
      record.line.setAttribute("x2", drawX.toFixed(2))
      record.line.setAttribute("y2", drawY.toFixed(2))
      record.line.style.opacity = record.reveal.toFixed(3)
      record.line.style.strokeOpacity = (
        record.reveal *
        (record.data.isTagLink ? 0.42 : 0.56) *
        (0.8 + pulse * 0.42)
      ).toFixed(3)
    }

    frameId = window.requestAnimationFrame(renderFrame)
  }

  frameId = window.requestAnimationFrame(renderFrame)
  window.addEventListener("resize", handleResize)

  graphState.stop = () => {
    active = false
    window.cancelAnimationFrame(frameId)
    window.removeEventListener("resize", handleResize)
    simulation.stop()
  }

  syncGardenBootGraphStage(graphState, false)
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

async function runGardenBootSequence(
  logEl: HTMLElement,
  graphState: GardenBootGraphState,
  signal: AbortSignal,
) {
  let previousGroup: HTMLElement | null = null
  setGardenBootGraphStage(graphState, 0)

  for (let groupIndex = 0; groupIndex < GARDEN_BOOT_GROUPS.length; groupIndex += 1) {
    if (signal.aborted) {
      return
    }

    setGardenBootGraphStage(graphState, groupIndex + 1)

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
  setGardenBootGraphStage(graphState, GARDEN_BOOT_GRAPH_STAGE_COUNT)
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

  const graphState = createGardenBootGraphLayer()
  const shell = document.createElement("div")
  shell.className = "garden-boot-shell"

  const log = document.createElement("div")
  log.className = "garden-boot-log"

  shell.appendChild(log)
  overlay.replaceChildren(graphState.layer, shell)
  document.body.style.overflow = "hidden"

  const controller = new AbortController()
  let exited = false

  void hydrateGardenBootGraphLayer(graphState, controller.signal)

  const exitOverlay = () => {
    if (exited) {
      return
    }

    exited = true
    controller.abort()
    graphState.stop()
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
  runGardenBootSequence(log, graphState, controller.signal)
}

document.addEventListener("nav", initGardenBootOverlay)
initGardenBootOverlay()
