"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, MapPin, Phone, Clock } from "lucide-react"

export default function EmergencyRequestPage() {
  const [urgency, setUrgency] = useState(80)
  const [formData, setFormData] = useState({
    bloodType: "O+",
    quantity: "2 units",
    hospital: "City General Hospital",
    reason: "Post-surgical support",
    patientName: "John Doe",
    doctorPhone: "+1 (555) 123-4567",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const getUrgencyColor = () => {
    if (urgency > 80) return "bg-red-500/20 text-red-700"
    if (urgency > 50) return "bg-yellow-500/20 text-yellow-700"
    return "bg-green-500/20 text-green-700"
  }

  const getUrgencyLabel = () => {
    if (urgency > 80) return "Critical"
    if (urgency > 50) return "Urgent"
    return "Standard"
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass soft-shadow max-w-md w-full mx-4">
          <CardContent className="pt-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Request Submitted!</h2>
              <p className="text-muted-foreground">
                Your emergency blood request has been broadcast. Nearby donors and hospitals have been notified.
              </p>
              <div className="space-y-2 text-sm bg-muted p-4 rounded-lg">
                <p>
                  <strong>Request ID:</strong> BR-2024-001234
                </p>
                <p>
                  <strong>Status:</strong> Active Search
                </p>
                <p>
                  <strong>Estimated Time:</strong> 30-45 minutes
                </p>
              </div>
              <Button className="w-full">Track Request</Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h1 className="text-3xl font-bold">Emergency Blood Request</h1>
          </div>
          <p className="text-muted-foreground">Submit an urgent blood request to notify nearby donors and hospitals</p>
        </div>

        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Emergency requests are prioritized. A notification will be sent to all nearby donors and hospitals.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <Card className="glass soft-shadow">
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>Provide information about the blood needed</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Blood Type & Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type Required</Label>
                      <select
                        id="bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                      >
                        <option>O+</option>
                        <option>O-</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Needed</Label>
                      <select
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                      >
                        <option>1 unit (450 mL)</option>
                        <option>2 units (900 mL)</option>
                        <option>4 units (1800 mL)</option>
                        <option>6 units (2700 mL)</option>
                      </select>
                    </div>
                  </div>

                  {/* Hospital & Reason */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital/Medical Facility</Label>
                      <Input
                        id="hospital"
                        value={formData.hospital}
                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Medical Reason</Label>
                      <Input
                        id="reason"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Patient & Doctor Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorPhone">Doctor's Contact</Label>
                      <Input
                        id="doctorPhone"
                        value={formData.doctorPhone}
                        onChange={(e) => setFormData({ ...formData, doctorPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Urgency Slider */}
                  <div className="space-y-3">
                    <Label>Urgency Level</Label>
                    <Slider
                      value={[urgency]}
                      onValueChange={(value) => setUrgency(value[0])}
                      min={20}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center">
                      <Badge className={getUrgencyColor()}>{getUrgencyLabel()}</Badge>
                      <span className="text-sm text-muted-foreground">{urgency}% urgency</span>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional medical information or special requirements..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Emergency Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            <Card className="glass soft-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Auto-Geolocation</p>
                      <p className="text-xs text-muted-foreground">Your location will be shared with nearby donors</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Response Time</p>
                      <p className="text-xs text-muted-foreground">Expect responses within 15-30 minutes</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Direct Contact</p>
                      <p className="text-xs text-muted-foreground">Donors will contact you directly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass soft-shadow bg-primary/5 border border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm font-medium mb-2">Emergency Hotline</p>
                <p className="text-2xl font-bold text-primary font-mono">+1 (800) BLOOD-NET</p>
                <p className="text-xs text-muted-foreground mt-2">24/7 emergency support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
