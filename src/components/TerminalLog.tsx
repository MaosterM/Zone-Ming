import { Link } from 'react-router'
import Reveal from './Reveal'

export type LogLine = {
  stamp: string
  text: string
  /** A page on this site that the line links to. */
  to?: string
}

/** A terminal-style event log. */
export default function TerminalLog({ title, lines }: { title: string; lines: LogLine[] }) {
  return (
    <Reveal>
      <div className="hud-panel font-mono text-sm md:text-base">
        <p className="border-b border-line px-5 py-3 text-neon-cyan">{title}</p>
        <ol className="flex flex-col gap-3 p-5">
          {lines.map((line) => (
            <li key={`${line.stamp}${line.text}`} className="grid gap-x-4 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
              <span className="text-neon-yellow">{line.stamp}</span>
              {line.to ? (
                <Link to={line.to} className="text-ink underline decoration-neon-magenta underline-offset-4 hover:text-neon-yellow">
                  {line.text}
                </Link>
              ) : (
                <span className="text-ink">{line.text}</span>
              )}
            </li>
          ))}
        </ol>
        <p aria-hidden className="px-5 pb-5 text-neon-cyan">
          &gt; <span className="status-caret inline-block h-[1em] w-[0.6em] translate-y-[0.15em] bg-neon-cyan" />
        </p>
      </div>
    </Reveal>
  )
}
