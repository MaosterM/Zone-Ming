import { useEffect, useRef, type ElementType } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { useTransitionPhase } from '../lib/transition'

const GLYPHS = 'アカサタナハマヤラワ0123456789#%&/<>+=*_'
const SECONDS_PER_CHARACTER = 0.045
const MIN_SECONDS = 0.35
const MAX_SECONDS = 1.1
const VIEW_THRESHOLD = 0.4

type Props = {
  text: string
  as?: ElementType
  /** 'view' plays once on entering the viewport, 'hover' on hover or keyboard focus. */
  on?: 'view' | 'hover'
  className?: string
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

/**
 * Decode effect: random glyphs settle into the text from left to right. The real text stays
 * in the DOM, only made transparent while an aria-hidden copy does the scrambling.
 */
export default function ScrambleText({ text, as: Tag = 'span', on = 'view', className = '' }: Props) {
  const root = useRef<HTMLElement>(null)
  const real = useRef<HTMLSpanElement>(null)
  const overlay = useRef<HTMLSpanElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  const phase = useTransitionPhase()

  const { contextSafe } = useGSAP({ scope: root })

  const play = contextSafe(() => {
    if (prefersReducedMotion()) return

    const copy = overlay.current!
    const original = real.current!
    const progress = { value: 0 }

    tween.current?.kill()
    gsap.set(original, { opacity: 0 })
    gsap.set(copy, { display: 'block' })

    let frame = 0
    tween.current = gsap.to(progress, {
      value: 1,
      duration: gsap.utils.clamp(MIN_SECONDS, MAX_SECONDS, text.length * SECONDS_PER_CHARACTER),
      ease: 'none',
      onUpdate() {
        // Changing glyphs every other frame reads as decoding rather than noise.
        if (frame++ % 2) return
        const settled = Math.floor(progress.value * text.length)
        copy.textContent = [...text]
          .map((character, index) => (index < settled || character === ' ' ? character : randomGlyph()))
          .join('')
      },
      onComplete() {
        copy.textContent = ''
        gsap.set(copy, { display: 'none' })
        gsap.set(original, { clearProps: 'opacity' })
      },
    })
  })

  // Waits for the wipe to finish, so a heading never decodes unseen behind the slabs.
  useEffect(() => {
    if (on !== 'view' || phase === 'covering') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        play()
      },
      { threshold: VIEW_THRESHOLD },
    )
    observer.observe(root.current!)
    return () => observer.disconnect()
    // play is stable for this purpose: it only reads refs and the current text.
  }, [on, phase, text])

  useEffect(() => {
    if (on !== 'hover') return

    const target = root.current!.closest('a, button') ?? root.current!
    target.addEventListener('mouseenter', play)
    target.addEventListener('focusin', play)
    return () => {
      target.removeEventListener('mouseenter', play)
      target.removeEventListener('focusin', play)
    }
  }, [on, text])

  return (
    <Tag ref={root} className={`relative inline-block ${className}`}>
      <span ref={real}>{text}</span>
      <span
        ref={overlay}
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden overflow-hidden whitespace-nowrap select-none"
      />
    </Tag>
  )
}
