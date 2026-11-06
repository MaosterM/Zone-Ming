import type { Stat } from '../data/profile'
import Reveal from './Reveal'

/** A telemetry strip of headline figures. */
export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <Reveal>
      <dl className="hud-panel grid grid-cols-2 gap-x-6 gap-y-8 p-6 md:p-8 lg:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse justify-end gap-2">
            <dt className="hud-label">{stat.label}</dt>
            <dd className="font-display text-4xl leading-none font-black text-neon-yellow md:text-6xl">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
