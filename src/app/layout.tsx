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