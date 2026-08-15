import { MetadataRoute } from 'next'
import { getAllArticles, getAllVehicles } from '@/lib/content'
import { comparisons } from '@/lib/data/comparisons'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const vehicles = getAllVehicles()
  const baseUrl = 'https://autovaly.com'

  const staticPages = [
    '',
    '/vehicles',
    '/articles',
    '/news',
    '/reviews',
    '/evs',
    '/classics',
    '/compare',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const vehicleUrls = vehicles.map((vehicle) => ({
    url: `${baseUrl}/vehicles/${vehicle.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const comparisonUrls = comparisons.map((comp) => ({
    url: `${baseUrl}/compare/${comp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...articleUrls,
    ...vehicleUrls,
    ...comparisonUrls,
  ]
}
