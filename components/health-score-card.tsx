import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

interface HealthScoreCardProps {
  score: number
  lastUpdated?: string
}

export function HealthScoreCard({ score, lastUpdated }: HealthScoreCardProps) {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "bg-green-500" }
    if (score >= 60) return { label: "Good", color: "bg-blue-500" }
    if (score >= 40) return { label: "Fair", color: "bg-yellow-500" }
    return { label: "Needs Review", color: "bg-red-500" }
  }

  const status = getHealthStatus(score)

  return (
    <Card className="glass soft-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Health Score
            </CardTitle>
            <CardDescription>AI-Generated Health Assessment</CardDescription>
          </div>
          <Badge className={`${status.color} text-white`}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${status.color} transition-all duration-500`} style={{ width: `${score}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-primary">{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          {lastUpdated && <p className="text-xs text-muted-foreground">Updated: {lastUpdated}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
