'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Heart, Clock, CheckCircle, XCircle, AlertCircle, MapPin } from 'lucide-react'

interface BloodRequest {
  id: string
  requesterName: string
  bloodGroup: string
  units: number
  urgency: string
  status: string
  acceptedDonorName?: string
  acceptedDonorEmail?: string
  createdAt: string
  estimatedDeliveryTime?: string
  deliveredAt?: string
  hospitalName?: string
}

interface User {
  id: string
  name: string
  email: string
  bloodGroup?: string
  city: string
  phone: string
}

export default function ReceiverDashboard({ user }: { user: User }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [myRequests, setMyRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReceiverData()
  }, [user.id])

  async function loadReceiverData() {
    try {
      const city = user?.city || 'Karachi'
      const res = await fetch(`/api/blood-requests?requesterId=${user.id}&city=${encodeURIComponent(city)}`)
      if (res.ok) {
        const requests = await res.json()
        setMyRequests(requests)
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load requests', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'accepted':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      open: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-blue-100 text-blue-700',
      fulfilled: 'bg-green-100 text-green-700',
      expired: 'bg-red-100 text-red-700',
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {myRequests.filter((r) => r.status === 'open').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Donor Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {myRequests.filter((r) => r.status === 'accepted').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {myRequests.filter((r) => r.status === 'fulfilled').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Blood Group Needed</label>
                  <p className="font-semibold text-lg">{user.bloodGroup || 'Any'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">City</label>
                  <p className="font-semibold">{user.city}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p className="font-semibold">{user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <p className="text-muted-foreground">No blood requests yet</p>
              ) : (
                <div className="space-y-3">
                  {myRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(req.status)}
                        <div>
                          <p className="font-semibold">{req.bloodGroup}</p>
                          <p className="text-sm text-muted-foreground">{req.units} units</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {myRequests
            .filter((r) => r.status === 'open' || r.status === 'accepted')
            .map((req) => (
              <Card key={req.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      {req.bloodGroup} Blood - {req.units} Units
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {req.status === 'accepted' && req.acceptedDonorName && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-900 mb-2">✓ Donor Found & Confirmed!</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground">Donor Name</label>
                          <p className="font-semibold">{req.acceptedDonorName}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Contact via WhatsApp</label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.open(`https://wa.me/${req.acceptedDonorEmail}?text=Hi%20${req.acceptedDonorName}%2C%20thanks%20for%20helping%20with%20blood%20donation`, '_blank')
                            }}
                            className="w-full"
                          >
                            Chat Now
                          </Button>
                        </div>
                      </div>
                      {req.estimatedDeliveryTime && (
                        <div className="mt-3 text-sm text-blue-900">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Estimated arrival: {req.estimatedDeliveryTime}
                        </div>
                      )}
                    </div>
                  )}

                  {req.status === 'open' && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-900">
                        Waiting for donors to accept your request. You'll be notified as soon as a donor accepts.
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Created {new Date(req.createdAt).toLocaleDateString()} at{' '}
                    {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </CardContent>
              </Card>
            ))}

          {myRequests.filter((r) => r.status === 'open' || r.status === 'accepted').length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No active requests</p>
                <Button onClick={() => (window.location.href = '/request-blood')}>Make a New Request</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {myRequests
            .filter((r) => r.status === 'fulfilled' || r.status === 'expired')
            .map((req) => (
              <Card key={req.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{req.bloodGroup} - {req.units} Units</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Requested</label>
                      <p>{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    {req.deliveredAt && (
                      <div>
                        <label className="text-muted-foreground">Delivered</label>
                        <p>{new Date(req.deliveredAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

          {myRequests.filter((r) => r.status === 'fulfilled' || r.status === 'expired').length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No history yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="font-semibold text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-semibold">{user.phone}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">City</label>
                <p className="font-semibold">{user.city}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
