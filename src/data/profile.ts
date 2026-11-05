/**
 * Every piece of personal content on the site lives in this file.
 *
 * Search for "TODO" to find what still needs filling in. Nothing here has been
 * invented: a value is either something you supplied or a marked TODO.
 */

export type ProjectLink = {
  label: string
  url: string
}

export type Project = {
  /** Used in the URL: /work/<slug>. Lowercase letters, digits and hyphens. */
  slug: string
  title: string
  year: string
  /** One line, shown on the Work list. */
  description: string
  role: string
  stack: string[]
  /** What you built. Each string renders as its own paragraph. */
  built: string[]
  links: ProjectLink[]
  /** Screenshot in public/projects/, for example 'projects/my-app.jpg'. */
  image: string
  imageAlt: string
}

export type SkillGroup = {
  name: 'Build' | 'Motion' | 'Tools'
  items: string[]
}

export const profile = {
  name: 'Cheah Yi Ming',
  linkedin: 'https://www.linkedin.com/in/cheah-yi-ming-549165364/',

  // TODO: your GitHub profile. This is your account name from the repo URL, so confirm it.
  github: 'https://github.com/MaosterM',

  // TODO: your headline or role, one line. It shows under your name on Home.
  role: 'TODO: add your headline or role',

  // TODO: your short bio. Each string renders as its own paragraph on About.
  bio: ['TODO: add your short bio'],

  // TODO: your current status, one line. It shows in the terminal panel on About.
  status: 'TODO: add your status',

  // TODO: your contact email. It powers the large link and the form on Contact.
  email: 'TODO@example.com',

  // Optional. Paste a Formspree endpoint here, such as 'https://formspree.io/f/abc123', to have
  // the contact form send messages directly. While it is empty, the form opens the visitor's
  // email app addressed to the email above.
  formspreeEndpoint: '',
}

// TODO: list your skills in each group.
export const skills: SkillGroup[] = [
  { name: 'Build', items: ['TODO: add your build skills'] },
  { name: 'Motion', items: ['TODO: add your motion skills'] },
  { name: 'Tools', items: ['TODO: add your tools'] },
]

// TODO: add 3 to 6 projects. Copy this shape for each one:
// {
//   slug: 'my-project',
//   title: 'My project',
//   year: '2026',
//   description: 'One line about what it is.',
//   role: 'What you did on it',
//   stack: ['React', 'TypeScript'],
//   built: ['What you built, in a sentence or two.'],
//   links: [{ label: 'Live site', url: 'https://example.com' }],
//   image: 'projects/my-project.jpg',
//   imageAlt: 'Describe what the screenshot shows',
// },
export const projects: Project[] = []
