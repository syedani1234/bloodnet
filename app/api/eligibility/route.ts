import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { checkDonorEligibility } from '@/lib/fulfillment-service'

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const { donorId, city = 'Karachi' } = body

    if (!donorId) {
      return NextResponse.json({ error: 'Donor ID required' }, { status: 400 })
    }

    if (auth.user.role !== 'donor' || auth.user._id.toString() !== donorId) {
      return NextResponse.json({ error: 'Can only check eligibility for your own donor account' }, { status: 403 })
    }

    const eligibility = await checkDonorEligibility(donorId, city)
    return NextResponse.json(eligibility)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Eligibility check failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
