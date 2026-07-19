"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HealthScoreCard } from "@/components/health-score-card"
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function UploadReportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<null | {
    status: string
    score: number
    findings: string[]
  }>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsProcessing(true)

    // Simulate AI OCR processing
    setTimeout(() => {
      setAnalysisResult({
        status: "Healthy",
        score: 88,
        findings: [
          "Hemoglobin levels: Normal (14.5 g/dL)",
          "Blood pressure: Healthy (120/80 mmHg)",
          "No infections detected",
          "Platelet count: Normal",
        ],
      })
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Blood Report</h1>
          <p className="text-muted-foreground">Upload your blood test report for AI analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Upload Card */}
            <Card className="glass soft-shadow border-2 border-dashed border-primary/30">
              <CardHeader>
                <CardTitle>Upload Blood Report</CardTitle>
                <CardDescription>Supported formats: PDF, JPG, PNG</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="font-medium mb-1">Drag and drop your report here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  {file && <Badge className="bg-green-500/20 text-green-700">{file.name}</Badge>}
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <Button onClick={handleUpload} disabled={!file || isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing with AI OCR...
                    </>
                  ) : (
                    "Upload & Analyze"
                  )}
                </Button>

                {isProcessing && (
                  <Alert>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <AlertDescription>
                      Our AI is analyzing your blood report. This may take up to 2 minutes.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Previous Reports */}
            <Card className="glass soft-shadow">
              <CardHeader>
                <CardTitle>Previous Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Blood_Report_2024.pdf</p>
                      <p className="text-xs text-muted-foreground">Jan 10, 2024</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-700">Analyzed</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Analysis Result */}
          <div>
            {analysisResult && (
              <Card className="glass soft-shadow border border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Analysis Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <HealthScoreCard score={analysisResult.score} />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Findings:</h4>
                    {analysisResult.findings.map((finding, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{finding}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-4">View Full Report</Button>
                </CardContent>
              </Card>
            )}

            {!analysisResult && (
              <Card className="glass soft-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-sm font-medium">No report analyzed yet</p>
                    <p className="text-xs text-muted-foreground">Upload a report to see analysis results</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
