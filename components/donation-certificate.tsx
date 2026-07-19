'use client'

import { DonationRecord } from '@/lib/donation-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Award } from 'lucide-react'

interface DonationCertificateProps {
  donation: DonationRecord
}

export function DonationCertificate({ donation }: DonationCertificateProps) {
  if (!donation.certificateGenerated) {
    return null
  }

  const serverCertificateUrl = donation.certificateUrl
    ? `/api/donations/${donation.id}/certificate?city=${encodeURIComponent(donation.city || 'Karachi')}`
    : null

  const downloadCertificatePDF = () => {
    if (serverCertificateUrl) {
      window.open(serverCertificateUrl, '_blank', 'noopener')
      return
    }

    // Create a simple PDF-like certificate using HTML canvas
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 900
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Background
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, 1200, 900)

    // Decorative border
    ctx.strokeStyle = '#c41e3a'
    ctx.lineWidth = 8
    ctx.strokeRect(20, 20, 1160, 860)

    ctx.strokeStyle = '#c41e3a'
    ctx.lineWidth = 3
    ctx.strokeRect(35, 35, 1130, 830)

    // Title
    ctx.fillStyle = '#c41e3a'
    ctx.font = 'bold 48px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('BLOOD DONATION CERTIFICATE', 600, 120)

    // Subtitle
    ctx.fillStyle = '#333'
    ctx.font = '24px Georgia, serif'
    ctx.fillText('Certificate of Recognition', 600, 170)

    // Divider line
    ctx.strokeStyle = '#c41e3a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(200, 200)
    ctx.lineTo(1000, 200)
    ctx.stroke()

    // Main text
    ctx.fillStyle = '#333'
    ctx.font = '20px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('This is to certify that', 600, 280)

    // Donor name
    ctx.font = 'bold 32px Georgia, serif'
    ctx.fillStyle = '#c41e3a'
    ctx.fillText(donation.donorName.toUpperCase(), 600, 360)

    // Description
    ctx.fillStyle = '#333'
    ctx.font = '18px Georgia, serif'
    ctx.fillText('has selflessly donated blood to save lives', 600, 420)

    // Details section
    ctx.font = '16px Arial'
    ctx.textAlign = 'left'
    let yPos = 520

    const details = [
      `Blood Type: ${donation.bloodGroup}`,
      `Volume: ${donation.units} Unit(s)`,
      `Hospital: ${donation.hospitalName}`,
      `Recipient: ${donation.recipientName}`,
      `Date: ${donation.donationDate || new Date().toISOString().split('T')[0]}`,
    ]

    details.forEach((detail) => {
      ctx.fillStyle = '#333'
      ctx.fillText(detail, 150, yPos)
      yPos += 40
    })

    // Impact message
    ctx.textAlign = 'center'
    ctx.fillStyle = '#c41e3a'
    ctx.font = 'bold 18px Arial'
    ctx.fillText('One donation can save up to 3 lives', 600, 780)

    // Footer
    ctx.fillStyle = '#666'
    ctx.font = '12px Arial'
    ctx.fillText(`Certificate ID: ${donation.certificateId}`, 600, 820)
    ctx.fillText('Certified by BloodNet - Connecting Lives, Saving Hearts', 600, 845)

    // Convert canvas to image and download as PNG (simplified PDF)
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Blood-Donation-Certificate-${donation.certificateId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Certificate Header */}
          <div className="text-center space-y-2 border-b-2 border-dashed border-primary/30 pb-4">
            <div className="flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-primary">Blood Donation Certificate</h3>
              <Award className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Certificate ID: {donation.certificateId}</p>
          </div>

          {/* Certificate Details */}
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Donor Name</p>
                <p className="font-bold text-sm">{donation.donorName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Blood Type</p>
                <p className="font-bold text-sm text-primary text-lg">{donation.bloodGroup}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volume Donated</p>
                <p className="font-bold text-sm">{donation.units} Unit(s)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date of Donation</p>
                <p className="font-bold text-sm">{donation.donationDate || new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Hospital/Center</p>
                <p className="font-bold text-sm">{donation.hospitalName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Recipient</p>
                <p className="font-bold text-sm">{donation.recipientName}</p>
              </div>
            </div>
          </div>

          {/* Impact Message */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 rounded-lg text-center">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
              Impact: 1 Donation = Up to 3 Lives Saved
            </p>
            <p className="text-xs text-green-800 dark:text-green-200">
              Your selfless contribution is making a real difference in the community.
            </p>
          </div>

          {/* Download Button */}
          <Button
            onClick={downloadCertificatePDF}
            className="w-full gap-2"
            variant="default"
          >
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>

          {/* Certification Message */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-center">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              This certificate is officially issued by BloodNet and certified by our donation verification system.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
