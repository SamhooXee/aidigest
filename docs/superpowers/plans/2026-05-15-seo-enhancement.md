# SEO Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Open Graph, Twitter Card, robots.txt, sitemap.xml, and dynamic page metadata to the AI Digest Next.js site.

**Architecture:** Use Next.js App Router built-in Metadata API. Root layout provides defaults, homepage and digest pages override with dynamic `generateMetadata`. robots.ts and sitemap.ts generate crawl files at build time.

**Tech Stack:** Next.js 16 Metadata API, gray-matter (existing), plain fs/path parsing (no new deps).

---

### Task 1: Create shared SEO utility — extract metadata from markdown

**Files:**
- Create: `src/lib/seo.ts`

**Why a shared utility:** Both the digest page and the sitemap need to parse metadata from markdown files. Extract this into a reusable function so the digest page and sitemap can share the same parsing logic.

- [ ] **Step 1: Create the SEO utility file**

Create `src/lib/seo.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/seo.ts
git commit -m "feat: add shared SEO metadata extraction utility"
```

---

### Task 2: Enhance root layout metadata

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update the root layout with complete metadata**

Replace the entire file content of `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './Providers'
import Header from './Header'

export const metadata: Metadata = {
  title: {
    default: 'AI Digest — AI 博客每日精选',
    template: '%s | AI Digest',
  },
  description: '来自 Karpathy 推荐的 90+ 个顶级技术博客，AI 每日精选 Top 15 篇，涵盖安全、AI/ML、编程、基础设施等领域',
  metadataBase: new URL(process.env.SITE_URL || 'https://aidigest.vercel.app'),
  openGraph: {
    title: 'AI Digest — AI 博客每日精选',
    description: '来自 Karpathy 推荐的 90+ 个顶级技术博客，AI 每日精选 Top 15 篇',
    siteName: 'AI Digest',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Digest — AI 博客每日精选',
    description: '来自 Karpathy 推荐的 90+ 个顶级技术博客，AI 每日精选 Top 15 篇',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: enhance root layout with complete SEO metadata (OG, Twitter, robots)"
```

---

### Task 3: Add homepage dynamic metadata

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add generateMetadata to the homepage**

The current `src/app/page.tsx` needs `generateMetadata` added. The file currently exports a default `Home` component. We need to add a `generateMetadata` export that reads the latest digest's highlights.

Replace the entire file:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add homepage generateMetadata for dynamic SEO"
```

---

### Task 4: Add digest page dynamic metadata

**Files:**
- Modify: `src/app/digest/[slug]/page.tsx`

- [ ] **Step 1: Add generateMetadata to the digest page**

The current `src/app/digest/[slug]/page.tsx` needs a `generateMetadata` export. Add it after the imports and before the components definition. Replace the entire file:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Metadata, ResolvingMetadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import Link from 'next/link'
import Mermaid from '@/components/Mermaid'
import type { Components } from 'react-markdown'
import { extractMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return {
      title: '文章未找到',
    }
  }

  const meta = extractMetadata(filePath, slug)
  const parentData = await parent
  const url = `/digest/${slug}`

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      publishedTime: meta.date,
      tags: meta.tags,
      url,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  }
}

function getMdFilePath(slug: string): string | null {
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`)
  if (fs.existsSync(filePath)) {
    return filePath
  }
  return null
}

const components: Components = {
  pre({ node, children, ...props }: any) {
    const isMermaid =
      node?.children?.[0]?.type === 'element' &&
      node.children[0].tagName === 'code' &&
      node.children[0].properties?.className?.includes('language-mermaid')

    if (isMermaid) {
      return <div className="not-prose">{children}</div>
    }

    return <pre {...props}>{children}</pre>
  },
  code({ className, children, node, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '')
    const code = String(children).trim()

    if (match && match[1] === 'mermaid') {
      return <Mermaid chart={code} />
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

export default async function DigestPage({ params }: PageProps) {
  const { slug } = await params
  const filePath = getMdFilePath(slug)

  if (!filePath) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return (
    <div>
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        ← 返回首页
      </Link>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-8 mt-4">
        <header className="mb-8 pb-6 border-b dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {data.title || slug.replace(/-/g, ' ')}
          </h1>
          {data.date && (
            <time className="text-gray-500 dark:text-gray-400">{data.date}</time>
          )}
        </header>
        <div className="prose prose-blue max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              rehypeAutolinkHeadings,
              rehypeHighlight,
            ]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/digest/\[slug\]/page.tsx
git commit -m "feat: add digest page generateMetadata for per-article SEO"
```

---

### Task 5: Create robots.txt generator

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create the robots.ts file**

Next.js automatically serves this as `/robots.txt`:

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || 'https://aidigest.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat: add robots.txt generator"
```

---

### Task 6: Create sitemap.xml generator

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create the sitemap.ts file**

Next.js automatically serves this as `/sitemap.xml`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add sitemap.xml generator"
```

---

### Task 7: Verify build and SEO output

- [ ] **Step 1: Run the build to verify no TypeScript errors**

```bash
npm run build
```

Expected: Build succeeds, `/robots.txt` and `/sitemap.xml` are generated.

- [ ] **Step 2: Run dev server and verify SEO**

```bash
npm run dev
```

Then verify:
- `curl http://localhost:3000/robots.txt` — shows `Allow: /` and sitemap URL
- `curl http://localhost:3000/sitemap.xml` — shows sitemap with home + all digest URLs
- Visit homepage — check `<title>` and `<meta>` tags in page source
- Visit any digest page (e.g., `/digest/digest_2026-05-15`) — check dynamic title/OG/Twitter tags

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address build/dev verification issues"
```
