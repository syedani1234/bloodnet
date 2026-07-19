import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    const query = { recipientEmail: auth.user.email.toLowerCase() }
    
    const docs = await db
      .collection('notifications')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    const notifications = docs.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      timestamp: n.timestamp ?? 'Just now',
      read: n.read ?? false,
      actionUrl: n.actionUrl,
    }))

    return NextResponse.json({
      notifications,
      count: notifications.length,
      unreadCount: notifications.filter((n) => !n.read).length,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const { action, notificationId, notification, city = 'Karachi' } = body
    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)
    const collection = db.collection('notifications')

    const userQuery = { recipientEmail: auth.user.email.toLowerCase() }

    if (action === 'mark-as-read' && notificationId) {
      await collection.updateOne(
        { _id: new ObjectId(notificationId), ...userQuery },
        { $set: { read: true } }
      )
      const notifications = await collection.find(userQuery).sort({ createdAt: -1 }).limit(50).toArray()
      return NextResponse.json({
        success: true,
        notifications: notifications.map((n) => ({ ...n, id: n._id.toString() })),
      })
    }

    if (action === 'mark-all-as-read') {
      await collection.updateMany({ ...userQuery, read: { $ne: true } }, { $set: { read: true } })
      const notifications = await collection.find(userQuery).sort({ createdAt: -1 }).limit(50).toArray()
      return NextResponse.json({
        success: true,
        notifications: notifications.map((n) => ({ ...n, id: n._id.toString() })),
      })
    }

    if (action === 'delete' && notificationId) {
      await collection.deleteOne({ _id: new ObjectId(notificationId), ...userQuery })
      const notifications = await collection.find(userQuery).sort({ createdAt: -1 }).limit(50).toArray()
      return NextResponse.json({
        success: true,
        notifications: notifications.map((n) => ({ ...n, id: n._id.toString() })),
      })
    }

    if (action === 'add-notification' && notification) {
      // Ensure notification has recipient information for privacy
      if (!notification.recipientEmail && !notification.recipientId) {
        return NextResponse.json({ error: 'Notification must specify recipient' }, { status: 400 })
      }
      await collection.insertOne({ ...notification, createdAt: new Date().toISOString() })
      return NextResponse.json({ success: true, notification })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Notification update failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
