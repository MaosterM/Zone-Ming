import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useSyncExternalStore } from 'react'

gsap.registerPlugin(useGSAP)

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
