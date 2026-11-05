import { Link, useParams } from 'react-router'
import ButtonLink from '../components/ButtonLink'
import Heading from '../components/Heading'
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
        <p className="text-halo font-mono text-base text-neon-cyan">{project.year}</p>
        <Heading as="h1" text={project.title} className="mt-2 text-7xl leading-[0.9] md:text-9xl" />
      </header>

      {project.image && (
        <img
          src={assetUrl(project.image)}
          alt={project.imageAlt}
          fetchPriority="high"
          decoding="async"
          className="mt-8 aspect-video w-full object-cover object-top [clip-path:polygon(0_0,100%_0,100%_94%,0_100%)] md:aspect-[21/9]"
        />
      )}

      <div className="grid gap-12 px-6 py-12 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <dl className="flex flex-col gap-6">
          <div>
            <dt className="font-mono text-sm text-neon-cyan">Role</dt>
            <dd className="text-halo mt-1 text-lg text-ink">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-sm text-neon-cyan">Stack</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item} className="clip-slant bg-night-raised px-4 py-1 font-mono text-sm text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <section>
          <Heading text="What I built" className="text-5xl leading-none md:text-6xl" />
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
