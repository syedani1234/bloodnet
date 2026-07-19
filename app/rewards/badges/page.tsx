"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Lock } from "lucide-react"

export default function BadgesPage() {
  const badges = [
    {
      id: 1,
      name: "First Drop",
      description: "Made your first blood donation",
      icon: "🩸",
      unlocked: true,
      progress: 100,
    },
    {
      id: 2,
      name: "Lifesaver",
      description: "Completed 5 donations",
      icon: "❤️",
      unlocked: true,
      progress: 100,
    },
    {
      id: 3,
      name: "Silver Donor",
      description: "Completed 10 donations",
      icon: "⭐",
      unlocked: true,
      progress: 100,
    },
    {
      id: 4,
      name: "Gold Donor",
      description: "Completed 25 donations",
      icon: "✨",
      unlocked: false,
      progress: 76,
    },
    {
      id: 5,
      name: "Platinum Donor",
      description: "Completed 50 donations",
      icon: "💎",
      unlocked: false,
      progress: 38,
    },
    {
      id: 6,
      name: "Emergency Hero",
      description: "Responded to emergency request",
      icon: "🚀",
      unlocked: true,
      progress: 100,
    },
    {
      id: 7,
      name: "Health Guardian",
      description: "Maintained 80+ health score",
      icon: "🛡️",
      unlocked: true,
      progress: 100,
    },
    {
      id: 8,
      name: "Community Champion",
      description: "Referred 5 donors to BloodNet",
      icon: "🏆",
      unlocked: false,
      progress: 20,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Achievement Badges</h1>
          <p className="text-muted-foreground">Earn badges by completing donations and helping the community</p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <Card key={badge.id} className={`glass soft-shadow ${!badge.unlocked ? "opacity-70" : ""}`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative">
                  <div className="text-6xl mb-2">{badge.icon}</div>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>

                {!badge.unlocked && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${badge.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium">{badge.progress}%</span>
                    </div>
                  </div>
                )}

                {badge.unlocked && (
                  <BadgeComponent className="bg-green-500/20 text-green-700 mx-auto">Unlocked</BadgeComponent>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
