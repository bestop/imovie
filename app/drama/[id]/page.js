import { getDramaById } from '../../../lib/db-neon'
import DramaDetailClient from './DramaDetailClient'

export async function generateMetadata({ params }) {
  const { id } = await params
  const drama = await getDramaById(id)

  if (!drama) {
    return {
      title: '未找到 - 微剧场',
      description: '未找到此影剧'
    }
  }

  const title = `${drama.title} - 微剧场`
  const description = drama.synopsis || `观看${drama.title}，${drama.genre}，${drama.episodes}集全`
  const imageUrl = drama.poster || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/drama/${id}`,
      siteName: '微剧场',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 800,
          height: 450,
          alt: drama.title
        }
      ] : [],
      type: 'video.other',
      locale: 'zh_CN'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : []
    }
  }
}

export default function DramaDetailPage() {
  return <DramaDetailClient />
}
