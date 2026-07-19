import './load-env.mjs'
import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const dbName = process.env.MONGODB_DB || 'bloodnet'
const adminEmail = process.env.MONGODB_ADMIN_EMAIL || 'admin@bloodnet.dev'
const adminPassword = process.env.MONGODB_ADMIN_PASSWORD || 'Admin@123456'

async function main() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const users = db.collection('users')

    const existing = await users.findOne({ name: '4', role: 'admin' })
    if (existing) {
      console.log('Admin user "4" already exists in database')
      return
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await users.insertOne({
      name: '4',
      email: adminEmail.toLowerCase(),
      passwordHash,
      phone: '+920000000000',
      role: 'admin',
      city: 'Karachi',
      isVerified: true,
      createdAt: new Date().toISOString(),
      totalDonations: 0,
      livesImpacted: 0,
      achievements: [],
    })

    console.log('✓ Admin user "4" seeded successfully')
    console.log(`  Email: ${adminEmail.toLowerCase()}`)
    console.log(`  Password: ${adminPassword}`)
    console.log('  Note: Please change the password after first login!')

  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('✗ Connection failed. Check MongoDB:')
  console.error(`  URI: ${uri}`)
  console.error(`  DB: ${dbName}`)
  if (error.message && error.message.includes('ECONNREFUSED')) {
    console.error('\n  MongoDB is not running!')
    console.error('  Option 1: Start MongoDB locally with: mongod')
    console.error('  Option 2: Use MongoDB Atlas and update MONGODB_URI in .env.local')
  }
  console.error('\nFull error:', error.message)
  process.exit(1)
})
