import { Delaunay } from "d3"

const CFG = {
  SESSION_KEY: "gardenBooted",
  OVERLAY_ID: "garden-boot-overlay",
  RESTART_SELECTOR: "[data-gb-restart]",
  STAGE_COUNT: 4,
  TYPE_SPEED_MS: 12,
  GROUP_GAP_MS: 420,
  FINAL_PROMPT_DELAY_MS: 700,
  EXIT_BG_FADE_MS: 500,
  CURSOR_CHAR: "\u258c",
  SVG_NS: "http://www.w3.org/2000/svg",
  WARMUP_STEPS: 5000,
  SIM_STEPS_PER_FRAME: 1,
  ROTATION_SPEED: 0.000035,
  SIM_DT_SCALE: 0.50,
  MAIN_ROT_X: 0.6,
  MAIN_CZ_OFFSET: 25,
  HUD_ROW_COUNT: 44,
  HUD_SAMPLE_INTERVAL_MS: 110,
  TRAIL_HISTORY_LENGTH: 2000,
  OVERLAY_MIN_PARTICLES: 25,
  MESH_DISTANCE_THRESHOLD: 500,
  TRACKER_REVEAL_THRESHOLD: 0.14,
  SCREEN_SCALE_MIN: 16,
  SCREEN_SCALE_MAX: 40,
  TRAIL_POINT_BASE: 168,
  TRAIL_POINT_RANGE: 456,
  SCALE_DIV_MOBILE: 39,
  SCALE_DIV_DESKTOP: 47,
  CENTER_X_MOBILE: 0.54,
  CENTER_X_DESKTOP: 0.56,
  READABILITY_MIN: 0.78,
  READABILITY_RADIUS_X: 0.14,
  READABILITY_RADIUS_Y: 0.11,
  KEYPOINT_GREEN: "#8fd6c3",
  KEYPOINT_GREEN_GLOW: "rgba(143, 214, 195, 0.58)",
  KEYPOINT_PURPLE: "#b39adf",
  KEYPOINT_PURPLE_GLOW: "rgba(179, 154, 223, 0.56)",
} as const

const BOOT_GROUPS = [
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

const PROMPT_LINE = "[dim]press any key or click to enter  [/dim]"

const LORENZ_DEFAULTS = { sigma: 10, rho: 28, beta: 8 / 3, dt: 0.005, particles: 12 }

const PALETTE = [
  {
    core: "rgba(126, 180, 156, 0.82)",
    glow: "rgba(74, 109, 95, 0.12)",
    trail: "rgba(112, 165, 145, 0.18)",
    ring: "rgba(166, 210, 193, 0.42)",
  },
  {
    core: "rgba(164, 146, 198, 0.8)",
    glow: "rgba(99, 84, 129, 0.11)",
    trail: "rgba(132, 118, 168, 0.17)",
    ring: "rgba(191, 179, 221, 0.4)",
  },
  {
    core: "rgba(142, 164, 198, 0.76)",
    glow: "rgba(86, 103, 129, 0.1)",
    trail: "rgba(112, 132, 167, 0.16)",
    ring: "rgba(173, 190, 221, 0.38)",
  },
]

const GB = {
  layer: "gb-layer",
  fx: "gb-fx",
  meshLineLayer: "gb-mesh-lines",
  meshKeypointGlowLayer: "gb-mesh-keypoint-glows",
  meshKeypointLayer: "gb-mesh-keypoints",
  meshLine: "gb-mesh-line",
  meshKeypointGlow: "gb-mesh-keypoint-glow",
  meshKeypoint: "gb-mesh-keypoint",
  track: "gb-track",
  trackTrail: "gb-track-trail",
  trackGlow: "gb-track-glow",
  trackBox: "gb-track-box",
  trackRing: "gb-track-ring",
  trackCore: "gb-track-core",
  hud: "gb-hud",
  hudTitle: "gb-hud-title",
  hudLog: "gb-hud-log",
  hudRow: "gb-hud-row",
  shell: "gb-shell",
  log: "gb-log",
  group: "gb-group",
  line: "gb-line",
  seg: "gb-seg",
  cursor: "gb-cursor",
} as const

type Tone = "normal" | "accent" | "lavender" | "dim"
type Segment = { tone: Tone; text: string }
type Particle = {
  stage: number
  colorIndex: number
  important: boolean
  label: string | null
  x: number
  y: number
  z: number
  trail: Array<{ x: number; y: number; z: number }>
}
type LorenzParams = { sigma: number; rho: number; beta: number; dt: number; particles: number }
type TrackerRecord = {
  particle: Particle
  tracker: SVGGElement
  trail: SVGPolylineElement
  glow: SVGCircleElement
  box: SVGRectElement
  ring: SVGCircleElement
  core: SVGCircleElement
  screenX: number
  screenY: number
  screenZ: number
  screenScale: number
  reveal: number
  targetReveal: number
  pulsePhase: number
}
type TrackerState = {
  layer: HTMLDivElement
  hud: HTMLDivElement
  hudRows: HTMLDivElement[]
  currentStage: number
  trackers: TrackerRecord[]
  stop: () => void
}
type MeshPoint = {
  x: number
  y: number
  reveal: number
  readability: number
  fill: string
  glow: string
}
type MeshEdge = { start: MeshPoint; end: MeshPoint; distance: number }

const hasGardenBooted = () => {
  try {
    return sessionStorage.getItem(CFG.SESSION_KEY) === "true"
  } catch {
    return false
  }
}
const markGardenBooted = () => {
  try {
    sessionStorage.setItem(CFG.SESSION_KEY, "true")
  } catch {}
}
const clearGardenBooted = () => {
  try {
    sessionStorage.removeItem(CFG.SESSION_KEY)
  } catch {}
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

function readStoredNumber(key: string, fallback: number) {
  const v = parseFloat(localStorage.getItem(key) ?? "")
  return Number.isFinite(v) ? v : fallback
}

function readStoredInt(key: string, fallback: number) {
  const v = parseInt(localStorage.getItem(key) ?? "", 10)
  return Number.isFinite(v) ? v : fallback
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

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(CFG.SVG_NS, tag) as SVGElementTagNameMap[K]
}

function newParticle(offset = 0): Particle {
  return {
    stage: 0,
    colorIndex: 0,
    important: false,
    label: null,
    x: 0.1 + offset * 0.3,
    y: 0.1 + offset * 0.2,
    z: 0.1 + offset * 0.4,
    trail: [],
  }
}

function parseMarkup(line: string): Segment[] {
  const pattern = /\[(accent|lavender|dim)\]([\s\S]*?)\[\/\1\]/g
  const segments: Segment[] = []
  let cursor = 0
  for (const match of line.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > cursor) segments.push({ tone: "normal", text: line.slice(cursor, start) })
    segments.push({ tone: match[1] as Exclude<Tone, "normal">, text: match[2] })
    cursor = start + match[0].length
  }
  if (cursor < line.length) segments.push({ tone: "normal", text: line.slice(cursor) })
  return segments.filter((s) => s.text.length > 0)
}

function waitMs(ms: number, signal: AbortSignal) {
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

const formatRatio = (v: number) => clamp(v, 0, 0.999).toFixed(2)

const normalizeReveal = (reveal: number) =>
  clamp((reveal - CFG.TRACKER_REVEAL_THRESHOLD) / (1 - CFG.TRACKER_REVEAL_THRESHOLD), 0, 1)

const normalizeScale = (size: number) =>
  clamp((size - CFG.SCREEN_SCALE_MIN) / (CFG.SCREEN_SCALE_MAX - CFG.SCREEN_SCALE_MIN), 0, 0.999)

function readability(x: number, y: number, width: number, height: number) {
  const rx = Math.max(180, width * CFG.READABILITY_RADIUS_X)
  const ry = Math.max(110, height * CFG.READABILITY_RADIUS_Y)
  const dx = (x - width * 0.5) / rx
  const dy = (y - height * 0.5) / ry
  const d = Math.sqrt(dx * dx + dy * dy)
  return d >= 1 ? 1 : CFG.READABILITY_MIN + (1 - CFG.READABILITY_MIN) * Math.pow(d, 1.35)
}

function pushEdge(
  points: MeshPoint[],
  edges: MeshEdge[],
  seen: Set<string>,
  i: number,
  j: number,
  maxDSq: number,
) {
  if (i === j) return
  const a = Math.min(i, j),
    b = Math.max(i, j)
  const key = `${a}:${b}`
  if (seen.has(key)) return
  const start = points[a],
    end = points[b]
  const dx = end.x - start.x,
    dy = end.y - start.y
  const dSq = dx * dx + dy * dy
  if (dSq > maxDSq) return
  seen.add(key)
  edges.push({ start, end, distance: Math.sqrt(dSq) })
}

function buildEdges(points: MeshPoint[]) {
  if (points.length < 2) return []
  const maxDSq = CFG.MESH_DISTANCE_THRESHOLD * CFG.MESH_DISTANCE_THRESHOLD
  const edges: MeshEdge[] = []
  const seen = new Set<string>()
  if (points.length === 2) {
    pushEdge(points, edges, seen, 0, 1, maxDSq)
    return edges
  }

  const delaunay = Delaunay.from(
    points,
    (p) => p.x,
    (p) => p.y,
  )
  const { triangles } = delaunay

  if (triangles.length === 0) {
    for (let i = 0; i < points.length; i++)
      for (let j = i + 1; j < points.length; j++) pushEdge(points, edges, seen, i, j, maxDSq)
    return edges
  }

  for (let i = 0; i < triangles.length; i += 3) {
    const [a, b, c] = [triangles[i], triangles[i + 1], triangles[i + 2]]
    pushEdge(points, edges, seen, a, b, maxDSq)
    pushEdge(points, edges, seen, b, c, maxDSq)
    pushEdge(points, edges, seen, c, a, maxDSq)
  }

  return edges
}

const particleStage = (index: number, total: number) =>
  total <= 0 ? 1 : 1 + Math.min(CFG.STAGE_COUNT - 1, Math.floor((index * CFG.STAGE_COUNT) / total))

function stepLorenz(p: Particle, params: LorenzParams, recordTrail = true) {
  const dx = params.sigma * (p.y - p.x)
  const dy = p.x * (params.rho - p.z) - p.y
  const dz = p.x * p.y - params.beta * p.z
  if (recordTrail) {
    p.trail.push({ x: p.x, y: p.y, z: p.z })
    if (p.trail.length > CFG.TRAIL_HISTORY_LENGTH) p.trail.shift()
  }
  const dt = params.dt * CFG.SIM_DT_SCALE
  p.x += dx * dt
  p.y += dy * dt
  p.z += dz * dt
}

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  scale: number,
  rotX: number,
  rotZ: number,
  czOffset: number,
): [number, number] {
  const cosZ = Math.cos(rotZ),
    sinZ = Math.sin(rotZ)
  const cosX = Math.cos(rotX),
    sinX = Math.sin(rotX)
  const rx = x * cosZ - y * sinZ
  const ry = x * sinZ + y * cosZ
  return [cx + rx * scale, cy + (ry * cosX - (z - czOffset) * sinX) * scale]
}

function createTrackerState(): TrackerState {
  const layer = document.createElement("div")
  layer.className = GB.layer
  const hud = document.createElement("div")
  hud.className = GB.hud
  const hudTitle = document.createElement("div")
  hudTitle.className = GB.hudTitle
  hudTitle.textContent = "tracking data"
  hud.appendChild(hudTitle)
  const hudLog = document.createElement("div")
  hudLog.className = GB.hudLog
  hud.appendChild(hudLog)
  const hudRows = Array.from({ length: CFG.HUD_ROW_COUNT }, (_, i) => {
    const row = document.createElement("div")
    row.className = GB.hudRow
    row.style.opacity = `${Math.max(0.1, 1 - i * 0.018)}`
    hudLog.appendChild(row)
    return row
  })
  return { layer, hud, hudRows, currentStage: -1, trackers: [], stop() {} }
}

function syncStage(state: TrackerState) {
  const stage = clamp(state.currentStage, 0, CFG.STAGE_COUNT)
  for (const r of state.trackers) r.targetReveal = r.particle.stage <= stage ? 1 : 0
}

function setStage(state: TrackerState, stage: number) {
  state.currentStage = clamp(stage, 0, CFG.STAGE_COUNT)
  state.layer.dataset.stage = String(state.currentStage)
  state.hud.dataset.stage = String(state.currentStage)
  if (state.trackers.length > 0) syncStage(state)
}

function pushHudSample(state: TrackerState, record: TrackerRecord, sampleIndex: number) {
  const confidence = Math.round(
    4 + (0.5 + 0.5 * Math.sin(record.pulsePhase + performance.now() * 0.001)) * 6,
  )
  const elapsed = sampleIndex * CFG.HUD_SAMPLE_INTERVAL_MS
  const s = String(Math.floor(elapsed / 1000) % 100).padStart(2, "0")
  const ms = String(elapsed % 1000).padStart(3, "0")
  const line = `${record.particle.label ?? "ID:0000"}  X:${formatRatio(record.screenX)}  Y:${formatRatio(record.screenY)}  Z:${formatRatio(record.screenZ)}  S:${formatRatio(record.screenScale)}  T:${s}:${ms}  CONF:${confidence.toString().padStart(2, "0")}`
  for (let i = state.hudRows.length - 1; i > 0; i--)
    state.hudRows[i].textContent = state.hudRows[i - 1].textContent
  state.hudRows[0].textContent = line
}

async function hydrateTracker(state: TrackerState, signal: AbortSignal) {
  const lorenzParams: LorenzParams = {
    sigma: readStoredNumber("lorenz.sigma", LORENZ_DEFAULTS.sigma),
    rho: readStoredNumber("lorenz.rho", LORENZ_DEFAULTS.rho),
    beta: readStoredNumber("lorenz.beta", LORENZ_DEFAULTS.beta),
    dt: readStoredNumber("lorenz.dt", LORENZ_DEFAULTS.dt),
    particles: Math.max(
      CFG.OVERLAY_MIN_PARTICLES,
      readStoredInt("lorenz.particles", LORENZ_DEFAULTS.particles),
    ),
  }
  const random = createSeededRandom(29)
  const importantIds = [3791, 5898, 7460, 8847]
  const mainParticles = Array.from({ length: lorenzParams.particles }, (_, i) => {
    const p = newParticle(i)
    p.stage = particleStage(i, lorenzParams.particles)
    p.colorIndex = i
    p.important = i < importantIds.length
    p.label = p.important ? `CL:${String(importantIds[i]).padStart(4, "0")}` : null
    return p
  })

  for (let i = 0; i < CFG.WARMUP_STEPS; i++) {
    for (const p of mainParticles) stepLorenz(p, lorenzParams, false)
  }

  if (signal.aborted) return

  const svg = svgEl("svg")
  svg.classList.add(GB.fx)
  svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`)
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice")
  svg.setAttribute("aria-hidden", "true")

  const meshLineGroup = svgEl("g")
  meshLineGroup.classList.add(GB.meshLineLayer)
  const meshGlowGroup = svgEl("g")
  meshGlowGroup.classList.add(GB.meshKeypointGlowLayer)
  const meshPointGroup = svgEl("g")
  meshPointGroup.classList.add(GB.meshKeypointLayer)
  const trackerGroup = svgEl("g")
  svg.append(meshLineGroup, trackerGroup, meshGlowGroup, meshPointGroup)
  state.layer.replaceChildren(svg)

  const linePool = Array.from({ length: Math.max(0, mainParticles.length * 3) }, () => {
    const el = svgEl("line")
    el.classList.add(GB.meshLine)
    meshLineGroup.appendChild(el)
    return el
  })
  const glowPool = Array.from({ length: mainParticles.length }, () => {
    const el = svgEl("circle")
    el.classList.add(GB.meshKeypointGlow)
    meshGlowGroup.appendChild(el)
    return el
  })
  const pointPool = Array.from({ length: mainParticles.length }, () => {
    const el = svgEl("circle")
    el.classList.add(GB.meshKeypoint)
    meshPointGroup.appendChild(el)
    return el
  })

  for (const p of mainParticles) {
    const pal = PALETTE[p.colorIndex % PALETTE.length]
    const tracker = svgEl("g")
    tracker.classList.add(GB.track)
    tracker.style.setProperty("--tracker-core", pal.core)
    tracker.style.setProperty("--tracker-glow", pal.glow)
    tracker.style.setProperty("--tracker-trail", pal.trail)
    tracker.style.setProperty("--tracker-ring", pal.ring)
    const trail = svgEl("polyline")
    trail.classList.add(GB.trackTrail)
    const glow = svgEl("circle")
    glow.classList.add(GB.trackGlow)
    const box = svgEl("rect")
    box.classList.add(GB.trackBox)
    const ring = svgEl("circle")
    ring.classList.add(GB.trackRing)
    const core = svgEl("circle")
    core.classList.add(GB.trackCore)
    tracker.append(trail, glow, box, ring, core)
    trackerGroup.appendChild(tracker)
    state.trackers.push({
      particle: p,
      tracker,
      trail,
      glow,
      box,
      ring,
      core,
      screenX: 0.5,
      screenY: 0.5,
      screenZ: 0.5,
      screenScale: 0,
      reveal: 0,
      targetReveal: 0,
      pulsePhase: random() * Math.PI * 2,
    })
  }

  syncStage(state)

  let width = window.innerWidth,
    height = window.innerHeight,
    rotZ = -0.72
  let frameId = 0,
    active = true,
    lastFrameTime = performance.now()
  let lastHudTime = 0,
    hudIdx = 0

  const handleResize = () => {
    width = window.innerWidth
    height = window.innerHeight
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  }

  const renderFrame = (time: number) => {
    if (!active) return
    const deltaMs = Math.min(32, Math.max(10, time - lastFrameTime || 16.667))
    const fs = deltaMs / 16.667
    lastFrameTime = time

    const scale =
      Math.min(width, height) / (width < 900 ? CFG.SCALE_DIV_MOBILE : CFG.SCALE_DIV_DESKTOP)
    const cx = width < 900 ? width * CFG.CENTER_X_MOBILE : width * CFG.CENTER_X_DESKTOP
    const cy = height * 0.555
    const stageFactor = (state.currentStage + 1) / (CFG.STAGE_COUNT + 1)
    const meshPts: MeshPoint[] = []

    rotZ += CFG.ROTATION_SPEED * fs
    for (let step = 0; step < Math.max(1, Math.round(CFG.SIM_STEPS_PER_FRAME * fs)); step++)
      mainParticles.forEach((p) => stepLorenz(p, lorenzParams))

    for (const r of state.trackers) {
      r.reveal += (r.targetReveal - r.reveal) * 0.08

      const [px, py] = project(
        r.particle.x,
        r.particle.y,
        r.particle.z,
        cx,
        cy,
        scale,
        CFG.MAIN_ROT_X,
        rotZ,
        CFG.MAIN_CZ_OFFSET,
      )
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.00075 + r.pulsePhase)
      const baseR = (r.particle.important ? 5.8 : 4.1) * (0.96 + pulse * 0.12)
      const coreR = baseR * (r.particle.important ? 0.74 : 0.6)
      const ringR = baseR * (r.particle.important ? 1.75 : 1.28)
      const glowR = baseR * (r.particle.important ? 3.2 : 2.35)
      const trailW = r.particle.important ? 1.15 : 0.88
      const trailLimit = Math.round(CFG.TRAIL_POINT_BASE + stageFactor * CFG.TRAIL_POINT_RANGE)
      const visTail = r.particle.trail.slice(-trailLimit)
      const pts: string[] = []
      const rf = readability(px, py, width, height)
      const isPurple = r.particle.colorIndex % PALETTE.length === 1

      for (let i = 1; i < visTail.length; i++) {
        const [tx, ty] = project(
          visTail[i].x,
          visTail[i].y,
          visTail[i].z,
          cx,
          cy,
          scale,
          CFG.MAIN_ROT_X,
          rotZ,
          CFG.MAIN_CZ_OFFSET,
        )
        pts.push(`${tx.toFixed(2)},${ty.toFixed(2)}`)
      }

      r.screenX = px / width
      r.screenY = py / height
      r.screenZ = clamp((r.particle.z + 6) / 40, 0, 0.999)
      r.tracker.style.opacity = (r.reveal * rf).toFixed(3)

      r.trail.setAttribute("points", pts.join(" "))
      r.trail.setAttribute("stroke-width", trailW.toFixed(2))
      r.trail.style.opacity = (
        r.reveal * (r.particle.important ? 0.56 : 0.34 + stageFactor * 0.22)
      ).toFixed(3)

      r.glow.setAttribute("cx", px.toFixed(2))
      r.glow.setAttribute("cy", py.toFixed(2))
      r.glow.setAttribute("r", glowR.toFixed(2))
      r.glow.style.opacity = (r.reveal * (r.particle.important ? 0.46 : 0.24)).toFixed(3)

      const boxSize = baseR * (r.particle.important ? 5.8 + pulse * 0.32 : 4.6 + pulse * 0.24)
      r.screenScale = normalizeScale(boxSize)
      r.box.setAttribute("x", (px - boxSize / 2).toFixed(2))
      r.box.setAttribute("y", (py - boxSize / 2).toFixed(2))
      r.box.setAttribute("width", boxSize.toFixed(2))
      r.box.setAttribute("height", boxSize.toFixed(2))
      r.box.style.opacity = (
        r.reveal * (r.particle.important ? 0.56 + pulse * 0.22 : 0.34 + pulse * 0.14)
      ).toFixed(3)

      r.ring.setAttribute("cx", px.toFixed(2))
      r.ring.setAttribute("cy", py.toFixed(2))
      r.ring.setAttribute("r", ringR.toFixed(2))
      r.ring.style.opacity = (r.reveal * (r.particle.important ? 0.4 : 0.24)).toFixed(3)

      r.core.setAttribute("cx", px.toFixed(2))
      r.core.setAttribute("cy", py.toFixed(2))
      r.core.setAttribute("r", coreR.toFixed(2))
      r.core.style.opacity = (r.reveal * 0.94).toFixed(3)

      if (r.reveal > CFG.TRACKER_REVEAL_THRESHOLD) {
        meshPts.push({
          x: px,
          y: py,
          reveal: r.reveal,
          readability: rf,
          fill: isPurple ? CFG.KEYPOINT_PURPLE : CFG.KEYPOINT_GREEN,
          glow: isPurple ? CFG.KEYPOINT_PURPLE_GLOW : CFG.KEYPOINT_GREEN_GLOW,
        })
      }
    }

    const edges = buildEdges(meshPts)
    let li = 0
    for (let ei = 0; ei < edges.length && li < linePool.length; ei++) {
      const e = edges[ei],
        line = linePool[li]
      const minReveal = Math.min(e.start.reveal, e.end.reveal)
      const rf = Math.min(e.start.readability, e.end.readability)
      const dr = e.distance / CFG.MESH_DISTANCE_THRESHOLD
      const op = clamp(0.34 - dr * 0.12, 0.22, 0.34)
      line.setAttribute("x1", e.start.x.toFixed(2))
      line.setAttribute("y1", e.start.y.toFixed(2))
      line.setAttribute("x2", e.end.x.toFixed(2))
      line.setAttribute("y2", e.end.y.toFixed(2))
      line.style.opacity = (op * normalizeReveal(minReveal) * rf).toFixed(3)
      li++
    }
    for (; li < linePool.length; li++) {
      linePool[li].setAttribute("x1", "0")
      linePool[li].setAttribute("y1", "0")
      linePool[li].setAttribute("x2", "0")
      linePool[li].setAttribute("y2", "0")
      linePool[li].style.opacity = "0"
    }

    const visPts = meshPts.slice(0, pointPool.length)
    for (let i = 0; i < visPts.length; i++) {
      const pt = visPts[i],
        op = normalizeReveal(pt.reveal) * pt.readability
      glowPool[i].setAttribute("cx", pt.x.toFixed(2))
      glowPool[i].setAttribute("cy", pt.y.toFixed(2))
      glowPool[i].setAttribute("r", "5.5")
      glowPool[i].style.fill = pt.glow
      glowPool[i].style.opacity = (op * 0.52).toFixed(3)
      pointPool[i].setAttribute("cx", pt.x.toFixed(2))
      pointPool[i].setAttribute("cy", pt.y.toFixed(2))
      pointPool[i].setAttribute("r", "2.5")
      pointPool[i].style.fill = pt.fill
      pointPool[i].style.opacity = (op * 0.98).toFixed(3)
    }
    for (let i = visPts.length; i < pointPool.length; i++) {
      glowPool[i].style.opacity = "0"
      pointPool[i].style.opacity = "0"
    }

    if (time - lastHudTime >= CFG.HUD_SAMPLE_INTERVAL_MS) {
      const vis = state.trackers.filter((r) => r.particle.important && r.reveal > 0.2)
      if (vis.length > 0) {
        pushHudSample(state, vis[hudIdx % vis.length], hudIdx)
        hudIdx++
      }
      lastHudTime = time
    }

    frameId = window.requestAnimationFrame(renderFrame)
  }

  window.addEventListener("resize", handleResize)
  frameId = window.requestAnimationFrame(renderFrame)
  state.stop = () => {
    active = false
    window.cancelAnimationFrame(frameId)
    window.removeEventListener("resize", handleResize)
  }
}

async function typeSegments(lineEl: HTMLElement, segments: Segment[], signal: AbortSignal) {
  for (const seg of segments) {
    if (signal.aborted) return
    const node =
      seg.tone === "normal" ? document.createTextNode("") : document.createElement("span")
    if (node instanceof HTMLSpanElement) node.className = `${GB.seg} tone-${seg.tone}`
    lineEl.appendChild(node)
    for (const ch of seg.text) {
      if (signal.aborted) return
      node.textContent += ch
      await waitMs(CFG.TYPE_SPEED_MS, signal)
    }
  }
}

async function typePrompt(logEl: HTMLElement, signal: AbortSignal) {
  const lineEl = document.createElement("div")
  lineEl.className = GB.line
  logEl.appendChild(lineEl)
  await typeSegments(lineEl, parseMarkup(PROMPT_LINE), signal)
  if (signal.aborted) return
  const cursor = document.createElement("span")
  cursor.className = GB.cursor
  cursor.textContent = CFG.CURSOR_CHAR
  lineEl.appendChild(cursor)
}

async function runSequence(logEl: HTMLElement, state: TrackerState, signal: AbortSignal) {
  let prevGroup: HTMLElement | null = null
  setStage(state, 0)

  for (let gi = 0; gi < BOOT_GROUPS.length; gi++) {
    if (signal.aborted) return
    setStage(state, gi + 1)
    if (prevGroup) prevGroup.classList.add("is-past")
    const groupEl = document.createElement("div")
    groupEl.className = GB.group
    logEl.appendChild(groupEl)
    for (const line of BOOT_GROUPS[gi]) {
      const lineEl = document.createElement("div")
      lineEl.className = GB.line
      groupEl.appendChild(lineEl)
      await typeSegments(lineEl, parseMarkup(line), signal)
    }
    prevGroup = groupEl
    if (gi < BOOT_GROUPS.length - 1) await waitMs(CFG.GROUP_GAP_MS, signal)
  }

  await waitMs(CFG.FINAL_PROMPT_DELAY_MS, signal)
  setStage(state, CFG.STAGE_COUNT)
  await typePrompt(logEl, signal)
}

function restartOverlay() {
  clearGardenBooted()
  document.getElementById(CFG.OVERLAY_ID)?.remove()
  initOverlay()
}

function bindRestartTriggers() {
  for (const trigger of document.querySelectorAll<HTMLElement>(CFG.RESTART_SELECTOR)) {
    if (trigger.dataset.gbRestartBound === "true") continue
    trigger.dataset.gbRestartBound = "true"
    if (!trigger.hasAttribute("tabindex")) trigger.tabIndex = 0
    if (!trigger.hasAttribute("role")) trigger.setAttribute("role", "button")
    const restart = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      restartOverlay()
    }
    trigger.addEventListener("click", restart)
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") restart(e)
    })
  }
}

function initOverlay() {
  const existing = document.getElementById(CFG.OVERLAY_ID)
  if (hasGardenBooted()) {
    existing?.remove()
    return
  }
  if (!document.body) return
  if (existing instanceof HTMLElement && existing.dataset.bootMounted === "true") return

  const prevOverflow = document.body.style.overflow
  const overlay = existing instanceof HTMLDivElement ? existing : document.createElement("div")
  overlay.id = CFG.OVERLAY_ID
  overlay.dataset.bootMounted = "true"
  overlay.removeAttribute("style")
  if (overlay.parentElement !== document.body) document.body.appendChild(overlay)

  const state = createTrackerState()
  const shell = document.createElement("div")
  shell.className = GB.shell
  const log = document.createElement("div")
  log.className = GB.log
  shell.appendChild(log)
  overlay.replaceChildren(state.layer, state.hud, shell)
  document.body.style.overflow = "hidden"

  const controller = new AbortController()
  let exited = false

  void hydrateTracker(state, controller.signal)

  const exitOverlay = () => {
    if (exited) return
    exited = true
    controller.abort()
    state.stop()
    markGardenBooted()
    window.removeEventListener("keydown", exitOverlay)
    overlay.removeEventListener("click", exitOverlay)
    overlay.classList.add("is-exiting")
    window.setTimeout(() => {
      document.body.style.overflow = prevOverflow
      overlay.remove()
    }, CFG.EXIT_BG_FADE_MS)
  }

  window.addEventListener("keydown", exitOverlay)
  overlay.addEventListener("click", exitOverlay, { passive: true })
  runSequence(log, state, controller.signal)
}

function handleNav() {
  bindRestartTriggers()
  initOverlay()
}

document.addEventListener("nav", handleNav)
handleNav()
