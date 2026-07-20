"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BloodBadge } from "@/components/blood-badge"
import type { Donor } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"
import { MapPin, Search, Heart, Phone, Mail, Star, Check, Clock, Lock } from "lucide-react"
import Link from "next/link"
import { useToast } from '@/hooks/use-toast'

export default function DonorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBloodGroup, setFilterBloodGroup] = useState("all")
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [donors, setDonors] = useState<Donor[]>([])
  const [databaseName, setDatabaseName] = useState("bloodnet_karachi1")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    async function loadDonors() {
      try {
        const res = await fetch('/api/donors?city=Karachi')
        const data = await res.json()
        if (data.donors) setDonors(data.donors)
        if (data.database) setDatabaseName(data.database)
      } catch (error) {
        console.error('Failed to load donors:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDonors()
  }, [])

  const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]

  // Filter donors
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchesSearch =
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.city.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBloodGroup = filterBloodGroup === "all" || donor.bloodGroup === filterBloodGroup

      return matchesSearch && matchesBloodGroup && donor.available
    })
  }, [searchTerm, filterBloodGroup])

  const handleContactDonor = (donor: Donor) => {
    const message = `Hi ${donor.name}, I would like to request blood donation of type ${donor.bloodGroup}. Please let me know your availability.`
    const normalizedPhone = donor.phone?.replace(/[^\d]/g, '')

    if (normalizedPhone) {
      const whatsappLink = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
      window.open(whatsappLink, '_blank')
      return
    }

    if (donor.email) {
      window.location.href = `mailto:${donor.email}?subject=${encodeURIComponent('Blood donation request')}&body=${encodeURIComponent(message)}`
      return
    }
    toast({ title: 'No contact details', description: 'No contact details are available for this donor yet.', variant: 'destructive' })
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-12 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Authentication Alert */}
          {!user && (
            <Card className="mb-8 border-2 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold text-lg">Sign in to Contact Donors</p>
                      <p className="text-sm text-muted-foreground">Contact information and WhatsApp numbers are only visible to authenticated users</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/login">
                      <Button variant="outline" className="bg-transparent">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-4" style={{ animationFillMode: 'both' }}>
            <h1 className="text-4xl font-bold mb-2">Find Blood Donors in Karachi</h1>
            <p className="text-lg text-muted-foreground">
              {loading ? 'Loading donors from MongoDB...' : `${filteredDonors.length} verified donors from ${databaseName} database`}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-top-4" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            {/* Search Bar */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by donor name, blood type, or area..."
                      className="pl-10 py-6"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blood Group Filter */}
            <Card>
              <CardContent className="pt-6">
                <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                  <SelectTrigger className="py-6">
                    <SelectValue placeholder="All blood types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All blood types</SelectItem>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* View Toggle */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Button
                    variant={viewType === "grid" ? "default" : "outline"}
                    className="flex-1"
                    size="sm"
                    onClick={() => setViewType("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewType === "list" ? "default" : "outline"}
                    className="flex-1"
                    size="sm"
                    onClick={() => setViewType("list")}
                  >
                    List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Counter */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredDonors.length}</span> available donors in Karachi
            </p>
            {(searchTerm || filterBloodGroup !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setFilterBloodGroup("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Donors Grid/List */}
          {filteredDonors.length > 0 ? (
            <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredDonors.map((donor, index) => (
                <Card
                  key={donor.id}
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <CardContent className={`pt-6 ${viewType === "list" ? "flex items-center justify-between gap-6" : ""}`}>
                    <div className={viewType === "list" ? "flex-1" : ""}>
                      {/* Header: Name and Blood Type */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{donor.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {donor.city} • Age {donor.age}
                          </p>
                        </div>
                        <BloodBadge bloodType={donor.bloodGroup} size="lg" />
                      </div>

                      {/* Health & Status */}
                      <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Health Score</p>
                          <p className="font-bold text-sm text-primary">{donor.health}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Donations</p>
                          <p className="font-bold text-sm">{donor.donations}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            Ready
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Last Donation:</span>
                          <span className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {donor.lastDonation}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Verification:</span>
                          <span className={`font-medium flex items-center gap-1 ${donor.verified ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            <Check className="h-3 w-3" />
                            {donor.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        {donor.email && (
                          <div className={`flex items-center gap-2 text-xs ${!user ? 'blur-sm opacity-60 pointer-events-none' : 'text-muted-foreground'}`}>
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{donor.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                      {/* Contact Button */}
                    <div className={viewType === "list" ? "flex-shrink-0" : ""}>
                      {user ? (
                        <Button
                          className="w-full gap-2"
                          onClick={() => handleContactDonor(donor)}
                        >
                          <Phone className="h-4 w-4" />
                          Contact
                        </Button>
                      ) : (
                        <Link href="/signup" className="w-full block">
                          <Button className="w-full gap-2 bg-transparent" variant="outline">
                            <Lock className="h-4 w-4" />
                            Sign Up to Contact
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No donors found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria or blood type filter</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterBloodGroup("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
