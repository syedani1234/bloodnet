import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    const docs = await db
      .collection('blood_requests')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    const requests = docs.map((r) => ({
      id: r._id.toString(),
      bloodType: r.bloodGroup,
      units: Number(r.unitsRequired ?? r.units ?? 1),
      hospital: r.hospitalName,
      urgency: r.urgency || r.urgencyLevel,
      status: r.status || 'open',
      createdAt: r.createdAt,
      city: r.city,
    }))

    return NextResponse.json(requests)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch requests'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
