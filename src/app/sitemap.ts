import type { MetadataRoute } from 'next'
import { getDigestSlugs } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL || 'https://aidigest.vercel.app'
  const slugs = getDigestSlugs()

  const digestUrls = slugs.map(slug => {
    const lastModified = new Date(slug.replace('digest_', ''))
    return {
      url: `${siteUrl}/digest/${slug}`,
      lastModified: isNaN(lastModified.getTime()) ? new Date() : lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }
  })

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
