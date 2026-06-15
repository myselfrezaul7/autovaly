import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const baseUrl = 'https://autovaly.com'

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/vehicles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...articleUrls,
  ]
}
