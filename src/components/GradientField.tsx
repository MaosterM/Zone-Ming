import { useRef } from 'react'
import { gsap, useGSAP, usePrefersReducedMotion } from '../lib/motion'

// Radial gradients look like blurred blobs without the repaint cost of filter: blur().
// The alpha values keep muted body text above 4.5:1 where a blob sits behind it.
const blobs = [
  { color: 'rgb(255 31 143 / 0.3)', position: '-20vmax -15vmax', driftX: 28, driftY: 18, duration: 26 },
  { color: 'rgb(0 240 255 / 0.15)', position: '45vw 35vh', driftX: -24, driftY: -22, duration: 32 },
  { color: 'rgb(59 43 255 / 0.4)', position: '-10vw 60vh', driftX: 22, driftY: -26, duration: 38 },
]

export default function GradientField() {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      gsap.utils.toArray<HTMLElement>('[data-blob]', root.current).forEach((blob, index) => {
        const { driftX, driftY, duration } = blobs[index]
        gsap.to(blob, {
          xPercent: driftX,
          yPercent: driftY,
          duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: root, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <div ref={root} className="absolute inset-0">
      {blobs.map((blob) => (
        <div
          key={blob.color}
          data-blob
          className="absolute size-[75vmax] will-change-transform"
          style={{
            translate: blob.position,
            background: `radial-gradient(closest-side, ${blob.color}, transparent)`,
          }}
        />
      ))}
    </div>
  )
}
