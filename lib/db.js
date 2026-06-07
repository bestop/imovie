import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'dramas.json')

const DEFAULT_DATA = [
  {
    id: 13,
    title: '奔跑吧第十季',
    synopsis: '全新一季的户外竞技真人秀节目，明星嘉宾们通过各种有趣的游戏挑战，带来欢笑与感动，传递正能量。每周准时更新！',
    poster: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=450&fit=crop',
    episodes: 12,
    year: 2026,
    genre: '综艺竞技',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '4K',
    featured: true,
    badge: '新上线',
    createdAt: new Date().toISOString()
  },
  {
    id: 1,
    title: '繁花',
    synopsis: '上海滩繁华落尽，三个性格迥异的女人在时代洪流中各自浮沉，演绎一段关于爱情、友情与人生的动人故事。',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
    episodes: 30,
    year: 2026,
    genre: '年代传奇',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '4K',
    featured: false,
    badge: '热播',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: '漫长的季节',
    synopsis: '一个尘封多年的悬案，一段跨越二十年的追凶之旅。当真相浮出水面，所有人都要面对命运的审判。',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&h=450&fit=crop',
    episodes: 12,
    year: 2026,
    genre: '悬疑犯罪',
    linkUrl: 'https://pan.baidu.com/s/xxxxx',
    linkType: '百度网盘',
    quality: '4K',
    featured: false,
    badge: '豆瓣9分',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    title: '我的阿勒泰',
    synopsis: '逃离都市喧嚣的汉族女孩，在新疆阿勒泰的草原上找到了心灵的归宿，一段关于成长与治愈的故事。',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=450&fit=crop',
    episodes: 8,
    year: 2026,
    genre: '治愈田园',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '1080P',
    featured: false,
    badge: '口碑佳作',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 4,
    title: '庆余年2',
    synopsis: '范闲重归京城，面对更加复杂的朝堂纷争与江湖恩怨，他将以全新身份搅动这盘生死棋局。',
    poster: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=450&fit=crop',
    episodes: 36,
    year: 2026,
    genre: '古装权谋',
    linkUrl: 'https://pan.baidu.com/s/xxxxx',
    linkType: '百度网盘',
    quality: '4K',
    featured: false,
    badge: '续作回归',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 5,
    title: '墨雨云间',
    synopsis: '相府千金浴火重生，化身复仇女神步步为营，且看她如何以智取胜，搅动朝野风云。',
    poster: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=450&fit=crop',
    episodes: 40,
    year: 2026,
    genre: '古装复仇',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '4K',
    featured: false,
    badge: '复仇爽剧',
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
]

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(data)
    console.log('数据读取成功，共', parsed.length, '部剧集')
    return parsed
  } catch (error) {
    console.log('数据文件不存在或读取失败，使用默认数据，错误:', error.message)
    return DEFAULT_DATA
  }
}

async function writeData(data) {
  try {
    console.log('尝试写入数据文件，路径:', DATA_FILE)
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    console.log('目录创建成功（或已存在）')
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log('数据文件写入成功')
    return true
  } catch (error) {
    console.error('写入数据文件失败:', error)
    throw error
  }
}

export async function getDramas() {
  const dramas = await readData()
  return dramas.sort(function(a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export async function getFeaturedDrama() {
  const dramas = await readData()
  return dramas.find(function(d) {
    return d.featured
  }) || dramas[0]
}

export async function getDramaById(id) {
  const dramas = await readData()
  return dramas.find(function(d) {
    return d.id === parseInt(id)
  })
}

export async function addDrama(drama) {
  const dramas = await readData()
  const newDrama = {
    ...drama,
    id: Date.now(),
    createdAt: new Date().toISOString()
  }
  if (newDrama.featured) {
    dramas.forEach(function(d) {
      d.featured = false
    })
  }
  dramas.unshift(newDrama)
  await writeData(dramas)
  return newDrama
}

export async function updateDrama(id, updates) {
  const dramas = await readData()
  const index = dramas.findIndex(function(d) {
    return d.id === parseInt(id)
  })
  
  console.log('更新剧集 ID:', id, '找到索引:', index)
  
  if (index === -1) {
    console.error('未找到要更新的剧集，ID:', id)
    return null
  }

  if (updates.featured) {
    dramas.forEach(function(d) {
      d.featured = false
    })
  }

  dramas[index] = {
    ...dramas[index],
    ...updates
  }
  
  await writeData(dramas)
  console.log('剧集更新成功:', dramas[index].title)
  return dramas[index]
}

export async function deleteDrama(id) {
  const dramas = await readData()
  const filtered = dramas.filter(function(d) {
    return d.id !== parseInt(id)
  })
  
  if (filtered.length === dramas.length) {
    console.error('未找到要删除的剧集，ID:', id)
    return false
  }
  
  await writeData(filtered)
  console.log('剧集删除成功，ID:', id)
  return true
}
