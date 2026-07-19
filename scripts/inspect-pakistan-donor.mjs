import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'

async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  const user = await client.db('bloodnet').collection('users').findOne({ role: 'donor', city: 'Lahore' })
  console.log('Pakistan donor sample:', JSON.stringify(user, null, 2))
  await client.close()
}

main().catch(console.error)
