import { useEffect } from 'react'
import { profile, projects } from '../data/profile'

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

/** The page name for a path, shown huge on the transition and announced to screen readers. */
export function routeLabel(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const item = navItems.find((nav) => nav.to === path)
  if (item) return item.label

  const slug = path.match(/^\/work\/([^/]+)$/)?.[1]
  const project = projects.find((entry) => entry.slug === slug)
  return project?.title ?? 'Signal lost'
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${profile.name}`
  }, [title])
}
