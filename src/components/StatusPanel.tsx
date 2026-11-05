import { useRef } from 'react'
import { profile, projects, skills } from '../data/profile'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'
import { useTransitionPhase } from '../lib/transition'

const CHARACTERS_PER_SECOND = 70
const VIEW_THRESHOLD = 0.3

// Every value comes from the profile data, so the panel can never state anything invented.
const skillCount = skills.flatMap((group) => group.items).filter((item) => !item.startsWith('TODO')).length
const lines = [
  { key: 'name', value: profile.name },
  { key: 'role', value: profile.role },
  { key: 'status', value: profile.status },
  { key: 'projects', value: String(projects.length) },
  { key: 'skills', value: String(skillCount) },
]

/** Terminal-style panel. Its lines type in with a stepped reveal, and the text is always in the DOM. */
export default function StatusPanel() {
  const root = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const covered = useTransitionPhase() === 'covering'
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || played.current) return

      const rows = gsap.utils.toArray<HTMLElement>('[data-status-line]', root.current)
      gsap.set(rows, { clipPath: 'inset(0 100% 0 0)' })
      if (covered) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          played.current = true

          const timeline = gsap.timeline()
          rows.forEach((row) => {
            const characters = row.textContent?.length ?? 1
            timeline.to(row, {
              clipPath: 'inset(0 0% 0 0)',
              duration: characters / CHARACTERS_PER_SECOND,
              ease: `steps(${characters})`,
              clearProps: 'clipPath',
            })
          })
        },
        { threshold: VIEW_THRESHOLD },
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
    <div ref={root} className="border-2 border-neon-cyan bg-night-raised font-mono text-sm md:text-base">
      <div className="flex items-center justify-between border-b-2 border-neon-cyan px-4 py-2 text-neon-cyan">
        <span>status.sh</span>
        <span aria-hidden>[ online ]</span>
      </div>
      <dl className="flex flex-col gap-2 p-4">
        {lines.map((line) => (
          <div key={line.key} data-status-line className="flex flex-wrap gap-x-3">
            <dt className="text-neon-yellow">{line.key}:</dt>
            <dd className="text-ink">{line.value}</dd>
          </div>
        ))}
      </dl>
      <p aria-hidden className="px-4 pb-4 text-neon-cyan">
        &gt; <span className="status-caret inline-block h-[1em] w-[0.6em] translate-y-[0.15em] bg-neon-cyan" />
      </p>
    </div>
  )
}
