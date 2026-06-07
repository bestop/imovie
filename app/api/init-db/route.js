import { initDatabase } from '../../../lib/db-neon';

export async function POST() {
  try {
    console.log('🚀 收到数据库初始化请求...');
    
    const result = await initDatabase();
    
    console.log('✅ 数据库初始化完成:', result);
    
    return Response.json({
      success: true,
      message: '数据库初始化成功！所有默认剧集已添加。',
      count: result.count
    });
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    return Response.json({
      success: false,
      error: error.message || '数据库初始化失败',
      details: error.stack
    }, { status: 500 });
  }
}
