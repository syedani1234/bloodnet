"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Upload, Check } from "lucide-react"

interface ExtractedData {
  bloodGroup?: string
  hemoglobin?: string
  whiteBloodCells?: string
  platelets?: string
  redBloodCells?: string
  healthStatus?: string
  testDate?: string
}

interface OCRBloodTestReaderProps {
  onDataExtracted?: (data: ExtractedData) => void
}

export function OCRBloodTestReader({ onDataExtracted }: OCRBloodTestReaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setSelectedFile(file)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const extractBloodData = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      // Simulate OCR processing with mock data
      // In production, integrate with Tesseract.js or cloud OCR API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted data based on image analysis
      const mockData: ExtractedData = {
        bloodGroup: "A-",
        hemoglobin: "14.5 g/dL",
        whiteBloodCells: "7.2 K/µL",
        platelets: "250 K/µL",
        redBloodCells: "4.8 M/µL",
        healthStatus: "Healthy",
        testDate: new Date().toISOString().split("T")[0],
      }

      setExtractedData(mockData)
      if (onDataExtracted) {
        onDataExtracted(mockData)
      }
    } catch (err) {
      setError("Failed to process image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Blood Test Report OCR
        </CardTitle>
        <CardDescription>Upload your blood test report to auto-fill your health data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Upload Test Report Image</label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="blood-test-upload"
            />
            <label htmlFor="blood-test-upload" className="cursor-pointer block">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
            </label>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Preview</label>
            <div className="border border-border rounded-lg overflow-hidden">
              <img src={preview || "/placeholder.svg"} alt="Blood test preview" className="w-full h-auto max-h-48 object-cover" />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Extract Button */}
        {selectedFile && !extractedData && (
          <Button
            onClick={extractBloodData}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "Processing Image..." : "Extract Blood Data"}
          </Button>
        )}

        {/* Extracted Data Display */}
        {extractedData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900 dark:text-green-100">Data extracted successfully!</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Blood Group</p>
                <p className="font-bold text-lg text-primary">{extractedData.bloodGroup}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Health Status</p>
                <p className="font-semibold text-green-600">{extractedData.healthStatus}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Hemoglobin</p>
                <p className="font-medium">{extractedData.hemoglobin}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Test Date</p>
                <p className="font-medium">{extractedData.testDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">WBC</p>
                <p className="font-medium">{extractedData.whiteBloodCells}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Platelets</p>
                <p className="font-medium">{extractedData.platelets}</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setExtractedData(null)
                setSelectedFile(null)
                setPreview(null)
              }}
              className="w-full"
            >
              Upload Another Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
