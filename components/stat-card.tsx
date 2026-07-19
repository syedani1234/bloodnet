import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("glass soft-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn("text-xs font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.positive ? "+" : ""}
                {trend.value}% from last month
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
