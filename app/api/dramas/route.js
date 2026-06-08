import { getDramas, addDrama } from '../../../lib/db-neon'

export async function GET() {
  const dramas = await getDramas()
  return Response.json(dramas)
}

export async function POST(request) {
  const drama = await request.json()
  const newDrama = await addDrama(drama)
  return Response.json(newDrama)
}
