import { client } from '../lib/sanity'

const baseUrl = 'https://architectsstories.com'

const staticRoutes = [
  '',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/stories',
  '/projects',
  '/learn',
  '/community',
  '/plans',
]

export default async function sitemap() {
  const lastModified = new Date()
  const routes = staticRoutes.map((route) => ({ route, lastModified }))

  try {
    const [projects, stories, courses, people] = await Promise.all([
      client.fetch('*[_type == "project"]{"slug": slug.current, _updatedAt}'),
      client.fetch('*[_type == "project" && showInLatestStories == true]{"slug": slug.current, _updatedAt}'),
      client.fetch('*[_type == "course"]{"slug": slug.current, _updatedAt}'),
      client.fetch('*[_type == "person" && isEnabled != false]{"slug": slug.current, _updatedAt}'),
    ])

    for (const item of projects) {
      if (item.slug) routes.push({ route: `/projects/${item.slug}`, lastModified: new Date(item._updatedAt || lastModified) })
    }
    for (const item of stories) {
      if (item.slug) routes.push({ route: `/stories/${item.slug}`, lastModified: new Date(item._updatedAt || lastModified) })
    }
    for (const item of courses) {
      if (item.slug) routes.push({ route: `/learn/${item.slug}`, lastModified: new Date(item._updatedAt || lastModified) })
    }
    for (const item of people) {
      if (item.slug) routes.push({ route: `/community/people/${item.slug}`, lastModified: new Date(item._updatedAt || lastModified) })
    }
  } catch (error) {
    console.error('Could not load CMS routes for sitemap:', error)
  }

  return routes.map(({ route, lastModified: modified }) => ({
    url: `${baseUrl}${route}`,
    lastModified: modified,
  }))
}
