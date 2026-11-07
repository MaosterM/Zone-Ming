import { Link } from 'react-router'
import { buildLog, projects } from '../data/profile'
import { assetUrl } from '../lib/assets'
import ButtonLink from './ButtonLink'
import FocusAreas from './FocusAreas'
import Heading from './Heading'
import Reveal from './Reveal'
import SectionBreak from './SectionBreak'
import SectionHeader from './SectionHeader'
import StatStrip from './StatStrip'
import TerminalLog from './TerminalLog'

const FEATURED_COUNT = 3

const results = [
  { label: 'Guarded position, value kept', value: 83.6, colour: 'bg-neon-cyan', text: 'text-neon-cyan' },
  { label: 'Unguarded position, value kept', value: 0.1, colour: 'bg-neon-magenta', text: 'text-neon-magenta' },
]

/** Everything on Home below the first screen. */
export default function HomeSections() {
  return (
    <>
      <div className="flex flex-col gap-24 px-6 pt-12 pb-24 md:gap-36 md:px-12 md:pb-36">
        <StatStrip
          stats={[
            { label: 'Projects shown', value: String(projects.length) },
            { label: 'RMIT Hackathon challenges', value: '2' },
            { label: 'Best validation macro-F1', value: '0.9397' },
            { label: 'Stage of degree', value: 'Final year' },
          ]}
        />

        <section>
          <SectionHeader label="01 / Selected work" title="Featured projects" intro="Three projects across security, finance and machine learning." />
          <div className="flex flex-col gap-16 md:gap-24">
            {projects.slice(0, FEATURED_COUNT).map((project, index) => (
              <Reveal key={project.slug}>
                <Link to={`/work/${project.slug}`} className="group grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
                  <div className={`hud-panel p-2 lg:col-span-7 ${index % 2 ? 'lg:order-2' : ''}`}>
                    <img
                      src={assetUrl(project.image)}
                      alt={project.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="text-halo lg:col-span-5">
                    <p className="hud-label">
                      {project.year} / {project.role}
                    </p>
                    <h3 className="mt-2 font-display text-6xl leading-[0.9] font-black text-ink uppercase transition-colors group-hover:text-neon-yellow md:text-7xl">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-lg text-ink md:text-xl">{project.description}</p>
                    <p className="mt-4 font-mono text-sm text-neon-cyan underline underline-offset-4">See this project</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 md:mt-16">
            <ButtonLink to="/work" variant="secondary">
              See all projects
            </ButtonLink>
          </Reveal>
        </section>

        <section>
          <SectionHeader label="02 / Focus" title="Focus areas" intro="Four areas my public projects keep coming back to." />
          <FocusAreas />
        </section>
      </div>

      <SectionBreak />

      <div className="flex flex-col gap-24 px-6 py-24 md:gap-36 md:px-12 md:py-36">
        <section>
          <SectionHeader
            label="03 / Measured"
            title="An exit in 185 to 213 ms"
            intro="Ejector Seat's scripted demo on BNB Smart Chain testnet. The team sold in steps and the price crashed 89.8%, with one position guarded and one not."
          />
          <Reveal>
            <div className="hud-panel flex flex-col gap-8 p-6 md:p-10">
              {results.map((result) => (
                <div key={result.label}>
                  <p className="hud-label">{result.label}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className={`h-10 origin-left -skew-x-12 md:h-14 ${result.colour}`} style={{ width: `max(0.5rem, ${result.value * 0.8}%)` }} />
                    <p className={`font-display text-5xl leading-none font-black md:text-7xl ${result.text}`}>{result.value}%</p>
                  </div>
                </div>
              ))}
              <div>
                <ButtonLink to="/work/ejector-seat" variant="secondary">
                  See how it works
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="circuit-grid">
          <SectionHeader label="04 / Log" title="Build log" intro="When each of my public project repos was started." />
          <TerminalLog title="git log --all --oneline" lines={buildLog} />
        </section>
      </div>

      <SectionBreak flip />

      <section className="flex flex-col items-start gap-8 px-6 py-24 md:px-12 md:py-36">
        <Reveal>
          <p className="hud-label">05 / Contact</p>
          <Heading text="Send me a message" className="mt-2 text-6xl leading-[0.9] md:text-8xl" />
        </Reveal>
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row">
            <ButtonLink to="/contact">Contact me</ButtonLink>
            <ButtonLink to="/about" variant="secondary">
              Read about me
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  )
}
