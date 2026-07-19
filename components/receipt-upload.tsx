'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DonationRecord } from '@/lib/donation-types'
import { uploadReceipt } from '@/lib/donation-service'
import { Upload, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ReceiptUploadProps {
  donation: DonationRecord
  onUploadComplete: (updatedDonation: DonationRecord | null) => void
}

export function ReceiptUpload({ donation, onUploadComplete }: ReceiptUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload a valid image file (JPG, PNG, etc.)', variant: 'destructive' })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image size should be less than 10MB', variant: 'destructive' })
      return
    }

    setIsProcessing(true)

    // Simulate OCR processing and verification
    setTimeout(() => {
      const handleReceipt = async () => {
        try {
          const mockReceiptText = `
            Donation Receipt
            Donor: ${donation.donorName}
            Recipient: ${donation.recipientName}
            Hospital: ${donation.hospitalName}
            Blood Type: ${donation.bloodGroup}
            Units: ${donation.units}
            Date: ${new Date().toISOString().split('T')[0]}
          `

          const result = await uploadReceipt(
            donation.id,
            `/receipts/receipt-${donation.id}.pdf`,
            mockReceiptText,
            donation.city || 'Karachi'
          )

          setVerificationResult({
            success: result.success,
            message: result.message,
          })

          if (result.success && result.donation) {
            setTimeout(() => {
              onUploadComplete(result.donation || null)
            }, 200)
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Receipt verification failed'
          setVerificationResult({ success: false, message })
        } finally {
          setIsProcessing(false)
        }
      }

      void handleReceipt()
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (verificationResult?.success) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">Receipt Verified Successfully!</h3>
              <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                {verificationResult.message}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your donation certificate has been generated and is available for download in your donations history.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (verificationResult?.success === false) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">Receipt Verification Failed</h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                {verificationResult.message}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setVerificationResult(null)}
                className="bg-transparent"
              >
                Try Another Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Upload Donation Receipt Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/30 hover:border-primary/50 rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-primary/5"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />

          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Click to upload receipt image</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or other image formats. Max 10MB.</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Before uploading:</p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>✓ Receipt must clearly show donor name: <span className="font-semibold">{donation.donorName}</span></li>
            <li>✓ Receipt must show recipient name: <span className="font-semibold">{donation.recipientName}</span></li>
            <li>✓ Receipt must show hospital: <span className="font-semibold">{donation.hospitalName}</span></li>
            <li>✓ Receipt must display blood type: <span className="font-semibold">{donation.bloodGroup}</span></li>
            <li>✓ Receipt must show units: <span className="font-semibold">{donation.units}</span></li>
          </ul>
        </div>

        {/* Processing */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verifying receipt...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
