'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth-provider'
import { DonationRecord } from '@/lib/donation-types'
import { DonationTracker } from '@/components/donation-tracker'
import { RecipientReviewForm } from '@/components/recipient-review-form'
import { ReceiptUpload } from '@/components/receipt-upload'
import { DonationCertificate } from '@/components/donation-certificate'
import { ArrowLeft, Heart, FileText, CheckCircle, AlertTriangle, Clock, Upload } from 'lucide-react'
import Link from 'next/link'

export default function DonationsPage() {
  const { user } = useAuth()
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null)
  const [donations, setDonations] = useState<DonationRecord[]>([])

  useEffect(() => {
    async function loadDonations() {
      if (!user) return
      try {
        const param = user.role === 'donor' ? `donorId=${user.id}` : `recipientId=${user.id}`
        const res = await fetch(`/api/donations?city=${encodeURIComponent(user.city)}&${param}`)
        const data = await res.json()
        if (Array.isArray(data.donations)) {
          setDonations(data.donations)
        } else if (Array.isArray(data)) {
          setDonations(data)
        }
      } catch (error) {
        console.error('Failed to load donations:', error)
      }
    }
    loadDonations()
  }, [user])

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Awaiting Verification',
      submitted: 'Awaiting Verification',
      confirmed: 'Confirmed',
      receiver_confirmed: 'Confirmed by Recipient',
      verified: 'Verified & Certified',
      completed: 'Completed',
      receipt_uploaded: 'Receipt Pending',
      receipt_verified: 'Verified & Certified',
      rejected: 'Rejected',
    }
    return labels[status] || 'Unknown'
  }

  const handleConfirmDonation = (updatedDonation: DonationRecord | null) => {
    if (updatedDonation) {
      setDonations((prev) =>
        prev.map((d) => (d.id === updatedDonation.id ? updatedDonation : d))
      )
      setSelectedDonation(updatedDonation)
    }
  }

  const handleReceiptUpload = (updatedDonation: DonationRecord | null) => {
    if (updatedDonation) {
      setDonations((prev) =>
        prev.map((d) => (d.id === updatedDonation.id ? updatedDonation : d))
      )
      setSelectedDonation(updatedDonation)
    }
  }

  const handleRequestReceipt = (donationId: string) => {
    const donation = donations.find((d) => d.id === donationId)
    if (donation) {
      setSelectedDonation(donation)
    }
  }

  const handleDonationUpdate = (updatedDonation: DonationRecord | null) => {
    if (updatedDonation) {
      setDonations((prev) =>
        prev.map((d) => (d.id === updatedDonation.id ? updatedDonation : d))
      )
      setSelectedDonation(updatedDonation)
    }
  }

  // Check if recipient is overdue (14 days without confirmation)
  const isRecipientOverdue = (donation: DonationRecord): boolean => {
    if (donation.recipientConfirmed) return false
    const communicationDate = new Date(donation.communicationDate || new Date().toISOString())
    const daysPassed = Math.floor((new Date().getTime() - communicationDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysPassed > 14
  }

  // Check if donor can upload receipt as alternative
  const canDonorUploadReceipt = (donation: DonationRecord): boolean => {
    return !donation.recipientConfirmed && donation.status !== 'receipt_verified' && donation.status !== 'completed'
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-muted/30 py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <Card className="border-2 border-primary/50 bg-primary/5">
              <CardContent className="pt-12 pb-12 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-xl font-semibold mb-3">Sign in to Track Donations</p>
                <p className="text-muted-foreground mb-6">
                  Track your blood donations, confirm receipts, and manage donation records.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              Donation Tracking
            </h1>
            <p className="text-muted-foreground">
              {user.role === 'donor'
                ? 'Manage your blood donations and track certificates.'
                : 'Confirm received blood donations and leave reviews.'}
            </p>
          </div>

          {!selectedDonation ? (
            // Donations List View
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">Total Donations</p>
                    <p className="text-3xl font-bold text-primary">{donations.length}</p>
                  </CardContent>
                </Card>
                {user.role === 'donor' && (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-1">Lives Saved</p>
                        <p className="text-3xl font-bold text-green-600">
                          {donations.filter((d) => d.status === 'completed' || d.status === 'receipt_verified').length * 3}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-1">Certificates</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {donations.filter((d) => d.certificateGenerated).length}
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Donations Tracker */}
              <DonationTracker
                donations={donations}
                userRole={user?.role === 'receiver' ? 'receiver' : 'donor'}
                onSelectDonation={setSelectedDonation}
              />
            </div>
          ) : (
            // Donation Detail View
            <div className="space-y-6">
              <Button
                variant="outline"
                onClick={() => setSelectedDonation(null)}
                className="gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Donation Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Donation Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Donor</p>
                          <p className="font-bold">{selectedDonation.donorName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Recipient</p>
                          <p className="font-bold">{selectedDonation.recipientName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Blood Type</p>
                          <p className="font-bold text-lg text-primary">{selectedDonation.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Units</p>
                          <p className="font-bold">{selectedDonation.units}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Hospital</p>
                          <p className="font-bold">{selectedDonation.hospitalName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date</p>
                          <p className="font-bold">{selectedDonation.donationDate || 'Pending'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Section - Hidden Verification, Seamless Flow */}
                  <div className="border-t border-border pt-6 space-y-4">
                    {/* Recipient Overdue Warning */}
                    {isRecipientOverdue(selectedDonation) && (
                      <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800 p-4 rounded-lg">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-900 dark:text-red-100 mb-1">Recipient Account Warning</p>
                            <p className="text-sm text-red-800 dark:text-red-200">
                              The recipient has not confirmed this donation for more than 14 days. Their account has been flagged for non-responsiveness.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                          {/* Recipient Actions */}
                    {user?.role === 'receiver' && selectedDonation.status === 'pending' && (
                      <RecipientReviewForm donation={selectedDonation} onConfirm={handleDonationUpdate} />
                    )}

                    {/* Donor Receipt Upload Option - Always Available for Pending Donations */}
                    {user?.role === 'donor' && canDonorUploadReceipt(selectedDonation) && !selectedDonation.recipientConfirmed && (
                      <Card className="border-2 border-primary/30 bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" />
                            Upload Receipt for Verification
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-2">
                            If the recipient hasn't confirmed, you can upload your donation receipt. We'll verify it and generate your certificate.
                          </p>
                        </CardHeader>
                        <CardContent>
                          <ReceiptUpload
                            donation={selectedDonation}
                            onUploadComplete={handleDonationUpdate}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Certificate Display */}
                    {user.role === 'donor' && (selectedDonation.status === 'completed' ||
                      selectedDonation.status === 'receipt_verified' ||
                      selectedDonation.status === 'verified') && (
                      <div>
                        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-lg mb-4">
                          <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                            ✓ Donation Verified and Certified
                          </p>
                        </div>
                        <DonationCertificate donation={selectedDonation} />
                      </div>
                    )}

                    {/* Status Info */}
                    {selectedDonation.status === 'pending' && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                        <p className="text-xs text-blue-800 dark:text-blue-200">
                          Waiting for your confirmation that you received the blood donation.
                        </p>
                      </div>
                    )}

                    {/* Days Remaining Info for Donor */}
                    {user?.role === 'donor' && selectedDonation.status === 'pending' && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-lg flex gap-2">
                        <Clock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                          Recipient has 14 days to confirm. After that, upload receipt for automatic verification and certificate generation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Certificate */}
                  {user.role === 'donor' && selectedDonation.certificateGenerated && (
                    <DonationCertificate donation={selectedDonation} />
                  )}

                  {/* Status Timeline */}
                  {selectedDonation.recipientConfirmed && (
                    <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Donation Confirmed
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Confirmed on</p>
                          <p className="font-bold">{selectedDonation.recipientConfirmedDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Recipient Rating</p>
                          <p className="font-bold text-lg">
                            {selectedDonation.recipientRating}
                            <span className="text-yellow-500 ml-1">⭐</span>
                          </p>
                        </div>
                        {selectedDonation.recipientReview && (
                          <div>
                            <p className="text-muted-foreground mb-1">Review</p>
                            <p className="italic">{selectedDonation.recipientReview}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
