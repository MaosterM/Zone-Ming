import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { navItems } from '../lib/routes'
import { lockScroll, unlockScroll } from '../lib/smoothScroll'
import GlitchText from './GlitchText'
import ScrambleText from './ScrambleText'

const RESIZE_DEBOUNCE_MS = 150
const DESKTOP_QUERY = '(min-width: 768px)'

export default function Nav() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const desktopNav = useRef<HTMLElement>(null)
  const indicator = useRef<HTMLSpanElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const menuWasOpen = useRef(false)

  // Slides the slanted block under whichever link is current.
  function placeIndicator(animate: boolean) {
    const active = desktopNav.current?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!active) {
      gsap.set(indicator.current, { autoAlpha: 0 })
      return
    }
    gsap.to(indicator.current, {
      autoAlpha: 1,
      x: active.offsetLeft,
      width: active.offsetWidth,
      duration: animate && !prefersReducedMotion() ? 0.35 : 0,
      ease: 'power4.out',
      overwrite: true,
    })
  }

  useEffect(() => {
    placeIndicator(true)
  }, [pathname])

  useEffect(() => {
    // Link widths change once the display font has loaded, and again on resize.
    document.fonts.ready.then(() => placeIndicator(false))

    let timer = 0
    function onResize() {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => placeIndicator(false), RESIZE_DEBOUNCE_MS)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // The full-screen menu wipes in on a slant, like the page transitions.
  useEffect(() => {
    if (!menuOpen && !menuWasOpen.current) return
    menuWasOpen.current = menuOpen

    const main = document.getElementById('main')
    const links = gsap.utils.toArray<HTMLElement>('[data-menu-link]', panel.current)
    const speed = prefersReducedMotion() ? 0 : 1

    if (menuOpen) {
      lockScroll()
      main?.setAttribute('inert', '')
      gsap.set(panel.current, { display: 'flex' })
      gsap.fromTo(
        panel.current,
        { clipPath: 'polygon(0 0, 0 0, -20% 100%, -20% 100%)' },
        { clipPath: 'polygon(0 0, 120% 0, 100% 100%, -20% 100%)', duration: 0.4 * speed, ease: 'power4.out', overwrite: true },
      )
      gsap.fromTo(
        links,
        { xPercent: -30 * speed, opacity: 1 - speed },
        { xPercent: 0, opacity: 1, duration: 0.4 * speed, stagger: 0.05 * speed, delay: 0.1 * speed, ease: 'power4.out' },
      )
      links[0]?.focus({ preventScroll: true })
      return
    }

    main?.removeAttribute('inert')
    unlockScroll()
    gsap.to(panel.current, {
      clipPath: 'polygon(100% 0, 120% 0, 100% 100%, 80% 100%)',
      duration: 0.28 * speed,
      ease: 'power3.in',
      overwrite: true,
      onComplete: () => void gsap.set(panel.current, { display: 'none' }),
    })
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return

    const button = menuButton.current
    const desktop = window.matchMedia(DESKTOP_QUERY)

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      button?.focus()
    }
    function onBreakpoint() {
      setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onBreakpoint)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-linear-to-b from-night/90 to-transparent">
      <a
        href="#main"
        className="sr-only z-20 bg-neon-yellow px-4 py-2 font-bold text-night focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <div className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <Link
          to="/"
          aria-label="Cheah Yi Ming, home"
          className="clip-slant bg-neon-yellow px-5 py-2 font-display text-2xl leading-none font-black tracking-wide text-night transition-colors hover:bg-neon-cyan"
        >
          CYM
        </Link>

        <nav ref={desktopNav} aria-label="Main" className="relative hidden md:block">
          <span
            ref={indicator}
            aria-hidden
            className="clip-slant invisible absolute top-0 bottom-0 left-0 bg-neon-yellow"
          />
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative block px-5 py-2 font-display text-xl font-bold tracking-wider uppercase transition-colors ${
                      isActive ? 'text-night' : 'text-ink hover:text-neon-yellow'
                    }`
                  }
                >
                  <GlitchText text={item.label}>
                    <ScrambleText text={item.label} on="hover" />
                  </GlitchText>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="-mr-3 min-h-11 px-3 font-display text-xl font-bold tracking-wider text-neon-yellow uppercase md:hidden"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div
        ref={panel}
        id="mobile-menu"
        className="fixed inset-0 hidden flex-col justify-center bg-night px-6 md:hidden"
      >
        <nav aria-label="Mobile">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  data-menu-link
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block font-display text-7xl leading-[1.05] font-black uppercase ${
                      isActive ? 'text-neon-yellow' : 'text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
