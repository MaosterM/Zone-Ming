import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { profile, projects } from './src/data/profile.ts'

// GitHub Pages serves the site from /<repo>/, so built paths need that prefix.
const BASE = '/Zone-Ming/'

/**
 * Writes a real HTML file for every known page. GitHub Pages then answers direct links with a
 * 200 and the right title, and only unknown addresses go through the 404.html redirect.
 */
function routeFiles(): Plugin {
  const routes = [
    { path: 'work', title: 'Work' },
    { path: 'about', title: 'About' },
    { path: 'contact', title: 'Contact' },
    ...projects.map((project) => ({ path: `work/${project.slug}`, title: project.title })),
  ]

  return {
    name: 'route-files',
    apply: 'build',
    closeBundle() {
      const index = readFileSync('dist/index.html', 'utf8')
      for (const route of routes) {
        const html = index.replace(/<title>.*<\/title>/, `<title>${route.title} | ${profile.name}</title>`)
        // Both forms, because /work/ is a folder as soon as any project page exists inside it.
        for (const file of [`${route.path}.html`, `${route.path}/index.html`]) {
          const target = join('dist', file)
          mkdirSync(dirname(target), { recursive: true })
          writeFileSync(target, html)
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE : '/',
  plugins: [react(), tailwindcss(), routeFiles()],
}))
