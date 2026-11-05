import { usePageTitle } from '../lib/routes'

/** Temporary body for a page until it is built. */
export default function PageStub({ title }: { title: string }) {
  usePageTitle(title)

  return (
    <section className="flex min-h-svh flex-col justify-center px-6 md:px-12">
      <h1 className="font-display text-7xl font-black uppercase md:text-9xl">{title}</h1>
    </section>
  )
}
