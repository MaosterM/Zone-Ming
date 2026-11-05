import { useLocation } from 'react-router'
import GlitchOverlay from './GlitchOverlay'
import GradientField from './GradientField'
import MatrixRain from './MatrixRain'

const RAIN_OPACITY_HOME = 0.5
const RAIN_OPACITY_CONTENT = 0.16

/** The animated backdrop shared by every page. */
export default function Background() {
  const { pathname } = useLocation()

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden bg-night">
        <GradientField />
        <MatrixRain opacity={pathname === '/' ? RAIN_OPACITY_HOME : RAIN_OPACITY_CONTENT} />
      </div>
      <GlitchOverlay />
    </>
  )
}
