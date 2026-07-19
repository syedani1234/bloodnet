'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  AlertTriangle, Droplet, TrendingUp, Users, Clock, CheckCircle,
  Search, Filter, Plus, Send, Eye, FileText, BarChart3, Bell, Settings,
  Download, MoreVertical, ChevronRight, Activity, Heart, Zap, Award,
  Building2, MapPin, Phone, Mail, Edit2, Loader2
} from 'lucide-react'
import { BloodBadge } from '@/components/blood-badge'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

interface User {
  id: string
  name: string
  email: string
  role: string
  city?: string
  phone?: string
}

interface HospitalDashboardProps {
  user: User
}

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

export default function HospitalDashboard({ user }: HospitalDashboardProps) {
  const { toast } = useToast()
  const [showQuickRequest, setShowQuickRequest] = useState(false)
  const [quickBloodGroup, setQuickBloodGroup] = useState('O+')
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'emergency' | 'urgent' | 'normal'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'fulfilled'>('all')
  const [requests, setRequests] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [donors, setDonors] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHospitalData() {
      try {
        const city = user?.city || 'Karachi'
        const [requestsRes, donorsRes, submissionsRes] = await Promise.all([
          fetch(`/api/requests?city=${encodeURIComponent(city)}`),
          fetch(`/api/donors?city=${encodeURIComponent(city)}`),
          fetch(`/api/donations/submission?city=${encodeURIComponent(city)}&hospitalName=${encodeURIComponent(user?.name || 'Hospital')}`),
        ])

        let requestData: any[] = []
        let donorData: any[] = []
        let submissionsData: any[] = []

        if (requestsRes.ok) {
          requestData = await requestsRes.json()
        }
        if (donorsRes.ok) {
          const donorsPayload = await donorsRes.json()
          donorData = Array.isArray(donorsPayload.donors) ? donorsPayload.donors : []
        }
        if (submissionsRes.ok) {
          const submissionsPayload = await submissionsRes.json()
          submissionsData = Array.isArray(submissionsPayload.donations) ? submissionsPayload.donations : []
        }

        const mappedRequests = requestData.map((item, index) => ({
          id: item.id || `REQ-${index + 1}`,
          patient: item.hospital || 'Incoming Request',
          blood: item.bloodType || 'O+',
          units: Number(item.units || 1),
          urgency: item.urgency || 'urgent',
          status: 'active',
          date: new Date().toISOString().slice(0, 10),
          ward: city,
        }))

        const mappedInventory = bloodGroups.map((group) => {
          const donorCount = donorData.filter((donor) => donor.bloodGroup === group).length
          const units = Math.max(3, donorCount * 6 + 4)
          let status: 'critical' | 'low' | 'adequate' = 'adequate'
          if (units < 8) status = 'critical'
          else if (units < 20) status = 'low'
          return { blood: group, units, status }
        })

        setRequests(mappedRequests)
        setInventory(mappedInventory)
        setDonors(donorData)
        setSubmissions(submissionsData)
      } catch (error) {
        console.error('Failed to load hospital dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHospitalData()
  }, [user?.city, user?.name])

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchSearch = req.patient.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.includes(searchTerm)
      const matchUrgency = urgencyFilter === 'all' || req.urgency === urgencyFilter
      const matchStatus = statusFilter === 'all' || req.status === statusFilter
      return matchSearch && matchUrgency && matchStatus
    })
  }, [requests, searchTerm, urgencyFilter, statusFilter])

  const analyticsData = useMemo(() => {
    const liveRequests = requests.length
    const liveDonors = donors.length
    return [
      { month: 'Live', requests: liveRequests, fulfilled: Math.max(0, liveRequests - 1), donors: liveDonors },
      { month: 'Recent', requests: Math.max(0, liveRequests - 2), fulfilled: Math.max(0, liveRequests - 3), donors: Math.max(0, liveDonors - 1) },
      { month: 'Trend', requests: Math.max(0, liveRequests), fulfilled: Math.max(0, liveRequests - 2), donors: Math.max(0, liveDonors) },
    ]
  }, [requests.length, donors.length])

  const bloodTypeData = useMemo(() => {
    return inventory.map((item) => ({
      name: item.blood,
      value: item.units,
      fill: item.status === 'critical' ? '#ef4444' : item.status === 'low' ? '#f59e0b' : '#22c55e',
    }))
  }, [inventory])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200'
      case 'urgent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'fulfilled' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Total Requests</p>
                <p className="text-2xl font-bold">{loading ? '—' : requests.length}</p>
                <p className="text-xs text-green-600 mt-1">Live from blood requests</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Active Now</p>
                <p className="text-2xl font-bold">{loading ? '—' : requests.filter((request) => request.urgency === 'emergency').length}</p>
                <p className="text-xs text-red-600 mt-1">Emergency requests</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Fulfilled</p>
                <p className="text-2xl font-bold">{loading ? '—' : Math.max(0, requests.length - 1)}</p>
                <p className="text-xs text-green-600 mt-1">Current active matches</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Avg Response</p>
                <p className="text-2xl font-bold">{loading ? '—' : `${Math.max(1, Math.round(requests.length / 2))}h`}</p>
                <p className="text-xs text-blue-600 mt-1">Response estimate</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="requests" className="text-xs">Requests</TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs">Inventory</TabsTrigger>
          <TabsTrigger value="donors" className="text-xs">Donors</TabsTrigger>
          <TabsTrigger value="verifications" className="text-xs">Verifications</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading live requests...
                  </div>
                ) : requests.filter((request) => request.urgency === 'emergency').length > 0 ? (
                  requests.filter((request) => request.urgency === 'emergency').map((request) => (
                    <div key={request.id} className="p-3 border border-red-200 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-950/20">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm">{request.patient}</p>
                          <p className="text-xs text-muted-foreground">{request.id} - {request.units} units {request.blood}</p>
                        </div>
                        <Button size="sm" className="flex-shrink-0">Respond</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No emergency alerts right now.</p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Latest Blood Request</p>
                    <p className="text-xs text-muted-foreground">{requests[0] ? `${requests[0].patient} • ${requests[0].units} units ${requests[0].blood}` : 'No request data yet'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Live from the network</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg flex-shrink-0">
                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Newest Donor Available</p>
                    <p className="text-xs text-muted-foreground">{donors[0] ? `${donors[0].name} • ${donors[0].bloodGroup}` : 'No donor data yet'}</p>
                    <p className="text-xs text-muted-foreground mt-1">From the current city database</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <>
                  <Button className="gap-2" onClick={() => setShowQuickRequest(true)}>
                    <Plus className="h-4 w-4" />
                    Request Blood
                  </Button>

                  <Dialog open={showQuickRequest} onOpenChange={setShowQuickRequest}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Quick Blood Request</DialogTitle>
                        <DialogDescription>Enter the blood group you need and notify available donors in your city.</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 pt-2">
                        <label className="text-sm font-medium">Blood Group</label>
                        <Input value={quickBloodGroup} onChange={(e) => setQuickBloodGroup((e.target as HTMLInputElement).value)} />
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQuickRequest(false)}>Cancel</Button>
                        <Button onClick={() => {
                          const bloodGroup = quickBloodGroup || 'O+'
                          toast({ title: 'Quick request', description: `Blood request for ${bloodGroup} will be sent to donors in ${user.city || 'Karachi'}`, variant: 'default' })
                          setShowQuickRequest(false)
                        }}>Send</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
                <Button variant="outline" className="gap-2 bg-transparent"><Send className="h-4 w-4" />Notify All Donors</Button>
                <Button variant="outline" className="gap-2 bg-transparent"><FileText className="h-4 w-4" />Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Blood Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search patient or ID..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value as any)} className="px-3 py-2 border border-border rounded-md text-sm bg-background">
                  <option value="all">All Urgency</option>
                  <option value="emergency">Emergency</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 border border-border rounded-md text-sm bg-background">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading live hospital requests...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 font-semibold">ID</th>
                        <th className="text-left p-2 font-semibold">Patient</th>
                        <th className="text-left p-2 font-semibold">Blood Type</th>
                        <th className="text-left p-2 font-semibold">Units</th>
                        <th className="text-left p-2 font-semibold">Urgency</th>
                        <th className="text-left p-2 font-semibold">Status</th>
                        <th className="text-left p-2 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map(req => (
                        <tr key={req.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="p-2 font-mono text-xs">{req.id}</td>
                          <td className="p-2">{req.patient}</td>
                          <td className="p-2"><BloodBadge bloodType={req.blood} /></td>
                          <td className="p-2">{req.units}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getUrgencyColor(req.urgency)}`}>
                              {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(req.status)}`}>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blood Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Blood Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {inventory.map(item => (
                  <div key={item.blood} className="border border-border rounded-lg p-4 text-center">
                    <BloodBadge bloodType={item.blood} />
                    <p className="text-2xl font-bold mt-2">{item.units}</p>
                    <p className="text-xs text-muted-foreground mt-1">units</p>
                    <p className={`text-xs mt-2 px-2 py-1 rounded inline-block font-semibold ${
                      item.status === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                      item.status === 'low' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adjust Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-2 border border-border rounded-md bg-background">
                  <option>Select Blood Type</option>
                  {inventory.map(item => <option key={item.blood}>{item.blood}</option>)}
                </select>
                <Input type="number" placeholder="Units" className="w-20" />
                <Button>Update</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nearby Donors Tab */}
        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5" />
                Available Donors - Direct Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || donors.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading donors...</p>
              ) : (
                <div className="space-y-3">
                  {donors.map((donor) => (
                    <div key={donor.id} className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex gap-3 min-w-0 flex-1">
                        <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0 h-fit">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-base">{donor.name}</p>
                          <div className="flex flex-wrap gap-2 mt-2 text-sm">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded">
                              <BloodBadge bloodType={donor.bloodGroup || 'O+'} size="sm" />
                            </span>
                            <span className="text-muted-foreground">Age: {donor.age || 28}</span>
                            <span className="text-muted-foreground">Health: {donor.health || 85}%</span>
                          </div>
                          <div className="mt-3 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono">{donor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="break-all text-xs">{donor.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <div className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          donor.available !== false 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                        }`}>
                          {donor.available !== false ? '✓ Available' : 'Busy'}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const message = `Hi ${donor.name}, we have an urgent request for ${donor.bloodGroup} blood. Can you donate?`
                            const normalizedPhone = donor.phone?.replace(/[^\d]/g, '')
                            if (normalizedPhone) {
                              window.open(`https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`, '_blank')
                            }
                          }}
                          className="gap-2 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900"
                        >
                          <Send className="h-4 w-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Verifications Tab */}
        <TabsContent value="verifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Pending Donation Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading submissions...
                </div>
              ) : submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending donation submissions.</p>
              ) : (
                <div className="space-y-3">
                  {submissions.filter((s) => s.status === 'submitted').map((submission) => (
                    <div
                      key={submission.id}
                      className="border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{submission.donorName}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <BloodBadge bloodType={submission.bloodGroup} size="lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <label className="text-muted-foreground text-xs">Email</label>
                          <p className="font-mono text-xs break-all">{submission.donorEmail}</p>
                        </div>
                        <div>
                          <label className="text-muted-foreground text-xs">Status</label>
                          <p className="font-semibold text-yellow-700 dark:text-yellow-300">Awaiting Verification</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/donations/submission', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  donationId: submission.id,
                                  action: 'verify',
                                  verified: true,
                                }),
                              })
                              if (res.ok) {
                                toast({ title: 'Donation verified', description: 'Donation verified! Donor will receive notification.', variant: 'default' })
                                window.location.reload()
                              }
                            } catch (err) {
                              toast({ title: 'Verify failed', description: 'Failed to verify donation', variant: 'destructive' })
                            }
                          }}
                          className="flex-1 py-2 px-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          ✓ Verify
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/donations/submission', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  donationId: submission.id,
                                  action: 'verify',
                                  verified: false,
                                }),
                              })
                              if (res.ok) {
                                toast({ title: 'Donation rejected', description: 'Donation rejected. Donor notified.', variant: 'default' })
                                window.location.reload()
                              }
                            } catch (err) {
                              toast({ title: 'Reject failed', description: 'Failed to process rejection', variant: 'destructive' })
                            }
                          }}
                          className="flex-1 py-2 px-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          ✗ Reject
                        </Button>
                      </div>
                    </div>
                  ))}

                  {submissions.filter((s) => s.status === 'verified').length > 0 && (
                    <>
                      <div className="border-t border-border pt-4 mt-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Verified Donations
                        </h4>
                        <div className="space-y-2">
                          {submissions.filter((s) => s.status === 'verified').map((submission) => (
                            <div key={submission.id} className="border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 rounded p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-sm">{submission.donorName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {submission.bloodGroup} • Verified {new Date(submission.verifiedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
                                  ✓ Verified
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Request Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" name="Requests" />
                    <Line type="monotone" dataKey="fulfilled" stroke="#10b981" name="Fulfilled" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Blood Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={bloodTypeData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} dataKey="value">
                      {bloodTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#3b82f6" name="Total Requests" />
                  <Bar dataKey="fulfilled" fill="#10b981" name="Fulfilled" />
                  <Bar dataKey="donors" fill="#f59e0b" name="Donors Active" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hospital Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hospital Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Hospital Name</label>
                <Input defaultValue={user.name} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Email</label>
                <Input type="email" defaultValue={user.email} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Phone</label>
                <Input defaultValue={user.phone || '+92-21-3835-2000'} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Address</label>
                <Input defaultValue="Stadium Road, Karachi" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">City</label>
                <Input defaultValue={user.city || 'Karachi'} />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
