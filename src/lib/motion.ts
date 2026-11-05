import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useSyncExternalStore } from 'react'

gsap.registerPlugin(useGSAP)

/** How long the transition holds the screen covered while the route swaps. */
export const COVER_HOLD_SECONDS = 0.25

// A slow frame may never advance timelines further than the cover hold. Otherwise one long
// frame could jump past the whole hold and show the route swap uncovered.
gsap.ticker.lagSmoothing(COVER_HOLD_SECONDS * 1000, 100)

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** Follows the OS setting live, so changing it does not need a reload. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, prefersReducedMotion)
}

export { gsap, useGSAP }
