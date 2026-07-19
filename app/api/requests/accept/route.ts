import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { donorAcceptsRequest } from '@/lib/fulfillment-service'

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const { requestId, donorId, donorEmail, donorName, city = 'Karachi' } = body

    if (!requestId || !donorId || !donorEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (auth.user._id.toString() !== donorId || auth.user.email.toLowerCase() !== donorEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Can only accept requests for your own donor account' }, { status: 403 })
    }

    const request = await donorAcceptsRequest(requestId, donorId, donorEmail, donorName, city)

    return NextResponse.json({ success: true, request }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Acceptance failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
