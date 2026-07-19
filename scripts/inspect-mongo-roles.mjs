import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'

async function main() {
  const client = new MongoClient(uri)
  await client.connect()

  for (const dbName of ['bloodnet', 'bloodnet_karachi']) {
    const db = client.db(dbName)
    const roles = await db.collection('users').aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]).toArray()
    console.log(`\n${dbName} roles:`, roles)

    const admin = await db.collection('users').findOne({ role: 'admin' })
    const hospital = await db.collection('users').findOne({ role: 'hospital' })
    const donor = await db.collection('users').findOne({ role: 'donor' })

    if (process.env.MONGODB_INSPECT_PASSWORD) {
      for (const [label, user] of [['admin', admin], ['hospital', hospital], ['donor', donor]]) {
        if (!user) continue
        const match = await bcrypt.compare(process.env.MONGODB_INSPECT_PASSWORD, user.passwordHash)
        console.log(`${dbName} ${label}: ${user.email} / password check: ${match}`)
      }
    }
  }

  await client.close()
}

main().catch(console.error)
