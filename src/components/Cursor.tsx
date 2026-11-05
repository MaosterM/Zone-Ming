import { useRef, useSyncExternalStore } from 'react'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]'

function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function hasFinePointer() {
  return window.matchMedia(FINE_POINTER_QUERY).matches
}

/** Neon crosshair with a trailing slanted block. Touch devices keep their normal behaviour. */
export default function Cursor() {
  const finePointer = useSyncExternalStore(subscribeToPointer, hasFinePointer)
  const reducedMotion = usePrefersReducedMotion()
  const crosshair = useRef<HTMLDivElement>(null)
  const block = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!finePointer) return

      const root = document.documentElement
      root.classList.add('has-custom-cursor')

      const trailSeconds = reducedMotion ? 0 : 0.35
      const crosshairX = gsap.quickSetter(crosshair.current, 'x', 'px')
      const crosshairY = gsap.quickSetter(crosshair.current, 'y', 'px')
      const blockX = gsap.quickTo(block.current, 'x', { duration: trailSeconds, ease: 'power3.out' })
      const blockY = gsap.quickTo(block.current, 'y', { duration: trailSeconds, ease: 'power3.out' })
      let visible = false

      function onMove(event: PointerEvent) {
        crosshairX(event.clientX)
        crosshairY(event.clientY)
        blockX(event.clientX)
        blockY(event.clientY)
        if (!visible) {
          visible = true
          gsap.set([crosshair.current, block.current], { autoAlpha: 1 })
        }
      }

      function onOver(event: PointerEvent) {
        const active = (event.target as Element).closest(INTERACTIVE) !== null
        gsap.to(block.current, {
          scale: active ? 1.8 : 1,
          duration: reducedMotion ? 0 : 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      function onLeave() {
        visible = false
        gsap.set([crosshair.current, block.current], { autoAlpha: 0 })
      }

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver, { passive: true })
      root.addEventListener('pointerleave', onLeave)

      return () => {
        root.classList.remove('has-custom-cursor')
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        root.removeEventListener('pointerleave', onLeave)
      }
    },
    { dependencies: [finePointer, reducedMotion], revertOnUpdate: true },
  )

  if (!finePointer) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div ref={block} className="invisible absolute top-0 left-0">
        <span className="absolute -top-2 -left-4 block h-4 w-8 -skew-x-12 border-2 border-neon-magenta" />
      </div>
      <div ref={crosshair} className="invisible absolute top-0 left-0">
        <span className="absolute -top-px -left-2.5 h-0.5 w-5 bg-neon-cyan" />
        <span className="absolute -top-2.5 -left-px h-5 w-0.5 bg-neon-cyan" />
      </div>
    </div>
  )
}
