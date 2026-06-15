import { createClient } from '@sanity/client'
import { articles } from '../lib/data/articles'
import { vehicles } from '../lib/data/vehicles'
import { authors } from '../lib/data/authors'
import { projectId, dataset, apiVersion } from './env'

// Note: To run this script, you must provide a SANITY_API_TOKEN with write access.
// Example: NEXT_PUBLIC_SANITY_PROJECT_ID=your_id SANITY_API_TOKEN=your_token npx tsx src/sanity/migrate.ts

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function migrate() {
  console.log('Starting migration to Sanity...')

  if (projectId === 'your-project-id') {
    console.error('ERROR: You must run `npx sanity init` and set NEXT_PUBLIC_SANITY_PROJECT_ID before migrating.')
    return
  }

  // 1. Migrate Authors
  for (const author of authors) {
    await client.createOrReplace({
      _id: `author-${author.slug}`,
      _type: 'author',
      name: author.name,
      slug: { _type: 'slug', current: author.slug },
    })
    console.log(`Migrated author: ${author.name}`)
  }

  // 2. Migrate Articles
  for (const article of articles) {
    await client.createOrReplace({
      _id: `article-${article.id}`,
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      author: { _type: 'reference', _ref: `author-${article.author.slug}` },
      category: article.category,
      segments: article.segments,
      publishedAt: article.publishedAt,
      excerpt: article.excerpt,
      body: article.body,
      readTime: article.readTime,
      featured: article.featured,
      editorsPick: article.editorsPick,
      heroArticle: article.heroArticle,
      coverGradient: article.coverGradient,
    })
    console.log(`Migrated article: ${article.title}`)
  }

  // 3. Migrate Vehicles
  for (const vehicle of vehicles) {
    await client.createOrReplace({
      _id: `vehicle-${vehicle.id}`,
      _type: 'vehicle',
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      slug: { _type: 'slug', current: vehicle.slug },
      trim: vehicle.trim,
      priceEur: vehicle.priceEur,
      fuelType: vehicle.fuelType,
      bodyStyle: vehicle.bodyStyle,
      segments: vehicle.segments,
      specs: vehicle.specs,
      evSpecs: vehicle.evSpecs,
      highlights: vehicle.highlights,
    })
    console.log(`Migrated vehicle: ${vehicle.make} ${vehicle.model}`)
  }

  console.log('Migration complete!')
}

migrate().catch(console.error)
