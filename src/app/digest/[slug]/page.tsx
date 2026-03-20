import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

function getMdFilePath(slug: string): string | null {
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`)
  if (fs.existsSync(filePath)) {
    return filePath
  }
  return null
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
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← 返回首页
      </Link>
      <article className="bg-white rounded-lg shadow-sm border p-8 mt-4">
        <header className="mb-8 pb-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.title || slug.replace(/-/g, ' ')}
          </h1>
          {data.date && (
            <time className="text-gray-500">{data.date}</time>
          )}
        </header>
        <div className="prose prose-blue max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}