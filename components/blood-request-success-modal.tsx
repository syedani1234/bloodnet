'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface BloodRequestSuccessModalProps {
  donorName?: string
  bloodType: string
  units: number
  onClose?: () => void
  onRequestAnother?: () => void
}

export function BloodRequestSuccessModal({
  donorName = 'the donor',
  bloodType,
  units,
  onClose,
  onRequestAnother,
}: BloodRequestSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full border-green-200 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 dark:border-green-900">
        <CardContent className="pt-12 space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">Request Sent Successfully</h2>
            <p className="text-green-800 dark:text-green-200 leading-relaxed">
              Your blood request for <span className="font-bold">{units} units of {bloodType}</span> has been delivered to {donorName}. You may also request additional donors while waiting for a response.
            </p>
          </div>

          {/* Status Info */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-green-200 dark:border-green-900/30">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blood Type:</span>
                <span className="font-semibold text-primary">{bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Units Requested:</span>
                <span className="font-semibold">{units}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={onRequestAnother}
              size="lg"
            >
              Request Another Donor
            </Button>
            <Link href="/request-blood" className="block">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                View My Requests
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full"
              onClick={onClose}
              size="lg"
            >
              Close
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You will receive notifications about donor responses
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
