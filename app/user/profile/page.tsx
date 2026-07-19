"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HealthScoreCard } from "@/components/health-score-card"
import { Heart, Shield, Edit2, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    bloodType: "O+",
    city: "San Francisco, CA",
    address: "123 Main St",
  })

  const handleSave = () => {
    setIsEditing(false)
  }

  const donations = [
    { date: "2024-01-15", amount: "450 mL", status: "Completed" },
    { date: "2023-12-20", amount: "450 mL", status: "Completed" },
    { date: "2023-11-10", amount: "450 mL", status: "Completed" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and donation history</p>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass soft-shadow md:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{formData.name}</h3>
                  <Badge className="mt-2 bg-blue-500/20 text-blue-700">Active Donor</Badge>
                </div>
                <div className="flex items-center justify-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">5.0 (24 ratings)</p>
              </div>
            </CardContent>
          </Card>

          <HealthScoreCard score={92} lastUpdated="2024-01-10" />

          <Card className="glass soft-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>
                    Blood Type: <strong>{formData.bloodType}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Verified Donor</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Medical Cleared</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass soft-shadow">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-muted-foreground">Total Donations</p>
                <p className="text-xs text-muted-foreground">10,800 mL saved</p>
                <Badge className="mt-2 bg-green-500/20 text-green-700">Lives Impacted: 72</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="donations">Donation History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal">
            <Card className="glass soft-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                >
                  {isEditing ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                      <Badge className="bg-green-500/20 text-green-700 self-center">Verified</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input id="bloodType" value={formData.bloodType} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donation History */}
          <TabsContent value="donations">
            <Card className="glass soft-shadow">
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>Your past blood donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {donations.map((donation, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{donation.date}</p>
                        <p className="text-sm text-muted-foreground">{donation.amount}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700">{donation.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="glass soft-shadow">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Control how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span>Email notifications for blood requests</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span>SMS alerts for emergency requests</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span>Marketing emails</span>
                </label>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
