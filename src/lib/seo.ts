import fs from 'fs'
import path from 'path'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HEADING_H1_RE = /^#\s+(.+)$/m
const EMOJI_NEWSLETTER = '📰'
const HIGHLIGHTS_SECTION_RE = /##\s*.*?今日看点\s*\n([\s\S]*?)\n---/
const TAGS_LINE_RE = /🏷️\s*(.+)/
const DATE_RE = /(\d{4}-\d{2}-\d{2})/
const MD_EXTENSION_RE = /\.md$/
const FALLBACK_DESCRIPTION = 'AI 博客每日精选，来自 Karpathy 推荐的顶级技术博客'

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
  let content: string
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    throw new Error(`Failed to read digest file: ${filePath}`)
  }

  // Extract title from first H1
  const titleMatch = content.match(HEADING_H1_RE)
  const title = titleMatch
    ? titleMatch[1].replace(EMOJI_NEWSLETTER, '').trim()
    : slug.replace(/-/g, ' ')

  // Extract description from 今日看点 section
  const highlightsMatch = content.match(HIGHLIGHTS_SECTION_RE)
  const description = highlightsMatch
    ? highlightsMatch[1].trim().slice(0, 160).replace(/\n/g, ' ')
    : FALLBACK_DESCRIPTION

  // Extract date from filename (e.g., digest_2026-05-15.md)
  const dateMatch = slug.match(DATE_RE)
  const date = dateMatch ? dateMatch[1] : ''

  // Extract tags from 🏷️ line
  const tagsMatch = content.match(TAGS_LINE_RE)
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

  try {
    return fs.readdirSync(contentDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(MD_EXTENSION_RE, ''))
      .sort((a, b) => b.localeCompare(a))
  } catch {
    return []
  }
}
