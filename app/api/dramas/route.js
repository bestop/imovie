import { getDramas, addDrama } from '../../../lib/db-neon';

export async function GET() {
  try {
    const dramas = await getDramas();
    return Response.json(dramas);
  } catch (error) {
    console.error('GET /api/dramas 错误:', error);
    return Response.json({ error: '读取数据失败: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const drama = await request.json();
    console.log('添加新剧集:', drama);
    const newDrama = await addDrama(drama);
    return Response.json(newDrama);
  } catch (error) {
    console.error('POST /api/dramas 错误:', error);
    return Response.json({ error: '添加剧集失败: ' + error.message }, { status: 500 });
  }
}
