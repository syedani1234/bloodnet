import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { ObjectId } from 'mongodb'
import PDFDocument from 'pdfkit'
import { getDbNameForCity } from './db-config'
import { getDb } from './mongodb'
import type { MongoUser } from './types'

export type DonationStatus =
  | 'pending'
  | 'submitted'
  | 'verified'
  | 'receipt_uploaded'
  | 'receipt_verified'
  | 'receiver_confirmed'
  | 'completed'
  | 'rejected'

export interface DonationDocument {
  _id: ObjectId
  donorId: string
  donorName: string
  donorEmail?: string
  recipientId?: string
  recipientName?: string
  bloodGroup: string
  units: number
  status: DonationStatus
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  communicationDate?: string
  donationDate?: string
  hospitalId?: string
  hospitalName?: string
  receiptUrl?: string
  receiptVerificationStatus?: 'pending' | 'verified' | 'rejected'
  submissionProofUrl?: string
  verifiedAt?: string
  verifiedBy?: string
  verifiedByName?: string
  rejectionReason?: string
  certificateGenerated?: boolean
  certificateUrl?: string
  certificateId?: string
  certificatePath?: string
  recipientConfirmed?: boolean
  recipientConfirmedDate?: string
  recipientRating?: number
  recipientReview?: string
  createdAt: string
  updatedAt: string
}

const CERTIFICATE_DIR = path.join(process.cwd(), 'public', 'certificates')

function ensureCertificatesDir() {
  fs.mkdirSync(CERTIFICATE_DIR, { recursive: true })
}

export async function createDonationRecord(input: Partial<DonationDocument> & { donorId: string; donorName: string; bloodGroup: string; units: number; city?: string }) {
  const city = input.city || 'Karachi'
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)
  const now = new Date().toISOString()

  const donation = {
    donorId: input.donorId,
    donorName: input.donorName,
    recipientId: input.recipientId,
    recipientName: input.recipientName,
    bloodGroup: input.bloodGroup,
    units: input.units,
    status: 'pending' as DonationStatus,
    communicationDate: input.communicationDate || now,
    donationDate: input.donationDate,
    hospitalName: input.hospitalName,
    certificateGenerated: false,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection('donations').insertOne(donation)
  return { ...donation, id: result.insertedId.toString() }
}

export async function confirmDonationByDonor(
  donationId: string,
  donorId: string,
  donorName: string,
  city: string
) {
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)
  const donation = await db.collection<DonationDocument>('donations').findOne({ _id: new ObjectId(donationId) })

  if (!donation) {
    return { success: false, message: 'Donation not found' }
  }

  if (donation.donorId && donation.donorId !== donorId) {
    return { success: false, message: 'Only the donor can confirm this donation' }
  }

  if (donation.status === 'completed' || donation.status === 'rejected') {
    return { success: false, message: `Donation already ${donation.status}` }
  }

  const updatedAt = new Date().toISOString()
  await db.collection('donations').updateOne(
    { _id: donation._id },
    {
      $set: {
        status: 'submitted',
        donorId,
        donorName,
        updatedAt,
      },
    }
  )

  const updatedDonation = await db.collection<DonationDocument>('donations').findOne({ _id: donation._id })

  return {
    success: true,
    message: 'Donation marked as donated by donor',
    donation: updatedDonation ? { ...updatedDonation, id: updatedDonation._id.toString() } : null,
  }
}

export async function confirmDonationByReceiver(
  donationId: string,
  receiverId: string,
  receiverName: string,
  city: string,
  rating?: number,
  review?: string
) {
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)
  const donation = await db.collection<DonationDocument>('donations').findOne({ _id: new ObjectId(donationId) })

  if (!donation) {
    return { success: false, message: 'Donation not found' }
  }

  if (donation.recipientId && donation.recipientId !== receiverId) {
    return { success: false, message: 'Only the matched receiver can confirm this donation' }
  }

  if (donation.status === 'completed' || donation.status === 'rejected') {
    return { success: false, message: `Donation already ${donation.status}` }
  }

  const updatedAt = new Date().toISOString()
  await db.collection('donations').updateOne(
    { _id: donation._id },
    {
      $set: {
        status: 'receiver_confirmed',
        recipientId: receiverId,
        recipientName: receiverName,
        recipientConfirmed: true,
        recipientConfirmedDate: updatedAt,
        recipientRating: rating ?? donation.recipientRating,
        recipientReview: review ?? donation.recipientReview,
        updatedAt,
      },
    }
  )

  const updatedDonation = await db
    .collection<DonationDocument>('donations')
    .findOne({ _id: donation._id })

  return {
    success: true,
    message: 'Donation confirmed by receiver',
    donation: updatedDonation
      ? { ...updatedDonation, id: updatedDonation._id.toString() }
      : null,
  }
}

export async function getPendingDonations(city: string) {
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)
  const docs = await db.collection<DonationDocument>('donations').find({ status: { $in: ['submitted', 'receiver_confirmed'] } }).sort({ updatedAt: -1 }).toArray()
  return docs.map((d) => ({ ...d, id: d._id.toString() }))
}

export async function approveDonation(donationId: string, city: string) {
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)
  const donation = await db.collection<DonationDocument>('donations').findOne({ _id: new ObjectId(donationId) })

  if (!donation) {
    return { success: false, message: 'Donation not found' }
  }

  if (donation.status === 'completed') {
    return { success: false, message: 'Donation already approved' }
  }

  const donorUser = await db.collection<MongoUser>('users').findOne({ _id: new ObjectId(donation.donorId) })
  if (!donorUser) {
    return { success: false, message: 'Donor not found' }
  }

  const approvalDate = new Date().toISOString()
  const certificateUrl = await generateCertificateFile({
    donorName: donation.donorName,
    donationId: donation._id.toString(),
    date: approvalDate,
  })

  await db.collection('donations').updateOne(
    { _id: donation._id },
    {
      $set: {
        status: 'completed',
        donationDate: approvalDate,
        certificateGenerated: true,
        certificateUrl,
        updatedAt: approvalDate,
      },
    }
  )

  await db.collection('users').updateOne(
    { _id: donorUser._id },
    {
      $set: {
        lastDonationDate: approvalDate,
      },
      $inc: {
        totalDonations: 1,
        livesImpacted: 1,
      },
    }
  )

  return {
    success: true,
    message: 'Donation approved',
    certificateUrl,
    donation: {
      ...donation,
      id: donation._id.toString(),
      status: 'completed',
      donationDate: approvalDate,
      certificateGenerated: true,
      certificateUrl,
    },
  }
}

export async function rejectDonation(donationId: string, reason: string, city: string) {
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)
  const donation = await db.collection<DonationDocument>('donations').findOne({ _id: new ObjectId(donationId) })

  if (!donation) {
    return { success: false, message: 'Donation not found' }
  }

  await db.collection('donations').updateOne(
    { _id: donation._id },
    {
      $set: {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date().toISOString(),
      },
    }
  )

  return { success: true, message: 'Donation rejected' }
}

export async function getDonationCertificate(donationId: string, city: string) {
  const dbName = getDbNameForCity(city)
  const db = await getDb(dbName)
  const donation = await db.collection<DonationDocument>('donations').findOne({ _id: new ObjectId(donationId) })

  if (!donation?.certificateUrl) {
    return null
  }

  return donation.certificateUrl
}

export async function generateCertificateFile({ donorName, donationId, date }: { donorName: string; donationId: string; date: string }) {
  ensureCertificatesDir()
  const safeName = donorName.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'donor'
  const fileName = `${safeName}-${donationId}.pdf`
  const filePath = path.join(CERTIFICATE_DIR, fileName)

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const stream = fs.createWriteStream(filePath)
  doc.pipe(stream)

  doc.fontSize(22).text('BloodNet Donation Certificate', { align: 'center' })
  doc.moveDown()
  doc.fontSize(14).text(`Donation ID: ${donationId}`)
  doc.moveDown(1)
  doc.fontSize(14).text(`Donor: ${donorName}`)
  doc.moveDown(1)
  doc.fontSize(14).text(`Date: ${new Date(date).toLocaleDateString()}`)
  doc.moveDown(1)
  doc.fontSize(14).text('This certificate acknowledges a successful blood donation.')
  doc.end()

  await new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve())
    stream.on('error', reject)
  })

  return `/certificates/${fileName}`
}

export async function streamCertificateResponse(donationId: string, city: string) {
  const certificateUrl = await getDonationCertificate(donationId, city)
  if (!certificateUrl) {
    return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'public', certificateUrl.replace(/^\//, ''))
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Certificate file missing' }, { status: 404 })
  }

  return new NextResponse(fs.createReadStream(filePath) as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${donationId}.pdf"`,
    },
  })
}
