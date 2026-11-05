import { useRef } from 'react'
import { useLocation } from 'react-router'
import ButtonLink from '../components/ButtonLink'
import GlitchText, { type GlitchHandle } from '../components/GlitchText'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'
import { usePageTitle } from '../lib/routes'
import { useTransitionPhase } from '../lib/transition'

const MIN_WAIT_SECONDS = 0.8
const MAX_WAIT_SECONDS = 3

export default function NotFound() {
  usePageTitle('Signal lost')

  const { pathname } = useLocation()
  const first = useRef<GlitchHandle>(null)
  const second = useRef<GlitchHandle>(null)
  const covered = useTransitionPhase() === 'covering'
  const reducedMotion = usePrefersReducedMotion()

  // Unlike the rest of the site this heading keeps glitching, as the signal cuts in and out.
  useGSAP(
    () => {
      if (covered || reducedMotion) return

      let timer: gsap.core.Tween | undefined

      function glitch() {
        first.current?.play()
        second.current?.play()
        timer = gsap.delayedCall(gsap.utils.random(MIN_WAIT_SECONDS, MAX_WAIT_SECONDS), glitch)
      }

      glitch()
      return () => timer?.kill()
    },
    { dependencies: [covered, reducedMotion], revertOnUpdate: true },
  )

  return (
    <section className="flex flex-1 flex-col justify-center gap-6 px-6 pt-24 pb-8 md:px-12">
      <p className="text-halo font-mono text-base text-neon-magenta">Error 404</p>
      <h1 className="signal-split font-display text-[min(30vw,32svh)] leading-[0.84] font-black tracking-tight uppercase">
        <span className="block">
          <GlitchText ref={first} text="Signal" on="manual" />
        </span>{' '}
        <span className="block text-neon-yellow">
          <GlitchText ref={second} text="lost" on="manual" />
        </span>
      </h1>
      <p className="text-halo font-mono text-base break-all text-ink">No page at {pathname}</p>
      <div>
        <ButtonLink to="/">Back home</ButtonLink>
      </div>
    </section>
  )
}
