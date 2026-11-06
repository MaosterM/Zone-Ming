import {
  CanvasTexture,
  Color,
  InstancedMesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  Object3D,
  OctahedronGeometry,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'
import { gsap } from './motion'
import type { Formation, Placement } from './scenePlacements'

const CAMERA_Z = 10
const CAMERA_FOV = 35
const HALF_HEIGHT = Math.tan((CAMERA_FOV / 2) * (Math.PI / 180)) * CAMERA_Z
const MAX_DPR = 1.5
const ACCENT_SHARE = 0.16
const MORPH_SECONDS = 1.3
const MORPH_STAGGER = 0.6
const TILT_X = 0.28
const SPIN_SPEED = 0.12
const POINTER_TURN = 0.45
const SCROLL_TURN = 0.0007
const PUSH_RADIUS = 1.5
const PUSH_STRENGTH = 0.9
const PUSH_EASE = 0.14
const NEON = ['#fcee0a', '#ff1f8f', '#00f0ff']
const GLYPHS = '404'
const GLYPH_PIECE_SCALE = 0.85

export type ShardScene = {
  place: (placement: Placement, instant: boolean) => void
  setPointer: (x: number, y: number) => void
  draw: (time: number, scrollY: number) => void
  resize: (width: number, height: number) => void
  dispose: () => void
}

function random(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Shuffles the points, so the glowing accent shards spread through a shape, not along one end. */
function shuffled(points: Float32Array) {
  for (let i = points.length / 3 - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    for (let axis = 0; axis < 3; axis++) {
      const held = points[i * 3 + axis]
      points[i * 3 + axis] = points[j * 3 + axis]
      points[j * 3 + axis] = held
    }
  }
  return points
}

function sphereFormation(count: number) {
  const points = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const radius = random(1.25, 1.75)
    points[i * 3] = Math.cos(golden * i) * r * radius
    points[i * 3 + 1] = y * radius
    points[i * 3 + 2] = Math.sin(golden * i) * r * radius
  }
  return points
}

function ringFormation(count: number) {
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const radius = 1.65 + random(-0.25, 0.25)
    points[i * 3] = Math.cos(angle) * radius
    points[i * 3 + 1] = Math.sin(angle) * radius
    points[i * 3 + 2] = random(-0.28, 0.28)
  }
  return points
}

function helixFormation(count: number) {
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = i / count
    const strand = i % 2 === 0 ? 0 : Math.PI
    const angle = t * Math.PI * 5 + strand
    points[i * 3] = Math.cos(angle) * 0.85 + random(-0.06, 0.06)
    points[i * 3 + 1] = (t - 0.5) * 4
    points[i * 3 + 2] = Math.sin(angle) * 0.85 + random(-0.06, 0.06)
  }
  return points
}

/** Samples text drawn on a small canvas, so the pieces spell it out. */
function glyphFormation(count: number) {
  const width = 150
  const height = 100
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })!
  context.font = '900 96px "Big Shoulders Display Variable", "Arial Narrow", sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(GLYPHS, width / 2, height / 2)
  const { data } = context.getImageData(0, 0, width, height)

  const filled: [number, number][] = []
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (data[(y * width + x) * 4 + 3] > 128) filled.push([x, y])
    }
  }

  const points = new Float32Array(count * 3)
  const scale = 4.6 / width
  for (let i = 0; i < count; i++) {
    const [x, y] = filled[Math.floor((i / count) * filled.length)] ?? [width / 2, height / 2]
    points[i * 3] = (x - width / 2) * scale
    points[i * 3 + 1] = (height / 2 - y) * scale
    points[i * 3 + 2] = random(-0.12, 0.12)
  }
  return points
}

/**
 * Paints the neon reflections onto a small texture. Each facet looks up its colour by the way it
 * faces, which reads as chrome in a neon room, at a fraction of the cost of real lighting.
 */
function neonMatcap() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')!
  context.fillStyle = '#16141f'
  context.fillRect(0, 0, size, size)
  context.globalCompositeOperation = 'lighter'

  const lights: [string, number, number, number][] = [
    ['#ff1f8f', 0.12, 0.42, 0.42],
    ['#00f0ff', 0.9, 0.56, 0.42],
    ['#fcee0a', 0.56, 0.06, 0.34],
    ['#8f93a8', 0.5, 0.5, 0.3],
    ['#ffffff', 0.34, 0.26, 0.1],
  ]
  for (const [colour, x, y, radius] of lights) {
    const gradient = context.createRadialGradient(x * size, y * size, 0, x * size, y * size, radius * size)
    gradient.addColorStop(0, colour)
    gradient.addColorStop(1, 'transparent')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

/**
 * One scene of slanted chrome shards, with a few glowing neon ones, that re-forms into a new
 * shape for each page. It holds no animation loop of its own: the caller runs draw().
 */
export function createShardScene(canvas: HTMLCanvasElement, count: number, reducedMotion: boolean): ShardScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 50)
  camera.position.z = CAMERA_Z

  const accentCount = Math.round(count * ACCENT_SHARE)
  const shardCount = count - accentCount
  const geometry = new OctahedronGeometry(1, 0)
  const matcap = neonMatcap()
  const chrome = new MeshMatcapMaterial({ matcap, flatShading: true })
  const glow = new MeshBasicMaterial({ color: '#ffffff' })
  const shards = new InstancedMesh(geometry, chrome, shardCount)
  const accents = new InstancedMesh(geometry, glow, accentCount)
  shards.frustumCulled = false
  accents.frustumCulled = false
  scene.add(shards, accents)

  const accentColour = new Color()
  for (let i = 0; i < accentCount; i++) {
    accents.setColorAt(i, accentColour.set(NEON[i % NEON.length]))
  }

  const formations: Record<Formation, Float32Array> = {
    sphere: shuffled(sphereFormation(count)),
    ring: shuffled(ringFormation(count)),
    helix: shuffled(helixFormation(count)),
    glyphs: shuffled(glyphFormation(count)),
  }

  // Fixed per-shard values: a long thin slanted shape, its own spin and its own morph delay.
  const sizes = new Float32Array(count * 3)
  const spins = new Float32Array(count * 3)
  const delays = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    sizes[i * 3] = random(0.05, 0.12)
    sizes[i * 3 + 1] = random(0.14, 0.38)
    sizes[i * 3 + 2] = random(0.03, 0.08)
    spins[i * 3] = random(-0.5, 0.5)
    spins[i * 3 + 1] = random(-0.7, 0.7)
    spins[i * 3 + 2] = random(0, Math.PI * 2)
    delays[i] = Math.random()
  }

  const from = formations.sphere.slice()
  const current = formations.sphere.slice()
  let to = formations.sphere
  const pushX = new Float32Array(count)
  const pushY = new Float32Array(count)

  const state = { x: 0, y: 0, size: 1, piece: 1, morph: 1, pointerTurn: 0 }
  const pointer = { x: 99, y: 99, active: false }
  const dummy = new Object3D()
  let halfWidth = HALF_HEIGHT

  function place(placement: Placement, instant: boolean) {
    from.set(current)
    to = formations[placement.formation]
    const piece = placement.formation === 'glyphs' ? GLYPH_PIECE_SCALE : 1

    gsap.killTweensOf(state)
    if (instant) {
      gsap.set(state, { x: placement.x, y: placement.y, size: placement.size, piece, morph: 1 })
      return
    }
    state.morph = 0
    gsap.to(state, {
      x: placement.x,
      y: placement.y,
      size: placement.size,
      piece,
      morph: 1,
      duration: MORPH_SECONDS,
      ease: 'power2.inOut',
    })
  }

  function setPointer(x: number, y: number) {
    pointer.x = x * halfWidth
    pointer.y = y * HALF_HEIGHT
    pointer.active = true
  }

  function draw(time: number, scrollY: number) {
    const turnGoal = pointer.active ? (pointer.x / halfWidth) * POINTER_TURN : 0
    state.pointerTurn += (turnGoal - state.pointerTurn) * 0.08

    const turn = (reducedMotion ? 0.6 : time * SPIN_SPEED) + state.pointerTurn + scrollY * SCROLL_TURN
    const cosY = Math.cos(turn)
    const sinY = Math.sin(turn)
    // Text has to stay readable, so the turn fades out as the pieces settle into glyphs.
    const flat = to === formations.glyphs ? state.morph : 0
    const tilt = TILT_X * (1 - flat)
    const cosX = Math.cos(tilt)
    const sinX = Math.sin(tilt)
    const originX = state.x * halfWidth
    const originY = state.y * HALF_HEIGHT
    const spinTime = reducedMotion ? 1 : time

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const local = gsap.utils.clamp(0, 1, state.morph * (1 + MORPH_STAGGER) - delays[i] * MORPH_STAGGER)
      const eased = local * local * (3 - 2 * local)
      const px = from[i3] + (to[i3] - from[i3]) * eased
      const py = from[i3 + 1] + (to[i3 + 1] - from[i3 + 1]) * eased
      const pz = from[i3 + 2] + (to[i3 + 2] - from[i3 + 2]) * eased
      current[i3] = px
      current[i3 + 1] = py
      current[i3 + 2] = pz

      const useCos = flat > 0 ? cosY + (1 - cosY) * flat : cosY
      const useSin = flat > 0 ? sinY * (1 - flat) : sinY
      const x1 = px * useCos + pz * useSin
      const z1 = -px * useSin + pz * useCos
      const y2 = py * cosX - z1 * sinX
      const z2 = py * sinX + z1 * cosX
      const worldX = originX + x1 * state.size
      const worldY = originY + y2 * state.size

      // Pieces near the pointer get pushed aside, then ease back.
      let goalX = 0
      let goalY = 0
      if (pointer.active && !reducedMotion) {
        const dx = worldX - pointer.x
        const dy = worldY - pointer.y
        const distance = Math.hypot(dx, dy) || 1
        if (distance < PUSH_RADIUS) {
          const force = (1 - distance / PUSH_RADIUS) * PUSH_STRENGTH
          goalX = (dx / distance) * force
          goalY = (dy / distance) * force
        }
      }
      pushX[i] += (goalX - pushX[i]) * PUSH_EASE
      pushY[i] += (goalY - pushY[i]) * PUSH_EASE

      dummy.position.set(worldX + pushX[i], worldY + pushY[i], z2 * state.size)
      dummy.rotation.set(spins[i3 + 2] + spinTime * spins[i3], spinTime * spins[i3 + 1], spins[i3 + 2])
      dummy.scale.set(sizes[i3], sizes[i3 + 1], sizes[i3 + 2]).multiplyScalar(state.size * state.piece)
      dummy.updateMatrix()
      if (i < shardCount) shards.setMatrixAt(i, dummy.matrix)
      else accents.setMatrixAt(i - shardCount, dummy.matrix)
    }

    shards.instanceMatrix.needsUpdate = true
    accents.instanceMatrix.needsUpdate = true
    renderer.render(scene, camera)
  }

  function resize(width: number, height: number) {
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    halfWidth = HALF_HEIGHT * camera.aspect
  }

  function dispose() {
    gsap.killTweensOf(state)
    geometry.dispose()
    chrome.dispose()
    glow.dispose()
    matcap.dispose()
    shards.dispose()
    accents.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { place, setPointer, draw, resize, dispose }
}
