'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { DonationRecord } from '@/lib/donation-types'
import { Star, CheckCircle, AlertCircle } from 'lucide-react'

interface RecipientReviewFormProps {
  donation: DonationRecord
  onConfirm: (updatedDonation: DonationRecord) => void
}

export function RecipientReviewForm({ donation, onConfirm }: RecipientReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/donations/${donation.id}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          review,
          city: donation.city || 'Karachi',
        }),
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        throw new Error(errorPayload?.error || 'Failed to confirm donation')
      }

      const payload = await response.json()
      if (payload.success && payload.donation) {
        setSubmitted(true)
        onConfirm(payload.donation)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Confirmation failed'
      toast({ title: 'Confirmation failed', description: message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">Thank you for confirming!</h3>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                Your review has been recorded. {donation.donorName} will receive a donation certificate for this contribution.
              </p>
              <div className="bg-white dark:bg-slate-900 p-3 rounded border border-green-200 dark:border-green-800 text-sm">
                <p className="font-semibold mb-1">Donation Summary:</p>
                <ul className="space-y-1 text-xs">
                  <li>Donor: {donation.donorName}</li>
                  <li>Blood Type: {donation.bloodGroup}</li>
                  <li>Units: {donation.units}</li>
                  <li>Your Rating: {donation.recipientRating}/5 stars</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Confirm Blood Donation Receipt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Donation Details */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Donor:</span> {donation.donorName}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Blood Type:</span> {donation.bloodGroup}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Units:</span> {donation.units}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Hospital:</span> {donation.hospitalName}
          </p>
        </div>

        {/* Rating Section */}
        <div className="space-y-3">
          <label className="text-sm font-semibold">Rate this donation experience (1-5 stars)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">You selected {rating} star{rating !== 1 ? 's' : ''}</p>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <label htmlFor="review" className="text-sm font-semibold block">
            Add a review (optional)
          </label>
          <Textarea
            id="review"
            placeholder="Share your experience with this donor. Was the process smooth? Any comments about their professionalism?"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-32"
          />
          <p className="text-xs text-muted-foreground">{review.length}/500 characters</p>
        </div>

        {/* Confirmation Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-200">
            By confirming, you acknowledge that you received {donation.units} unit(s) of {donation.bloodGroup} blood from {donation.donorName}. This will generate a donation certificate for the donor.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Donation'}
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Not Yet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
