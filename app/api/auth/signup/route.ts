import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { mapMongoUserToAppUser } from '@/lib/mappers'
import type { AppRole } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role, city, bloodGroup } = await req.json()

    if (!name || !email || !password || !phone || !role || !city) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }

    if (role === 'admin') {
      return NextResponse.json({ error: 'Admin signup is not allowed' }, { status: 400 })
    }

    if (!['donor', 'receiver', 'hospital'].includes(role)) {
      return NextResponse.json({ error: 'Only donor, receiver, and hospital roles are allowed' }, { status: 400 })
    }

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)
    const users = db.collection('users')

    const existing = await users.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()

    const newUser = {
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: role as AppRole,
      city,
      bloodGroup: role === 'donor' || role === 'receiver' ? bloodGroup : undefined,
      isVerified: role === 'hospital' ? false : false,
      availability: role === 'donor' ? true : undefined,  // FIX: Set availability for donors
      totalDonations: 0,
      livesImpacted: 0,
      achievements: [],
      lastDonationDate: undefined,
      createdAt: now,
    }

    const insertResult = await users.insertOne(newUser)
    const createdUser = { _id: insertResult.insertedId, ...newUser }
    const appUser = mapMongoUserToAppUser(createdUser as any)

    return NextResponse.json({ success: true, message: 'Signup successful', user: appUser }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Signup failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
