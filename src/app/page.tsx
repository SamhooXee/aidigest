import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import HomePageContent from './HomePageContent'
import { extractMetadata, getDigestSlugs } from '@/lib/seo'

function getMdFiles() {
  const contentDir = path.join(process.cwd(), 'content')
  if (!fs.existsSync(contentDir)) {
    return []
  }
  return fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
}

function parseDateFromFilename(filename: string): string {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/)
  if (match) {
    return match[1]
  }
  return filename.replace('.md', '')
}

function extractTodayHighlights(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const startMatch = content.match(/## .*?今日看点/)
    if (!startMatch) return ''

    const startIndex = startMatch.index! + startMatch[0].length
    const rest = content.slice(startIndex)
    const separatorIndex = rest.indexOf('---')
    if (separatorIndex === -1) return rest.trim()

    return rest.slice(0, separatorIndex).trim()
  } catch {
    return ''
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const slugs = getDigestSlugs()
  if (slugs.length === 0) {
    return {
      title: 'AI 博客每日精选',
      description: '来自 Karpathy 推荐的 90+ 个顶级技术博客，AI 每日精选 Top 15 篇',
    }
  }

  const latestSlug = slugs[0]
  const filePath = path.join(process.cwd(), 'content', `${latestSlug}.md`)
  const meta = extractMetadata(filePath, latestSlug)

  return {
    title: meta.title,
    description: meta.description,
  }
}

export default function Home() {
  const fileNames = getMdFiles().sort().reverse()

  const contentDir = path.join(process.cwd(), 'content')

  const files = fileNames.map(filename => {
    const date = parseDateFromFilename(filename)
    const slug = filename.replace('.md', '')
    const title = slug.replace(/-/g, ' ')
    const filePath = path.join(contentDir, filename)
    const highlights = extractTodayHighlights(filePath)

    return {
      filename,
      date,
      slug,
      title,
      highlights,
    }
  })

  return <HomePageContent files={files} />
}
