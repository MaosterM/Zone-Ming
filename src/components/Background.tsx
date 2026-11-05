import GradientField from './GradientField'

/** The animated backdrop shared by every page. */
export default function Background() {
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden bg-night">
      <GradientField />
    </div>
  )
}
