import { useEffect, useRef } from 'react'
import { gsap, useHasFinePointer, usePrefersReducedMotion } from '../lib/motion'
import { placementFor } from '../lib/scenePlacements'
import type { ShardScene } from '../lib/shardScene'

const FRAME_SECONDS = 1 / 30
const RESIZE_DEBOUNCE_MS = 200
const IDLE_TIMEOUT_MS = 1500
const SHARDS_WIDE = 200
const SHARDS_TALL = 110
const TALL_RATIO = 1
const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|software|basic render/i

function isTall() {
  return window.innerWidth / window.innerHeight < TALL_RATIO
}

// Checked first, so devices without a real GPU skip the download, three.js's console errors, and
// the jank of drawing WebGL on the CPU. The rest of the background still runs for them.
function hasGpuWebGL() {
  const gl = document.createElement('canvas').getContext('webgl2')
  if (!gl) return false

  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  return !SOFTWARE_RENDERERS.test(renderer)
}

/** The shared 3D layer. three.js loads separately, once the page is idle, so it never delays the page. */
export default function Scene3D({ pathname }: { pathname: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<ShardScene | null>(null)
  const latestPath = useRef(pathname)
  const reducedMotion = usePrefersReducedMotion()
  const finePointer = useHasFinePointer()

  useEffect(() => {
    latestPath.current = pathname
    if (!scene.current) return

    const placement = placementFor(pathname, isTall())
    scene.current.place(placement, reducedMotion)
    gsap.to(canvas.current, { opacity: placement.opacity, duration: reducedMotion ? 0 : 0.8, ease: 'power2.out', overwrite: true })
    // Under reduced motion nothing else redraws, so the new shape is drawn once here.
    if (reducedMotion) scene.current.draw(0, 0)
  }, [pathname, reducedMotion])

  useEffect(() => {
    if (!hasGpuWebGL()) return

    const element = canvas.current!
    const tall = isTall()
    let cancelled = false
    let created: ShardScene | null = null
    let removeLoop = () => {}
    let resizeTimer = 0

    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!created) return
        created.resize(element.clientWidth, element.clientHeight)
        created.place(placementFor(latestPath.current, isTall()), true)
        if (reducedMotion) created.draw(0, 0)
      }, RESIZE_DEBOUNCE_MS)
    }

    async function start() {
      const { createShardScene } = await import('../lib/shardScene')
      if (cancelled) return

      try {
        created = createShardScene(element, tall ? SHARDS_TALL : SHARDS_WIDE, reducedMotion)
      } catch {
        // No WebGL here. The rest of the background still works without this layer.
        return
      }
      scene.current = created
      const current = created
      current.resize(element.clientWidth, element.clientHeight)

      const placement = placementFor(latestPath.current, tall)
      current.place(placement, true)
      current.draw(0, 0)
      gsap.to(element, { opacity: placement.opacity, duration: reducedMotion ? 0 : 1, ease: 'power2.out' })
      window.addEventListener('resize', onResize)
      if (reducedMotion) return

      let lastFrame = 0
      function onTick(time: number) {
        const elapsed = time - lastFrame
        if (elapsed < FRAME_SECONDS) return
        lastFrame = time - (elapsed % FRAME_SECONDS)
        current.draw(time, window.scrollY)
      }
      function onVisibilityChange() {
        if (document.hidden) gsap.ticker.remove(onTick)
        else gsap.ticker.add(onTick)
      }
      gsap.ticker.add(onTick)
      document.addEventListener('visibilitychange', onVisibilityChange)
      removeLoop = () => {
        gsap.ticker.remove(onTick)
        document.removeEventListener('visibilitychange', onVisibilityChange)
      }
    }

    const useIdle = 'requestIdleCallback' in window
    const handle = useIdle
      ? window.requestIdleCallback(() => void start(), { timeout: IDLE_TIMEOUT_MS })
      : window.setTimeout(() => void start(), IDLE_TIMEOUT_MS)

    return () => {
      cancelled = true
      if (useIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      removeLoop()
      created?.dispose()
      scene.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!finePointer || reducedMotion) return

    function onMove(event: PointerEvent) {
      scene.current?.setPointer((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [finePointer, reducedMotion])

  return <canvas ref={canvas} className="absolute inset-0 size-full opacity-0" />
}
