import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'dramas.json')

const DEFAULT_DATA = [
  {
    id: 13,
    title: '奔跑吧第10季',
    synopsis: '全新一季的户外竞技真人秀节目，明星嘉宾们通过各种有趣的游戏挑战，带来欢笑与感动，传递正能量。',
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
  },
  {
    id: 6,
    title: '新生',
    synopsis: '一场追思会，五个互不相识的人被揭露与死者的复杂关系，真相远比想象中更加扑朔迷离。',
    poster: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=450&fit=crop',
    episodes: 10,
    year: 2026,
    genre: '悬疑推理',
    linkUrl: 'https://pan.baidu.com/s/xxxxx',
    linkType: '百度网盘',
    quality: '1080P',
    featured: false,
    badge: '烧脑神剧',
    createdAt: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 7,
    title: '玫瑰的故事',
    synopsis: '从校园到职场，从恋爱到婚姻，刘亦菲饰演的黄亦玫演绎了一个女人二十年的成长与蜕变。',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop',
    episodes: 38,
    year: 2026,
    genre: '都市情感',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '4K',
    featured: false,
    badge: '女神新作',
    createdAt: new Date(Date.now() - 518400000).toISOString()
  },
  {
    id: 8,
    title: '看不见影子的少年',
    synopsis: '失踪多年的少年突然归来，却失去了所有记忆。真相与谎言交织，亲情与正义该如何抉择。',
    poster: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=450&fit=crop',
    episodes: 16,
    year: 2026,
    genre: '家庭悬疑',
    linkUrl: 'https://pan.baidu.com/s/xxxxx',
    linkType: '百度网盘',
    quality: '1080P',
    featured: false,
    badge: '张颂文',
    createdAt: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: 9,
    title: '狐妖小红娘月红篇',
    synopsis: '人妖两族的千年情缘，涂山苏苏与东方月初的命运纠缠，谱写一曲跨越生死的旷世奇缘。',
    poster: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=800&h=450&fit=crop',
    episodes: 36,
    year: 2026,
    genre: '奇幻仙侠',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '4K',
    featured: false,
    badge: '动漫改编',
    createdAt: new Date(Date.now() - 691200000).toISOString()
  },
  {
    id: 10,
    title: 'executioner',
    synopsis: '顶级杀手隐退都市，却被迫重出江湖。当杀手遇到纯真少女，是救赎还是毁灭？',
    poster: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=450&fit=crop',
    episodes: 24,
    year: 2026,
    genre: '都市动作',
    linkUrl: 'https://pan.baidu.com/s/xxxxx',
    linkType: '百度网盘',
    quality: '4K',
    featured: false,
    badge: '动作爽剧',
    createdAt: new Date(Date.now() - 777600000).toISOString()
  },
  {
    id: 11,
    title: '少年白马醉春风',
    synopsis: '热血少年闯荡江湖，以一腔正气对抗世间不公。侠之大者，为国为民。',
    poster: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=450&fit=crop',
    episodes: 40,
    year: 2026,
    genre: '武侠江湖',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '4K',
    featured: false,
    badge: '武侠新篇',
    createdAt: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: 12,
    title: '破镜重圆',
    synopsis: '分手五年的前任意外重逢，旧情复燃却困难重重。爱情能否经受住现实的重重考验？',
    poster: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=450&fit=crop',
    episodes: 30,
    year: 2026,
    genre: '都市爱情',
    linkUrl: 'https://pan.baidu.com/s/xxxxx',
    linkType: '百度网盘',
    quality: '1080P',
    featured: false,
    badge: '都市虐恋',
    createdAt: new Date(Date.now() - 950400000).toISOString()
  }
]

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
  }
}

async function readData() {
  await ensureDataFile()
  const data = await fs.readFile(DATA_FILE, 'utf8')
  return JSON.parse(data)
}

async function writeData(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function getDramas() {
  const dramas = await readData()
  return dramas.sort((a, b) =&gt; new Date(b.createdAt) - new Date(a.createdAt))
}

export async function getFeaturedDrama() {
  const dramas = await readData()
  return dramas.find(d =&gt; d.featured) || dramas[0]
}

export async function getDramaById(id) {
  const dramas = await readData()
  return dramas.find(d =&gt; d.id === parseInt(id))
}

export async function addDrama(drama) {
  const dramas = await readData()
  const newDrama = {
    ...drama,
    id: Date.now(),
    createdAt: new Date().toISOString()
  }
  if (newDrama.featured) {
    dramas.forEach(d =&gt; d.featured = false)
  }
  dramas.unshift(newDrama)
  await writeData(dramas)
  return newDrama
}

export async function updateDrama(id, updates) {
  const dramas = await readData()
  const index = dramas.findIndex(d =&gt; d.id === parseInt(id))
  if (index === -1) return null

  if (updates.featured) {
    dramas.forEach(d =&gt; d.featured = false)
  }

  dramas[index] = {
    ...dramas[index],
    ...updates
  }
  await writeData(dramas)
  return dramas[index]
}

export async function deleteDrama(id) {
  const dramas = await readData()
  const filtered = dramas.filter(d =&gt; d.id !== parseInt(id))
  await writeData(filtered)
  return true
}
