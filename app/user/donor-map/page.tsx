"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Search, Shield, Star, Calendar, Phone, Mail, History, Award } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DonorMapPage() {
  const [selectedDonor, setSelectedDonor] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("map")

  const donors = [
    {
      id: 1,
      name: "Alice Johnson",
      bloodType: "O+",
      distance: "0.5 km away",
      rating: 4.9,
      reviews: 45,
      verified: true,
      location: "Downtown District",
      lat: 40.7484,
      lng: -73.9857,
      phone: "+1 (555) 123-4567",
      email: "alice.j@email.com",
      donationHistory: [
        { date: "2024-12-01", hospital: "City General Hospital", units: 1 },
        { date: "2024-09-15", hospital: "Metro Medical Center", units: 1 },
        { date: "2024-06-20", hospital: "Downtown Clinic", units: 2 },
      ],
      totalDonations: 12,
      lastDonation: "2024-12-01",
      healthScore: 95,
      badges: ["Super Donor", "Verified", "First Responder"],
    },
    {
      id: 2,
      name: "Bob Wilson",
      bloodType: "A+",
      distance: "1.2 km away",
      rating: 4.8,
      reviews: 32,
      verified: true,
      location: "Tech Park",
      lat: 40.7589,
      lng: -73.9851,
      phone: "+1 (555) 234-5678",
      email: "bob.w@email.com",
      donationHistory: [
        { date: "2024-11-20", hospital: "Tech Park Medical", units: 1 },
        { date: "2024-08-10", hospital: "City General Hospital", units: 1 },
      ],
      totalDonations: 8,
      lastDonation: "2024-11-20",
      healthScore: 92,
      badges: ["Verified", "Regular Donor"],
    },
    {
      id: 3,
      name: "Carol Smith",
      bloodType: "B+",
      distance: "2.1 km away",
      rating: 4.7,
      reviews: 28,
      verified: true,
      location: "Riverside",
      lat: 40.7489,
      lng: -73.968,
      phone: "+1 (555) 345-6789",
      email: "carol.s@email.com",
      donationHistory: [{ date: "2024-10-05", hospital: "Riverside Hospital", units: 1 }],
      totalDonations: 6,
      lastDonation: "2024-10-05",
      healthScore: 88,
      badges: ["Verified"],
    },
    {
      id: 4,
      name: "David Brown",
      bloodType: "AB+",
      distance: "3.4 km away",
      rating: 4.6,
      reviews: 19,
      verified: false,
      location: "North End",
      lat: 40.7689,
      lng: -73.983,
      phone: "+1 (555) 456-7890",
      email: "david.b@email.com",
      donationHistory: [{ date: "2024-09-01", hospital: "North End Clinic", units: 1 }],
      totalDonations: 3,
      lastDonation: "2024-09-01",
      healthScore: 85,
      badges: ["New Donor"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Nearby Donors</h1>
          <p className="text-muted-foreground">AI-ranked donors based on compatibility and availability</p>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name or blood type..." className="pl-9" />
          </div>
          <select className="px-4 py-2 border border-border rounded-lg bg-card">
            <option>All Blood Types</option>
            <option>O+</option>
            <option>A+</option>
            <option>B+</option>
            <option>AB+</option>
          </select>
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode("map")}
              variant={viewMode === "map" ? "default" : "outline"}
              className="flex-1"
            >
              Map View
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "outline"}
              className="flex-1"
            >
              List View
            </Button>
          </div>
        </div>

        {viewMode === "map" && (
          <Card className="glass soft-shadow mb-8 h-[500px] overflow-hidden">
            <CardContent className="p-0 h-full relative">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10">
                {/* Simple coordinate grid to simulate map */}
                <div className="relative h-full w-full">
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-border" />
                    ))}
                  </div>

                  {/* Donor Markers */}
                  {donors.map((donor, index) => {
                    const left = 20 + index * 18
                    const top = 30 + (index % 2) * 20
                    return (
                      <button
                        key={donor.id}
                        onClick={() => setSelectedDonor(donor)}
                        className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                        style={{ left: `${left}%`, top: `${top}%` }}
                      >
                        {/* Pulse effect */}
                        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

                        {/* Marker pin */}
                        <div className="relative">
                          <MapPin className="w-10 h-10 text-primary drop-shadow-lg fill-primary" strokeWidth={1.5} />
                          {donor.verified && (
                            <Shield className="absolute top-0 right-0 w-4 h-4 text-green-500 fill-green-500" />
                          )}
                        </div>

                        {/* Hover tooltip */}
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          <p className="font-semibold text-sm">{donor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {donor.bloodType} • {donor.distance}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg">
                <p className="text-xs font-semibold mb-2">Legend</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary fill-primary" />
                    <span>Available Donor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500 fill-green-500" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              {/* Map Info */}
              <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
                <p className="text-sm font-semibold mb-1">Click on markers to view donor details</p>
                <p className="text-xs text-muted-foreground">Showing {donors.length} nearby donors</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Donor List */}
        {viewMode === "list" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">AI-Ranked Matches</h2>
            <div className="grid gap-4">
              {donors.map((donor) => (
                <Card
                  key={donor.id}
                  className="glass soft-shadow hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedDonor(donor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{donor.name}</h3>
                          {donor.verified && <Shield className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="text-xs font-medium mb-1">Blood Type</p>
                            <Badge className="bg-primary/20 text-primary">{donor.bloodType}</Badge>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">Location</p>
                            <p>{donor.location}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">Distance</p>
                            <p>{donor.distance}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">Rating</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(donor.rating)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                              <span className="text-xs ml-1">({donor.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="ml-4">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedDonor} onOpenChange={() => setSelectedDonor(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedDonor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  {selectedDonor.name}
                  {selectedDonor.verified && <Shield className="w-5 h-5 text-green-500" />}
                </DialogTitle>
                <DialogDescription>
                  {selectedDonor.location} • {selectedDonor.distance}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedDonor.bloodType}</p>
                      <p className="text-xs text-muted-foreground">Blood Type</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{selectedDonor.totalDonations}</p>
                      <p className="text-xs text-muted-foreground">Total Donations</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{selectedDonor.healthScore}</p>
                      <p className="text-xs text-muted-foreground">Health Score</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <p className="text-2xl font-bold">{selectedDonor.rating}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedDonor.reviews} Reviews</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Badges */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Achievements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDonor.badges.map((badge: string) => (
                      <Badge key={badge} variant="outline" className="bg-primary/10">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedDonor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedDonor.email}</span>
                    </div>
                  </div>
                </div>

                {/* Donation History */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Donation History
                  </h4>
                  <div className="space-y-3">
                    {selectedDonor.donationHistory.map((donation: any, index: number) => (
                      <Card key={index} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{donation.hospital}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(donation.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {donation.units} {donation.units === 1 ? "unit" : "units"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Last donation: {new Date(selectedDonor.lastDonation).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1">Send Message</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Request Donation
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
