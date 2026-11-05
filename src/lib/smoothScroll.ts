import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'
import { gsap, usePrefersReducedMotion } from './motion'

let lenis: Lenis | null = null

function raf(time: number) {
  lenis?.raf(time * 1000)
}

/** Runs Lenis from gsap.ticker, and not at all under reduced motion. */
export function useSmoothScroll() {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    lenis = new Lenis()
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [reducedMotion])
}

export function lockScroll() {
  lenis?.stop()
}

export function unlockScroll() {
  lenis?.start()
}

export function resetScroll() {
  lenis?.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}
