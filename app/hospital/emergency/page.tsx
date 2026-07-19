"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, MapPin } from "lucide-react"

export default function EmergencyFlagPage() {
  const [bloodType, setBloodType] = useState("O+")
  const [quantity, setQuantity] = useState("2 units")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const matchedDonors = [
    { name: "John Doe", distance: "0.5 km", rating: 4.9, status: "Available Now" },
    { name: "Jane Smith", distance: "1.2 km", rating: 4.8, status: "Available Now" },
    { name: "Bob Wilson", distance: "2.1 km", rating: 4.7, status: "Available in 15 min" },
    { name: "Carol Brown", distance: "3.4 km", rating: 4.6, status: "Available in 30 min" },
    { name: "David Lee", distance: "4.2 km", rating: 4.5, status: "Available in 45 min" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h1 className="text-3xl font-bold">Emergency Blood Alert</h1>
          </div>
          <p className="text-muted-foreground">Trigger emergency alert to notify nearby donors and hospitals</p>
        </div>

        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Triggering an emergency alert will immediately notify all nearby donors and hospitals in your region.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert Form */}
          <div className="lg:col-span-2">
            <Card className="glass soft-shadow">
              <CardHeader>
                <CardTitle>Required Blood</CardTitle>
                <CardDescription>Select the blood type and quantity needed</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Blood Type Selection */}
                  <div className="space-y-3">
                    <Label>Select Blood Type</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={bloodType === type ? "default" : "outline"}
                          onClick={() => setBloodType(type)}
                          className="w-full"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div className="space-y-3">
                    <Label>Quantity Needed</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["1 unit (450 mL)", "2 units (900 mL)", "4 units (1800 mL)", "6 units (2700 mL)"].map((q) => (
                        <Button
                          key={q}
                          type="button"
                          variant={quantity === q ? "default" : "outline"}
                          onClick={() => setQuantity(q)}
                          className="w-full justify-start"
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Hospital Details */}
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital Name</Label>
                    <Input id="hospital" placeholder="City General Hospital" />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <Label htmlFor="contact">Hospital Contact Number</Label>
                    <Input id="contact" placeholder="+1 (555) 123-4567" />
                  </div>

                  {/* Trigger Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => setIsSubmitted(true)}
                  >
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Trigger Emergency Alert
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <div>
            <Card className="glass soft-shadow sticky top-8">
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Type:</span>
                    <Badge className="bg-primary/20 text-primary">{bloodType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge className="bg-red-500/20 text-red-700">Critical</Badge>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-2">When triggered, alert will be sent to:</p>
                  <ul className="text-xs space-y-1">
                    <li>✓ {matchedDonors.length} nearby donors</li>
                    <li>✓ 8 blood banks</li>
                    <li>✓ 5 nearby hospitals</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Matched Donors */}
        {isSubmitted && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Nearest Matching Donors</h2>
            <div className="space-y-3">
              {matchedDonors.map((donor, idx) => (
                <Card key={idx} className="glass soft-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{donor.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {donor.distance}
                          </span>
                          <span>★ {donor.rating}</span>
                          <Badge className="bg-green-500/20 text-green-700">{donor.status}</Badge>
                        </div>
                      </div>
                      <Button>Contact</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
