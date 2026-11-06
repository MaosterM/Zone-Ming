import { Link, useParams } from 'react-router'
import ButtonLink from '../components/ButtonLink'
import FlowSteps from '../components/FlowSteps'
import Heading from '../components/Heading'
import ImageGallery from '../components/ImageGallery'
import NoteGrid from '../components/NoteGrid'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import StatStrip from '../components/StatStrip'
import { projects } from '../data/profile'
import { assetUrl } from '../lib/assets'
import { usePageTitle } from '../lib/routes'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((project) => project.slug === slug)

  if (index === -1) return <NotFound />
  return <ProjectBody index={index} />
}

function ProjectBody({ index }: { index: number }) {
  const project = projects[index]
  usePageTitle(project.title)

  // Wraps around, so the first project's previous link is the last project.
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="flex flex-1 flex-col pt-28">
      <header className="px-6 md:px-12">
        <p className="hud-label">
          {project.year} / {project.role}
        </p>
        <Heading as="h1" text={project.title} className="mt-2 text-7xl leading-[0.9] md:text-9xl" />
        <p className="text-halo mt-4 max-w-3xl text-xl text-ink md:text-2xl">{project.description}</p>
      </header>

      {project.image && (
        <img
          src={assetUrl(project.image)}
          alt={project.imageAlt}
          fetchPriority="high"
          decoding="async"
          className="mt-8 aspect-video w-full max-w-6xl object-cover object-top [clip-path:polygon(0_0,100%_0,100%_97%,0_100%)]"
        />
      )}

      <div className="flex flex-col gap-20 px-6 py-16 md:gap-28 md:px-12 md:py-24">
        <StatStrip stats={project.stats} />

        <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <Reveal>
            <dl className="hud-panel flex flex-col gap-6 p-6">
              <div>
                <dt className="hud-label">Role</dt>
                <dd className="mt-1 text-lg text-ink">{project.role}</dd>
              </div>
              <div>
                <dt className="hud-label">Stack</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <li key={item} className="clip-slant bg-night px-4 py-1 font-mono text-sm text-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </Reveal>

          <div>
            <Heading text="What I built" className="text-5xl leading-none md:text-7xl" />
            <div className="text-halo mt-6 flex max-w-prose flex-col gap-4 text-lg text-ink">
              {project.built.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {project.links.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-5">
                {project.links.map((link, linkIndex) => (
                  <li key={link.url}>
                    <ButtonLink href={link.url} variant={linkIndex === 0 ? 'primary' : 'secondary'}>
                      {link.label}
                    </ButtonLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <SectionHeader label="Sequence" title="How it works" />
          <FlowSteps steps={project.steps} />
        </section>

        <section>
          <SectionHeader label="Detail" title="Key details" />
          <NoteGrid notes={project.notes} />
        </section>

        <section>
          <SectionHeader label="Visuals" title="Images" />
          <ImageGallery images={project.gallery} />
        </section>

        <section>
          <SectionHeader label="Status check" title="Limits" intro="What is simulated, unfinished or untested in this project." />
          <Reveal>
            <ul className="hud-panel flex flex-col gap-4 p-6 font-mono text-sm md:p-8 md:text-base">
              {project.limits.map((limit) => (
                <li key={limit} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 text-ink">
                  <span aria-hidden className="text-neon-yellow">
                    !
                  </span>
                  {limit}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </div>

      {projects.length > 1 && (
        <nav aria-label="More projects" className="mt-auto grid border-b border-line md:grid-cols-2">
          <Link to={`/work/${previous.slug}`} className="work-row work-row-compact">
            <span aria-hidden className="work-row-meta font-mono text-sm">
              &lt;
            </span>
            <span className="font-display text-4xl leading-none font-black uppercase md:text-5xl">
              {previous.title}
            </span>
            <span className="work-row-meta font-mono text-sm">Previous project</span>
          </Link>
          <Link to={`/work/${next.slug}`} className="work-row work-row-compact">
            <span aria-hidden className="work-row-meta font-mono text-sm">
              &gt;
            </span>
            <span className="font-display text-4xl leading-none font-black uppercase md:text-5xl">{next.title}</span>
            <span className="work-row-meta font-mono text-sm">Next project</span>
          </Link>
        </nav>
      )}
    </article>
  )
}
