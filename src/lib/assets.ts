/** Turns a path in public/ into a URL that works under the GitHub Pages base path. */
export function assetUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
