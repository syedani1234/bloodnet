"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const team = [
    { name: "Dr. Sarah Chen", role: "Founder & CEO", dept: "Healthcare" },
    { name: "Prof. James Wilson", role: "CTO", dept: "AI & ML" },
    { name: "Emily Rodriguez", role: "Head of Operations", dept: "Operations" },
    { name: "David Park", role: "Lead Engineer", dept: "Backend" },
  ]

  const technologies = [
    "Next.js 16",
    "React 19",
    "Tailwind CSS",
    "TypeScript",
    "AI/ML Integration",
    "Real-time Matching",
    "Geolocation APIs",
    "Cloud Infrastructure",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">About BloodNet</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionizing blood donation through AI-driven matching and real-time connectivity
          </p>
        </div>

        {/* Project Overview */}
        <Card className="glass soft-shadow mb-12">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>BloodNet is an AI-powered blood donation ecosystem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              BloodNet is an innovative Final Year Project that transforms the blood donation landscape by leveraging
              artificial intelligence and real-time data matching. The platform connects blood donors with hospitals and
              recipients urgently needing blood, significantly reducing response times and improving patient outcomes.
            </p>
            <p>
              Our mission is to create a seamless, efficient, and life-saving blood donation network that empowers
              donors, supports recipients, and helps hospitals manage their blood inventory with unprecedented accuracy.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass soft-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="text-4xl">🤖</div>
                <h3 className="font-semibold">AI Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Smart algorithm matches donors and recipients based on blood type, location, and health metrics
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass soft-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="text-4xl">⚡</div>
                <h3 className="font-semibold">Real-time Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Instant push notifications alert donors about urgent requests in their area
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass soft-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="text-4xl">📍</div>
                <h3 className="font-semibold">Geolocation</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive maps show nearby donors and hospitals for quick coordination
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass soft-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="text-4xl">🎖️</div>
                <h3 className="font-semibold">Gamification</h3>
                <p className="text-sm text-muted-foreground">
                  Badges, certificates, and tree planting rewards incentivize donations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scope & Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="glass soft-shadow">
            <CardHeader>
              <CardTitle>Project Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>User authentication with role-based access</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Real-time blood request and donor matching</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Hospital blood inventory management</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>AI-powered health score calculation</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Emergency alert system</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Analytics and reporting dashboard</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Gamification with rewards</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass soft-shadow">
            <CardHeader>
              <CardTitle>Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="font-medium mb-1">Development Approach</p>
                <p className="text-muted-foreground">Agile methodology with iterative sprints</p>
              </div>
              <div>
                <p className="font-medium mb-1">Technology Stack</p>
                <p className="text-muted-foreground">Modern web technologies for scalability</p>
              </div>
              <div>
                <p className="font-medium mb-1">Database</p>
                <p className="text-muted-foreground">PostgreSQL with real-time sync</p>
              </div>
              <div>
                <p className="font-medium mb-1">AI/ML</p>
                <p className="text-muted-foreground">TensorFlow for health scoring and matching</p>
              </div>
              <div>
                <p className="font-medium mb-1">Testing</p>
                <p className="text-muted-foreground">Unit and integration testing with Jest</p>
              </div>
              <div>
                <p className="font-medium mb-1">Deployment</p>
                <p className="text-muted-foreground">Vercel for frontend, AWS for backend</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technologies Used */}
        <Card className="glass soft-shadow mb-12">
          <CardHeader>
            <CardTitle>Technologies & Tools</CardTitle>
            <CardDescription>Modern tech stack for optimal performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge key={tech} className="bg-primary/20 text-primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Development Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="glass soft-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                    <Badge variant="outline">{member.dept}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Supervised By */}
        <Card className="glass soft-shadow bg-primary/5 border border-primary/20 mb-12">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Project Supervisor</p>
            <p className="text-xl font-bold">Prof. Dr. Muhammad Hassan Khan</p>
            <p className="text-sm text-muted-foreground">Department of Computer Science</p>
          </CardContent>
        </Card>

        {/* References */}
        <Card className="glass soft-shadow mb-12">
          <CardHeader>
            <CardTitle>References & Research</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>[1] Smith, J., et al. (2023). "AI in Healthcare: Blood Donation Optimization"</p>
            <p>[2] WHO. (2023). Global Blood Safety Initiative Report</p>
            <p>[3] Chen, X., & Lee, Y. (2022). "Real-time Matching Algorithms for Emergency Medical Services"</p>
            <p>[4] International Blood Bank Association. (2023). Annual Report on Blood Inventory Management</p>
            <p>[5] Vercel Documentation. (2024). Next.js and Modern Web Development</p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Ready to Save Lives?</h3>
          <p className="text-muted-foreground">Join the BloodNet community today</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Become a Donor</Button>
            <Button size="lg" variant="outline">
              Request Blood
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
