import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'

async function main() {
  const client = new MongoClient(uri)
  await client.connect()

  const admin = client.db().admin()
  const { databases } = await admin.listDatabases()

  for (const dbInfo of databases) {
    if (!['bloodnet', 'bloodnet_karachi'].includes(dbInfo.name)) continue

    const db = client.db(dbInfo.name)
    const collections = await db.listCollections().toArray()
    console.log(`\n=== Database: ${dbInfo.name} ===`)

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments()
      const sample = await db.collection(col.name).findOne()
      console.log(`  Collection: ${col.name} (${count} docs)`)
      if (sample) {
        console.log(`  Sample keys: ${Object.keys(sample).join(', ')}`)
        console.log(`  Sample: ${JSON.stringify(sample, null, 2).slice(0, 500)}`)
      }
    }
  }

  await client.close()
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
