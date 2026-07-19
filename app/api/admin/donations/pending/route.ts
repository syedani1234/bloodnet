import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getPendingDonations } from '@/lib/donation-workflow'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, { admin: true })
    if (auth.response) return auth.response

    const city = req.nextUrl.searchParams.get('city') || 'Karachi'
    const donations = await getPendingDonations(city)
    return NextResponse.json({ success: true, donations })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch pending donations'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
