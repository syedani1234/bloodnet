/**
 * seed-demo-users.mjs
 *
 * Seeds real demo accounts into the BloodNet MongoDB database so you can
 * see them in MongoDB Compass and log in to every dashboard.
 *
 * Creates:
 *  - 2 donors
 *  - 2 receivers
 *  - 2 hospital-role login accounts
 *  - 2 admins
 *
 * All in the `users` collection of the `bloodnet` database (Karachi city,
 * which is what the app's login/signup code checks first).
 *
 * USAGE:
 *   1. Copy this file into your project's /scripts folder
 *      (next to seed-admin.mjs and seed-hospitals.mjs)
 *   2. Make sure MongoDB is running and MONGODB_URI is set (or defaults
 *      to mongodb://localhost:27017)
 *   3. Run:  node scripts/seed-demo-users.mjs
 */

import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb+srv://notmustafakhan:lIKeCIDaN544VT6X@cluster0.qjcj4.mongodb.net'
const dbName = 'bloodnet' // matches DB_KARACHI check in the app (city: 'Karachi')
const defaultPassword = 'password123'

const demoUsers = [
  // --- Donors ---
  {
    name: 'Ahmed Raza',
    email: 'donor1@test.com',
    phone: '+92-300-1234567',
    role: 'donor',
    city: 'Karachi',
    bloodGroup: 'O+',
  },
  {
    name: 'Bilal Khan',
    email: 'donor2@test.com',
    phone: '+92-301-2345678',
    role: 'donor',
    city: 'Karachi',
    bloodGroup: 'A+',
  },
  // --- Receivers ---
  {
    name: 'Sana Malik',
    email: 'receiver1@test.com',
    phone: '+92-302-3456789',
    role: 'receiver',
    city: 'Karachi',
    bloodGroup: 'B+',
  },
  {
    name: 'Hassan Iqbal',
    email: 'receiver2@test.com',
    phone: '+92-303-4567890',
    role: 'receiver',
    city: 'Karachi',
    bloodGroup: 'AB+',
  },
  // --- Hospital login accounts ---
  {
    name: 'Aga Khan University Hospital',
    email: 'hospital1@test.com',
    phone: '+92-21-3486-0000',
    role: 'hospital',
    city: 'Karachi',
  },
  {
    name: 'Indus Hospital',
    email: 'hospital2@test.com',
    phone: '+92-21-3664-1100',
    role: 'hospital',
    city: 'Karachi',
  },
  // --- Admins ---
  {
    name: 'Admin One',
    email: 'admin1@test.com',
    phone: '+92-300-0000001',
    role: 'admin',
    city: 'Karachi',
  },
  {
    name: 'Admin Two',
    email: 'admin2@test.com',
    phone: '+92-300-0000002',
    role: 'admin',
    city: 'Karachi',
  },
]

async function main() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const users = db.collection('users')

    const passwordHash = await bcrypt.hash(defaultPassword, 10)
    const now = new Date().toISOString()

    for (const u of demoUsers) {
      const existing = await users.findOne({ email: u.email.toLowerCase() })
      if (existing) {
        console.log(`Skipped (already exists): ${u.email}`)
        continue
      }

      await users.insertOne({
        ...u,
        email: u.email.toLowerCase(),
        passwordHash,
        availability: u.role === 'donor' ? true : undefined,  // FIX: Set availability for donors
        isVerified: true,
        totalDonations: 0,
        livesImpacted: 0,
        achievements: [],
        createdAt: now,
      })
      console.log(`Created: ${u.email} (${u.role})`)
    }

    console.log('\nDone. All demo accounts use the password: password123')
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
