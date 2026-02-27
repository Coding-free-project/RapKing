import { MetadataRoute } from 'next'
import { getArticles, getArtists, getClips } from '@/lib/api'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapking.com'
const langs = ['fr', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const lang of langs) {
    entries.push(
      { url: `${siteUrl}/${lang}`, changeFrequency: 'daily', priority: 1.0 },
      { url: `${siteUrl}/${lang}/articles`, changeFrequency: 'daily', priority: 0.9 },
      { url: `${siteUrl}/${lang}/artistes`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${siteUrl}/${lang}/clips`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${siteUrl}/${lang}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    )
  }

  // Dynamic articles
  try {
    const res = await getArticles({ limit: 200, lang: 'fr' })
    for (const article of res.data.data) {
      if (article.published) {
        for (const lang of langs) {
          entries.push({
            url: `${siteUrl}/${lang}/articles/${article.slug}`,
            lastModified: new Date(article.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      }
    }
  } catch {}

  // Dynamic artists
  try {
    const res = await getArtists({ limit: 200 })
    for (const artist of res.data.data) {
      for (const lang of langs) {
        entries.push({
          url: `${siteUrl}/${lang}/artistes/${artist.slug}`,
          lastModified: new Date(artist.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch {}

  // Dynamic clips
  try {
    const res = await getClips({ limit: 200 })
    for (const clip of res.data.data) {
      for (const lang of langs) {
        entries.push({
          url: `${siteUrl}/${lang}/clips/${clip.slug}`,
          lastModified: new Date(clip.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch {}

  return entries
}
