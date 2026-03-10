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
const GARDEN_BOOT_TRAIL_HISTORY_LENGTH = 420
const GARDEN_BOOT_MESH_LINE_COUNT = 228
const GARDEN_BOOT_MESH_POINT_COUNT = 132
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
  particles: 8,
}
const GARDEN_BOOT_TRACKER_PALETTE = [
  {
    core: "rgba(132, 169, 140, 0.88)",
    glow: "rgba(132, 169, 140, 0.18)",
    trail: "rgba(132, 169, 140, 0.32)",
    ring: "rgba(185, 216, 191, 0.74)",
  },
  {
    core: "rgba(157, 143, 190, 0.82)",
    glow: "rgba(157, 143, 190, 0.14)",
    trail: "rgba(157, 143, 190, 0.26)",
    ring: "rgba(198, 190, 224, 0.62)",
  },
  {
    core: "rgba(212, 212, 212, 0.76)",
    glow: "rgba(212, 212, 212, 0.12)",
    trail: "rgba(212, 212, 212, 0.2)",
    ring: "rgba(212, 212, 212, 0.46)",
  },
]
const GARDEN_BOOT_MESH_PALETTE = [
  {
    stroke: "rgba(244, 244, 240, 0.72)",
    glow: "rgba(244, 244, 240, 0.22)",
    point: "rgba(250, 250, 247, 0.98)",
    blob: "rgba(250, 250, 247, 0.24)",
  },
  {
    stroke: "rgba(204, 235, 213, 0.54)",
    glow: "rgba(204, 235, 213, 0.18)",
    point: "rgba(228, 245, 234, 0.88)",
    blob: "rgba(204, 235, 213, 0.14)",
  },
  {
    stroke: "rgba(233, 214, 247, 0.48)",
    glow: "rgba(233, 214, 247, 0.16)",
    point: "rgba(242, 228, 251, 0.82)",
    blob: "rgba(233, 214, 247, 0.12)",
  },
  {
    stroke: "rgba(214, 226, 247, 0.42)",
    glow: "rgba(214, 226, 247, 0.14)",
    point: "rgba(238, 243, 250, 0.8)",
    blob: "rgba(214, 226, 247, 0.1)",
  },
]
const GB = {
  layer: "gb-layer",
  fx: "gb-fx",
  meshGlowLayer: "gb-mesh-glow",
  meshLineLayer: "gb-mesh-lines",
  meshBlobLayer: "gb-mesh-blobs",
  meshPointLayer: "gb-mesh-points",
  meshLineGlow: "gb-mesh-line-glow",
  meshLine: "gb-mesh-line",
  meshBlob: "gb-mesh-blob",
  meshPoint: "gb-mesh-point",
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
  anchor: boolean
  colorIndex: number
}

type GardenBootMeshEdge = {
  start: GardenBootMeshPoint
  end: GardenBootMeshPoint
  score: number
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
  const line = `${record.particle.label ?? "ID:0000"}  X:${formatGardenBootRatio(record.screenX)}  Y:${formatGardenBootRatio(record.screenY)}  Z:${formatGardenBootRatio(record.screenZ)}  T:${seconds}:${milliseconds}  CONF:${confidence.toString().padStart(2, "0")}`

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
      7,
      readStoredInt("lorenz.particles", GARDEN_BOOT_LORENZ_DEFAULTS.particles),
    ),
  }
  const random = createSeededRandom(29)
  const importantIds = [3791, 5898, 7460, 8847]
  const mainParticles = Array.from({ length: lorenzParams.particles }, (_, index) => {
    const particle = createGardenBootPoint(index)
    particle.stage = index === 0 ? 0 : index < 3 ? 1 : index < 5 ? 2 : 3
    particle.colorIndex = index
    particle.important = index < importantIds.length
    particle.label = particle.important
      ? `ID:${String(importantIds[index]).padStart(4, "0")}`
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

  const meshGlowGroup = createGardenBootSvgEl("g")
  meshGlowGroup.classList.add(GB.meshGlowLayer)
  const meshLineGroup = createGardenBootSvgEl("g")
  meshLineGroup.classList.add(GB.meshLineLayer)
  const meshBlobGroup = createGardenBootSvgEl("g")
  meshBlobGroup.classList.add(GB.meshBlobLayer)
  const meshPointGroup = createGardenBootSvgEl("g")
  meshPointGroup.classList.add(GB.meshPointLayer)
  const trackerGroup = createGardenBootSvgEl("g")
  svg.append(meshGlowGroup, meshBlobGroup, meshLineGroup, meshPointGroup, trackerGroup)
  state.layer.replaceChildren(svg)

  const meshGlowLinePool = Array.from({ length: GARDEN_BOOT_MESH_LINE_COUNT }, () => {
    const line = createGardenBootSvgEl("polyline")
    line.classList.add(GB.meshLineGlow)
    meshGlowGroup.appendChild(line)
    return line
  })

  const meshLinePool = Array.from({ length: GARDEN_BOOT_MESH_LINE_COUNT }, () => {
    const line = createGardenBootSvgEl("polyline")
    line.classList.add(GB.meshLine)
    meshLineGroup.appendChild(line)
    return line
  })

  const meshBlobPool = Array.from({ length: GARDEN_BOOT_MESH_POINT_COUNT }, () => {
    const point = createGardenBootSvgEl("circle")
    point.classList.add(GB.meshBlob)
    meshBlobGroup.appendChild(point)
    return point
  })

  const meshPointPool = Array.from({ length: GARDEN_BOOT_MESH_POINT_COUNT }, () => {
    const point = createGardenBootSvgEl("circle")
    point.classList.add(GB.meshPoint)
    meshPointGroup.appendChild(point)
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

    const scale = Math.min(width, height) / (width < 900 ? 35 : 42)
    const centerX = width < 900 ? width * 0.545 : width * 0.585
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
      const drawEvery = record.particle.important ? 1 : 2
      const trailPointLimit = Math.round(96 + stageFactor * 320)
      const visibleTrail = record.particle.trail.slice(-trailPointLimit)
      const points: string[] = []

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

      record.tracker.style.opacity = record.reveal.toFixed(3)
      record.trail.setAttribute("points", points.join(" "))
      record.trail.setAttribute("stroke-width", trailWidth.toFixed(2))
      record.trail.style.opacity = (
        record.reveal * (record.particle.important ? 0.5 : 0.28 + stageFactor * 0.18)
      ).toFixed(3)

      record.glow.setAttribute("cx", px.toFixed(2))
      record.glow.setAttribute("cy", py.toFixed(2))
      record.glow.setAttribute("r", glowRadius.toFixed(2))
      record.glow.style.opacity = (
        record.reveal * (record.particle.important ? 0.46 : 0.24)
      ).toFixed(3)

      const boxSize =
        baseRadius * (record.particle.important ? 5.8 + pulse * 0.32 : 4.6 + pulse * 0.24)
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

      if (record.reveal > 0.14) {
        meshPoints.push({
          x: px,
          y: py,
          reveal: record.reveal,
          anchor: record.particle.important,
          colorIndex: record.particle.colorIndex,
        })

        const meshStride = record.particle.important ? 3 : 5
        const meshLimit = record.particle.important ? 16 : 9

        for (
          let index = visibleTrail.length - 2, emitted = 0;
          index >= 0 && emitted < meshLimit;
          index -= meshStride, emitted += 1
        ) {
          const point = visibleTrail[index]
          const [mx, my] = projectGardenBootPoint(
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

          meshPoints.push({
            x: mx,
            y: my,
            reveal: record.reveal * (1 - emitted / (meshLimit + 1)),
            anchor: record.particle.important && emitted < 2,
            colorIndex: record.particle.colorIndex,
          })
        }
      }
    }

    const localEdges: GardenBootMeshEdge[] = []
    const bridgeEdges: GardenBootMeshEdge[] = []
    const meshKeys = new Set<string>()
    const localDistanceSq = Math.pow(Math.min(width, height) * (width < 900 ? 0.22 : 0.175), 2)
    const bridgeDistanceSq = Math.pow(Math.min(width, height) * (width < 900 ? 0.5 : 0.4), 2)

    for (let index = 0; index < meshPoints.length; index += 1) {
      const point = meshPoints[index]
      const candidates: Array<{ index: number; distanceSq: number }> = []

      for (let otherIndex = index + 1; otherIndex < meshPoints.length; otherIndex += 1) {
        const other = meshPoints[otherIndex]
        const dx = other.x - point.x
        const dy = other.y - point.y
        const distanceSq = dx * dx + dy * dy

        if (distanceSq <= localDistanceSq) {
          candidates.push({ index: otherIndex, distanceSq })
          continue
        }

        if ((point.anchor || other.anchor) && distanceSq <= bridgeDistanceSq) {
          bridgeEdges.push({
            start: point,
            end: other,
            score: distanceSq,
          })
        }
      }

      candidates.sort((left, right) => left.distanceSq - right.distanceSq)
      const neighborCount = point.anchor ? 7 : 4

      for (
        let candidateIndex = 0;
        candidateIndex < candidates.length && candidateIndex < neighborCount;
        candidateIndex += 1
      ) {
        const candidate = candidates[candidateIndex]
        const other = meshPoints[candidate.index]
        const key = `${Math.min(index, candidate.index)}:${Math.max(index, candidate.index)}`

        if (meshKeys.has(key)) {
          continue
        }

        meshKeys.add(key)
        localEdges.push({
          start: point,
          end: other,
          score: candidate.distanceSq,
        })
      }
    }

    bridgeEdges.sort((left, right) => {
      const anchorPairDelta =
        Number(right.start.anchor && right.end.anchor) -
        Number(left.start.anchor && left.end.anchor)
      return anchorPairDelta !== 0 ? anchorPairDelta : right.score - left.score
    })
    const selectedEdges = [...localEdges]
    const bridgeBudget = Math.max(18, Math.round(meshLinePool.length * 0.36))

    for (
      let edgeIndex = 0, bridgesAdded = 0;
      edgeIndex < bridgeEdges.length &&
      selectedEdges.length < meshLinePool.length &&
      bridgesAdded < bridgeBudget;
      edgeIndex += 1
    ) {
      const edge = bridgeEdges[edgeIndex]
      const startIndex = meshPoints.indexOf(edge.start)
      const endIndex = meshPoints.indexOf(edge.end)
      const key = `${Math.min(startIndex, endIndex)}:${Math.max(startIndex, endIndex)}`

      if (meshKeys.has(key)) {
        continue
      }

      meshKeys.add(key)
      selectedEdges.push(edge)
      bridgesAdded += 1
    }

    let meshLineIndex = 0
    for (
      let edgeIndex = 0;
      edgeIndex < selectedEdges.length && meshLineIndex < meshLinePool.length;
      edgeIndex += 1
    ) {
      const edge = selectedEdges[edgeIndex]
      const glowLine = meshGlowLinePool[meshLineIndex]
      const line = meshLinePool[meshLineIndex]
      const dx = edge.end.x - edge.start.x
      const dy = edge.end.y - edge.start.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const distanceRatio = distance / Math.sqrt(bridgeDistanceSq)
      const isBridge = edge.score > localDistanceSq
      const paletteIndex =
        edge.start.anchor && edge.end.anchor
          ? (edge.start.colorIndex + edge.end.colorIndex + edgeIndex) %
            GARDEN_BOOT_MESH_PALETTE.length
          : edge.start.anchor || edge.end.anchor
            ? edge.start.anchor
              ? edge.start.colorIndex % GARDEN_BOOT_MESH_PALETTE.length
              : edge.end.colorIndex % GARDEN_BOOT_MESH_PALETTE.length
            : 0
      const palette = GARDEN_BOOT_MESH_PALETTE[paletteIndex]
      const opacity =
        Math.min(edge.start.reveal, edge.end.reveal) *
        (edge.start.anchor || edge.end.anchor ? 0.78 : 0.5) *
        (isBridge ? 0.64 + distanceRatio * 0.18 : 0.96 - distanceRatio * 0.24)
      const linePoints = `${edge.start.x.toFixed(2)},${edge.start.y.toFixed(2)} ${edge.end.x.toFixed(2)},${edge.end.y.toFixed(2)}`
      const lineOpacity = clamp(opacity, 0, 0.84)
      const glowOpacity = clamp(
        lineOpacity * (isBridge ? 0.68 : edge.start.anchor || edge.end.anchor ? 0.54 : 0.38),
        0,
        0.5,
      )
      const lineWidth = isBridge ? 0.92 : edge.start.anchor || edge.end.anchor ? 0.84 : 0.68
      const glowWidth = lineWidth * (isBridge ? 4.2 : 3.4)

      glowLine.setAttribute("points", linePoints)
      glowLine.style.stroke = palette.glow
      glowLine.style.strokeWidth = glowWidth.toFixed(2)
      glowLine.style.opacity = glowOpacity.toFixed(3)

      line.setAttribute("points", linePoints)
      line.style.stroke = palette.stroke
      line.style.strokeWidth = lineWidth.toFixed(2)
      line.style.opacity = lineOpacity.toFixed(3)
      meshLineIndex += 1
    }

    for (let index = meshLineIndex; index < meshLinePool.length; index += 1) {
      meshGlowLinePool[index].setAttribute("points", "")
      meshGlowLinePool[index].style.opacity = "0"
      meshLinePool[index].setAttribute("points", "")
      meshLinePool[index].style.opacity = "0"
    }

    const visibleMeshPoints = meshPoints.slice(0, meshPointPool.length)
    for (let index = 0; index < visibleMeshPoints.length; index += 1) {
      const point = visibleMeshPoints[index]
      const palette = GARDEN_BOOT_MESH_PALETTE[point.colorIndex % GARDEN_BOOT_MESH_PALETTE.length]
      const meshBlob = meshBlobPool[index]
      const meshPoint = meshPointPool[index]
      meshBlob.setAttribute("cx", point.x.toFixed(2))
      meshBlob.setAttribute("cy", point.y.toFixed(2))
      meshBlob.setAttribute("r", (point.anchor ? 8.4 : 5).toFixed(2))
      meshBlob.style.fill = palette.blob
      meshBlob.style.opacity = clamp(point.reveal * (point.anchor ? 0.48 : 0.2), 0, 0.54).toFixed(3)

      meshPoint.setAttribute("cx", point.x.toFixed(2))
      meshPoint.setAttribute("cy", point.y.toFixed(2))
      meshPoint.setAttribute("r", (point.anchor ? 2.2 : 1.25).toFixed(2))
      meshPoint.style.fill = palette.point
      meshPoint.style.opacity = clamp(point.reveal * (point.anchor ? 0.92 : 0.56), 0, 0.96).toFixed(
        3,
      )
    }

    for (let index = visibleMeshPoints.length; index < meshPointPool.length; index += 1) {
      meshBlobPool[index].style.opacity = "0"
      meshPointPool[index].style.opacity = "0"
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
