import { useEffect, useRef } from 'react'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789CYMZX'
const FONT = '"Yu Gothic", "MS Gothic", "Hiragino Kaku Gothic ProN", "Noto Sans JP", monospace'

// Weighted so most columns are cyan or green, with the occasional magenta or yellow.
const PALETTE = [
  { weight: 0.58, trail: '#00f0ff', head: '#d9fdff' },
  { weight: 0.3, trail: '#2bff9a', head: '#d8ffec' },
  { weight: 0.07, trail: '#ff1f8f', head: '#ffc4e3' },
  { weight: 0.05, trail: '#fcee0a', head: '#fffbb8' },
]

const FRAME_SECONDS = 1 / 30
const MAX_DPR = 2
const RESIZE_DEBOUNCE_MS = 200
const TRAIL_FADE = 0.06
const WARM_UP_FRAMES = 90

type Column = {
  x: number
  y: number
  speed: number
  cell: number
  glyph: string
  trail: string
  head: string
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function randomColours() {
  let roll = Math.random()
  for (const entry of PALETTE) {
    roll -= entry.weight
    if (roll <= 0) return entry
  }
  return PALETTE[0]
}

function startRain(canvas: HTMLCanvasElement, reducedMotion: boolean) {
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return () => {}

  let columns: Column[] = []
  let width = 0
  let height = 0
  let cellSize = 18
  let lastFrame = 0
  let resizeTimer = 0

  function setup() {
    width = canvas.clientWidth
    height = canvas.clientHeight
    cellSize = width < 768 ? 14 : 18

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx!.font = `${cellSize}px ${FONT}`
    ctx!.textAlign = 'center'
    ctx!.textBaseline = 'top'

    const rows = height / cellSize
    columns = Array.from({ length: Math.ceil(width / cellSize) }, (_, index) => {
      const { trail, head } = randomColours()
      return {
        x: index * cellSize + cellSize / 2,
        y: -Math.random() * rows,
        speed: 0.2 + Math.random() * 0.4,
        cell: -1,
        glyph: randomGlyph(),
        trail,
        head,
      }
    })

    // Run the rain forward so the first visible frame already has full trails.
    for (let frame = 0; frame < WARM_UP_FRAMES; frame++) drawFrame()
  }

  function drawFrame() {
    const c = ctx!
    c.globalCompositeOperation = 'destination-out'
    c.fillStyle = `rgb(0 0 0 / ${TRAIL_FADE})`
    c.fillRect(0, 0, width, height)
    c.globalCompositeOperation = 'source-over'

    const rows = height / cellSize
    for (const column of columns) {
      column.y += column.speed
      const cell = Math.floor(column.y)

      if (cell !== column.cell) {
        if (column.cell >= 0) {
          // The old head settles into the dimmer trail colour.
          c.clearRect(column.x - cellSize / 2, column.cell * cellSize, cellSize, cellSize)
          c.fillStyle = column.trail
          c.fillText(column.glyph, column.x, column.cell * cellSize)
        }
        column.cell = cell
        column.glyph = randomGlyph()
        if (cell >= 0) {
          c.fillStyle = column.head
          c.fillText(column.glyph, column.x, cell * cellSize)
        }
      }

      if (cell > rows && Math.random() > 0.97) {
        const { trail, head } = randomColours()
        column.y = -Math.random() * rows * 0.5
        column.cell = -1
        column.speed = 0.2 + Math.random() * 0.4
        column.trail = trail
        column.head = head
      }
    }
  }

  function onTick(time: number) {
    if (time - lastFrame < FRAME_SECONDS) return
    lastFrame = time
    drawFrame()
  }

  function onVisibilityChange() {
    if (document.hidden) gsap.ticker.remove(onTick)
    else gsap.ticker.add(onTick)
  }

  function onResize() {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (canvas.clientWidth !== width || canvas.clientHeight !== height) setup()
    }, RESIZE_DEBOUNCE_MS)
  }

  setup()
  window.addEventListener('resize', onResize)

  // Under reduced motion the warmed-up canvas stays as one static frame.
  if (!reducedMotion) {
    gsap.ticker.add(onTick)
    document.addEventListener('visibilitychange', onVisibilityChange)
  }

  return () => {
    window.clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    gsap.ticker.remove(onTick)
  }
}

/** Falling glyph columns on a canvas. `opacity` is tweened so pages can dim it. */
export default function MatrixRain({ opacity }: { opacity: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => startRain(canvas.current!, reducedMotion), [reducedMotion])

  useGSAP(() => {
    gsap.to(canvas.current, { opacity, duration: reducedMotion ? 0 : 0.8, ease: 'power2.out' })
  }, [opacity, reducedMotion])

  return <canvas ref={canvas} className="absolute inset-0 size-full opacity-0" />
}
