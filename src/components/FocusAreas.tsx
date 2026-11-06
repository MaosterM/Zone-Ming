import { Link } from 'react-router'
import { focusAreas, projects } from '../data/profile'
import Reveal from './Reveal'

/** The areas of work, each linked to the projects that show it. */
export default function FocusAreas() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {focusAreas.map((area, index) => (
        <Reveal key={area.title} className="h-full">
          <div className="hud-panel flex h-full flex-col p-6 md:p-8">
            <p className="font-mono text-sm text-neon-magenta">{String(index + 1).padStart(2, '0')} /</p>
            <h3 className="mt-2 font-display text-4xl leading-none font-extrabold text-ink uppercase md:text-5xl">{area.title}</h3>
            <p className="mt-3 flex-1 text-base text-muted md:text-lg">{area.text}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {area.projects.map((slug) => (
                <li key={slug}>
                  <Link
                    to={`/work/${slug}`}
                    className="inline-flex min-h-11 items-center font-mono text-sm text-neon-cyan underline underline-offset-4 hover:text-neon-yellow"
                  >
                    {projects.find((project) => project.slug === slug)?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
