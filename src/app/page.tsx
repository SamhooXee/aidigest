import Link from 'next/link'
import fs from 'fs'
import path from 'path'

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

export default function Home() {
  const files = getMdFiles().sort().reverse()

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">暂无内容</p>
        <p className="text-gray-400 mt-2">请在 content 目录下添加 .md 文件</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">最新摘要</h1>
      <div className="space-y-4">
        {files.map(file => {
          const date = parseDateFromFilename(file)
          const slug = file.replace('.md', '')
          return (
            <Link
              key={file}
              href={`/digest/${slug}`}
              className="block bg-white rounded-lg shadow-sm border p-6 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="text-sm text-blue-600 mb-1">{date}</div>
              <div className="text-lg font-medium text-gray-900">
                {slug.replace(/-/g, ' ')}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}