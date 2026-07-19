import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient
  _mongoClientPromise?: Promise<MongoClient>
}

function getClientPromise(): Promise<MongoClient> {
  if (globalForMongo._mongoClientPromise) {
    return globalForMongo._mongoClientPromise
  }

  const client = new MongoClient(uri)
  globalForMongo._mongoClientPromise = client.connect().catch((error) => {
    console.warn('Mongo connection unavailable, continuing without database:', error instanceof Error ? error.message : error)
    return client
  })
  return globalForMongo._mongoClientPromise
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClientPromise()
}

export async function getDb(dbName: string): Promise<Db> {
  const client = await getMongoClient()
  return client.db(dbName)
}
