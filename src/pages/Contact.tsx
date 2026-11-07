import { Link } from 'react-router'
import ContactForm from '../components/ContactForm'
import GlitchText from '../components/GlitchText'
import Heading from '../components/Heading'
import Reveal from '../components/Reveal'
import SectionBreak from '../components/SectionBreak'
import SectionHeader from '../components/SectionHeader'
import StatStrip from '../components/StatStrip'
import { profile, projects } from '../data/profile'
import { assetUrl } from '../lib/assets'
import { usePageTitle } from '../lib/routes'

const EMAIL_WIDTH_FACTOR = 170 // vw per character, so any address fits on one line
const RECENT_COUNT = 3

const channels = [
  { label: 'Email', title: 'Send an email', detail: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: 'LinkedIn', title: 'Connect on LinkedIn', detail: profile.name, href: profile.linkedin, external: true },
  { label: 'GitHub', title: 'Read my code', detail: 'MaosterM', href: profile.github, external: true },
]

export default function Contact() {
  usePageTitle('Contact')

  return (
    <div className="flex flex-1 flex-col pt-28">
      <div className="flex flex-col gap-24 px-6 pb-24 md:gap-36 md:px-12 md:pb-36">
        <section>
          <Heading as="h1" text="Contact" className="text-8xl leading-none md:text-[10rem]" />
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-block font-display leading-none font-black text-neon-yellow transition-colors hover:text-neon-cyan"
            style={{ fontSize: `min(${EMAIL_WIDTH_FACTOR / profile.email.length}vw, 7rem)` }}
          >
            <GlitchText text={profile.email} />
          </a>
          <div className="mt-12">
            <StatStrip
              stats={[
                { label: 'Based in', value: 'Greater Kuala Lumpur' },
                { label: 'Studying at', value: "Taylor's University" },
                { label: 'Stage of degree', value: 'Final year' },
              ]}
            />
          </div>
        </section>

        <section aria-labelledby="message-heading" className="max-w-3xl">
          <p className="hud-label">01 / Message</p>
          <h2 id="message-heading" className="mt-2 font-display text-5xl leading-none font-black uppercase md:text-7xl">
            Send a message
          </h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>

        <section>
          <SectionHeader label="02 / Channels" title="Other ways to reach me" />
          <ul className="grid gap-5 md:grid-cols-3">
            {channels.map((channel) => (
              <li key={channel.label}>
                <Reveal className="h-full">
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="hud-panel group block h-full p-6"
                  >
                    <span className="hud-label block">{channel.label}</span>
                    <span className="mt-2 block font-display text-4xl leading-none font-extrabold text-ink uppercase group-hover:text-neon-yellow">
                      {channel.title}
                    </span>
                    <span className="mt-3 block font-mono text-sm break-all text-muted">{channel.detail}</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <SectionBreak />

      <section className="px-6 py-24 md:px-12 md:py-36">
        <SectionHeader label="03 / Before you write" title="See my recent work" />
        <ul className="grid gap-5 md:grid-cols-3">
          {projects.slice(0, RECENT_COUNT).map((project) => (
            <li key={project.slug}>
              <Reveal className="h-full">
                <Link to={`/work/${project.slug}`} className="hud-panel group block h-full p-2">
                  <img
                    src={assetUrl(project.image)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full object-cover object-top"
                  />
                  <span className="block px-3 pt-4 pb-3 font-display text-3xl leading-none font-extrabold text-ink uppercase group-hover:text-neon-yellow">
                    {project.title}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
