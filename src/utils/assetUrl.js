/**
 * Builds a URL for files served from Vite's public directory.
 * This keeps assets working when the app is deployed below a sub-path.
 */
export function assetUrl(path) {
  const relativePath = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${relativePath}`
}
