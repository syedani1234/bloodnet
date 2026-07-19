"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BloodBadge } from "@/components/blood-badge"
import { MapPin, Heart, Activity, Calendar, Phone, Mail, Star, Award } from "lucide-react"

interface DonorDetailModalProps {
  isOpen: boolean
  donor: {
    id: string
    name: string
    bloodGroup: string
    city: string
    lastDonation: string
    verified: boolean
    successfulDonations: number
    lat: number
    lng: number
    age?: number
    email?: string
    phone?: string
    healthStatus?: string
    hemoglobin?: string
    whiteBloodCells?: string
    platelets?: string
    distance?: number
    rating?: number
  } | null
  onClose: () => void
  onContact: (donorId: string) => void
}

export function DonorDetailModal({ isOpen, donor, onClose, onContact }: DonorDetailModalProps) {
  if (!donor) return null

  const healthScore = Math.min(95, 60 + donor.successfulDonations * 3)
  const distanceText = donor.distance ? `${(donor.distance * 0.621371).toFixed(1)} km away` : "Location nearby"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{donor.name}</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                <span className="flex items-center gap-2 text-foreground mt-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {donor.city} • {distanceText}
                </span>
              </DialogDescription>
            </div>
            <BloodBadge bloodType={donor.bloodGroup} size="lg" />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                <p className="text-2xl font-bold text-primary">{healthScore}/100</p>
                <div className="w-full bg-muted h-1 rounded-full mt-2">
                  <div
                    className="h-1 bg-primary rounded-full transition-all"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-1">Donations</p>
                <p className="text-2xl font-bold text-green-600">{donor.successfulDonations}</p>
                <p className="text-xs text-muted-foreground mt-2">Verified donations</p>
              </CardContent>
            </Card>
          </div>

          {/* Verification Badge */}
          {donor.verified && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">Verified & Certified Donor</span>
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Age</p>
                <p className="font-medium">{donor.age || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Donation</p>
                <p className="font-medium">{donor.lastDonation}</p>
              </div>
              {donor.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{donor.phone}</p>
                </div>
              )}
              {donor.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{donor.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Health Data */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Health Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Hemoglobin Level</p>
                </div>
                <p className="font-semibold text-lg">{donor.hemoglobin || "14.5 g/dL"}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Health Status</p>
                </div>
                <p className="font-semibold text-green-600">{donor.healthStatus || "Excellent"}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">White Blood Cells</p>
                <p className="font-semibold">{donor.whiteBloodCells || "7.2 K/µL"}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Platelets</p>
                <p className="font-semibold">{donor.platelets || "250 K/µL"}</p>
              </div>
            </div>
          </div>

          {/* Donor Rating */}
          {donor.rating && (
            <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{donor.rating.toFixed(1)}/5.0</span>
              <span className="text-sm text-muted-foreground">Community Rating</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={() => onContact(donor.id)}>
              Contact Donor
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DonorDetailModal
