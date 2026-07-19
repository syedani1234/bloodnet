import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out' })
    return clearAuthCookie(response)
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
