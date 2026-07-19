"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { Trees, Leaf, Globe, Award } from "lucide-react"

export default function TreesPage() {
  const trees = [
    { id: 1, name: "Oak Tree", plantedAt: "Jan 10, 2024", location: "Central Park, NYC", status: "Growing" },
    { id: 2, name: "Maple Tree", plantedAt: "Dec 25, 2023", location: "Golden Gate Park, SF", status: "Growing" },
    { id: 3, name: "Birch Tree", plantedAt: "Nov 30, 2023", location: "Yosemite, CA", status: "Thriving" },
    { id: 4, name: "Pine Tree", plantedAt: "Oct 15, 2023", location: "Rocky Mountains, CO", status: "Thriving" },
    { id: 5, name: "Elm Tree", plantedAt: "Sep 20, 2023", location: "Central Park, NYC", status: "Thriving" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tree Planting Rewards</h1>
          <p className="text-muted-foreground">Your environmental impact through blood donation</p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Trees Planted"
            value="5"
            icon={<Trees className="w-6 h-6" />}
            trend={{ value: 100, positive: true }}
          />
          <StatCard
            label="CO₂ Offset (kg)"
            value="450"
            icon={<Globe className="w-6 h-6" />}
            trend={{ value: 50, positive: true }}
          />
          <StatCard
            label="Lives Saved"
            value="15"
            icon={<Award className="w-6 h-6" />}
            trend={{ value: 200, positive: true }}
          />
          <StatCard
            label="Environmental Impact"
            value="5 Stars"
            icon={<Leaf className="w-6 h-6" />}
            trend={{ value: 40, positive: true }}
          />
        </div>

        {/* Impact Message */}
        <Card className="glass soft-shadow bg-green-500/5 border border-green-500/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Leaf className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Your Environmental Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Through your 5 blood donations, we've planted 5 trees in national parks across the US. Each tree will
                  absorb approximately 90 kg of CO₂ over its lifetime. You're making a real difference!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trees List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Planted Trees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trees.map((tree) => (
              <Card key={tree.id} className="glass soft-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{tree.name}</h3>
                        <p className="text-sm text-muted-foreground">{tree.location}</p>
                      </div>
                      <div className="text-4xl">{["🌳", "🌲", "🌴", "🌿", "🍀"][tree.id - 1]}</div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Planted:</span>
                        <span className="font-medium">{tree.plantedAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span
                          className={`font-medium ${tree.status === "Thriving" ? "text-green-600" : "text-blue-600"}`}
                        >
                          {tree.status}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      Track Growth
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="glass soft-shadow mt-8 bg-primary/5 border border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Make More Impact</h3>
              <p className="text-muted-foreground">
                Donate again to plant more trees. One more donation = One more tree!
              </p>
              <Button size="lg">Schedule Next Donation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
