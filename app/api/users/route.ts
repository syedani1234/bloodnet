import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { DB_KARACHI, DB_PAKISTAN } from '@/lib/db-config'
import { getEligibilityStatus, mapMongoUserToAppUser } from '@/lib/mappers'
import { getDb } from '@/lib/mongodb'
import type { MongoUser } from '@/lib/types'

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth.response) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const dbNames = city?.toLowerCase() === 'karachi' ? [DB_KARACHI] : city ? [DB_PAKISTAN] : [DB_KARACHI, DB_PAKISTAN]

    const allUsers: MongoUser[] = []

    for (const dbName of dbNames) {
      const db = await getDb(dbName)
      const filter: Record<string, unknown> = {}
      if (city) filter.city = city
      if (role) filter.role = role
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]
      }

      const users = await db.collection<MongoUser>('users').find(filter).sort({ createdAt: -1 }).limit(200).toArray()
      const normalizedUsers = users.map((user) => ({
        ...user,
        totalDonations: user.totalDonations ?? 0,
        livesImpacted: user.livesImpacted ?? 0,
        achievements: user.achievements ?? [],
        eligibilityStatus: user.eligibilityStatus ?? getEligibilityStatus(user.lastDonationDate),
      }))
      allUsers.push(...normalizedUsers)
    }

    const users = allUsers
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .map((user) => ({
        ...mapMongoUserToAppUser(user),
        createdAt: user.createdAt,
        totalDonations: user.totalDonations ?? 0,
        livesImpacted: user.livesImpacted ?? 0,
      }))

    return NextResponse.json({
      users,
      total: users.length,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
