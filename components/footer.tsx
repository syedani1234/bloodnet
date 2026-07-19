import Link from "next/link"
import Image from "next/image"
import { Heart, Mail, MapPin, Users, Droplet, Award } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 relative">
                <Image 
                  src="/logo.png" 
                  alt="BloodNet Logo" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">BloodNet</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A mission-driven platform connecting donors and recipients to save lives through safe blood matching.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplet className="h-4 w-4 text-primary" />
              <span>Verify. Match. Save.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/register-donor" className="text-muted-foreground hover:text-primary transition-colors">
                  Become Donor
                </Link>
              </li>
              <li>
                <Link href="/request-blood" className="text-muted-foreground hover:text-primary transition-colors">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#faqs" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Connect
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-muted-foreground text-xs uppercase font-semibold tracking-wide mb-1">Email Support</p>
                <a href="mailto:support@bloodnet.com" className="text-primary hover:underline font-medium">
                  support@bloodnet.com
                </a>
              </li>
              <li>
                <p className="text-muted-foreground text-xs uppercase font-semibold tracking-wide mb-1">Location</p>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-start gap-1">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Pakistan</span>
                </a>
              </li>

            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-8 sm:mt-12 pt-8 sm:pt-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {currentYear} BloodNet. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">•</span>
            <p className="font-medium text-foreground">Saving lives, one donation at a time</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
