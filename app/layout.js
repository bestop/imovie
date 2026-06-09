import './globals.css'

export const metadata = {
  title: '微剧场 - 影视影剧发布平台',
  description: '发现精彩影视影剧，热门综艺、年代传奇、悬疑犯罪等类型一网打尽',
  openGraph: {
    title: '微剧场 - 影视影剧发布平台',
    description: '发现精彩影视影剧，热门综艺、年代传奇、悬疑犯罪等类型一网打尽',
    siteName: '微剧场',
    locale: 'zh_CN',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: '微剧场 - 影视影剧发布平台',
    description: '发现精彩影视影剧，热门综艺、年代传奇、悬疑犯罪等类型一网打尽'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
