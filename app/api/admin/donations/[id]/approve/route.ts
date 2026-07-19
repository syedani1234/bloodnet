import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { approveDonation } from '@/lib/donation-workflow'

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const auth = await requireAuth(req, { admin: true })
    if (auth.response) return auth.response

    const city = req.nextUrl.searchParams.get('city') || 'Karachi'
    const result = await approveDonation(params.id, city)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Approval failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
