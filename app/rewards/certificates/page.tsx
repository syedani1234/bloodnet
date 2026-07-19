"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Download, Share2, Award } from "lucide-react"

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<number | null>(null)

  const certificates = [
    {
      id: 1,
      title: "Platinum Donor",
      donations: 50,
      date: "Jan 15, 2024",
      template: "platinum",
    },
    {
      id: 2,
      title: "Gold Donor",
      donations: 30,
      date: "Dec 20, 2023",
      template: "gold",
    },
    {
      id: 3,
      title: "Silver Donor",
      donations: 10,
      date: "Nov 10, 2023",
      template: "silver",
    },
    {
      id: 4,
      title: "Blood Hero - Emergency Response",
      donations: 1,
      date: "Oct 5, 2023",
      template: "hero",
    },
  ]

  const getCertColor = (template: string) => {
    const colors = {
      platinum: "from-slate-400 to-slate-600",
      gold: "from-yellow-400 to-yellow-600",
      silver: "from-gray-300 to-gray-400",
      hero: "from-red-400 to-red-600",
    }
    return colors[template as keyof typeof colors]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Certificates & Achievements</h1>
          <p className="text-muted-foreground">Your donation milestones and certificates</p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className={`glass soft-shadow cursor-pointer transition-all ${selectedCert === cert.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedCert(cert.id)}
            >
              <CardContent className="p-6">
                <div
                  className={`bg-gradient-to-br ${getCertColor(cert.template)} rounded-lg p-8 mb-4 text-white text-center h-48 flex flex-col items-center justify-center space-y-3`}
                >
                  <Award className="w-12 h-12" />
                  <h3 className="text-2xl font-bold">{cert.title}</h3>
                  <p className="text-sm opacity-90">{cert.donations} Donations</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Issued: {cert.date}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Large Certificate Display */}
        {selectedCert && (
          <Card className="glass soft-shadow">
            <CardHeader>
              <CardTitle>Certificate Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-lg p-12 text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                    Certificate of Achievement
                  </p>
                  <h2 className="text-4xl font-bold text-primary">
                    {certificates.find((c) => c.id === selectedCert)?.title}
                  </h2>
                </div>

                <div className="flex justify-center">
                  <Trophy className="w-16 h-16 text-primary" />
                </div>

                <div className="space-y-2 text-muted-foreground">
                  <p>This is to certify that</p>
                  <p className="text-xl font-semibold text-foreground">John Doe</p>
                  <p>has successfully completed</p>
                  <p className="text-lg font-semibold text-foreground">
                    {certificates.find((c) => c.id === selectedCert)?.donations} Blood Donations
                  </p>
                  <p>and has made a significant contribution to saving lives.</p>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground">
                    Issued: {certificates.find((c) => c.id === selectedCert)?.date}
                  </p>
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <Button size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download Certificate
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Achievement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
