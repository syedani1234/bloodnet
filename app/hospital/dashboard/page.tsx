"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/stat-card"
import { AlertTriangle, Droplet, Users, TrendingUp, Zap } from "lucide-react"

export default function HospitalDashboard() {
  const emergencyRequests = [
    {
      id: 1,
      bloodType: "O+",
      quantity: "2 units",
      urgency: "Critical",
      time: "10 minutes ago",
      location: "City General Hospital",
    },
    {
      id: 2,
      bloodType: "A+",
      quantity: "1 unit",
      urgency: "Urgent",
      time: "25 minutes ago",
      location: "Memorial Hospital",
    },
    {
      id: 3,
      bloodType: "B-",
      quantity: "4 units",
      urgency: "Critical",
      time: "45 minutes ago",
      location: "St. Mary's Medical Center",
    },
  ]

  const inventory = [
    { type: "O+", units: 12, critical: false },
    { type: "O-", units: 3, critical: true },
    { type: "A+", units: 8, critical: false },
    { type: "A-", units: 2, critical: true },
    { type: "B+", units: 5, critical: false },
    { type: "B-", units: 1, critical: true },
    { type: "AB+", units: 4, critical: false },
    { type: "AB-", units: 0, critical: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hospital Dashboard</h1>
          <p className="text-muted-foreground">Manage blood inventory and emergency requests</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Active Requests"
            value="12"
            icon={<AlertTriangle className="w-6 h-6" />}
            trend={{ value: 15, positive: true }}
          />
          <StatCard
            label="Total Donors"
            value="2,450"
            icon={<Users className="w-6 h-6" />}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            label="Blood Units Available"
            value="156"
            icon={<Droplet className="w-6 h-6" />}
            trend={{ value: 5, positive: false }}
          />
          <StatCard
            label="Match Success Rate"
            value="94%"
            icon={<TrendingUp className="w-6 h-6" />}
            trend={{ value: 3, positive: true }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button size="lg" className="gap-2">
            <Zap className="w-5 h-5" />
            Trigger Emergency Alert
          </Button>
          <Button size="lg" variant="outline" className="gap-2 bg-transparent">
            <Droplet className="w-5 h-5" />
            Request Blood Supply
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Emergency Requests */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Active Emergency Requests</h2>
            {emergencyRequests.map((request) => (
              <Card key={request.id} className="glass soft-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{request.bloodType}</h3>
                      <p className="text-sm text-muted-foreground">{request.location}</p>
                    </div>
                    <Badge
                      className={
                        request.urgency === "Critical"
                          ? "bg-red-500/20 text-red-700"
                          : "bg-yellow-500/20 text-yellow-700"
                      }
                    >
                      {request.urgency}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium">{request.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-medium">{request.time}</p>
                    </div>
                    <div className="text-right">
                      <Button size="sm">Match Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Blood Inventory */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Blood Inventory Status</h2>
            <Card className="glass soft-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {inventory.map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.type}</span>
                        {item.critical && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${item.critical ? "text-red-600" : "text-green-600"}`}>{item.units}</p>
                        <p className="text-xs text-muted-foreground">units</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Update Inventory</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Quick Match */}
        <Card className="glass soft-shadow mt-8 bg-primary/5 border border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Quick Match
            </CardTitle>
            <CardDescription>AI-powered donor matching algorithm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI system analyzes 12 emergency requests and found 87 compatible donors within 10 km radius. Click
              below to view recommended matches.
            </p>
            <Button>View AI Recommendations</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
