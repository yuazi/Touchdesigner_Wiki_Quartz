import { Delaunay } from "d3"

const GARDEN_BOOT_SESSION_KEY = "gardenBooted"
const GARDEN_BOOT_OVERLAY_ID = "garden-boot-overlay"
const GARDEN_BOOT_STAGE_COUNT = 4
const GARDEN_BOOT_TYPE_SPEED_MS = 12
const GARDEN_BOOT_GROUP_GAP_MS = 420
const GARDEN_BOOT_FINAL_PROMPT_DELAY_MS = 700
const GARDEN_BOOT_EXIT_BG_FADE_MS = 500
const GARDEN_BOOT_CURSOR_CHAR = "\u258c"
const GARDEN_BOOT_SVG_NS = "http://www.w3.org/2000/svg"
const GARDEN_BOOT_WARMUP_STEPS = 5000
const GARDEN_BOOT_SIM_STEPS_PER_FRAME = 1
const GARDEN_BOOT_ROTATION_SPEED = 0.000035
const GARDEN_BOOT_SIM_DT_SCALE = 0.68
const GARDEN_BOOT_MAIN_ROT_X = 0.6
const GARDEN_BOOT_MAIN_CZ_OFFSET = 25
const GARDEN_BOOT_HUD_ROW_COUNT = 44
const GARDEN_BOOT_HUD_SAMPLE_INTERVAL_MS = 110
const GARDEN_BOOT_TRAIL_HISTORY_LENGTH = 2000
const GARDEN_BOOT_OVERLAY_MIN_PARTICLES = 25
const GARDEN_BOOT_MESH_DISTANCE_THRESHOLD = 500
const GARDEN_BOOT_TRACKER_REVEAL_THRESHOLD = 0.14
const GARDEN_BOOT_SCREEN_SCALE_MIN = 16
const GARDEN_BOOT_SCREEN_SCALE_MAX = 40
const GARDEN_BOOT_TRAIL_POINT_BASE = 168
const GARDEN_BOOT_TRAIL_POINT_RANGE = 456
const GARDEN_BOOT_MAIN_SCALE_DIVISOR_MOBILE = 39
const GARDEN_BOOT_MAIN_SCALE_DIVISOR_DESKTOP = 47
const GARDEN_BOOT_MAIN_CENTER_X_MOBILE = 0.54
const GARDEN_BOOT_MAIN_CENTER_X_DESKTOP = 0.56
const GARDEN_BOOT_READABILITY_MIN = 0.78
const GARDEN_BOOT_READABILITY_RADIUS_X = 0.14
const GARDEN_BOOT_READABILITY_RADIUS_Y = 0.11
const GARDEN_BOOT_KEYPOINT_GREEN = "#8fd6c3"
const GARDEN_BOOT_KEYPOINT_GREEN_GLOW = "rgba(143, 214, 195, 0.58)"
const GARDEN_BOOT_KEYPOINT_PURPLE = "#b39adf"
const GARDEN_BOOT_KEYPOINT_PURPLE_GLOW = "rgba(179, 154, 223, 0.56)"
const GARDEN_BOOT_BOOT_GROUPS = [
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
const GARDEN_BOOT_LORENZ_DEFAULTS = {
  sigma: 10,
  rho: 28,
  beta: 8 / 3,
  dt: 0.005,
  particles: 12,
}
const GARDEN_BOOT_TRACKER_PALETTE = [
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

type GardenBootTone = "normal" | "accent" | "lavender" | "dim"

type GardenBootSegment = {
  tone: GardenBootTone
  text: string
}

type GardenBootParticle = {
  stage: number
  colorIndex: number
  important: boolean
  label: string | null
  x: number
  y: number
  z: number
  trail: Array<{ x: number; y: number; z: number }>
}

type GardenBootLorenzParams = {
  sigma: number
  rho: number
  beta: number
  dt: number
  particles: number
}

type GardenBootTrackerRecord = {
  particle: GardenBootParticle
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

type GardenBootTrackerState = {
  layer: HTMLDivElement
  hud: HTMLDivElement
  hudRows: HTMLDivElement[]
  currentStage: number
  trackers: GardenBootTrackerRecord[]
  stop: () => void
}

type GardenBootMeshPoint = {
  x: number
  y: number
  reveal: number
  readability: number
  fill: string
  glow: string
}

type GardenBootMeshEdge = {
  start: GardenBootMeshPoint
  end: GardenBootMeshPoint
  distance: number
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

function readStoredNumber(key: string, fallback: number) {
  const raw = localStorage.getItem(key)
  const value = raw === null ? fallback : parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}

function readStoredInt(key: string, fallback: number) {
  const raw = localStorage.getItem(key)
  const value = raw === null ? fallback : parseInt(raw, 10)
  return Number.isFinite(value) ? value : fallback
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

function createGardenBootPoint(offset = 0): GardenBootParticle {
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

function formatGardenBootRatio(value: number) {
  return clamp(value, 0, 0.999).toFixed(2)
}

function normalizeGardenBootReveal(reveal: number) {
  return clamp(
    (reveal - GARDEN_BOOT_TRACKER_REVEAL_THRESHOLD) / (1 - GARDEN_BOOT_TRACKER_REVEAL_THRESHOLD),
    0,
    1,
  )
}

function normalizeGardenBootScreenScale(size: number) {
  return clamp(
    (size - GARDEN_BOOT_SCREEN_SCALE_MIN) /
      (GARDEN_BOOT_SCREEN_SCALE_MAX - GARDEN_BOOT_SCREEN_SCALE_MIN),
    0,
    0.999,
  )
}

function getGardenBootReadabilityFactor(x: number, y: number, width: number, height: number) {
  const safeCenterX = width * 0.5
  const safeCenterY = height * 0.5
  const radiusX = Math.max(180, width * GARDEN_BOOT_READABILITY_RADIUS_X)
  const radiusY = Math.max(110, height * GARDEN_BOOT_READABILITY_RADIUS_Y)
  const dx = (x - safeCenterX) / radiusX
  const dy = (y - safeCenterY) / radiusY
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance >= 1) {
    return 1
  }

  return GARDEN_BOOT_READABILITY_MIN + (1 - GARDEN_BOOT_READABILITY_MIN) * Math.pow(distance, 1.35)
}

function pushGardenBootMeshEdge(
  points: GardenBootMeshPoint[],
  edges: GardenBootMeshEdge[],
  seenKeys: Set<string>,
  firstIndex: number,
  secondIndex: number,
  maxDistanceSq: number,
) {
  if (firstIndex === secondIndex) {
    return
  }

  const startIndex = Math.min(firstIndex, secondIndex)
  const endIndex = Math.max(firstIndex, secondIndex)
  const key = `${startIndex}:${endIndex}`

  if (seenKeys.has(key)) {
    return
  }

  const start = points[startIndex]
  const end = points[endIndex]
  const dx = end.x - start.x
  const dy = end.y - start.y
  const distanceSq = dx * dx + dy * dy

  if (distanceSq > maxDistanceSq) {
    return
  }

  seenKeys.add(key)
  edges.push({
    start,
    end,
    distance: Math.sqrt(distanceSq),
  })
}

function createGardenBootMeshEdges(points: GardenBootMeshPoint[]) {
  if (points.length < 2) {
    return []
  }

  const maxDistanceSq = GARDEN_BOOT_MESH_DISTANCE_THRESHOLD * GARDEN_BOOT_MESH_DISTANCE_THRESHOLD
  const edges: GardenBootMeshEdge[] = []
  const seenKeys = new Set<string>()

  if (points.length === 2) {
    pushGardenBootMeshEdge(points, edges, seenKeys, 0, 1, maxDistanceSq)
    return edges
  }

  const delaunay = Delaunay.from(
    points,
    (point) => point.x,
    (point) => point.y,
  )
  const { triangles } = delaunay

  if (triangles.length === 0) {
    for (let index = 0; index < points.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < points.length; otherIndex += 1) {
        pushGardenBootMeshEdge(points, edges, seenKeys, index, otherIndex, maxDistanceSq)
      }
    }

    return edges
  }

  for (let index = 0; index < triangles.length; index += 3) {
    const a = triangles[index]
    const b = triangles[index + 1]
    const c = triangles[index + 2]

    pushGardenBootMeshEdge(points, edges, seenKeys, a, b, maxDistanceSq)
    pushGardenBootMeshEdge(points, edges, seenKeys, b, c, maxDistanceSq)
    pushGardenBootMeshEdge(points, edges, seenKeys, c, a, maxDistanceSq)
  }

  return edges
}

function getGardenBootParticleStage(index: number, total: number) {
  if (total <= 0) {
    return 1
  }

  return (
    1 + Math.min(GARDEN_BOOT_STAGE_COUNT - 1, Math.floor((index * GARDEN_BOOT_STAGE_COUNT) / total))
  )
}

function stepGardenBootLorenz(particle: GardenBootParticle, params: GardenBootLorenzParams) {
  const dx = params.sigma * (particle.y - particle.x)
  const dy = particle.x * (params.rho - particle.z) - particle.y
  const dz = particle.x * particle.y - params.beta * particle.z

  particle.trail.push({ x: particle.x, y: particle.y, z: particle.z })
  if (particle.trail.length > GARDEN_BOOT_TRAIL_HISTORY_LENGTH) {
    particle.trail.shift()
  }

  const dt = params.dt * GARDEN_BOOT_SIM_DT_SCALE
  particle.x += dx * dt
  particle.y += dy * dt
  particle.z += dz * dt
}

function projectGardenBootPoint(
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
  const cosZ = Math.cos(rotZ)
  const sinZ = Math.sin(rotZ)
  const cosX = Math.cos(rotX)
  const sinX = Math.sin(rotX)

  const cx3 = x
  const cy3 = y
  const cz3 = z - czOffset

  const rx = cx3 * cosZ - cy3 * sinZ
  const ry = cx3 * sinZ + cy3 * cosZ
  const rz = cz3

  const fx = rx
  const fy = ry * cosX - rz * sinX

  return [cx + fx * scale, cy + fy * scale]
}

function createGardenBootTrackerState(): GardenBootTrackerState {
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

  const hudRows = Array.from({ length: GARDEN_BOOT_HUD_ROW_COUNT }, (_, index) => {
    const row = document.createElement("div")
    row.className = GB.hudRow
    row.style.opacity = `${Math.max(0.1, 1 - index * 0.018)}`
    hudLog.appendChild(row)
    return row
  })

  return {
    layer,
    hud,
    hudRows,
    currentStage: -1,
    trackers: [],
    stop() {},
  }
}

function syncGardenBootTrackerStage(state: GardenBootTrackerState) {
  const stage = clamp(state.currentStage, 0, GARDEN_BOOT_STAGE_COUNT)
  for (const record of state.trackers) {
    record.targetReveal = record.particle.stage <= stage ? 1 : 0
  }
}

function setGardenBootTrackerStage(state: GardenBootTrackerState, stage: number) {
  state.currentStage = clamp(stage, 0, GARDEN_BOOT_STAGE_COUNT)
  state.layer.dataset.stage = String(state.currentStage)
  state.hud.dataset.stage = String(state.currentStage)
  if (state.trackers.length > 0) {
    syncGardenBootTrackerStage(state)
  }
}

function pushGardenBootHudSample(
  state: GardenBootTrackerState,
  record: GardenBootTrackerRecord,
  sampleIndex: number,
) {
  const confidence = Math.round(
    4 + (0.5 + 0.5 * Math.sin(record.pulsePhase + performance.now() * 0.001)) * 6,
  )
  const elapsedMs = sampleIndex * GARDEN_BOOT_HUD_SAMPLE_INTERVAL_MS
  const seconds = String(Math.floor(elapsedMs / 1000) % 100).padStart(2, "0")
  const milliseconds = String(elapsedMs % 1000).padStart(3, "0")
  const line = `${record.particle.label ?? "CL:0000"}  X:${formatGardenBootRatio(record.screenX)}  Y:${formatGardenBootRatio(record.screenY)}  Z:${formatGardenBootRatio(record.screenZ)}  S:${formatGardenBootRatio(record.screenScale)}  T:${seconds}:${milliseconds}  CONF:${confidence.toString().padStart(2, "0")}`

  for (let index = state.hudRows.length - 1; index > 0; index -= 1) {
    state.hudRows[index].textContent = state.hudRows[index - 1].textContent
  }

  state.hudRows[0].textContent = line
}

async function hydrateGardenBootTrackerLayer(state: GardenBootTrackerState, signal: AbortSignal) {
  const lorenzParams: GardenBootLorenzParams = {
    sigma: readStoredNumber("lorenz.sigma", GARDEN_BOOT_LORENZ_DEFAULTS.sigma),
    rho: readStoredNumber("lorenz.rho", GARDEN_BOOT_LORENZ_DEFAULTS.rho),
    beta: readStoredNumber("lorenz.beta", GARDEN_BOOT_LORENZ_DEFAULTS.beta),
    dt: readStoredNumber("lorenz.dt", GARDEN_BOOT_LORENZ_DEFAULTS.dt),
    particles: Math.max(
      GARDEN_BOOT_OVERLAY_MIN_PARTICLES,
      readStoredInt("lorenz.particles", GARDEN_BOOT_LORENZ_DEFAULTS.particles),
    ),
  }
  const random = createSeededRandom(29)
  const importantIds = [3791, 5898, 7460, 8847]
  const mainParticles = Array.from({ length: lorenzParams.particles }, (_, index) => {
    const particle = createGardenBootPoint(index)
    particle.stage = getGardenBootParticleStage(index, lorenzParams.particles)
    particle.colorIndex = index
    particle.important = index < importantIds.length
    particle.label = particle.important
      ? `CL:${String(importantIds[index]).padStart(4, "0")}`
      : null
    return particle
  })

  for (let index = 0; index < GARDEN_BOOT_WARMUP_STEPS; index += 1) {
    mainParticles.forEach((particle) => stepGardenBootLorenz(particle, lorenzParams))
  }

  mainParticles.forEach((particle) => {
    particle.trail = []
  })

  if (signal.aborted) {
    return
  }

  const svg = createGardenBootSvgEl("svg")
  svg.classList.add(GB.fx)
  svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`)
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice")
  svg.setAttribute("aria-hidden", "true")

  const meshLineGroup = createGardenBootSvgEl("g")
  meshLineGroup.classList.add(GB.meshLineLayer)
  const meshKeypointGlowGroup = createGardenBootSvgEl("g")
  meshKeypointGlowGroup.classList.add(GB.meshKeypointGlowLayer)
  const meshKeypointGroup = createGardenBootSvgEl("g")
  meshKeypointGroup.classList.add(GB.meshKeypointLayer)
  const trackerGroup = createGardenBootSvgEl("g")
  svg.append(meshLineGroup, trackerGroup, meshKeypointGlowGroup, meshKeypointGroup)
  state.layer.replaceChildren(svg)

  const meshLinePool = Array.from({ length: Math.max(0, mainParticles.length * 3) }, () => {
    const line = createGardenBootSvgEl("line")
    line.classList.add(GB.meshLine)
    meshLineGroup.appendChild(line)
    return line
  })

  const meshKeypointGlowPool = Array.from({ length: mainParticles.length }, () => {
    const point = createGardenBootSvgEl("circle")
    point.classList.add(GB.meshKeypointGlow)
    meshKeypointGlowGroup.appendChild(point)
    return point
  })

  const meshKeypointPool = Array.from({ length: mainParticles.length }, () => {
    const point = createGardenBootSvgEl("circle")
    point.classList.add(GB.meshKeypoint)
    meshKeypointGroup.appendChild(point)
    return point
  })

  for (const particle of mainParticles) {
    const palette =
      GARDEN_BOOT_TRACKER_PALETTE[particle.colorIndex % GARDEN_BOOT_TRACKER_PALETTE.length]
    const tracker = createGardenBootSvgEl("g")
    tracker.classList.add(GB.track)
    tracker.style.setProperty("--tracker-core", palette.core)
    tracker.style.setProperty("--tracker-glow", palette.glow)
    tracker.style.setProperty("--tracker-trail", palette.trail)
    tracker.style.setProperty("--tracker-ring", palette.ring)

    const trail = createGardenBootSvgEl("polyline")
    trail.classList.add(GB.trackTrail)

    const glow = createGardenBootSvgEl("circle")
    glow.classList.add(GB.trackGlow)

    const box = createGardenBootSvgEl("rect")
    box.classList.add(GB.trackBox)

    const ring = createGardenBootSvgEl("circle")
    ring.classList.add(GB.trackRing)

    const core = createGardenBootSvgEl("circle")
    core.classList.add(GB.trackCore)

    tracker.append(trail, glow, box, ring, core)
    trackerGroup.appendChild(tracker)

    state.trackers.push({
      particle,
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

  syncGardenBootTrackerStage(state)

  let width = window.innerWidth
  let height = window.innerHeight
  let rotZ = -0.72
  let frameId = 0
  let active = true
  let lastFrameTime = performance.now()
  let lastHudSampleTime = 0
  let hudSampleIndex = 0

  const handleResize = () => {
    width = window.innerWidth
    height = window.innerHeight
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  }

  const renderFrame = (time: number) => {
    if (!active) {
      return
    }

    const deltaMs = Math.min(32, Math.max(10, time - lastFrameTime || 16.667))
    const frameScale = deltaMs / 16.667
    lastFrameTime = time

    const scale =
      Math.min(width, height) /
      (width < 900 ? GARDEN_BOOT_MAIN_SCALE_DIVISOR_MOBILE : GARDEN_BOOT_MAIN_SCALE_DIVISOR_DESKTOP)
    const centerX =
      width < 900
        ? width * GARDEN_BOOT_MAIN_CENTER_X_MOBILE
        : width * GARDEN_BOOT_MAIN_CENTER_X_DESKTOP
    const centerY = height * 0.555
    const stageFactor = (state.currentStage + 1) / (GARDEN_BOOT_STAGE_COUNT + 1)
    const meshPoints: GardenBootMeshPoint[] = []

    rotZ += GARDEN_BOOT_ROTATION_SPEED * frameScale

    for (
      let step = 0;
      step < Math.max(1, Math.round(GARDEN_BOOT_SIM_STEPS_PER_FRAME * frameScale));
      step += 1
    ) {
      mainParticles.forEach((particle) => stepGardenBootLorenz(particle, lorenzParams))
    }

    for (const record of state.trackers) {
      record.reveal += (record.targetReveal - record.reveal) * 0.08

      const [px, py] = projectGardenBootPoint(
        record.particle.x,
        record.particle.y,
        record.particle.z,
        centerX,
        centerY,
        scale,
        GARDEN_BOOT_MAIN_ROT_X,
        rotZ,
        GARDEN_BOOT_MAIN_CZ_OFFSET,
      )

      const pulse = 0.5 + 0.5 * Math.sin(time * 0.00075 + record.pulsePhase)
      const baseRadius = (record.particle.important ? 5.8 : 4.1) * (0.96 + pulse * 0.12)
      const coreRadius = baseRadius * (record.particle.important ? 0.74 : 0.6)
      const ringRadius = baseRadius * (record.particle.important ? 1.75 : 1.28)
      const glowRadius = baseRadius * (record.particle.important ? 3.2 : 2.35)
      const trailWidth = record.particle.important ? 1.15 : 0.88
      const drawEvery = 1
      const trailPointLimit = Math.round(
        GARDEN_BOOT_TRAIL_POINT_BASE + stageFactor * GARDEN_BOOT_TRAIL_POINT_RANGE,
      )
      const visibleTrail = record.particle.trail.slice(-trailPointLimit)
      const points: string[] = []
      const readabilityFactor = getGardenBootReadabilityFactor(px, py, width, height)
      const usePurpleKeypoint =
        record.particle.colorIndex % GARDEN_BOOT_TRACKER_PALETTE.length === 1

      for (let index = drawEvery; index < visibleTrail.length; index += drawEvery) {
        const point = visibleTrail[index]
        const [tx, ty] = projectGardenBootPoint(
          point.x,
          point.y,
          point.z,
          centerX,
          centerY,
          scale,
          GARDEN_BOOT_MAIN_ROT_X,
          rotZ,
          GARDEN_BOOT_MAIN_CZ_OFFSET,
        )
        points.push(`${tx.toFixed(2)},${ty.toFixed(2)}`)
      }

      record.screenX = px / width
      record.screenY = py / height
      record.screenZ = clamp((record.particle.z + 6) / 40, 0, 0.999)

      record.tracker.style.opacity = (record.reveal * readabilityFactor).toFixed(3)
      record.trail.setAttribute("points", points.join(" "))
      record.trail.setAttribute("stroke-width", trailWidth.toFixed(2))
      record.trail.style.opacity = (
        record.reveal * (record.particle.important ? 0.56 : 0.34 + stageFactor * 0.22)
      ).toFixed(3)

      record.glow.setAttribute("cx", px.toFixed(2))
      record.glow.setAttribute("cy", py.toFixed(2))
      record.glow.setAttribute("r", glowRadius.toFixed(2))
      record.glow.style.opacity = (
        record.reveal * (record.particle.important ? 0.46 : 0.24)
      ).toFixed(3)

      const boxSize =
        baseRadius * (record.particle.important ? 5.8 + pulse * 0.32 : 4.6 + pulse * 0.24)
      record.screenScale = normalizeGardenBootScreenScale(boxSize)
      record.box.setAttribute("x", (px - boxSize / 2).toFixed(2))
      record.box.setAttribute("y", (py - boxSize / 2).toFixed(2))
      record.box.setAttribute("width", boxSize.toFixed(2))
      record.box.setAttribute("height", boxSize.toFixed(2))
      record.box.style.opacity = (
        record.reveal * (record.particle.important ? 0.56 + pulse * 0.22 : 0.34 + pulse * 0.14)
      ).toFixed(3)

      record.ring.setAttribute("cx", px.toFixed(2))
      record.ring.setAttribute("cy", py.toFixed(2))
      record.ring.setAttribute("r", ringRadius.toFixed(2))
      record.ring.style.opacity = (
        record.reveal * (record.particle.important ? 0.4 : 0.24)
      ).toFixed(3)

      record.core.setAttribute("cx", px.toFixed(2))
      record.core.setAttribute("cy", py.toFixed(2))
      record.core.setAttribute("r", coreRadius.toFixed(2))
      record.core.style.opacity = (record.reveal * 0.94).toFixed(3)

      if (record.reveal > GARDEN_BOOT_TRACKER_REVEAL_THRESHOLD) {
        meshPoints.push({
          x: px,
          y: py,
          reveal: record.reveal,
          readability: readabilityFactor,
          fill: usePurpleKeypoint ? GARDEN_BOOT_KEYPOINT_PURPLE : GARDEN_BOOT_KEYPOINT_GREEN,
          glow: usePurpleKeypoint
            ? GARDEN_BOOT_KEYPOINT_PURPLE_GLOW
            : GARDEN_BOOT_KEYPOINT_GREEN_GLOW,
        })
      }
    }

    const meshEdges = createGardenBootMeshEdges(meshPoints)

    let meshLineIndex = 0
    for (
      let edgeIndex = 0;
      edgeIndex < meshEdges.length && meshLineIndex < meshLinePool.length;
      edgeIndex += 1
    ) {
      const edge = meshEdges[edgeIndex]
      const line = meshLinePool[meshLineIndex]
      const minReveal = Math.min(edge.start.reveal, edge.end.reveal)
      const revealFactor = normalizeGardenBootReveal(minReveal)
      const readabilityFactor = Math.min(edge.start.readability, edge.end.readability)
      const distanceRatio = edge.distance / GARDEN_BOOT_MESH_DISTANCE_THRESHOLD
      const baseOpacity = clamp(0.34 - distanceRatio * 0.12, 0.22, 0.34)
      line.setAttribute("x1", edge.start.x.toFixed(2))
      line.setAttribute("y1", edge.start.y.toFixed(2))
      line.setAttribute("x2", edge.end.x.toFixed(2))
      line.setAttribute("y2", edge.end.y.toFixed(2))
      line.style.opacity = (baseOpacity * revealFactor * readabilityFactor).toFixed(3)
      meshLineIndex += 1
    }

    for (let index = meshLineIndex; index < meshLinePool.length; index += 1) {
      meshLinePool[index].setAttribute("x1", "0")
      meshLinePool[index].setAttribute("y1", "0")
      meshLinePool[index].setAttribute("x2", "0")
      meshLinePool[index].setAttribute("y2", "0")
      meshLinePool[index].style.opacity = "0"
    }

    const visibleMeshPoints = meshPoints.slice(0, meshKeypointPool.length)
    for (let index = 0; index < visibleMeshPoints.length; index += 1) {
      const point = visibleMeshPoints[index]
      const pointOpacity = normalizeGardenBootReveal(point.reveal) * point.readability
      const meshKeypointGlow = meshKeypointGlowPool[index]
      const meshKeypoint = meshKeypointPool[index]
      meshKeypointGlow.setAttribute("cx", point.x.toFixed(2))
      meshKeypointGlow.setAttribute("cy", point.y.toFixed(2))
      meshKeypointGlow.setAttribute("r", "5.5")
      meshKeypointGlow.style.fill = point.glow
      meshKeypointGlow.style.opacity = (pointOpacity * 0.52).toFixed(3)

      meshKeypoint.setAttribute("cx", point.x.toFixed(2))
      meshKeypoint.setAttribute("cy", point.y.toFixed(2))
      meshKeypoint.setAttribute("r", "2.5")
      meshKeypoint.style.fill = point.fill
      meshKeypoint.style.opacity = (pointOpacity * 0.98).toFixed(3)
    }

    for (let index = visibleMeshPoints.length; index < meshKeypointPool.length; index += 1) {
      meshKeypointGlowPool[index].style.opacity = "0"
      meshKeypointPool[index].style.opacity = "0"
    }

    if (time - lastHudSampleTime >= GARDEN_BOOT_HUD_SAMPLE_INTERVAL_MS) {
      const visibleImportant = state.trackers.filter(
        (record) => record.particle.important && record.reveal > 0.2,
      )

      if (visibleImportant.length > 0) {
        pushGardenBootHudSample(
          state,
          visibleImportant[hudSampleIndex % visibleImportant.length],
          hudSampleIndex,
        )
        hudSampleIndex += 1
      }

      lastHudSampleTime = time
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
      node.className = `${GB.seg} tone-${segment.tone}`
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
  lineEl.className = GB.line
  logEl.appendChild(lineEl)

  await typeGardenBootSegments(lineEl, parseGardenBootMarkup(GARDEN_BOOT_PROMPT_LINE), signal)
  if (signal.aborted) {
    return
  }

  const cursor = document.createElement("span")
  cursor.className = GB.cursor
  cursor.textContent = GARDEN_BOOT_CURSOR_CHAR
  lineEl.appendChild(cursor)
}

async function runGardenBootSequence(
  logEl: HTMLElement,
  trackerState: GardenBootTrackerState,
  signal: AbortSignal,
) {
  let previousGroup: HTMLElement | null = null
  setGardenBootTrackerStage(trackerState, 0)

  for (let groupIndex = 0; groupIndex < GARDEN_BOOT_BOOT_GROUPS.length; groupIndex += 1) {
    if (signal.aborted) {
      return
    }

    setGardenBootTrackerStage(trackerState, groupIndex + 1)

    if (previousGroup) {
      previousGroup.classList.add("is-past")
    }

    const groupEl = document.createElement("div")
    groupEl.className = GB.group
    logEl.appendChild(groupEl)

    for (const line of GARDEN_BOOT_BOOT_GROUPS[groupIndex]) {
      const lineEl = document.createElement("div")
      lineEl.className = GB.line
      groupEl.appendChild(lineEl)
      await typeGardenBootSegments(lineEl, parseGardenBootMarkup(line), signal)
    }

    previousGroup = groupEl

    if (groupIndex < GARDEN_BOOT_BOOT_GROUPS.length - 1) {
      await waitForGardenBoot(GARDEN_BOOT_GROUP_GAP_MS, signal)
    }
  }

  await waitForGardenBoot(GARDEN_BOOT_FINAL_PROMPT_DELAY_MS, signal)
  setGardenBootTrackerStage(trackerState, GARDEN_BOOT_STAGE_COUNT)
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

  const trackerState = createGardenBootTrackerState()
  const shell = document.createElement("div")
  shell.className = GB.shell

  const log = document.createElement("div")
  log.className = GB.log

  shell.appendChild(log)
  overlay.replaceChildren(trackerState.layer, trackerState.hud, shell)
  document.body.style.overflow = "hidden"

  const controller = new AbortController()
  let exited = false

  void hydrateGardenBootTrackerLayer(trackerState, controller.signal)

  const exitOverlay = () => {
    if (exited) {
      return
    }

    exited = true
    controller.abort()
    trackerState.stop()
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
  runGardenBootSequence(log, trackerState, controller.signal)
}

document.addEventListener("nav", initGardenBootOverlay)
initGardenBootOverlay()
