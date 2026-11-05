import { useRef } from 'react'
import ButtonLink from '../components/ButtonLink'
import GlitchText, { type GlitchHandle } from '../components/GlitchText'
import ScrambleText from '../components/ScrambleText'
import { profile } from '../data/profile'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'
import { usePageTitle } from '../lib/routes'
import { useTransitionPhase } from '../lib/transition'

const FONT_WAIT_MS = 800

// First name on one line, the rest on the next.
const [firstWord, ...otherWords] = profile.name.split(' ')
const nameLines = [
  { words: [firstWord], colour: 'text-neon-yellow' },
  { words: otherWords, colour: 'text-ink' },
]

function displayFontReady() {
  return Promise.race([
    document.fonts.load('900 100px "Big Shoulders Display Variable"'),
    new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS)),
  ])
}

export default function Home() {
  usePageTitle('Home')

  const root = useRef<HTMLElement>(null)
  const glitches = useRef<GlitchHandle[]>([])
  const played = useRef(false)
  const phase = useTransitionPhase()
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    (_, contextSafe) => {
      if (reducedMotion || played.current) return

      const words = gsap.utils.toArray<HTMLElement>('[data-word]', root.current)
      const slabs = gsap.utils.toArray<HTMLElement>('[data-word-slab]', root.current)
      const details = gsap.utils.toArray<HTMLElement>('[data-detail]', root.current)

      gsap.set(words, { yPercent: 118, skewY: 7 })
      gsap.set(slabs, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(details, { autoAlpha: 0, y: 24 })

      // Arriving through a wipe, the name stays hidden until the slabs start to leave.
      if (phase === 'covering') return
      played.current = true

      let cancelled = false
      const play = contextSafe!(() => {
        if (cancelled) return

        gsap
          .timeline()
          .to(slabs, { scaleX: 1, duration: 0.2, ease: 'power4.in', stagger: 0.09 }, 0)
          .to(words, { yPercent: 0, skewY: 0, duration: 0.6, ease: 'power4.out', stagger: 0.09 }, 0.16)
          .set(slabs, { transformOrigin: 'right center' }, 0.36)
          .to(slabs, { scaleX: 0, duration: 0.26, ease: 'power4.out', stagger: 0.09 }, 0.36)
          .fromTo(
            '[data-name]',
            { x: -10, y: 5 },
            { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1.4, 0.3)', clearProps: 'transform' },
            0.42,
          )
          .call(() => glitches.current.forEach((glitch) => glitch?.play()), undefined, 0.78)
          .to(details, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.out', stagger: 0.08 }, 0.72)
      })

      displayFontReady().then(play, play)

      return () => {
        cancelled = true
        played.current = false
      }
    },
    { scope: root, dependencies: [phase, reducedMotion] },
  )

  return (
    <section ref={root} className="flex flex-1 flex-col justify-end gap-6 overflow-x-clip px-6 pt-24 pb-2 md:gap-8 md:px-12">
      <h1
        data-name
        className="font-display text-[min(30vw,42svh)] leading-[0.84] font-black tracking-tight uppercase"
      >
        {nameLines.map((line, lineIndex) => (
          <span key={line.words.join(' ')} className={`block whitespace-nowrap ${line.colour}`}>
            {line.words.map((word, wordIndex) => (
              <span key={word}>
                {wordIndex > 0 && ' '}
                <span className="word-mask">
                  <span data-word className="inline-block">
                    <GlitchText
                      text={word}
                      on="manual"
                      ref={(handle) => {
                        if (handle) glitches.current[lineIndex * 10 + wordIndex] = handle
                      }}
                    />
                  </span>
                  <span
                    data-word-slab
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-neon-magenta"
                  />
                </span>
              </span>
            ))}
            {lineIndex < nameLines.length - 1 && ' '}
          </span>
        ))}
      </h1>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <p data-detail className="text-halo max-w-xl text-lg text-ink md:text-2xl">
          <span aria-hidden className="mb-1 block font-mono text-sm text-neon-cyan md:text-base">
            &gt; whoami
          </span>
          <ScrambleText text={profile.role} multiline />
        </p>

        <div data-detail className="flex shrink-0 flex-col gap-5 sm:flex-row">
          <ButtonLink to="/work">See my work</ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Contact me
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
