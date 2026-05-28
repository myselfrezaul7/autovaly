import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Autovaly',
    short_name: 'Autovaly',
    description: 'Expert car reviews, road tests, and verdicts from the Autovaly team.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0E12',
    theme_color: '#E82B2B',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
