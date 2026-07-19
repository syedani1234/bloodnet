import { cn } from "@/lib/utils"

interface BloodBadgeProps {
  bloodType: string
  size?: "sm" | "md" | "lg"
}

export function BloodBadge({ bloodType, size = "md" }: BloodBadgeProps) {
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm font-semibold",
    lg: "px-4 py-2 text-base font-semibold",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-mono font-bold",
        sizes[size],
      )}
    >
      {bloodType}
    </div>
  )
}
