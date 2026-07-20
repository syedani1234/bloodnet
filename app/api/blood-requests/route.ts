import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { createBloodRequest, donorAcceptsRequest } from '@/lib/fulfillment-service'

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const {
      bloodGroup,
      units,
      urgency,
      city = 'Karachi',
      hospitalName,
      reason,
      selectedDonorId,
      selectedDonorEmail,
      selectedDonorName,
      // Old field mapping for backward compatibility
      patientName,
      urgencyLevel,
      unitsRequired,
    } = body

    const requesterId = auth.user._id.toString()
    const requesterEmail = auth.user.email
    const requesterName = auth.user.name
    const requesterType = auth.user.role === 'hospital' ? 'hospital' : 'receiver'

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    // Map old fields to new format
    const finalBloodGroup = bloodGroup || body.bloodGroup
    const finalUnits = units || unitsRequired
    const finalUrgency = urgency || (urgencyLevel === 'emergency' ? 'emergency' : 'normal')
    const finalName = requesterName || patientName

    if (!requesterId || !finalBloodGroup || !finalUnits || !finalUrgency) {
      return NextResponse.json({ error: 'Missing required request fields' }, { status: 400 })
    }

    const request = await createBloodRequest(
      requesterId,
      requesterEmail,
      finalName,
      requesterType,
      finalBloodGroup,
      finalUnits,
      finalUrgency,
      city,
      hospitalName,
      reason
    )

    if (selectedDonorId && selectedDonorEmail && selectedDonorName) {
      await donorAcceptsRequest(
        request.id || request._id?.toString() || '',
        selectedDonorId,
        selectedDonorEmail,
        selectedDonorName,
        city
      )
    }

    return NextResponse.json(
      {
        success: true,
        request,
        message: 'Blood request created and notifications sent',
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Request creation failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    const status = searchParams.get('status')
    const requesterId = searchParams.get('requesterId')

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    const filter: Record<string, any> = { city }
    if (status) filter.status = status
    if (requesterId) filter.requesterId = requesterId

    const bloodRequests = await db
      .collection('blood_requests')
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({
      bloodRequests: bloodRequests.map((r) => ({
        ...r,
        id: r._id.toString(),
      })),
      totalRequests: bloodRequests.length,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch requests'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
