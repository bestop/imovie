import { getDramaById } from '../../../lib/db'
import DramaDetail from './DramaDetail'

export async function generateMetadata({ params }) {
  const drama = await getDramaById(params.id)
  
  if (!drama) {
    return {
      title: '未找到影剧 - 微剧场',
    }
  }

  return {
    title: `${drama.title} - 微剧场`,
    description: drama.synopsis,
    openGraph: {
      title: drama.title,
      description: drama.synopsis,
      images: [drama.poster],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: drama.title,
      description: drama.synopsis,
      images: [drama.poster],
    },
  }
}

export default async function Page({ params }) {
  const drama = await getDramaById(params.id)
  
  return <DramaDetail drama={drama} />
}