import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb+srv://notmustafakhan:lIKeCIDaN544VT6X@cluster0.qjcj4.mongodb.net'
const dbName = process.env.MONGODB_DB || 'bloodnet'
const email = 'agakhan.hospital@test.com'
const password = 'AghaKhan@123'

async function main() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const users = db.collection('users')
    const hospitals = db.collection('hospitals')

    const passwordHash = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()

    const userResult = await users.updateOne(
      { email },
      {
        $set: {
          name: 'Agha Khan Hospital',
          email,
          phone: '+92-21-3486-1000',
          role: 'hospital',
          city: 'Karachi',
          passwordHash,
          isVerified: true,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    )

    const hospitalResult = await hospitals.updateOne(
      { name: 'Agha Khan Hospital' },
      {
        $set: {
          name: 'Agha Khan Hospital',
          address: 'Stadium Road, Karachi',
          phone: '+92-21-3486-1000',
          email,
          bloodBankAvailability: 'All types available',
          city: 'Karachi',
          lat: 24.8504,
          lng: 67.0117,
          capacity: 500,
          operatingHours: '24/7',
          services: ['Emergency', 'Blood Bank', 'ICU', 'Surgery'],
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    )

    console.log(`✓ Hospital account ready: ${email}`)
    console.log(`✓ Password: ${password}`)
    console.log(`✓ User upserted: ${userResult.upsertedCount || userResult.modifiedCount || 0}`)
    console.log(`✓ Hospital upserted: ${hospitalResult.upsertedCount || hospitalResult.modifiedCount || 0}`)
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('✗ Failed to seed Agha Khan Hospital account')
  console.error(error)
  process.exit(1)
})
