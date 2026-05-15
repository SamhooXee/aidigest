import type { MetadataRoute } from 'next'
import { getDigestSlugs } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL || 'https://aidigest.vercel.app'
  const slugs = getDigestSlugs()

  const digestUrls = slugs.map(slug => ({
    url: `${siteUrl}/digest/${slug}`,
    lastModified: new Date(slug.replace('digest_', '')),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...digestUrls,
  ]
}
