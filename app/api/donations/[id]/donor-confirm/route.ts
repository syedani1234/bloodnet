import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { confirmDonationByDonor } from '@/lib/donation-workflow'

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    if (auth.user.role !== 'donor') {
      return NextResponse.json({ error: 'Only donors can mark a donation as donated' }, { status: 403 })
    }

    const body = await req.json()
    const donorId = body.donorId || auth.user._id.toString()
    const donorName = body.donorName || auth.user.name
    const city = body.city || 'Karachi'

    if (donorId !== auth.user._id.toString()) {
      return NextResponse.json({ error: 'Donors may only confirm their own donations' }, { status: 403 })
    }

    const result = await confirmDonationByDonor(params.id, donorId, donorName, city)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Donation confirmation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
