import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'
import { useTransitionPhase } from '../lib/transition'

const HIDDEN = 'polygon(0 0, 0 0, 0 100%, 0 100%)'
const SHOWN = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'

/** Wipes its content in from the left the first time it scrolls into view. */
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const covered = useTransitionPhase() === 'covering'
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || played.current) return

      gsap.set(root.current, { clipPath: HIDDEN, y: 28 })
      if (covered) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          played.current = true
          gsap.to(root.current, {
            clipPath: SHOWN,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            clearProps: 'clipPath,transform',
          })
        },
        { rootMargin: '0px 0px -6% 0px' },
      )
      observer.observe(root.current!)

      return () => {
        observer.disconnect()
        played.current = false
      }
    },
    { scope: root, dependencies: [covered, reducedMotion] },
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
