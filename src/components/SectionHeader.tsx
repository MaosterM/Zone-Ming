import Heading from './Heading'
import Reveal from './Reveal'

type Props = {
  /** Short HUD label above the heading, such as the section's number. */
  label: string
  title: string
  intro?: string
}

export default function SectionHeader({ label, title, intro }: Props) {
  return (
    <Reveal className="mb-8 md:mb-12">
      <p className="hud-label">{label}</p>
      <Heading text={title} className="mt-2 text-5xl leading-[0.95] md:text-7xl" />
      {intro && <p className="text-halo mt-4 max-w-2xl text-lg text-ink md:text-xl">{intro}</p>}
    </Reveal>
  )
}
