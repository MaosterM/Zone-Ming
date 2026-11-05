import { usePageTitle } from '../lib/routes'
import GlitchText from './GlitchText'
import ScrambleText from './ScrambleText'

/** Temporary body for a page until it is built. */
export default function PageStub({ title }: { title: string }) {
  usePageTitle(title)

  return (
    <section className="flex flex-1 flex-col justify-center px-6 md:px-12">
      <h1 className="font-display text-7xl font-black uppercase md:text-9xl">
        <GlitchText text={title}>
          <ScrambleText text={title} />
        </GlitchText>
      </h1>
    </section>
  )
}
