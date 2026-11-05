import { profile } from '../data/profile'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="text-halo relative z-10 flex items-center justify-between gap-4 px-6 py-1 font-mono text-sm text-muted md:px-12">
      <span>
        &copy; {YEAR} {profile.name}
      </span>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center text-ink underline decoration-neon-yellow underline-offset-4 transition-colors hover:text-neon-yellow"
      >
        LinkedIn
      </a>
    </footer>
  )
}
