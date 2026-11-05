// Serves dist/ the way GitHub Pages does: under /Zone-Ming/, trying the exact file, then
// <path>.html, then <path>/index.html, with 404.html for anything else.
// Run `npm run build` first, then `npm run serve:pages`.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = '/Zone-Ming/'
const PORT = Number(process.env.PORT ?? 4174)
const DIST = resolve(fileURLToPath(import.meta.url), '../../dist')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function isFile(path) {
  return path.startsWith(DIST) && existsSync(path) && statSync(path).isFile()
}

function send(res, file, status) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

createServer((req, res) => {
  const { pathname } = new URL(req.url.replace(/^\/+/, '/'), 'http://localhost')
  if (!pathname.startsWith(BASE)) {
    res.writeHead(302, { Location: BASE })
    return res.end()
  }

  const relative = decodeURIComponent(pathname.slice(BASE.length)).replace(/\/$/, '')
  const candidate = join(DIST, normalize(relative))
  const found = [candidate, `${candidate}.html`, join(candidate, 'index.html')].find(isFile)
  send(res, found ?? join(DIST, '404.html'), found ? 200 : 404)
}).listen(PORT, () => {
  console.log(`GitHub Pages simulation on http://localhost:${PORT}${BASE}`)
})
