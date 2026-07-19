import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { DB_KARACHI, DB_PAKISTAN } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import type { AppRole, MongoUser } from '@/lib/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jwtLib = jwt as any

const JWT_SECRET = process.env.JWT_SECRET || 'bloodnet-dev-secret'

interface SessionPayload {
  sub: string
  role: AppRole
  email: string
  iat?: number
  exp?: number
}

export function signSessionToken(payload: SessionPayload) {
  return jwtLib.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwtLib.verify(token, JWT_SECRET) as SessionPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return req.cookies.get('bloodnet_session')?.value || null
}

export async function getAuthenticatedUser(req: NextRequest): Promise<MongoUser | null> {
  const token = getTokenFromRequest(req)
  if (!token) return null

  const payload = verifySessionToken(token)
  if (!payload?.sub) return null

  for (const dbName of [DB_KARACHI, DB_PAKISTAN]) {
    const db = await getDb(dbName)
    const user = await db.collection<MongoUser>('users').findOne({ _id: new ObjectId(payload.sub) })
    if (user) {
      return user
    }
  }

  return null
}

type AuthResultSuccess = { authenticated: true; user: MongoUser; response: null }
type AuthResultFailure = { authenticated: false; user: null; response: NextResponse }

type AuthResult = AuthResultSuccess | AuthResultFailure

export async function requireAuth(req: NextRequest, options?: { admin?: boolean }): Promise<AuthResult> {
  const user = await getAuthenticatedUser(req)
  if (!user) {
    return {
      authenticated: false,
      user: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  if (options?.admin && user.role !== 'admin') {
    return {
      authenticated: false,
      user: null,
      response: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
    }
  }

  return { authenticated: true, user, response: null }
}

export function setAuthCookie(response: NextResponse, user: MongoUser) {
  const token = signSessionToken({ sub: user._id.toString(), role: user.role, email: user.email })
  response.cookies.set('bloodnet_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set('bloodnet_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
