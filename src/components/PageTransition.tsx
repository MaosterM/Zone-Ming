import { useEffect, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, type Location } from 'react-router'
import { COVER_HOLD_SECONDS, gsap, prefersReducedMotion } from '../lib/motion'
import { routeLabel } from '../lib/routes'
import { lockScroll, resetScroll, unlockScroll } from '../lib/smoothScroll'
import { TransitionContext, type TransitionPhase } from '../lib/transition'

const SLAB_SKEW = -14
const OFFSCREEN = 112 // xPercent that clears the viewport, including the skew overhang
const LABEL_WIDTH_FACTOR = 200 // vw per character, so long project titles still fit

type Props = {
  /** Receives the location to render, which only changes while the screen is covered. */
  children: (location: Location) => ReactNode
}

/**
 * The signature wipe: three slanted slabs sweep across, the destination name flashes on the
 * last one, the route swaps while covered, then the slabs sweep off. Everything reacts to the
 * router location, so links, buttons and browser back/forward all take the same path.
 */
export default function PageTransition({ children }: Props) {
  const location = useLocation()
  const [displayed, setDisplayed] = useState(location)
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [announcement, setAnnouncement] = useState('')

  const overlay = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const path = useRef<HTMLSpanElement>(null)
  const displayedPath = useRef(location.pathname)
  const latest = useRef(location)
  const busy = useRef(false)

  function swapTo(target: Location) {
    displayedPath.current = target.pathname
    flushSync(() => {
      setDisplayed(target)
      setAnnouncement(routeLabel(target.pathname))
    })
    resetScroll()
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  function finish() {
    busy.current = false
    setPhase('idle')
    unlockScroll()
    // A back or forward press during the wipe is honoured once it ends.
    if (latest.current.pathname !== displayedPath.current) run(latest.current)
  }

  function run(target: Location) {
    if (prefersReducedMotion()) {
      // run() can be called from an effect, where flushSync is not allowed.
      queueMicrotask(() => swapTo(target))
      return
    }

    busy.current = true
    setPhase('covering')
    lockScroll()

    const name = routeLabel(target.pathname)
    label.current!.textContent = name
    label.current!.style.fontSize = `min(${LABEL_WIDTH_FACTOR / name.length}vw, 48vh)`
    path.current!.textContent = `> ${target.pathname}`

    const slabs = gsap.utils.toArray<HTMLElement>('[data-slab]', overlay.current)

    gsap
      .timeline({ onComplete: finish })
      .set(overlay.current, { display: 'block' })
      .set(slabs, { skewX: SLAB_SKEW, xPercent: -OFFSCREEN })
      .to(slabs, { xPercent: 0, duration: 0.34, ease: 'power4.out', stagger: 0.07 })
      .fromTo(
        label.current,
        { opacity: 0, scale: 1.35 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'power4.out' },
        '-=0.2',
      )
      .call(() => swapTo(target))
      .to({}, { duration: COVER_HOLD_SECONDS })
      .call(() => setPhase('revealing'))
      .to(slabs, {
        xPercent: OFFSCREEN,
        duration: 0.32,
        ease: 'power3.in',
        stagger: { each: 0.05, from: 'end' },
      })
      .set(overlay.current, { display: 'none' })
  }

  useEffect(() => {
    latest.current = location
    if (location.pathname === displayedPath.current) {
      setDisplayed(location)
      return
    }
    if (!busy.current) run(location)
  }, [location])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'

    // Blocks double-clicks and any other link or button press during the wipe.
    function blockWhileBusy(event: MouseEvent) {
      if (!busy.current) return
      if ((event.target as Element).closest('a, button')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener('click', blockWhileBusy, true)
    return () => document.removeEventListener('click', blockWhileBusy, true)
  }, [])

  return (
    <TransitionContext.Provider value={phase}>
      {children(displayed)}

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div ref={overlay} aria-hidden className="fixed inset-0 z-50 hidden overflow-hidden">
        <div data-slab className="absolute inset-y-0 -left-[30vw] w-[160vw] bg-neon-yellow" />
        <div data-slab className="absolute inset-y-0 -left-[30vw] w-[160vw] bg-neon-magenta" />
        <div
          data-slab
          className="absolute inset-y-0 -left-[30vw] flex w-[160vw] flex-col items-center justify-center gap-4 border-x-8 border-neon-cyan bg-night"
        >
          <span
            ref={label}
            className="block font-display leading-[0.85] font-black whitespace-nowrap text-neon-yellow uppercase"
          />
          <span ref={path} className="font-mono text-sm text-neon-cyan md:text-base" />
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
