import fs from 'fs'
import path from 'path'

export interface ArticleMetadata {
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
}

/**
 * Parse article metadata from a markdown file.
 * Title: extracted from the first H1 heading.
 * Description: extracted from the "今日看点" section (first 160 chars).
 * Date: extracted from the filename (digest_YYYY-MM-DD.md).
 * Tags: extracted from the 🏷️ line.
 */
export function extractMetadata(filePath: string, slug: string): ArticleMetadata {
  const content = fs.readFileSync(filePath, 'utf-8')

  // Extract title from first H1
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1].replace(/📰\s*/, '').trim()
    : slug.replace(/-/g, ' ')

  // Extract description from 今日看点 section
  const highlightsMatch = content.match(/##\s*.*?今日看点\s*\n([\s\S]*?)\n---/)
  const description = highlightsMatch
    ? highlightsMatch[1].trim().slice(0, 160).replace(/\n/g, ' ')
    : 'AI 博客每日精选，来自 Karpathy 推荐的顶级技术博客'

  // Extract date from filename (e.g., digest_2026-05-15.md)
  const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : ''

  // Extract tags from 🏷️ line
  const tagsMatch = content.match(/🏷️\s*(.+)/)
  const tags = tagsMatch
    ? tagsMatch[1].split(',').map(t => t.trim())
    : []

  return { title, description, date, slug, tags }
}

/**
 * Get all digest slugs sorted by date descending.
 */
export function getDigestSlugs(): string[] {
  const contentDir = path.join(process.cwd(), 'content')
  if (!fs.existsSync(contentDir)) return []

  return fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
    .sort()
    .reverse()
}
