'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DonationRecord } from '@/lib/donation-types'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, AlertCircle, FileText, Award } from 'lucide-react'

interface DonationTrackerProps {
  donations: DonationRecord[]
  userRole: 'donor' | 'receiver'
  onSelectDonation: (donation: DonationRecord) => void
}

export function DonationTracker({ donations, userRole, onSelectDonation }: DonationTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const filteredDonations = donations.filter((d) => {
    if (filter === 'pending') return d.status !== 'completed' && d.status !== 'receipt_verified'
    if (filter === 'completed') return d.status === 'completed' || d.status === 'receipt_verified'
    return true
  })

  const getStatusBadge = (status: DonationRecord['status']) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Awaiting Verification</Badge>
      case 'confirmed':
      case 'receiver_confirmed':
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" /> Confirmed</Badge>
      case 'verified':
      case 'receipt_verified':
        return <Badge className="gap-1 bg-green-600 hover:bg-green-700"><Award className="h-3 w-3" /> Verified</Badge>
      case 'completed':
        return <Badge className="gap-1 bg-green-600 hover:bg-green-700"><CheckCircle className="h-3 w-3" /> Completed</Badge>
      case 'receipt_uploaded':
        return <Badge variant="secondary" className="gap-1"><FileText className="h-3 w-3" /> Receipt Pending</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: DonationRecord['status']) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'completed':
      case 'receipt_verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'receipt_uploaded':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold mb-2">No donations yet</p>
          <p className="text-sm text-muted-foreground">
            {userRole === 'donor'
              ? 'When you donate blood, it will appear here for tracking.'
              : 'Your donation requests will appear here once confirmed with a donor.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({donations.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({donations.filter((d) => d.status !== 'completed' && d.status !== 'receipt_verified').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({donations.filter((d) => d.status === 'completed' || d.status === 'receipt_verified').length})
        </Button>
      </div>

      {/* Donations List */}
      <div className="space-y-3">
        {filteredDonations.map((donation) => (
          <Card
            key={donation.id}
            className="hover:shadow-md transition-all cursor-pointer border-l-4"
            style={{
              borderLeftColor:
                donation.status === 'completed' || donation.status === 'receipt_verified'
                  ? '#22c55e'
                  : donation.status === 'receipt_uploaded'
                    ? '#3b82f6'
                    : '#eab308',
            }}
            onClick={() => onSelectDonation(donation)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(donation.status)}
                    <div>
                      <p className="font-semibold text-sm">
                        {userRole === 'donor'
                          ? `Donated to ${donation.recipientName}`
                          : `Received from ${donation.donorName}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donation.hospitalName} • {donation.communicationDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">
                      {donation.bloodGroup}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {donation.units} unit{donation.units !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(donation.status)}

                  {donation.recipientRating && (
                    <div className="text-xs">
                      <span className="text-yellow-500">⭐ {donation.recipientRating}/5</span>
                    </div>
                  )}

                  {donation.certificateGenerated && (
                    <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <Award className="h-3 w-3" /> Certificate
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
