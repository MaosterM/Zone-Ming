import type { Note } from '../data/profile'
import Reveal from './Reveal'

/** Titled panels of detail, without an implied order. */
export default function NoteGrid({ notes }: { notes: Note[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {notes.map((note) => (
        <Reveal key={note.title} className="h-full">
          <div className="hud-panel h-full p-6 md:p-8">
            <h3 className="font-display text-3xl leading-none font-extrabold text-neon-cyan uppercase md:text-4xl">{note.title}</h3>
            <p className="mt-3 text-base text-ink md:text-lg">{note.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
