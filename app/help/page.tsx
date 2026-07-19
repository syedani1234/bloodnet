"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  UserPlus,
  Heart,
  MapPin,
  Shield,
  Award,
  MessageCircle,
  Hospital,
  Activity,
  Search,
} from "lucide-react"

export default function HelpPage() {
  const sections = [
    {
      icon: UserPlus,
      title: "Getting Started",
      faqs: [
        {
          question: "How do I register as a blood donor?",
          answer:
            "Click 'Become a Donor' in the navigation menu. Fill out the registration form with your personal details, blood type, location, and contact information. Complete the health screening questions, and you'll be verified within 24 hours.",
        },
        {
          question: "What information do I need to provide?",
          answer:
            "You'll need: Full name, age (must be 18+), blood type, weight (minimum 50kg), contact details (phone and email), current location/address, and basic health information.",
        },
        {
          question: "How long does verification take?",
          answer:
            "Verification typically takes 12-24 hours. Our team reviews your information and health screening. You'll receive an email once verified, and your profile will show a green shield badge.",
        },
      ],
    },
    {
      icon: Heart,
      title: "Blood Donation",
      faqs: [
        {
          question: "Who can donate blood?",
          answer:
            "You must be at least 18 years old, weigh at least 50kg, be in good general health, not have donated blood in the last 3 months, and be free from infectious diseases. Certain medications and conditions may affect eligibility.",
        },
        {
          question: "How often can I donate blood?",
          answer:
            "You can donate whole blood every 3 months (90 days). Platelet donations can be made more frequently. Our system automatically tracks your donation history and notifies you when you're eligible again.",
        },
        {
          question: "What should I do before donating?",
          answer:
            "Eat a healthy meal, drink plenty of water, get adequate sleep, avoid alcohol for 24 hours before donation, and bring valid ID. Wear comfortable clothing with sleeves that can be easily rolled up.",
        },
        {
          question: "What happens during the donation process?",
          answer:
            "The entire process takes about 45 minutes: registration (5-10 min), health screening (10-15 min), actual donation (8-10 min), and rest/refreshments (10-15 min). A trained professional will guide you through each step.",
        },
      ],
    },
    {
      icon: Search,
      title: "Finding Donors",
      faqs: [
        {
          question: "How do I find blood donors near me?",
          answer:
            "Go to 'Find Donors' page or the Donor Map. Use filters to search by blood type, location, and distance. Toggle between list view and interactive map view to see donors in your area.",
        },
        {
          question: "What is AI-powered matching?",
          answer:
            "Our AI algorithm ranks donors based on multiple factors: blood type compatibility, distance from you, donor's health score, availability status, donation history, and response time. This ensures you get the best possible matches.",
        },
        {
          question: "How do I view donor details?",
          answer:
            "In map view, click on any donor marker to see their complete profile. In list view, click on a donor card. You'll see donation history, health score, badges, contact info, and ratings.",
        },
        {
          question: "Can I contact donors directly?",
          answer:
            "Yes! Once you find a suitable donor, you can send them a direct message through our secure messaging system or request a donation. All communications are tracked for safety.",
        },
      ],
    },
    {
      icon: MapPin,
      title: "Emergency Requests",
      faqs: [
        {
          question: "How do I make an emergency blood request?",
          answer:
            "Go to 'Emergency Request' page, fill in required blood type, units needed, hospital location, and urgency level. Set urgency to 'Critical' for immediate alerts to all compatible donors within your area.",
        },
        {
          question: "How fast will I get a response?",
          answer:
            "Critical requests trigger instant push notifications to all compatible donors within 10km. Most emergency requests receive responses within 10-15 minutes. Hospital portal users can also flag emergencies for faster coordination.",
        },
        {
          question: "Can I track my request status?",
          answer:
            "Yes! Go to your Dashboard to see all active requests, responses received, and donor contact information. You'll receive real-time updates via notifications and email.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Safety & Verification",
      faqs: [
        {
          question: "How are donors verified?",
          answer:
            "All donors undergo identity verification, health screening questionnaire, and blood type confirmation. Medical professionals review applications. Verified donors receive a green shield badge on their profile.",
        },
        {
          question: "Is my personal information safe?",
          answer:
            "Absolutely. We use bank-level encryption for all data. Your phone number and email are only shared with donors/recipients you approve. You can control privacy settings from your profile page.",
        },
        {
          question: "What is the Health Score?",
          answer:
            "Health Score (0-100) is calculated based on donation frequency, health screening results, age, weight, and lifestyle factors. Higher scores indicate healthier donors more likely to be approved for donation.",
        },
      ],
    },
    {
      icon: Award,
      title: "Rewards & Certificates",
      faqs: [
        {
          question: "What rewards do I get for donating?",
          answer:
            "Earn digital certificates (Platinum, Gold, Silver, Hero tiers), achievement badges, and tree-planting rewards. Certificates are shareable on social media. Each donation also contributes to planting trees!",
        },
        {
          question: "How do I download my certificate?",
          answer:
            "Go to Rewards > Certificates page. Your certificates are auto-generated based on donation milestones. Click 'Download' to save as PDF or 'Share' to post on social media.",
        },
        {
          question: "What are the badge requirements?",
          answer:
            "Badges include: First Donation (1 donation), Regular Donor (5 donations), Super Donor (10 donations), Life Saver (20 donations), Hero (50+ donations), and special badges for emergency responses and verified status.",
        },
      ],
    },
    {
      icon: Hospital,
      title: "Hospital Portal",
      faqs: [
        {
          question: "How can hospitals join BloodNet?",
          answer:
            "Hospitals can register through the Hospital Portal. You'll need official documentation, verification from medical authorities, and admin approval. Contact support@bloodnet.com for hospital onboarding.",
        },
        {
          question: "What features are available for hospitals?",
          answer:
            "Hospitals can: Track blood inventory by type, post emergency requests, access donor database, flag critical shortages with one-click alerts, manage multiple requests simultaneously, and view analytics.",
        },
      ],
    },
    {
      icon: MessageCircle,
      title: "Communication",
      faqs: [
        {
          question: "How do I message donors or recipients?",
          answer:
            "Click on any donor/recipient profile and select 'Send Message'. Our secure messaging system supports text, images, and voice/video calls. All communications are encrypted and monitored for safety.",
        },
        {
          question: "Can I call donors directly?",
          answer:
            "Yes! Once connected, you can initiate voice or video calls through our platform. Phone numbers are only shared after mutual consent or when you accept a donation request.",
        },
      ],
    },
    {
      icon: Activity,
      title: "Dashboard & Profile",
      faqs: [
        {
          question: "How do I update my profile?",
          answer:
            "Go to Dashboard > Profile tab. You can edit personal information, update blood type (requires verification), change contact details, set availability status, and manage privacy settings.",
        },
        {
          question: "Can I see my donation history?",
          answer:
            "Yes! Your Dashboard shows complete donation history with dates, hospitals, units donated, and certificates earned. Export your history as PDF from the Profile page.",
        },
        {
          question: "What if I'm temporarily unavailable?",
          answer:
            "Update your availability status in Profile settings. Toggle 'Available for Donation' on/off. When unavailable, you won't receive donation requests but remain in the database.",
        },
      ],
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about using BloodNet. Find answers to common questions and learn how to make
              the most of our platform.
            </p>
          </div>

          {/* Help Sections */}
          <div className="space-y-8">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.title} className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {section.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Contact Support */}
          <Card className="mt-12 glass border-primary/20">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to assist you. Use the chatbot in the bottom-right corner for instant
                answers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@bloodnet.com" className="text-primary hover:underline">
                  support@bloodnet.com
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="tel:+15551234567" className="text-primary hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
