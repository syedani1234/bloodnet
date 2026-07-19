import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { createAppointment, confirmAppointmentCompletion } from '@/lib/fulfillment-service'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    let donorId = searchParams.get('donorId')
    let hospitalId = searchParams.get('hospitalId')

    if (auth.user.role === 'donor') {
      if (!donorId) donorId = auth.user._id.toString()
      else if (donorId !== auth.user._id.toString()) {
        return NextResponse.json({ error: 'Donors can only view their own appointments' }, { status: 403 })
      }
    }

    if (auth.user.role === 'hospital') {
      if (!hospitalId) hospitalId = auth.user._id.toString()
      else if (hospitalId !== auth.user._id.toString()) {
        return NextResponse.json({ error: 'Hospitals can only view their own appointments' }, { status: 403 })
      }
    }

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    const filter: Record<string, any> = {}
    if (donorId) filter.donorId = donorId
    if (hospitalId) filter.hospitalId = hospitalId

    const docs = await db
      .collection('appointments')
      .find(filter)
      .sort({ appointmentDate: 1 })
      .toArray()

    const appointments = docs.map((a) => ({
      id: a._id.toString(),
      donorId: a.donorId,
      donorName: a.donorName,
      hospitalName: a.hospitalName,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      status: a.status,
      bloodGroup: a.bloodGroup,
      createdAt: a.createdAt,
    }))

    return NextResponse.json(appointments)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch appointments'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const {
      donorId,
      donorEmail,
      donorName,
      hospitalId,
      hospitalName,
      hospitalCity,
      appointmentDate,
      appointmentTime,
      bloodGroup,
      city = 'Karachi',
    } = body

    if (auth.user.role !== 'donor' || auth.user._id.toString() !== donorId) {
      return NextResponse.json({ error: 'Only the signed-in donor can book this appointment' }, { status: 403 })
    }

    if (!donorId || !donorEmail || !hospitalId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: 'Missing required appointment fields' }, { status: 400 })
    }

    const appointment = await createAppointment(
      donorId,
      donorEmail,
      donorName,
      hospitalId,
      hospitalName,
      hospitalCity || city,
      appointmentDate,
      appointmentTime,
      bloodGroup,
      city
    )

    return NextResponse.json({ success: true, appointment }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Appointment creation failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const { appointmentId, status, city = 'Karachi' } = body

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 })
    }

    if (status === 'completed' && auth.user.role !== 'hospital' && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only hospital or admin users can complete appointments' }, { status: 403 })
    }

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    if (status === 'completed') {
      await confirmAppointmentCompletion(appointmentId, city)
    } else {
      await db.collection('appointments').updateOne(
        { _id: new ObjectId(appointmentId) },
        { $set: { status, updatedAt: new Date().toISOString() } }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
