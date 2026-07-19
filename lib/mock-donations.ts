export interface DonationRecord {
  id: string
  donorId: string
  donorName: string
  recipientId: string
  recipientName: string
  bloodGroup: string
  units: number
  status: 'pending' | 'confirmed' | 'completed' | 'receipt_uploaded' | 'receipt_verified'
  communicationDate: string
  donationDate?: string
  recipientConfirmed: boolean
  recipientConfirmedDate?: string
  recipientRating?: number
  recipientReview?: string
  hospitalName?: string
  receiptUrl?: string
  receiptVerificationStatus?: 'pending' | 'verified' | 'rejected'
  certificateGenerated: boolean
  certificateUrl?: string
  certificateId?: string
}

// Mock donation records
export const MOCK_DONATIONS: DonationRecord[] = [
  {
    id: 'donation-001',
    donorId: 'donor-001',
    donorName: 'Ahmed Ali',
    recipientId: 'receiver-001',
    recipientName: 'Fatima Khan',
    bloodGroup: 'O+',
    units: 1,
    status: 'completed',
    communicationDate: '2025-02-01',
    donationDate: '2025-02-03',
    recipientConfirmed: true,
    recipientConfirmedDate: '2025-02-04',
    recipientRating: 5,
    recipientReview: 'Ahmed was very professional and caring. The donation went smoothly.',
    hospitalName: 'Aga Khan Hospital',
    certificateGenerated: true,
    certificateId: 'CERT-2025-001',
  },
  {
    id: 'donation-002',
    donorId: 'donor-001',
    donorName: 'Ahmed Ali',
    recipientId: 'receiver-002',
    recipientName: 'Hassan Khan',
    bloodGroup: 'A+',
    units: 2,
    status: 'pending',
    communicationDate: '2025-02-10',
    recipientConfirmed: false,
    hospitalName: 'Sindh Medical College',
    certificateGenerated: false,
  },
  {
    id: 'donation-003',
    donorId: 'donor-002',
    donorName: 'Abdullah',
    recipientId: 'receiver-001',
    recipientName: 'Fatima Khan',
    bloodGroup: 'O+',
    units: 1,
    status: 'receipt_uploaded',
    communicationDate: '2025-02-05',
    donationDate: '2025-02-07',
    recipientConfirmed: false,
    hospitalName: 'Liaquat Hospital',
    receiptUrl: '/receipts/receipt-donation-003.pdf',
    receiptVerificationStatus: 'verified',
    certificateGenerated: false,
  },
  {
    id: 'donation-004',
    donorId: 'donor-003',
    donorName: 'Ali Raza',
    recipientId: 'receiver-003',
    recipientName: 'Zara Ali',
    bloodGroup: 'B+',
    units: 1,
    status: 'pending',
    communicationDate: '2025-02-12',
    recipientConfirmed: false,
    hospitalName: 'Shaukat Khanum Hospital',
    certificateGenerated: false,
  },
]

export function getDonationsByDonor(donorId: string): DonationRecord[] {
  return MOCK_DONATIONS.filter((d) => d.donorId === donorId)
}

export function getDonationsByRecipient(recipientId: string): DonationRecord[] {
  return MOCK_DONATIONS.filter((d) => d.recipientId === recipientId)
}

export function getDonationById(donationId: string): DonationRecord | undefined {
  return MOCK_DONATIONS.find((d) => d.id === donationId)
}

export function updateDonationRecord(donationId: string, updates: Partial<DonationRecord>): DonationRecord | undefined {
  const index = MOCK_DONATIONS.findIndex((d) => d.id === donationId)
  if (index !== -1) {
    MOCK_DONATIONS[index] = { ...MOCK_DONATIONS[index], ...updates }
    return MOCK_DONATIONS[index]
  }
  return undefined
}
