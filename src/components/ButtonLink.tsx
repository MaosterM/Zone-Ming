import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Props = {
  to: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

export default function ButtonLink({ to, variant = 'primary', children }: Props) {
  return (
    <Link to={to} className={`btn btn-${variant}`}>
      {children}
    </Link>
  )
}
