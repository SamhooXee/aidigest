import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './Providers'
import Header from './Header'

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