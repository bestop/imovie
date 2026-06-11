import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// 默认剧集数据（包含迷墙）
const DEFAULT_DRAMAS = [
  {
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
    badge: '新上线'
  },
  {
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
    badge: '热播'
  },
  {
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
    badge: '豆瓣9分'
  },
  {
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
    badge: '口碑佳作'
  },
  {
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
    badge: '续作回归'
  },
  {
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
    badge: '复仇爽剧'
  },
  {
    title: '迷墙',
    synopsis: '一部震撼人心的战争题材佳作，讲述了在战火纷飞的年代，普通人如何在绝境中寻找希望与救赎的故事。影片以细腻的情感刻画和宏大的叙事视角，展现了人性的光辉与战争的残酷。',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=450&fit=crop',
    episodes: 1,
    year: 2026,
    genre: '战争剧情',
    linkUrl: 'https://pan.quark.cn/s/xxxxx',
    linkType: '夸克网盘',
    quality: '4K',
    featured: false,
    badge: '新片'
  }
];

export async function POST() {
  try {
    console.log('🚀 开始种子数据插入...');

    // 创建表
    await sql`
      CREATE TABLE IF NOT EXISTS dramas (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        synopsis TEXT,
        poster TEXT,
        episodes INTEGER DEFAULT 1,
        year INTEGER DEFAULT 2026,
        genre VARCHAR(100),
        link_url TEXT,
        link_type VARCHAR(50),
        quality VARCHAR(20),
        featured BOOLEAN DEFAULT false,
        badge VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 清空现有数据（可选，取消注释即可）
    // await sql`DELETE FROM dramas`;

    // 检查现有数据
    const result = await sql`SELECT COUNT(*) as count FROM dramas`;
    const count = result[0]?.count || 0;
    console.log('📊 现有剧集数量:', count);

    // 插入默认数据
    for (const drama of DEFAULT_DRAMAS) {
      await sql`
        INSERT INTO dramas (
          title, synopsis, poster, episodes, year, genre, 
          link_url, link_type, quality, featured, badge, created_at
        ) VALUES (
          ${drama.title}, ${drama.synopsis}, ${drama.poster}, 
          ${drama.episodes}, ${drama.year}, ${drama.genre},
          ${drama.linkUrl}, ${drama.linkType}, ${drama.quality}, 
          ${drama.featured}, ${drama.badge}, NOW()
        )
      `;
      console.log('✅ 已添加:', drama.title);
    }

    // 验证结果
    const finalResult = await sql`SELECT COUNT(*) as count FROM dramas`;
    const finalCount = finalResult[0]?.count || 0;

    return Response.json({
      success: true,
      message: '种子数据插入成功！',
      previousCount: count,
      currentCount: finalCount,
      dramas: DEFAULT_DRAMAS.map(d => d.title)
    });

  } catch (error) {
    console.error('❌ 种子数据插入失败:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
