export const PUBLIC_SITE_ORIGIN = 'https://vellocorretores.vercel.app'
export const PUBLIC_CATALOG_DOMAIN = 'vellocorretores.vercel.app'

export function publicCatalogLabel(slug?: string | null) {
  return `${PUBLIC_CATALOG_DOMAIN}/${slug || ''}`.replace(/\/$/, '')
}

export function appPath(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${cleanPath}`
}
