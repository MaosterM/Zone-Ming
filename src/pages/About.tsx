import ButtonLink from '../components/ButtonLink'
import Heading from '../components/Heading'
import StatusPanel from '../components/StatusPanel'
import { profile, skills } from '../data/profile'
import { usePageTitle } from '../lib/routes'

export default function About() {
  usePageTitle('About')

  return (
    <div className="flex flex-1 flex-col gap-16 px-6 pt-28 pb-16 md:px-12">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
        <div>
          <Heading as="h1" text="About" className="text-8xl leading-none md:text-[10rem]" />
          <div className="text-halo mt-6 flex max-w-prose flex-col gap-4 text-lg text-ink md:text-xl">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href={profile.linkedin}>See my LinkedIn</ButtonLink>
          </div>
        </div>

        <section aria-labelledby="status-heading" className="lg:pt-10">
          <h2 id="status-heading" className="sr-only">
            Status
          </h2>
          <StatusPanel />
        </section>
      </section>

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="sr-only">
          Skills
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {skills.map((group) => (
            <div key={group.name} className="border-t-2 border-neon-yellow pt-4">
              <Heading as="h3" text={group.name} className="text-5xl leading-none" />
              <ul className="text-halo mt-4 flex flex-col gap-2 text-lg text-ink">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
