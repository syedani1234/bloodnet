'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BloodBadge } from '@/components/blood-badge'
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Zap,
  CheckCircle,
  Clock,
  PieChart,
  Download,
  Filter,
  BarChart3,
} from 'lucide-react'

interface BloodBankDashboardProps {
  user: any
}

export default function BloodBankDashboard({ user }: BloodBankDashboardProps) {
  const inventoryStats = [
    { blood: 'O+', units: 45, capacity: 50, critical: false },
    { blood: 'O-', units: 12, capacity: 30, critical: true },
    { blood: 'A+', units: 38, capacity: 50, critical: false },
    { blood: 'A-', units: 8, capacity: 20, critical: true },
    { blood: 'B+', units: 28, capacity: 40, critical: false },
    { blood: 'B-', units: 5, capacity: 20, critical: true },
    { blood: 'AB+', units: 15, capacity: 25, critical: false },
    { blood: 'AB-', units: 3, capacity: 15, critical: true },
  ]

  const keyMetrics = [
    { label: 'Total Units in Stock', value: '154', icon: Package, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Collections Today', value: '23', icon: TrendingUp, color: 'bg-green-500/10 text-green-600' },
    { label: 'Critical Stock', value: '4', icon: AlertTriangle, color: 'bg-red-500/10 text-red-600' },
    { label: 'Monthly Revenue', value: '$24.5K', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600' },
  ]

  const recentCollections = [
    { id: 1, donorId: 'D001', bloodType: 'O+', units: 1, collectedAt: '2 hours ago', status: 'Completed' },
    { id: 2, donorId: 'D015', bloodType: 'A+', units: 1, collectedAt: '4 hours ago', status: 'Completed' },
    { id: 3, donorId: 'D042', bloodType: 'B+', units: 1, collectedAt: '6 hours ago', status: 'Completed' },
    { id: 4, donorId: 'D089', bloodType: 'AB+', units: 1, collectedAt: '8 hours ago', status: 'Completed' },
  ]

  const distributionRequests = [
    { id: 1, hospital: 'Aga Khan Hospital', bloodType: 'O+', units: 5, requestedAt: '1 hour ago', status: 'Pending', priority: 'High' },
    { id: 2, hospital: 'Sindh Medical', bloodType: 'A+', units: 3, requestedAt: '3 hours ago', status: 'Processing', priority: 'Medium' },
    { id: 3, hospital: 'Liaquat Hospital', bloodType: 'B-', units: 2, requestedAt: '5 hours ago', status: 'Ready for Pickup', priority: 'High' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Processing':
        return 'bg-blue-100 text-blue-800'
      case 'Ready for Pickup':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                    <p className="text-3xl font-bold mt-2">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Status */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Blood Inventory Status</CardTitle>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryStats.map((item) => (
                <div key={item.blood} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BloodBadge bloodType={item.blood} />
                      <span className="font-medium">{item.units} / {item.capacity} units</span>
                      {item.critical && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
                          <AlertTriangle className="h-3 w-3" />
                          Critical
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.round((item.units / item.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        item.critical ? 'bg-red-500' : item.units > item.capacity * 0.7 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${(item.units / item.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2 h-auto py-2 px-3">
              <Users className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs font-semibold">Schedule Collection</div>
                <div className="text-xs text-muted">Arrange donor visits</div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-2 px-3">
              <Package className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs font-semibold">Distribute Units</div>
                <div className="text-xs text-muted">Send to hospitals</div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-2 px-3">
              <BarChart3 className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs font-semibold">View Reports</div>
                <div className="text-xs text-muted">Monthly analytics</div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-2 px-3">
              <AlertTriangle className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs font-semibold">Low Stock Alert</div>
                <div className="text-xs text-muted">Reorder blood units</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="collections">Recent Collections</TabsTrigger>
          <TabsTrigger value="distributions">Distribution Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Collections This Week</span>
                <Button size="sm" variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCollections.map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Donor {collection.donorId}</p>
                        <p className="text-xs text-muted-foreground">{collection.collectedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BloodBadge bloodType={collection.bloodType} />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(collection.status)}`}>
                        {collection.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Hospital Distribution Requests</span>
                <Button size="sm" variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributionRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Package className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{request.hospital}</p>
                        <p className="text-xs text-muted-foreground">{request.units} units • {request.requestedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BloodBadge bloodType={request.bloodType} />
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium block ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`text-xs font-semibold mt-1 ${request.priority === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
