import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Digest',
  description: 'AI 新闻摘要',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              AI Digest
            </a>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}