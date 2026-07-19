import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { confirmDonationByReceiver } from '@/lib/donation-workflow'

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    if (auth.user.role !== 'receiver') {
      return NextResponse.json({ error: 'Only receivers can confirm donations' }, { status: 403 })
    }

    const body = await req.json()
    const receiverId = body.receiverId || auth.user._id.toString()
    const receiverName = body.receiverName || auth.user.name
    const rating = body.rating
    const review = body.review
    const city = body.city || 'Karachi'

    if (receiverId !== auth.user._id.toString()) {
      return NextResponse.json({ error: 'Receivers may only confirm donations for their own account' }, { status: 403 })
    }

    const result = await confirmDonationByReceiver(
      params.id,
      receiverId,
      receiverName,
      city,
      typeof rating === 'number' ? rating : undefined,
      typeof review === 'string' ? review : undefined
    )
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Confirmation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
