import { neon } from '@neondatabase/serverless';

// 延迟创建数据库连接
let sqlConnection = null;

function getSql() {
  if (!sqlConnection) {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL 环境变量未设置');
      return null;
    }
    
    console.log('🔌 初始化 Neon 数据库连接...');
    try {
      sqlConnection = neon(process.env.DATABASE_URL);
      console.log('✅ Neon 数据库连接初始化成功');
    } catch (error) {
      console.error('❌ Neon 数据库连接初始化失败:', error);
      return null;
    }
  }
  return sqlConnection;
}

// 默认剧集数据
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
  }
];

// 自动创建数据库表
async function ensureTableExists() {
  const sql = getSql();
  if (!sql) {
    console.error('无法获取数据库连接');
    return false;
  }

  try {
    console.log('📝 检查 dramas 表...');
    
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
    
    console.log('✅ dramas 表检查完成');
    return true;
  } catch (error) {
    console.error('❌ 创建 dramas 表失败:', error);
    return false;
  }
}

// 初始化数据库并插入数据
async function initDatabase() {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置');
  }

  try {
    // 创建表
    await ensureTableExists();
    
    // 检查数据
    const result = await sql`SELECT COUNT(*) as count FROM dramas`;
    const count = result[0]?.count || 0;
    console.log('📊 当前剧集数量:', count);
    
    if (count === 0) {
      console.log('📥 开始插入默认数据...');
      
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
      }
      
      console.log('✅ 默认数据插入完成');
    }
    
    return { success: true, count };
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
}

// 获取所有剧集
export async function getDramas() {
  const sql = getSql();
  if (!sql) {
    console.warn('⚠️ 数据库未连接，返回默认数据');
    return DEFAULT_DRAMAS.map((d, i) => ({ ...d, id: i + 1, createdAt: new Date().toISOString() }));
  }

  try {
    const tableOk = await ensureTableExists();
    if (!tableOk) {
      console.warn('⚠️ 表创建失败，返回默认数据');
      return DEFAULT_DRAMAS.map((d, i) => ({ ...d, id: i + 1, createdAt: new Date().toISOString() }));
    }
    
    const rows = await sql`
      SELECT 
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType", 
        quality, featured, badge, created_at as "createdAt"
      FROM dramas 
      ORDER BY created_at DESC
    `;
    
    console.log('📋 获取到', rows.length, '条剧集');
    
    // 如果数据库为空，插入默认数据
    if (rows.length === 0) {
      console.log('📋 数据库为空，尝试插入默认数据...');
      try {
        await initDatabase();
        // 重新获取
        const newRows = await sql`
          SELECT 
            id, title, synopsis, poster, episodes, year, genre,
            link_url as "linkUrl", link_type as "linkType", 
            quality, featured, badge, created_at as "createdAt"
          FROM dramas 
          ORDER BY created_at DESC
        `;
        if (newRows.length > 0) return newRows;
      } catch (e) {
        console.error('插入默认数据失败:', e);
      }
      return DEFAULT_DRAMAS.map((d, i) => ({ ...d, id: i + 1, createdAt: new Date().toISOString() }));
    }
    
    return rows;
  } catch (error) {
    console.error('❌ 获取剧集失败:', error);
    return DEFAULT_DRAMAS.map((d, i) => ({ ...d, id: i + 1, createdAt: new Date().toISOString() }));
  }
}

// 获取精选剧集
export async function getFeaturedDrama() {
  const dramas = await getDramas();
  return dramas.find(d => d.featured) || dramas[0] || null;
}

// 根据ID获取剧集
export async function getDramaById(id) {
  const dramas = await getDramas();
  // 确保 id 比较时类型一致
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return dramas.find(d => d.id === numId) || null;
}

// 添加剧集
export async function addDrama(drama) {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置');
  }

  try {
    await ensureTableExists();
    
    if (drama.featured) {
      await sql`UPDATE dramas SET featured = false WHERE featured = true`;
    }

    const rows = await sql`
      INSERT INTO dramas (
        title, synopsis, poster, episodes, year, genre,
        link_url, link_type, quality, featured, badge
      ) VALUES (
        ${drama.title}, ${drama.synopsis || ''}, ${drama.poster || ''},
        ${drama.episodes || 1}, ${drama.year || 2026}, ${drama.genre || ''},
        ${drama.linkUrl || ''}, ${drama.linkType || '夸克网盘'}, 
        ${drama.quality || 'HD'}, ${drama.featured || false}, 
        ${drama.badge || ''}
      )
      RETURNING 
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType", 
        quality, featured, badge, created_at as "createdAt"
    `;
    return rows[0];
  } catch (error) {
    console.error('添加剧集失败:', error);
    throw error;
  }
}

// 更新剧集
export async function updateDrama(id, updates) {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置');
  }

  try {
    // 确保 id 是数字
    const dramaId = typeof id === 'string' ? parseInt(id, 10) : id;
    console.log('🔄 更新剧集，ID:', dramaId, '类型:', typeof dramaId, '更新内容:', updates);
    
    await ensureTableExists();
    
    if (updates.featured) {
      await sql`UPDATE dramas SET featured = false WHERE featured = true`;
    }

    const rows = await sql`
      UPDATE dramas SET
        title = ${updates.title || ''},
        synopsis = ${updates.synopsis || ''},
        poster = ${updates.poster || ''},
        episodes = ${updates.episodes || 1},
        year = ${updates.year || 2026},
        genre = ${updates.genre || ''},
        link_url = ${updates.linkUrl || ''},
        link_type = ${updates.linkType || '夸克网盘'},
        quality = ${updates.quality || 'HD'},
        featured = ${updates.featured || false},
        badge = ${updates.badge || ''}
      WHERE id = ${dramaId}
      RETURNING 
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType", 
        quality, featured, badge, created_at as "createdAt"
    `;
    
    console.log('✅ 更新成功，返回行数:', rows.length);
    return rows[0] || null;
  } catch (error) {
    console.error('❌ 更新剧集失败:', error);
    throw error;
  }
}

// 删除剧集
export async function deleteDrama(id) {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置');
  }

  try {
    const dramaId = typeof id === 'string' ? parseInt(id, 10) : id;
    await ensureTableExists();
    await sql`DELETE FROM dramas WHERE id = ${dramaId}`;
    return true;
  } catch (error) {
    console.error('删除剧集失败:', error);
    throw error;
  }
}

export { initDatabase };
