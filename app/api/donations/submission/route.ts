import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'
import { extractReceiptData, verifyReceiptAgainstDonation } from '@/lib/donation-service'
import { generateCertificateFile } from '@/lib/donation-workflow'
import { verifyDonationByHospital } from '@/lib/fulfillment-service'

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const {
      donorId,
      donorName,
      donorEmail,
      bloodGroup,
      hospitalId,
      hospitalName,
      city = 'Karachi',
      action,
    } = body

    if (!action || !['submit', 'verify', 'upload_receipt'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "submit", "verify" or "upload_receipt"' },
        { status: 400 }
      )
    }

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)
    const donations = db.collection('donations')

    if (action === 'submit') {
      if (auth.user.role !== 'donor' || auth.user._id.toString() !== donorId) {
        return NextResponse.json(
          { error: 'Only the authenticated donor may submit this donation' },
          { status: 403 }
        )
      }

      // Donor submits that they donated blood
      if (!donorId || !bloodGroup || !hospitalName) {
        return NextResponse.json(
          { error: 'Donor ID, blood group, and hospital name are required' },
          { status: 400 }
        )
      }

      const donation = {
        donorId,
        donorName,
        donorEmail,
        bloodGroup,
        hospitalId: hospitalId || null,
        hospitalName,
        city,
        donationDate: body.donationDate || null,
        status: 'submitted',
        verificationStatus: 'pending',
        submittedAt: new Date().toISOString(),
        verifiedAt: null,
        certificateGenerated: false,
        createdAt: new Date().toISOString(),
      }

      const result = await donations.insertOne(donation)

      // Send notification to hospital
      await db.collection('notifications').insertOne({
        type: 'donation_submitted',
        title: `Blood Donation Submitted - ${bloodGroup}`,
        message: `${donorName} has submitted ${bloodGroup} blood donation. Please verify.`,
        donationId: result.insertedId.toString(),
        donorId,
        donorName,
        donorEmail: donorEmail?.toLowerCase(),
        bloodGroup,
        hospitalName,
        recipientEmail: donorEmail?.toLowerCase() || hospitalName.toLowerCase(),
        timestamp: new Date().toISOString(),
        read: false,
        createdAt: new Date().toISOString(),
      })

      return NextResponse.json(
        {
          success: true,
          donationId: result.insertedId.toString(),
          message: 'Donation submitted. Awaiting hospital verification.',
        },
        { status: 201 }
      )
    } else if (action === 'verify') {
      if (auth.user.role !== 'hospital' && auth.user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only hospital staff or admin can verify donations' },
          { status: 403 }
        )
      }

      const { donationId, verified, verifiedBy, verifiedByName, rejectionReason, bloodGroup: bodyBloodGroup, testResults } = body

      if (!donationId) {
        return NextResponse.json(
          { error: 'Donation ID is required' },
          { status: 400 }
        )
      }

      const donation = await donations.findOne({ _id: new ObjectId(donationId) })
      if (!donation) {
        return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
      }

      if (auth.user.role === 'hospital' && donation.hospitalId && donation.hospitalId !== auth.user._id.toString()) {
        return NextResponse.json(
          { error: 'Hospitals can only verify donations for their own hospital' },
          { status: 403 }
        )
      }

      if (!verified) {
        const now = new Date().toISOString()
        const updateResult = await donations.updateOne(
          { _id: new ObjectId(donationId) },
          {
            $set: {
              status: 'rejected',
              verificationStatus: 'rejected',
              verifiedAt: null,
              rejectionReason: rejectionReason || 'Verification rejected by hospital',
              verifiedBy: verifiedBy || auth.user.email,
              verifiedByName: verifiedByName || auth.user.name,
              updatedAt: now,
            },
          }
        )

        if (updateResult.matchedCount === 0) {
          return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
        }

        await db.collection('notifications').insertOne({
          type: 'donation_rejected',
          title: 'Donation Status Update',
          message: `Your donation submission has been reviewed and could not be verified at this time.`,
          donationId,
          donorId: donation.donorId,
          recipientEmail: donation.donorEmail,
          timestamp: new Date().toISOString(),
          read: false,
          createdAt: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, message: 'Donation rejected', status: 'rejected' })
      }

      const { verifyDonationByHospital } = await import('@/lib/fulfillment-service')
      const hospitalId = auth.user.role === 'hospital' ? auth.user._id.toString() : donation.hospitalId || auth.user._id.toString()
      const result = await verifyDonationByHospital(
        donationId,
        verifiedBy || auth.user.email,
        verifiedByName || auth.user.name,
        hospitalId,
        bodyBloodGroup || donation.bloodGroup,
        testResults,
        city
      )

      return NextResponse.json({ success: true, donation: result, status: 'verified' })
    } else if (action === 'upload_receipt') {
      const { donationId, receiptText, receiptUrl } = body

      if (!donationId || !receiptText) {
        return NextResponse.json({ error: 'Donation ID and receipt text are required', status: 400 })
      }

      const donation = await donations.findOne({ _id: new ObjectId(donationId) })
      if (!donation) {
        return NextResponse.json({ error: 'Donation not found', status: 404 })
      }

      if (auth.user.role !== 'donor') {
        return NextResponse.json(
          { error: 'Only the donor who submitted this donation may upload the receipt' },
          { status: 403 }
        )
      }

      if (donation.donorId !== auth.user._id.toString()) {
        return NextResponse.json(
          { error: 'Only the donor who submitted the donation may upload the receipt' },
          { status: 403 }
        )
      }

      const extractedData = extractReceiptData(receiptText)
      const isVerified = verifyReceiptAgainstDonation(extractedData, donation as any)
      const now = new Date().toISOString()
      const updatedFields: Record<string, unknown> = {
        receiptUrl: receiptUrl || `/receipts/receipt-${donationId}.pdf`,
        receiptVerificationStatus: isVerified ? 'verified' : 'rejected',
        status: isVerified ? 'receipt_verified' : 'receipt_uploaded',
        updatedAt: now,
      }

      if (isVerified) {
        const certificateUrl = await generateCertificateFile({
          donorName: donation.donorName,
          donationId,
          date: now,
        })
        updatedFields.certificateGenerated = true
        updatedFields.certificateId = certificateUrl.split('/').pop()?.replace('.pdf', '') || `CERT-${donationId}`
        updatedFields.certificateUrl = certificateUrl
        updatedFields.verifiedAt = now
        updatedFields.donationDate = donation.donationDate || now
      }

      await donations.updateOne(
        { _id: new ObjectId(donationId) },
        { $set: updatedFields }
      )

      const updatedDonation = await donations.findOne({ _id: new ObjectId(donationId) })
      return NextResponse.json(
        {
          success: isVerified,
          message: isVerified
            ? 'Receipt verified successfully and certificate generated.'
            : 'Receipt uploaded and recorded, but verification failed. Please check receipt details.',
          donation: updatedDonation ? { ...updatedDonation, id: updatedDonation._id.toString() } : null,
        },
        { status: 200 }
      )
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Donation processing failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    const donorId = searchParams.get('donorId')
    const hospitalId = searchParams.get('hospitalId')
    const hospitalName = searchParams.get('hospitalName')
    const status = searchParams.get('status')

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    const filter: Record<string, unknown> = { city }
    if (auth.user.role === 'donor') {
      filter.donorId = auth.user._id.toString()
    } else if (donorId) {
      filter.donorId = donorId
    }

    if (auth.user.role === 'hospital') {
      filter.hospitalId = auth.user._id.toString()
    } else if (hospitalId) {
      filter.hospitalId = hospitalId
    }

    if (hospitalName) filter.hospitalName = hospitalName
    if (status) filter.status = status

    const donations = await db
      .collection('donations')
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({
      donations: donations.map((d) => ({
        ...d,
        id: d._id.toString(),
      })),
      total: donations.length,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch donations'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
