import Reveal from './Reveal'

const TICKS = ['bg-neon-yellow', 'bg-neon-yellow', 'bg-neon-magenta', 'bg-neon-cyan', 'bg-line']

/** A full-width divider of lightly diagonal neon lines that draws in as it scrolls into view. */
export default function SectionBreak({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none relative h-20 md:h-28">
      <Reveal className="absolute inset-0">
        <svg viewBox="0 0 1440 112" preserveAspectRatio="none" className={`size-full ${flip ? '-scale-x-100' : ''}`} fill="none">
          <path d="M0 84 L1440 40" stroke="var(--color-neon-yellow)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M0 96 L1440 52" stroke="var(--color-neon-magenta)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M0 106 L1440 62" stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className={`absolute top-1 flex gap-1.5 md:top-2 ${flip ? 'left-6 md:left-12' : 'right-6 md:right-12'}`}>
          {TICKS.map((colour, index) => (
            <span key={index} className={`block h-3 w-5 -skew-x-12 md:h-4 md:w-8 ${colour}`} />
          ))}
        </div>
      </Reveal>
    </div>
  )
}
