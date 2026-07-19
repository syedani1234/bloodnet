import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Blood-Net - Save Lives Through Blood Donation",
  description:
    "Quick, safe, and verified blood donation matching platform connecting donors and recipients in real-time",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "any",
      },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
