"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, CheckCircle } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    setTimeout(() => {
      setIsVerified(true)
      setIsVerifying(false)
    }, 1000)
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="w-full max-w-md px-4">
          <Card className="glass soft-shadow border border-primary/10">
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Verification Successful!</h2>
                <p className="text-muted-foreground">Your account has been verified. You can now log in.</p>
                <Button onClick={() => router.push("/login")} className="w-full mt-4">
                  Continue to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">BloodNet</h1>
          <p className="text-muted-foreground mt-2">Verify Your Email</p>
        </div>

        <Card className="glass soft-shadow border border-primary/10">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>Enter the code sent to your email address</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={isVerifying}
                  className="text-center text-2xl letter-spacing tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground text-center">Check your email for the verification code</p>
              </div>

              <Button type="submit" className="w-full" disabled={isVerifying || code.length !== 6}>
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Didn't receive a code?{" "}
                <button type="button" className="text-primary hover:underline font-medium">
                  Resend
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
