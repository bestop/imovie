import { neon } from '@neondatabase/serverless';

// 延迟创建数据库连接（每次请求使用独立连接，适配 serverless 环境）
let sqlConnection = null;

function getSql() {
  if (!sqlConnection) {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL 环境变量未设置，无法连接数据库');
      return null;
    }

    try {
      sqlConnection = neon(process.env.DATABASE_URL, {
        fetchConnectionCache: true,
      });
      console.log('Neon 数据库连接初始化成功');
    } catch (error) {
      console.error('Neon 数据库连接初始化失败:', error.message);
      sqlConnection = null;
      return null;
    }
  }
  return sqlConnection;
}

// 默认剧集数据（仅用于初始化数据库）
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
  if (!sql) return false;

  try {
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
    return true;
  } catch (error) {
    console.error('创建 dramas 表失败:', error.message);
    return false;
  }
}

// 初始化数据库并插入默认数据
async function initDatabase() {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置，请检查 DATABASE_URL 环境变量');
  }

  try {
    await ensureTableExists();

    const result = await sql`SELECT COUNT(*) as count FROM dramas`;
    const count = parseInt(result[0]?.count, 10) || 0;

    if (count === 0) {
      // Neon serverless 通过 HTTP 连接，不支持 BEGIN/COMMIT 事务
      // 逐条插入，使用 ON CONFLICT 防止重复
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
          ON CONFLICT DO NOTHING
        `;
      }
    }

    return { success: true, count };
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    throw new Error(`数据库初始化失败: ${error.message}`);
  }
}

// 数据库连接健康检查
export async function checkConnection() {
  const sql = getSql();
  if (!sql) {
    return { connected: false, error: 'DATABASE_URL 未配置' };
  }

  try {
    const result = await sql`SELECT 1 as ok`;
    return { connected: true, result: result[0] };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

// 获取所有剧集
export async function getDramas() {
  const sql = getSql();
  if (!sql) {
    console.warn('数据库未连接，返回空列表');
    return [];
  }

  try {
    const tableOk = await ensureTableExists();
    if (!tableOk) {
      return [];
    }

    let rows = await sql`
      SELECT
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType",
        quality, featured, badge, created_at as "createdAt"
      FROM dramas
      ORDER BY created_at DESC
    `;

    // 数据库为空时，自动初始化并重新查询
    if (rows.length === 0) {
      try {
        await initDatabase();
        rows = await sql`
          SELECT
            id, title, synopsis, poster, episodes, year, genre,
            link_url as "linkUrl", link_type as "linkType",
            quality, featured, badge, created_at as "createdAt"
          FROM dramas
          ORDER BY created_at DESC
        `;
      } catch (e) {
        console.error('自动初始化数据库失败:', e.message);
      }
    }

    return rows;
  } catch (error) {
    console.error('获取剧集失败:', error.message);
    return [];
  }
}

// 获取精选剧集
export async function getFeaturedDrama() {
  const sql = getSql();
  if (!sql) {
    return null;
  }

  try {
    await ensureTableExists();
    const rows = await sql`
      SELECT
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType",
        quality, featured, badge, created_at as "createdAt"
      FROM dramas
      WHERE featured = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (rows.length > 0) return rows[0];

    // 没有精选则返回最新一条
    const latest = await sql`
      SELECT
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType",
        quality, featured, badge, created_at as "createdAt"
      FROM dramas
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return latest[0] || null;
  } catch (error) {
    console.error('获取精选剧集失败:', error.message);
    return null;
  }
}

// 根据ID获取剧集
export async function getDramaById(id) {
  const sql = getSql();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;

  if (!sql) {
    return null;
  }

  try {
    await ensureTableExists();
    const rows = await sql`
      SELECT
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType",
        quality, featured, badge, created_at as "createdAt"
      FROM dramas
      WHERE id = ${numId}
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('获取剧集详情失败:', error.message);
    throw new Error(`获取剧集详情失败: ${error.message}`);
  }
}

// 添加剧集
export async function addDrama(drama) {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置，无法添加剧集');
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
        ${drama.title ?? ''}, ${drama.synopsis ?? ''}, ${drama.poster ?? ''},
        ${drama.episodes ?? 1}, ${drama.year ?? 2026}, ${drama.genre ?? ''},
        ${drama.linkUrl ?? ''}, ${drama.linkType ?? '夸克网盘'},
        ${drama.quality ?? 'HD'}, ${drama.featured ?? false},
        ${drama.badge ?? ''}
      )
      RETURNING
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType",
        quality, featured, badge, created_at as "createdAt"
    `;
    return rows[0];
  } catch (error) {
    console.error('添加剧集失败:', error.message);
    throw new Error(`添加剧集失败: ${error.message}`);
  }
}

// 更新剧集
export async function updateDrama(id, updates) {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置，无法更新剧集');
  }

  try {
    const dramaId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(dramaId)) {
      throw new Error(`无效的剧集 ID: ${id}`);
    }

    await ensureTableExists();

    if (updates.featured === true) {
      await sql`UPDATE dramas SET featured = false WHERE featured = true`;
    }

    const rows = await sql`
      UPDATE dramas SET
        title = ${updates.title ?? ''},
        synopsis = ${updates.synopsis ?? ''},
        poster = ${updates.poster ?? ''},
        episodes = ${updates.episodes ?? 1},
        year = ${updates.year ?? 2026},
        genre = ${updates.genre ?? ''},
        link_url = ${updates.linkUrl ?? ''},
        link_type = ${updates.linkType ?? '夸克网盘'},
        quality = ${updates.quality ?? 'HD'},
        featured = ${updates.featured ?? false},
        badge = ${updates.badge ?? ''}
      WHERE id = ${dramaId}
      RETURNING
        id, title, synopsis, poster, episodes, year, genre,
        link_url as "linkUrl", link_type as "linkType",
        quality, featured, badge, created_at as "createdAt"
    `;

    return rows[0] || null;
  } catch (error) {
    console.error('更新剧集失败:', error.message);
    throw new Error(`更新剧集失败: ${error.message}`);
  }
}

// 删除剧集
export async function deleteDrama(id) {
  const sql = getSql();
  if (!sql) {
    throw new Error('数据库连接未配置，无法删除剧集');
  }

  try {
    const dramaId = typeof id === 'string' ? parseInt(id, 10) : id;
    await ensureTableExists();
    await sql`DELETE FROM dramas WHERE id = ${dramaId}`;
    return true;
  } catch (error) {
    console.error('删除剧集失败:', error.message);
    throw new Error(`删除剧集失败: ${error.message}`);
  }
}

export { initDatabase };
