import { useImperativeHandle, useRef, type ElementType, type ReactNode, type Ref } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'

const STEPS = 7
const STEP_SECONDS = 0.045
const OFFSET_EM = 0.035

export type GlitchHandle = {
  play: () => void
}

type Props = {
  /** The text copied into the decorative layers. */
  text: string
  as?: ElementType
  /** 'load' plays once on mount, 'hover' on hover or keyboard focus, 'manual' only through ref. */
  on?: 'load' | 'hover' | 'manual'
  className?: string
  /** What sighted users and screen readers get, when it is more than the plain text. */
  children?: ReactNode
  ref?: Ref<GlitchHandle>
}

/** RGB-split text: cyan and magenta copies jump around in random clipped slices. */
export default function GlitchText({ text, as: Tag = 'span', on = 'hover', className = '', children, ref }: Props) {
  const root = useRef<HTMLElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  const { contextSafe } = useGSAP({ scope: root })

  const play = contextSafe(() => {
    if (prefersReducedMotion() || timeline.current?.isActive()) return

    const layers = gsap.utils.toArray<HTMLElement>('[data-glitch-layer]', root.current)
    const offset = Math.max(2, parseFloat(getComputedStyle(root.current!).fontSize) * OFFSET_EM)
    const tl = gsap.timeline()

    tl.set(layers, { visibility: 'visible' }, 0)
    for (let step = 0; step < STEPS; step++) {
      layers.forEach((layer, index) => {
        const top = gsap.utils.random(0, 80)
        const bottom = gsap.utils.random(0, 95 - top)
        const direction = index === 0 ? 1 : -1
        tl.set(
          layer,
          {
            clipPath: `inset(${top}% 0 ${bottom}% 0)`,
            x: direction * gsap.utils.random(offset * 0.4, offset),
          },
          step * STEP_SECONDS,
        )
      })
    }
    tl.set(layers, { visibility: 'hidden', clearProps: 'clipPath,transform' }, STEPS * STEP_SECONDS)
    timeline.current = tl
  })

  useImperativeHandle(ref, () => ({ play }), [play])

  useGSAP(
    () => {
      if (on === 'load') {
        play()
        return
      }
      if (on !== 'hover') return

      // A link or button reacts across its whole area, not only over the letters.
      const target = root.current!.closest('a, button') ?? root.current!
      target.addEventListener('mouseenter', play)
      target.addEventListener('focusin', play)
      return () => {
        target.removeEventListener('mouseenter', play)
        target.removeEventListener('focusin', play)
      }
    },
    { scope: root, dependencies: [on] },
  )

  return (
    <Tag ref={root} className={`relative inline-block ${className}`}>
      {children ?? text}
      <span aria-hidden data-glitch-layer className="glitch-layer text-neon-cyan">
        {text}
      </span>
      <span aria-hidden data-glitch-layer className="glitch-layer text-neon-magenta">
        {text}
      </span>
    </Tag>
  )
}
