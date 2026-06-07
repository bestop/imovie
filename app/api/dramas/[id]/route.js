import { getDramaById, updateDrama, deleteDrama } from '../../../../lib/db-neon';

export async function GET(request, { params }) {
  try {
    const drama = await getDramaById(params.id);
    if (!drama) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(drama);
  } catch (error) {
    console.error('GET /api/dramas/[id] 错误:', error);
    return Response.json({ error: '读取数据失败: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const updates = await request.json();
    console.log('更新剧集，ID:', params.id, '更新内容:', updates);
    const drama = await updateDrama(params.id, updates);
    if (!drama) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(drama);
  } catch (error) {
    console.error('PUT /api/dramas/[id] 错误:', error);
    return Response.json({ error: '更新剧集失败: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log('删除剧集，ID:', params.id);
    await deleteDrama(params.id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/dramas/[id] 错误:', error);
    return Response.json({ error: '删除剧集失败: ' + error.message }, { status: 500 });
  }
}
