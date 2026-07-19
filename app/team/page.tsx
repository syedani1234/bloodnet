"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Mail, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TeamPage() {
  const team = [
    {
      name: "Alex Rivera",
      role: "Lead Developer & AI Engineer",
      bio: "Full-stack developer specializing in AI/ML algorithms. Built the donor matching system and backend architecture.",
      image: "/professional-developer-male-tech.jpg",
      skills: ["Next.js", "Python", "AI/ML", "PostgreSQL"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "alex@bloodnet.com",
    },
    {
      name: "Sarah Chen",
      role: "Frontend Lead & UX Designer",
      bio: "Creative designer focused on accessible, user-friendly interfaces. Designed the entire BloodNet UI/UX experience.",
      image: "/professional-developer-female-designer.jpg",
      skills: ["React", "Tailwind CSS", "Figma", "UI/UX"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "sarah@bloodnet.com",
    },
    {
      name: "Michael Okonkwo",
      role: "Backend Engineer & Database Architect",
      bio: "Database expert and API architect. Built scalable backend systems and real-time notification infrastructure.",
      image: "/professional-developer-male-backend-engineer.jpg",
      skills: ["Node.js", "PostgreSQL", "Redis", "WebSockets"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "michael@bloodnet.com",
    },
    {
      name: "Priya Patel",
      role: "DevOps & Security Engineer",
      bio: "Security-first engineer ensuring data protection and HIPAA compliance. Manages deployment and infrastructure.",
      image: "/professional-developer-female-security-engineer.jpg",
      skills: ["DevOps", "Security", "Docker", "AWS"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "priya@bloodnet.com",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <Users className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Four passionate developers working together to revolutionize blood donation through technology. We're
              building BloodNet to save lives and connect communities.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="glass border-primary/20 mb-16">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                We believe technology can bridge the gap between blood donors and those in need. BloodNet combines
                AI-powered matching, real-time tracking, and community building to make blood donation accessible,
                efficient, and rewarding for everyone. Our goal is to eliminate blood shortages and save lives through
                innovation.
              </p>
            </CardContent>
          </Card>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {team.map((member) => (
              <Card key={member.name} className="glass overflow-hidden group hover:border-primary/50 transition-all">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={member.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${member.email}`}>
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tech Stack */}
          <Card className="glass">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Technology Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">▲</span>
                  </div>
                  <h4 className="font-semibold">Next.js 16</h4>
                  <p className="text-sm text-muted-foreground">Frontend Framework</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">TS</span>
                  </div>
                  <h4 className="font-semibold">TypeScript</h4>
                  <p className="text-sm text-muted-foreground">Type Safety</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">🗄️</span>
                  </div>
                  <h4 className="font-semibold">PostgreSQL</h4>
                  <p className="text-sm text-muted-foreground">Database</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-primary">🤖</span>
                  </div>
                  <h4 className="font-semibold">AI/ML</h4>
                  <p className="text-sm text-muted-foreground">Smart Matching</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4">Want to collaborate?</h3>
            <p className="text-muted-foreground mb-6">
              We're always open to feedback, partnerships, and contributions to make BloodNet better.
            </p>
            <Button size="lg" asChild>
              <a href="mailto:team@bloodnet.com">
                <Mail className="mr-2 w-5 h-5" />
                Contact Our Team
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
