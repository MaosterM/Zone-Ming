import { profile } from '../data/profile'
import ArtBanner from './ArtBanner'
import ButtonLink from './ButtonLink'
import FocusAreas from './FocusAreas'
import NoteGrid from './NoteGrid'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import StatStrip from './StatStrip'

const habits = [
  {
    title: 'Say what is simulated',
    text: "Zenithium has a file listing exactly what is mocked, Ejector Seat refuses to run on mainnet, and Quant Terminal labels its data as simulated.",
  },
  {
    title: 'Test the risky parts',
    text: "Ejector Seat's contract tests pass 6 of 6 against the real router, and its triggers are unit-tested pure functions. The classifier's notebook re-reads its output to confirm the file is valid.",
  },
  {
    title: 'Keep power narrow',
    text: "Ejector Seat's agent can only sell back to the owner, and Zenithium's vault key is split so no single heir, admin or host can open it.",
  },
  {
    title: 'Treat motion as a feature',
    text: "Maison Aurelle and this site both build their own page transitions and motion systems, and both respect a visitor's reduced motion setting.",
  },
]

const siteNotes = [
  {
    title: 'Stack',
    text: 'Vite, React, TypeScript and Tailwind CSS v4, with GSAP for timelines, Lenis for scrolling and three.js for the 3D scene. Hosted on GitHub Pages.',
  },
  {
    title: 'One animation loop',
    text: 'Smooth scrolling, the matrix rain and the 3D scene all run from one ticker. The rain and scene draw at 30fps and pause when the tab is hidden.',
  },
  {
    title: 'Original 3D',
    text: 'A single scene of instanced chrome shards re-forms into a new shape on each page. Devices without a real GPU skip it and its download.',
  },
  {
    title: 'Built to be usable',
    text: 'The real text stays in the page for screen readers, focus is always visible, and a reduced motion setting stops the rain, glitches and wipes.',
  },
]

/** The parts of About below the introduction and skills. */
export default function AboutSections() {
  return (
    <>
      <div className="flex flex-col gap-24 pt-24 pb-24 md:gap-36 md:pt-36 md:pb-36">
        <section>
          <SectionHeader label="01 / Education" title="Studying" />
          <StatStrip
            stats={[
              { label: "Bachelor's degree", value: 'Computer Science' },
              { label: 'Specialisation', value: 'Data Science' },
              { label: 'Minor', value: 'Finance' },
              { label: 'University', value: "Taylor's" },
              { label: 'Stage', value: 'Final year' },
            ]}
          />
        </section>

        <section>
          <SectionHeader label="02 / Focus" title="Focus areas" intro="Each one links to the projects that show it." />
          <FocusAreas />
        </section>

        <section>
          <SectionHeader label="03 / Evidence" title="What my projects show" intro="Patterns you can check for yourself in my public repos." />
          <NoteGrid notes={habits} />
        </section>
      </div>

      <div className="-mx-6 md:-mx-12">
        <ArtBanner image="art/circuit.jpg" />
      </div>

      <div className="flex flex-col gap-10 py-24 md:py-36">
        <section>
          <SectionHeader label="04 / Colophon" title="About this site" intro="Built as a project in its own right, inspired by cyberpunk, Persona menus and award-winning 3D sites." />
          <NoteGrid notes={siteNotes} />
        </section>
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row">
            <ButtonLink href={`${profile.github}/Zone-Ming`}>See this site's code</ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Contact me
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </>
  )
}
