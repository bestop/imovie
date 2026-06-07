import { initDatabase } from '../../../lib/db-neon';

export async function POST() {
  try {
    console.log('开始初始化数据库...');
    await initDatabase();
    return Response.json({ 
      success: true, 
      message: '数据库初始化成功！所有默认剧集已添加。' 
    });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return Response.json({ 
      success: false, 
      error: '数据库初始化失败: ' + error.message 
    }, { status: 500 });
  }
}
