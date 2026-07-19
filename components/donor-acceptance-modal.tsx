'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Heart, AlertCircle, Clock, MapPin } from 'lucide-react'

interface DonorAcceptanceModalProps {
  isOpen: boolean
  onClose: () => void
  request: {
    id: string
    requesterName: string
    bloodGroup: string
    units: number
    urgency: string
    city: string
    reason?: string
  }
  donor: {
    id: string
    email: string
    name: string
  }
  onAcceptSuccess?: () => void
}

export function DonorAcceptanceModal({ isOpen, onClose, request, donor, onAcceptSuccess }: DonorAcceptanceModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)

  async function handleAccept() {
    setLoading(true)
    try {
      const res = await fetch('/api/requests/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          donorId: donor.id,
          donorEmail: donor.email,
          donorName: donor.name,
          city: request.city,
        }),
      })

      if (res.ok) {
        toast({ title: 'Success', description: `You've accepted to help ${request.requesterName}!` })
        setAccepted(true)
        setTimeout(() => {
          onClose()
          onAcceptSuccess?.()
        }, 2000)
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Failed to accept request', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to accept request', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            {accepted ? 'Great! You are helping!' : 'Blood Donation Request'}
          </DialogTitle>
          <DialogDescription>
            {accepted
              ? 'The requester has been notified. You can contact them to coordinate donation details.'
              : 'A donor is needed in your city. Will you help?'}
          </DialogDescription>
        </DialogHeader>

        {!accepted ? (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Patient Name</label>
                <p className="font-semibold">{request.requesterName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Blood Type</label>
                  <p className="font-bold text-lg">{request.bloodGroup}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Units Needed</label>
                  <p className="font-bold">{request.units}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Urgency
                </label>
                <p className="font-semibold uppercase text-red-600">{request.urgency}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </label>
                <p className="font-semibold">{request.city}</p>
              </div>

              {request.reason && (
                <div>
                  <label className="text-xs text-muted-foreground">Reason</label>
                  <p className="text-sm">{request.reason}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <Clock className="w-4 h-4 inline mr-2" />
                After accepting, you can coordinate details with the requester to arrange donation at your nearest hospital.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-2">✓ Acceptance Confirmed!</p>
              <p className="text-sm text-green-800 dark:text-green-200">
                {request.requesterName} has been notified of your acceptance.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">Next Steps:</p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Requester will contact you to confirm appointment</li>
                <li>Go to hospital on agreed date/time</li>
                <li>Complete donation</li>
                <li>Submit donation proof to hospital for verification</li>
                <li>Get your digital certificate!</li>
              </ol>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {!accepted ? (
            <>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Decline
              </Button>
              <Button onClick={handleAccept} disabled={loading}>
                {loading ? 'Accepting...' : 'Accept & Help'}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
