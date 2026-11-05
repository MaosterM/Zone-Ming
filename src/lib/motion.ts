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
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeToQuery(query: string, onChange: () => void) {
  const list = window.matchMedia(query)
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/** Follows the OS setting live, so changing it does not need a reload. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore((onChange) => subscribeToQuery(REDUCED_MOTION_QUERY, onChange), prefersReducedMotion)
}

function hasFinePointer() {
  return window.matchMedia(FINE_POINTER_QUERY).matches
}

/** True for a mouse or trackpad, false on touch devices. */
export function useHasFinePointer() {
  return useSyncExternalStore((onChange) => subscribeToQuery(FINE_POINTER_QUERY, onChange), hasFinePointer)
}

export { gsap, useGSAP }
