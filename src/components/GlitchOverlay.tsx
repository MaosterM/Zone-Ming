import { useRef } from 'react'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'

const SLICE_COUNT = 4
const FLICKER_STEPS = 3
const FLICKER_STEP_SECONDS = 0.05 // three steps make the ~150 ms flicker
const MIN_WAIT_SECONDS = 4
const MAX_WAIT_SECONDS = 8

/** Faint scanlines, plus a brief slice and RGB-split flicker across the screen. */
export default function GlitchOverlay() {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const slices = gsap.utils.toArray<HTMLElement>('[data-slice]', root.current)
      let timer: gsap.core.Tween | undefined

      function scatter() {
        slices.forEach((slice) => {
          gsap.set(slice, {
            display: 'block',
            top: `${gsap.utils.random(0, 96)}%`,
            height: `${gsap.utils.random(0.5, 5)}%`,
            x: gsap.utils.random(-24, 24),
          })
        })
        gsap.set('#main', { x: gsap.utils.random(-4, 4) })
      }

      function rest() {
        gsap.set(slices, { display: 'none' })
        gsap.set('#main', { clearProps: 'transform' })
        document.documentElement.classList.remove('is-glitching')
        schedule()
      }

      function flicker() {
        document.documentElement.classList.add('is-glitching')
        const timeline = gsap.timeline({ onComplete: rest })
        for (let step = 0; step < FLICKER_STEPS; step++) {
          timeline.call(scatter, undefined, step * FLICKER_STEP_SECONDS)
        }
        timeline.to({}, { duration: FLICKER_STEP_SECONDS })
      }

      function schedule() {
        timer = gsap.delayedCall(gsap.utils.random(MIN_WAIT_SECONDS, MAX_WAIT_SECONDS), flicker)
      }

      schedule()

      return () => {
        timer?.kill()
        document.documentElement.classList.remove('is-glitching')
      }
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div className="scanlines absolute inset-0" />
      {Array.from({ length: SLICE_COUNT }, (_, index) => (
        <div key={index} data-slice className="glitch-slice absolute inset-x-0 hidden" />
      ))}
    </div>
  )
}
