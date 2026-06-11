import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function POST() {
  try {
    console.log('🎬 开始添加新剧集《主角》...');

    // 确保表存在
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

    // 检查是否已存在《主角》
    const existing = await sql`SELECT id, title FROM dramas WHERE title = '主角'`;
    if (existing.length > 0) {
      console.log('ℹ️ 剧集《主角》已存在，跳过添加');
      return Response.json({
        success: true,
        message: '剧集《主角》已存在',
        dramaId: existing[0].id
      });
    }

    // 插入《主角》
    const result = await sql`
      INSERT INTO dramas (
        title, synopsis, poster, episodes, year, genre, 
        link_url, link_type, quality, featured, badge, created_at
      ) VALUES (
        '主角',
        '讲述了一位普通小镇青年意外卷入一场惊天阴谋，在命运的十字路口做出艰难选择，最终成长为真正英雄的故事。全片节奏紧凑，情节反转令人意想不到，值得一看！',
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
        1,
        2026,
        '动作悬疑',
        'https://pan.quark.cn/s/xxxxx',
        '夸克网盘',
        '4K',
        false,
        '热播',
        NOW()
      )
      RETURNING id, title
    `;

    console.log('✅ 剧集《主角》添加成功！ID:', result[0]?.id);

    // 获取当前所有剧集
    const allDramas = await sql`SELECT id, title, year, genre, badge, featured FROM dramas ORDER BY created_at DESC`;

    return Response.json({
      success: true,
      message: '✅ 剧集《主角》添加成功！',
      addedDrama: {
        id: result[0]?.id,
        title: result[0]?.title,
        info: '动作悬疑 · 2026 · 4K · 热播'
      },
      totalDramas: allDramas.length,
      allDramas: allDramas.map(d => ({
        id: d.id,
        title: d.title,
        year: d.year,
        genre: d.genre,
        badge: d.badge,
        featured: d.featured
      }))
    });

  } catch (error) {
    console.error('❌ 添加失败:', error);
    return Response.json({
      success: false,
      error: error.message,
      details: '请检查数据库连接'
    }, { status: 500 });
  }
}
