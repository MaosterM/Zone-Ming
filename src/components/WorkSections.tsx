import { Link } from 'react-router'
import { profile, projects, type Language } from '../data/profile'
import ButtonLink from './ButtonLink'
import Reveal from './Reveal'
import SectionBreak from './SectionBreak'
import SectionHeader from './SectionHeader'
import StatStrip from './StatStrip'

const LANGUAGES: Language[] = ['Python', 'TypeScript', 'JavaScript', 'Solidity', 'PHP']
const PERSONAL = 'Personal project'

/** The parts of Work below the project list. */
export default function WorkSections() {
  const personal = projects.filter((project) => project.role === PERSONAL).length

  return (
    <>
      <div className="flex flex-col gap-24 px-6 py-24 md:gap-36 md:px-12 md:py-36">
        <StatStrip
          stats={[
            { label: 'Projects', value: String(projects.length) },
            { label: 'Team projects', value: String(projects.length - personal) },
            { label: 'Personal projects', value: String(personal) },
            { label: 'Main languages', value: String(LANGUAGES.length) },
          ]}
        />

        <section>
          <SectionHeader label="01 / Matrix" title="Languages by project" intro="The main languages each project is written in, as listed in its repo." />
          <Reveal>
            {/* Scrolls inside its own box on narrow screens, so the page never scrolls sideways. */}
            <div tabIndex={0} role="region" aria-label="Languages by project table" className="hud-panel overflow-x-auto p-2 md:p-4">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="hud-label p-3 font-normal">
                      Project
                    </th>
                    <th scope="col" className="hud-label p-3 font-normal">
                      Type
                    </th>
                    {LANGUAGES.map((language) => (
                      <th key={language} scope="col" className="hud-label p-3 text-center font-normal">
                        {language}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.slug} className="border-b border-line last:border-b-0">
                      <th scope="row" className="p-3 font-display text-2xl leading-none font-extrabold uppercase md:text-3xl">
                        <Link to={`/work/${project.slug}`} className="text-ink hover:text-neon-yellow">
                          {project.title}
                        </Link>
                      </th>
                      <td className="p-3 font-mono text-sm text-muted">{project.role === PERSONAL ? 'Personal' : 'Team'}</td>
                      {LANGUAGES.map((language) => (
                        <td key={language} className="p-3 text-center font-mono text-sm">
                          {project.languages.includes(language) ? (
                            <span className="text-neon-yellow">Yes</span>
                          ) : (
                            <span className="text-muted">No</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>
      </div>

      <SectionBreak />

      <section className="flex flex-col items-start gap-6 px-6 py-24 md:px-12 md:py-36">
        <SectionHeader label="02 / Source" title="Read the code" intro="Every project here links to its public repository, including its README and what is still unfinished." />
        <Reveal>
          <ButtonLink href={profile.github}>See my GitHub</ButtonLink>
        </Reveal>
      </section>
    </>
  )
}
