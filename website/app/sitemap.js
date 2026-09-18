const baseUrl = 'https://architectsstories.com'

export default function sitemap() {
  const routes = [
    '',
    '/stories',
    '/projects',
    '/learn',
    '/community',
    '/submit',
    '/featuring',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}