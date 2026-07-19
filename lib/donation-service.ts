
import { DonationRecord } from './donation-types'

export interface ReceiptData {
  donorName?: string
  recipientName?: string
  hospitalName?: string
  bloodGroup?: string
  units?: number
  donationDate?: string
}

// Simulate OCR text extraction from receipt image
export function extractReceiptData(receiptText: string): ReceiptData {
  const data: ReceiptData = {}

  const nameMatch = receiptText.match(/Donor[:\s]+([A-Za-z\s]+)/i)
  if (nameMatch) data.donorName = nameMatch[1].trim()

  const recipientMatch = receiptText.match(/Recipient[:\s]+([A-Za-z\s]+)/i)
  if (recipientMatch) data.recipientName = recipientMatch[1].trim()

  const hospitalMatch = receiptText.match(/Hospital[:\s]+([A-Za-z\s]+)/i)
  if (hospitalMatch) data.hospitalName = hospitalMatch[1].trim()

  const bloodMatch = receiptText.match(/Blood[:\s]+([A-Z+\-]+)/i)
  if (bloodMatch) data.bloodGroup = bloodMatch[1].trim()

  const unitsMatch = receiptText.match(/Units[:\s]+(\d+)/i)
  if (unitsMatch) data.units = parseInt(unitsMatch[1], 10)

  const dateMatch = receiptText.match(/Date[:\s]+(\d{4}-\d{2}-\d{2})/i)
  if (dateMatch) data.donationDate = dateMatch[1]

  return data
}

// Verify receipt data matches donation record
export function verifyReceiptAgainstDonation(receiptData: ReceiptData, donation: DonationRecord): boolean {
  const normalizedReceipt = {
    donorName: receiptData.donorName?.toLowerCase().trim() || '',
    recipientName: receiptData.recipientName?.toLowerCase().trim() || '',
    hospitalName: receiptData.hospitalName?.toLowerCase().trim() || '',
    bloodGroup: receiptData.bloodGroup?.toUpperCase() || '',
    units: receiptData.units || 0,
  }

  const normalizedDonation = {
    donorName: (donation.donorName || '').toLowerCase().trim(),
    recipientName: (donation.recipientName || '').toLowerCase().trim(),
    hospitalName: (donation.hospitalName || '').toLowerCase().trim(),
    bloodGroup: (donation.bloodGroup || '').toUpperCase(),
    units: donation.units || 0,
  }

  const donorMatch = normalizedDonation.donorName && normalizedReceipt.donorName
    ? normalizedReceipt.donorName.includes(normalizedDonation.donorName.split(' ')[0]) ||
      normalizedDonation.donorName.includes(normalizedReceipt.donorName.split(' ')[0])
    : true

  const recipientMatch = normalizedDonation.recipientName && normalizedReceipt.recipientName
    ? normalizedReceipt.recipientName.includes(normalizedDonation.recipientName.split(' ')[0]) ||
      normalizedDonation.recipientName.includes(normalizedReceipt.recipientName.split(' ')[0])
    : true

  const hospitalMatch = normalizedDonation.hospitalName && normalizedReceipt.hospitalName
    ? normalizedReceipt.hospitalName === normalizedDonation.hospitalName ||
      normalizedReceipt.hospitalName.includes(normalizedDonation.hospitalName.split(' ')[0])
    : true

  const bloodGroupMatch = normalizedDonation.bloodGroup && normalizedReceipt.bloodGroup
    ? normalizedReceipt.bloodGroup === normalizedDonation.bloodGroup
    : true

  const unitsMatch = normalizedDonation.units && normalizedReceipt.units
    ? normalizedReceipt.units === normalizedDonation.units
    : true

  return donorMatch && recipientMatch && hospitalMatch && bloodGroupMatch && unitsMatch
}

// Generate donation certificate
export function generateCertificate(donation: DonationRecord): { id: string; content: string } {
  const certificateId = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  const content = `
BLOOD DONATION CERTIFICATE

This certifies that

${donation.donorName}

Has successfully donated ${donation.units} unit(s) of ${donation.bloodGroup} blood

On: ${donation.donationDate || new Date().toISOString().split('T')[0]}
At: ${donation.hospitalName || 'Blood Donation Center'}
For: ${donation.recipientName}

Certificate ID: ${certificateId}
Date Issued: ${new Date().toISOString().split('T')[0]}

This donation has contributed to saving lives and is deeply appreciated.

---

This certificate recognizes the noble act of blood donation and the invaluable contribution to society. Every donation saves up to three lives.

Blood Donation Impact:
✓ 1 unit of blood donated
✓ 1 life potentially saved
✓ Certificate of Recognition awarded
  `

  return { id: certificateId, content }
}

// Recipient confirms donation with review
export function confirmDonation(
  donationId: string,
  rating: number,
  review: string
): DonationRecord | undefined {
  throw new Error('confirmDonation helper is not available in the browser. Use the API endpoint instead.')
}

// Donor uploads receipt
export async function uploadReceipt(
  donationId: string,
  receiptUrl: string,
  receiptText: string,
  city: string = 'Karachi'
): Promise<{ success: boolean; message: string; donation?: DonationRecord | null }> {
  const response = await fetch('/api/donations/submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'upload_receipt',
      donationId,
      receiptUrl,
      receiptText,
      city,
    }),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    return {
      success: false,
      message: payload?.error || 'Receipt upload failed',
      donation: null,
    }
  }

  return {
    success: payload?.success === true,
    message: payload?.message || 'Receipt upload completed',
    donation: payload?.donation || null,
  }
}

// Create tracking record when donor and recipient are ready
export function createDonationTrackingRecord(
  donorId: string,
  donorName: string,
  recipientId: string,
  recipientName: string,
  bloodGroup: string,
  units: number,
  hospitalName?: string
): DonationRecord {
  return {
    id: `donation-${Date.now()}`,
    donorId,
    donorName,
    recipientId,
    recipientName,
    bloodGroup,
    units,
    status: 'pending',
    communicationDate: new Date().toISOString().split('T')[0],
    recipientConfirmed: false,
    hospitalName,
    certificateGenerated: false,
  }
}
