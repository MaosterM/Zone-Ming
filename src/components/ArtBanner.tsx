import { useRef } from 'react'
import { assetUrl } from '../lib/assets'
import { useGSAP, usePrefersReducedMotion, gsap } from '../lib/motion'

const DRIFT_PERCENT = 8

/** A full-width band of decorative art, generated in code, that drifts slowly as you scroll. */
export default function ArtBanner({ image }: { image: string }) {
  const root = useRef<HTMLDivElement>(null)
  const art = useRef<HTMLImageElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const move = gsap.quickSetter(art.current, 'yPercent')
      function onScroll() {
        const box = root.current!.getBoundingClientRect()
        const progress = (box.top + box.height) / (window.innerHeight + box.height)
        move(gsap.utils.clamp(0, 1, progress) * -DRIFT_PERCENT)
      }

      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <div
      ref={root}
      aria-hidden
      className="relative h-56 overflow-hidden [clip-path:polygon(0_6%,100%_0,100%_94%,0_100%)] md:h-96"
    >
      <img ref={art} src={assetUrl(image)} alt="" loading="lazy" decoding="async" className="absolute inset-x-0 top-0 h-[112%] w-full object-cover" />
    </div>
  )
}
