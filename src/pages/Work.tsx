import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import Heading from '../components/Heading'
import { projects, type Project } from '../data/profile'
import { assetUrl } from '../lib/assets'
import { gsap, useGSAP, useHasFinePointer, usePrefersReducedMotion } from '../lib/motion'
import { usePageTitle } from '../lib/routes'

const CURSOR_GAP = 28
const EDGE_GAP = 16
const TILT_LIMIT = 18
const TILT_PER_PIXEL = 1.1
const TILT_PERSPECTIVE = 900

export default function Work() {
  usePageTitle('Work')

  const [active, setActive] = useState<Project | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  const moveX = useRef<gsap.QuickToFunc | null>(null)
  const moveY = useRef<gsap.QuickToFunc | null>(null)
  const showing = useRef(false)
  const levelOut = useRef<gsap.core.Tween | null>(null)
  const finePointer = useHasFinePointer()
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!finePointer || reducedMotion) return
      moveX.current = gsap.quickTo(preview.current, 'x', { duration: 0.45, ease: 'power3.out' })
      moveY.current = gsap.quickTo(preview.current, 'y', { duration: 0.45, ease: 'power3.out' })
    },
    { dependencies: [finePointer, reducedMotion], revertOnUpdate: true },
  )

  // Loads the screenshots once a pointer is around, so the first hover shows its image at once.
  useEffect(() => {
    if (!finePointer) return
    for (const project of projects) {
      new Image().src = assetUrl(project.image)
    }
  }, [finePointer])

  function placePreview(x: number, y: number) {
    const box = preview.current!.getBoundingClientRect()
    const fitsRight = x + CURSOR_GAP + box.width < window.innerWidth - EDGE_GAP
    const left = fitsRight ? x + CURSOR_GAP : x - CURSOR_GAP - box.width
    const top = gsap.utils.clamp(EDGE_GAP, window.innerHeight - box.height - EDGE_GAP, y - box.height / 2)

    // The first placement jumps straight there, later ones trail behind the cursor.
    if (reducedMotion) {
      gsap.set(preview.current, { x: left, y: top })
    } else if (showing.current) {
      moveX.current?.(left)
      moveY.current?.(top)
    } else {
      moveX.current?.(left, left)
      moveY.current?.(top, top)
    }
  }

  function showPreview(project: Project, x: number, y: number) {
    if (!finePointer) return
    setActive(project)
    placePreview(x, y)
    showing.current = true
    gsap.to(preview.current, {
      autoAlpha: 1,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: reducedMotion ? 0 : 0.25,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  function hidePreview() {
    if (!finePointer) return
    showing.current = false
    gsap.to(preview.current, {
      autoAlpha: 0,
      clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      duration: reducedMotion ? 0 : 0.18,
      ease: 'power3.in',
      overwrite: 'auto',
    })
  }

  // Keyboard users get the preview too, beside the row they have focused.
  function onRowFocus(project: Project, event: FocusEvent<HTMLAnchorElement>) {
    if (!event.currentTarget.matches(':focus-visible')) return
    const row = event.currentTarget.getBoundingClientRect()
    showPreview(project, row.left + row.width * 0.55, row.top + row.height / 2)
  }

  function onRowMove(event: PointerEvent) {
    if (!showing.current) return
    placePreview(event.clientX, event.clientY)
    if (reducedMotion) return

    // The card tilts in 3D with the pointer's speed, and levels out when it stops.
    gsap.to(preview.current, {
      rotationY: gsap.utils.clamp(-TILT_LIMIT, TILT_LIMIT, event.movementX * TILT_PER_PIXEL),
      rotationX: gsap.utils.clamp(-TILT_LIMIT, TILT_LIMIT, -event.movementY * TILT_PER_PIXEL),
      transformPerspective: TILT_PERSPECTIVE,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    })
    levelOut.current?.kill()
    levelOut.current = gsap.to(preview.current, { rotationX: 0, rotationY: 0, duration: 0.7, delay: 0.12, ease: 'power3.out' })
  }

  return (
    <div className="flex flex-1 flex-col pt-28 pb-16">
      <div className="px-6 md:px-12">
        <Heading as="h1" text="Work" className="text-8xl leading-none md:text-[10rem]" />
      </div>

      {projects.length === 0 ? (
        <p className="text-halo mt-8 px-6 text-lg text-ink md:px-12">TODO: add your projects to src/data/profile.ts</p>
      ) : (
        <ul className="mt-10 border-b border-line">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link
                to={`/work/${project.slug}`}
                className="work-row"
                onPointerEnter={(event) => showPreview(project, event.clientX, event.clientY)}
                onPointerMove={onRowMove}
                onPointerLeave={hidePreview}
                onFocus={(event) => onRowFocus(project, event)}
                onBlur={hidePreview}
              >
                <span aria-hidden className="work-row-meta font-mono text-sm md:text-base">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="font-display text-5xl leading-none font-black uppercase md:text-7xl xl:text-8xl">
                  {project.title}
                </h2>
                <p className="work-row-meta text-base md:text-lg">{project.description}</p>
                <span className="work-row-meta font-mono text-sm md:text-right md:text-base">{project.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {finePointer &&
        createPortal(
          <div
            ref={preview}
            aria-hidden
            className="pointer-events-none invisible fixed top-0 left-0 z-20 aspect-video w-[min(34vw,30rem)] border-2 border-neon-cyan bg-night-raised"
            style={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          >
            {active && (
              <img
                src={assetUrl(active.image)}
                alt=""
                decoding="async"
                loading="lazy"
                className="size-full object-cover"
              />
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
