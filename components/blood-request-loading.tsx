'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Heart } from 'lucide-react'

export function BloodRequestLoadingAnimation() {
  const [step, setStep] = useState(0)

  const steps = [
    { text: 'Searching nearby donors...', icon: '🔍' },
    { text: 'Matching blood groups...', icon: '🩸' },
    { text: 'Finding eligible donors...', icon: '✓' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-12 space-y-8">
          {/* Animated Heart */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Finding Donors</h2>
            <div className="h-16 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-primary">{steps[step].icon}</p>
                <p className="text-muted-foreground mt-2">{steps[step].text}</p>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Loading Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full animate-pulse"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
                transition: 'width 1s ease-in-out',
              }}
            />
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This usually takes a few seconds. Please wait...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
