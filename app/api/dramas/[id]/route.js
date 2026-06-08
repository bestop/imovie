import { getDramaById, updateDrama, deleteDrama } from '../../../../lib/db-neon'

export async function GET(request, { params }) {
  const { id } = await params
  const drama = await getDramaById(id)
  if (!drama) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  return Response.json(drama, {
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const updates = await request.json()
  const drama = await updateDrama(id, updates)
  if (!drama) {
    return Response.json({ error: 'Not found', id }, { status: 404 })
  }
  return Response.json(drama)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await deleteDrama(id)
  return Response.json({ success: true })
}
