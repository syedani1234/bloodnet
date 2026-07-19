import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { updateHospitalInventory } from '@/lib/fulfillment-service'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    const hospitalId = searchParams.get('hospitalId')

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    const filter: Record<string, any> = {}
    if (hospitalId) filter.hospitalId = hospitalId

    const inventory = await db
      .collection('hospital_inventory')
      .find(filter)
      .toArray()

    const result = inventory.map((inv) => ({
      id: inv._id.toString(),
      hospitalName: inv.hospitalName,
      bloodTypes: inv.bloodTypes,
      lastUpdated: inv.lastUpdated,
    }))

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch inventory'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const { hospitalId, hospitalName, bloodType, units, city = 'Karachi' } = body

    if (auth.user.role !== 'hospital' && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only hospital or admin users can update inventory' }, { status: 403 })
    }

    if (!hospitalId || !bloodType || !units) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await updateHospitalInventory(hospitalId, hospitalName, bloodType, units, city)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Inventory update failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
