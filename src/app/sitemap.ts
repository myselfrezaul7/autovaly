import { MetadataRoute } from 'next'
import { getAllArticles, getAllVehicles } from '@/lib/content'
import { comparisons } from '@/lib/data/comparisons'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const vehicles = getAllVehicles()
  const BASE_URL = 'https://autovaly.com'
  const toAbsoluteUrl = (path: string) => path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const baseUrl = BASE_URL

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
    lastModified: new Date("2026-06-01"),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    ...(article.coverImage ? { images: [toAbsoluteUrl(article.coverImage)] } : {}),
  }))

  const vehicleUrls = vehicles.map((vehicle) => ({
    url: `${baseUrl}/vehicles/${vehicle.slug}`,
    lastModified: new Date("2026-06-01"),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    ...(vehicle.coverImage ? { images: [toAbsoluteUrl(vehicle.coverImage)] } : {}),
  }))

  const comparisonUrls = comparisons.map((comp) => ({
    url: `${baseUrl}/compare/${comp.slug}`,
    lastModified: new Date("2026-06-01"),
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
