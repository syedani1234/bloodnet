import { getDb } from '@/lib/mongodb'
import { DB_KARACHI, DB_PAKISTAN } from '@/lib/db-config'

export async function GET() {
  try {
    const pakistanDb = await getDb(DB_PAKISTAN)
    const karachiDb = await getDb(DB_KARACHI)

    const [pakistanUsers, karachiUsers, karachiDonors] = await Promise.all([
      pakistanDb.collection('users').countDocuments(),
      karachiDb.collection('users').countDocuments(),
      karachiDb.collection('donors').countDocuments(),
    ])

    return Response.json({
      status: 'ok',
      message: 'BloodNet API connected to MongoDB',
      databases: {
        bloodnet: { users: pakistanUsers },
        bloodnet_karachi: { users: karachiUsers, donors: karachiDonors },
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'MongoDB connection failed'
    return Response.json({ status: 'error', message }, { status: 500 })
  }
}
