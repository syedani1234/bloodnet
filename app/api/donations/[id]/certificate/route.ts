import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { requireAuth } from '@/lib/auth'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { streamCertificateResponse } from '@/lib/donation-workflow'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const auth = await requireAuth(req)
  if (auth.response) return auth.response

  const city = req.nextUrl.searchParams.get('city') || 'Karachi'
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)

  const donation = await db.collection('donations').findOne({ _id: new ObjectId(params.id) })
  if (!donation) {
    return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
  }

  const userId = auth.user._id.toString()
  if (auth.user.role !== 'donor') {
    return NextResponse.json({ error: 'Only donors can download donation certificates' }, { status: 403 })
  }
  if (auth.user.role === 'donor' && donation.donorId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  return streamCertificateResponse(params.id, city)
}
