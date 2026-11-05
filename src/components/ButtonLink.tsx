import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Props = {
  /** A page on this site. */
  to?: string
  /** An external address, which opens in a new tab. */
  href?: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

export default function ButtonLink({ to, href, variant = 'primary', children }: Props) {
  const className = `btn btn-${variant}`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to ?? '/'} className={className}>
      {children}
    </Link>
  )
}
