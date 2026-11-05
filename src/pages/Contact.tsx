import ButtonLink from '../components/ButtonLink'
import ContactForm from '../components/ContactForm'
import GlitchText from '../components/GlitchText'
import Heading from '../components/Heading'
import { profile } from '../data/profile'
import { usePageTitle } from '../lib/routes'

const EMAIL_WIDTH_FACTOR = 170 // vw per character, so any address fits on one line

export default function Contact() {
  usePageTitle('Contact')

  return (
    <div className="flex flex-1 flex-col gap-12 px-6 pt-28 pb-16 md:px-12">
      <section>
        <Heading as="h1" text="Contact" className="text-8xl leading-none md:text-[10rem]" />
        <a
          href={`mailto:${profile.email}`}
          className="mt-6 inline-block font-display leading-none font-black text-neon-yellow transition-colors hover:text-neon-cyan"
          style={{ fontSize: `min(${EMAIL_WIDTH_FACTOR / profile.email.length}vw, 7rem)` }}
        >
          <GlitchText text={profile.email} />
        </a>
        <div className="mt-8 flex flex-col gap-5 sm:flex-row">
          <ButtonLink href={profile.linkedin} variant="secondary">
            LinkedIn
          </ButtonLink>
          <ButtonLink href={profile.github} variant="secondary">
            GitHub
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="message-heading" className="max-w-3xl">
        <h2 id="message-heading" className="font-display text-5xl leading-none font-black uppercase">
          Send a message
        </h2>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
