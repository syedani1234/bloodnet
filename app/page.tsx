"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Zap, Shield, MapPin, Activity, Users, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [donors, setDonors] = useState(0)
  const [livesSaved, setLivesSaved] = useState(0)

  useEffect(() => {
    // Animate donors counter from 1000 to 50000
    const donorInterval = setInterval(() => {
      setDonors((prev) => {
        if (prev < 50000) {
          return prev + Math.random() * 3000
        }
        return 50000
      })
    }, 50)

    // Animate lives saved counter from 100 to 10000
    const livesInterval = setInterval(() => {
      setLivesSaved((prev) => {
        if (prev < 10000) {
          return prev + Math.random() * 600
        }
        return 10000
      })
    }, 50)

    return () => {
      clearInterval(donorInterval)
      clearInterval(livesInterval)
    }
  }, [])
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description:
        "Advanced algorithm matches donors with recipients instantly based on blood type, location, and availability",
      image: "🤖",
    },
    {
      icon: Shield,
      title: "100% Verified & Safe",
      description: "All donors undergo rigorous health screening and background verification for your safety",
      image: "🛡️",
    },
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description: "Track blood requests, donor locations, and delivery status in real-time on interactive maps",
      image: "🗺️",
    },
    {
      icon: Activity,
      title: "Health Score System",
      description: "Dynamic health scoring helps identify the healthiest and most compatible donors instantly",
      image: "📊",
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Join 50,000+ active donors and recipients in a trusted community saving lives daily",
      image: "👥",
    },
    {
      icon: Clock,
      title: "24/7 Emergency Support",
      description: "Round-the-clock emergency alert system ensures critical requests get immediate attention",
      image: "⏰",
    },
  ]

  const steps = [
    {
      number: "1",
      title: "Quick Registration",
      description: "Create your account in under 2 minutes with basic info and blood type",
    },
    {
      number: "2",
      title: "AI Matching",
      description: "Our smart algorithm instantly finds the best matches based on multiple factors",
    },
    {
      number: "3",
      title: "Connect & Save Lives",
      description: "Communicate securely and coordinate donations through our verified platform",
    },
  ]

  const testimonials = [
    {
      name: "Dr. Ahmed Khan",
      role: "Hospital Director, Aga Khan Hospital",
      text: "BloodNet transformed our emergency blood request process. We can now reach verified donors within minutes instead of hours.",
      rating: 5,
    },
    {
      name: "Dr. Fatima Ali",
      role: "Chief of Hematology, Sindh Medical College",
      text: "The AI-powered matching system is incredibly accurate. It has significantly improved our blood inventory management and saved countless lives.",
      rating: 5,
    },
    {
      name: "Muhammad Hassan",
      role: "Regular Donor",
      text: "Love the platform! Easy to use, secure, and the rewards system motivates me to donate regularly. I've saved 12 lives and counting!",
      rating: 5,
    },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-20 sm:py-32">
              <div className="text-center space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
                  <Heart className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Connecting lives since 2025</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
                  Save Lives with
                  <span className="text-primary"> AI-Powered</span>
                  <br />
                  Blood Donation
                </h1>

                <p className="mx-auto max-w-3xl text-lg sm:text-xl text-muted-foreground text-balance leading-relaxed">
                  BloodNet connects blood donors and recipients in real-time using advanced AI matching. Whether you
                  need blood urgently or want to donate, we make it fast, safe, and rewarding.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link href="/register-donor">
                    <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 h-auto">
                      Become a Donor
                      <Heart className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/request-blood">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto text-base px-8 py-6 h-auto border-primary/50 bg-transparent"
                    >
                      Request Blood Now
                    </Button>
                  </Link>
                </div>

                <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <Card className="glass border-primary/20">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">{Math.floor(donors).toLocaleString()}+</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Verified Donors</p>
                    </CardContent>
                  </Card>
                  <Card className="glass border-primary/20">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">{Math.floor(livesSaved).toLocaleString()}+</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Lives Saved</p>
                    </CardContent>
                  </Card>
                  <Card className="glass border-primary/20">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">24/7</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Emergency Support</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-b border-border py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">Why Choose BloodNet?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built with cutting-edge technology to make blood donation seamless and life-saving
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={feature.title}
                    className="group glass hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    <CardContent className="p-8">
                      <div className="mb-6 text-5xl animate-bounce" style={{ animationDelay: `${index * 100}ms` }}>
                        {feature.image}
                      </div>
                      <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-b border-border py-20 sm:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Three simple steps to start saving lives</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
              {steps.map((step, index) => (
                <div key={step.number} className="relative animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
                  {/* Connector Line - Only on desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-[68px] -right-[calc(50%+16px)] w-1/2 h-1.5 bg-gradient-to-r from-primary/80 to-primary/20 rounded-full" />
                  )}

                  <div className="relative z-10 text-center group">
                    <div className="mb-6 sm:mb-8 flex h-28 sm:h-32 w-28 sm:w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-4xl sm:text-5xl font-bold mx-auto shadow-lg transition-transform duration-300 group-hover:scale-110">
                      {step.number}
                    </div>
                    <h3 className="text-center font-bold text-lg sm:text-2xl mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-center text-muted-foreground text-sm sm:text-base leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="border-b border-border py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">What Our Community Says</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Real stories from real people</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glass animate-in fade-in scale-in-95" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
                  <CardContent className="p-5 sm:p-6 lg:p-8">
                    <div className="flex mb-4 gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-lg">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-5 sm:mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Heart className="w-12 sm:w-16 h-12 sm:h-16 text-primary mx-auto mb-4 sm:mb-6 animate-pulse" />
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Ready to Make a Difference?</h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our community of heroes making a real impact. Whether you donate blood or need it urgently, BloodNet ensures every connection saves a life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 h-auto">
                  Start Saving Lives Today
                </Button>
              </Link>
              <Link href="/help" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 h-auto bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Chatbot />
      <Footer />
    </>
  )
}
