import './globals.css'

export const metadata = {
  title: '微剧场 - 影视影剧发布平台',
  description: '发现精彩影视影剧',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
