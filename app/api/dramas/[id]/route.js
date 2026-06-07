import { getDramaById, updateDrama, deleteDrama } from '../../../../lib/db'

export async function GET(request, { params }) {
  const drama = await getDramaById(params.id)
  if (!drama) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  return Response.json(drama)
}

export async function PUT(request, { params }) {
  const updates = await request.json()
  const drama = await updateDrama(params.id, updates)
  if (!drama) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  return Response.json(drama)
}

export async function DELETE(request, { params }) {
  await deleteDrama(params.id)
  return Response.json({ success: true })
}
