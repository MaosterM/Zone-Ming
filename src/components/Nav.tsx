import { NavLink } from 'react-router'
import { navItems } from '../lib/routes'

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 px-6 py-4 md:px-12">
      <nav aria-label="Main" className="flex gap-6">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
