import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { submitDonationForVerification, verifyDonationByHospital } from '@/lib/fulfillment-service'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Submit donation for verification
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
      bloodGroup,
      units,
      submissionProofUrl,
      city = 'Karachi',
      appointmentId,
      action,
    } = body

    if (action === 'verify') {
      if (auth.user.role !== 'hospital' && auth.user.role !== 'admin') {
        return NextResponse.json({ error: 'Only hospital staff or admin can verify donations' }, { status: 403 })
      }

      const donationId = body.donationId
      if (!donationId) {
        return NextResponse.json({ error: 'Donation ID is required for verification' }, { status: 400 })
      }

      const hospitalIdToUse = auth.user.role === 'hospital' ? auth.user._id.toString() : hospitalId
      if (auth.user.role === 'hospital' && hospitalId && hospitalId !== auth.user._id.toString()) {
        return NextResponse.json({ error: 'Hospital users can only verify donations for their own hospital' }, { status: 403 })
      }

      const { verifiedBy, verifiedByName, testResults } = body
      const donation = await verifyDonationByHospital(
        donationId,
        verifiedBy || auth.user.email,
        verifiedByName || auth.user.name,
        hospitalIdToUse,
        bloodGroup,
        testResults,
        city
      )
      return NextResponse.json({ success: true, donation }, { status: 200 })
    }

    if (!donorId || !hospitalId || !bloodGroup || !units) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (auth.user.role !== 'donor' || auth.user._id.toString() !== donorId) {
      return NextResponse.json({ error: 'Only the signed-in donor may submit their donation' }, { status: 403 })
    }

    const donation = await submitDonationForVerification(
      donorId,
      donorEmail,
      donorName,
      hospitalId,
      hospitalName,
      bloodGroup,
      units,
      submissionProofUrl,
      city,
      appointmentId
    )

    return NextResponse.json({ success: true, donation }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Submission failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// Get donations for verification (hospital endpoint)
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    let hospitalId = searchParams.get('hospitalId')
    const status = searchParams.get('status') || 'submitted'

    if (auth.user.role === 'hospital') {
      if (!hospitalId) hospitalId = auth.user._id.toString()
      else if (hospitalId !== auth.user._id.toString()) {
        return NextResponse.json({ error: 'Hospitals can only view their own donation verifications' }, { status: 403 })
      }
    }

    if (auth.user.role === 'donor') {
      return NextResponse.json({ error: 'Donors are not allowed to view the verification queue' }, { status: 403 })
    }

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    const filter: Record<string, any> = { verificationStatus: status }
    if (hospitalId) filter.hospitalId = hospitalId

    const donations = await db
      .collection('donations')
      .find(filter)
      .sort({ submittedAt: -1 })
      .toArray()

    const result = donations.map((d) => ({
      id: d._id.toString(),
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      bloodGroup: d.bloodGroup,
      units: d.units,
      submittedAt: d.submittedAt,
      status: d.verificationStatus,
      submissionProofUrl: d.submissionProofUrl,
    }))

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch donations'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Verify donation
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const {
      donationId,
      action,
      verifiedBy,
      verifiedByName,
      bloodType,
      testResults,
      rejectionReason,
      hospitalId,
      city = 'Karachi',
    } = body

    if (auth.user.role !== 'hospital' && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only hospital or admin users can update verification status' }, { status: 403 })
    }

    const hospitalIdToUse = auth.user.role === 'hospital' ? auth.user._id.toString() : hospitalId
    if (auth.user.role === 'hospital' && hospitalId && hospitalId !== auth.user._id.toString()) {
      return NextResponse.json({ error: 'Hospital users can only update verifications for their own hospital' }, { status: 403 })
    }

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    if (action === 'verify') {
      const donation = await verifyDonationByHospital(
        donationId,
        verifiedBy || auth.user.email,
        verifiedByName || auth.user.name,
        hospitalIdToUse,
        bloodType,
        testResults,
        city
      )
      return NextResponse.json({ success: true, donation })
    } else if (action === 'reject') {
      await db.collection('donations').updateOne(
        { _id: new ObjectId(donationId) },
        {
          $set: {
            verificationStatus: 'rejected',
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectionReason,
            updatedAt: new Date().toISOString(),
          },
        }
      )
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
