import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import GlitchOverlay from './GlitchOverlay'
import GradientField from './GradientField'
import MatrixRain from './MatrixRain'
import Scene3D from './Scene3D'

const RAIN_OPACITY_HOME = 0.5
const RAIN_OPACITY_CONTENT = 0.16
const SCROLLED_DIM = 0.6

/** The animated backdrop shared by every page. */
export default function Background() {
  const { pathname } = useLocation()
  const motionLayers = useRef<HTMLDivElement>(null)

  // The rain and 3D scene fade as you scroll, so long text further down stays easy to read.
  useEffect(() => {
    function onScroll() {
      const scrolled = Math.min(window.scrollY / window.innerHeight, 1)
      motionLayers.current!.style.opacity = String(1 - scrolled * SCROLLED_DIM)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden bg-night">
        <GradientField />
        <div ref={motionLayers} className="absolute inset-0">
          <MatrixRain opacity={pathname === '/' ? RAIN_OPACITY_HOME : RAIN_OPACITY_CONTENT} />
          <Scene3D pathname={pathname} />
        </div>
        {/* Dims the rain where small text sits, so a bright glyph can't drop it below 4.5:1. */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-night/85 to-transparent" />
      </div>
      <GlitchOverlay />
    </>
  )
}
