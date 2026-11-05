import { usePageTitle } from '../lib/routes'
import Heading from './Heading'

/** Temporary body for a page until it is built. */
export default function PageStub({ title }: { title: string }) {
  usePageTitle(title)

  return (
    <section className="flex flex-1 flex-col justify-center px-6 md:px-12">
      <Heading as="h1" text={title} className="text-7xl md:text-9xl" />
    </section>
  )
}
