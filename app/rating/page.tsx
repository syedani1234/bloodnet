"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle } from "lucide-react"

export default function RatingPage() {
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState("")

  const donorInfo = {
    name: "Alice Johnson",
    bloodType: "O+",
    amount: "450 mL",
    date: "Nov 22, 2024",
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center py-8">
          <Card className="glass soft-shadow max-w-md w-full mx-4 border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Rating Submitted</h2>
                <p className="text-muted-foreground">
                  Thank you for rating the donor. Your feedback helps maintain quality.
                </p>
                <Button className="w-full" onClick={() => (window.location.href = "/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Rate Your Donation Experience</h1>
            <p className="text-muted-foreground">Help us improve by rating the donor and your experience</p>
          </div>

          <Card className="glass soft-shadow">
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donor Info */}
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">Donor Name</p>
                <p className="font-semibold text-lg">{donorInfo.name}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Blood Type</p>
                    <Badge className="mt-1 bg-primary/20 text-primary">{donorInfo.bloodType}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">{donorInfo.amount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{donorInfo.date}</p>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-3">How would you rate this donor?</p>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {rating === 5 && "Excellent donation experience!"}
                      {rating === 4 && "Good donation experience"}
                      {rating === 3 && "Average donation experience"}
                      {rating === 2 && "Could be improved"}
                      {rating === 1 && "Needs significant improvement"}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Feedback */}
              <div className="space-y-2">
                <label className="font-semibold">Additional Feedback (Optional)</label>
                <Textarea
                  placeholder="Share any additional comments about your experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <Button className="w-full" onClick={() => setSubmitted(true)} disabled={rating === 0}>
                Submit Rating
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
