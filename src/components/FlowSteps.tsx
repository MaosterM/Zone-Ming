import type { Note } from '../data/profile'
import Reveal from './Reveal'

/** Numbered stages of a process, in reading order. */
export default function FlowSteps({ steps }: { steps: Note[] }) {
  return (
    <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal className="h-full">
            <div className="hud-panel h-full p-6">
              <p className="font-mono text-sm text-neon-magenta">{String(index + 1).padStart(2, '0')} /</p>
              <h3 className="mt-2 font-display text-3xl leading-none font-extrabold text-ink uppercase">{step.title}</h3>
              <p className="mt-3 text-base text-muted">{step.text}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
