export type Formation = 'sphere' | 'ring' | 'helix' | 'glyphs'

export type Placement = {
  formation: Formation
  /** Centre of the shape: -1 is the left or bottom edge of the screen, 1 the right or top. */
  x: number
  y: number
  size: number
  opacity: number
}

type Pair = { wide: Placement; tall: Placement }

const placements: Record<string, Pair> = {
  home: {
    wide: { formation: 'sphere', x: 0.62, y: 0.16, size: 1.25, opacity: 1 },
    tall: { formation: 'sphere', x: 0.28, y: 0.5, size: 0.62, opacity: 1 },
  },
  work: {
    wide: { formation: 'ring', x: 0.55, y: 0.56, size: 0.46, opacity: 0.8 },
    tall: { formation: 'ring', x: 0.55, y: 0.72, size: 0.32, opacity: 0.7 },
  },
  project: {
    wide: { formation: 'helix', x: 0.86, y: 0.15, size: 0.6, opacity: 0.8 },
    tall: { formation: 'helix', x: 0.72, y: 0.72, size: 0.3, opacity: 0.45 },
  },
  about: {
    wide: { formation: 'helix', x: 0.03, y: 0.3, size: 0.48, opacity: 0.8 },
    tall: { formation: 'helix', x: 0.72, y: 0.72, size: 0.3, opacity: 0.45 },
  },
  contact: {
    wide: { formation: 'ring', x: 0.64, y: -0.42, size: 0.8, opacity: 0.85 },
    tall: { formation: 'ring', x: 0.6, y: 0.72, size: 0.3, opacity: 0.5 },
  },
  lost: {
    wide: { formation: 'glyphs', x: 0.56, y: 0.14, size: 0.72, opacity: 1 },
    tall: { formation: 'glyphs', x: 0.05, y: 0.68, size: 0.42, opacity: 1 },
  },
}

/** Where the shards go on each page. The shapes sit where they least cover text. */
export function placementFor(pathname: string, tall: boolean) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const name =
    path === '/'
      ? 'home'
      : path === '/work'
        ? 'work'
        : path === '/about'
          ? 'about'
          : path === '/contact'
            ? 'contact'
            : /^\/work\/[^/]+$/.test(path)
              ? 'project'
              : 'lost'
  return placements[name][tall ? 'tall' : 'wide']
}
