import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "pending" | "matched" | "fulfilled" | "urgent"
  size?: "sm" | "md"
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    matched: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    fulfilled: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }

  const sizes = {
    sm: "px-2 py-1 text-xs font-medium",
    md: "px-3 py-1 text-sm font-medium",
  }

  const labels = {
    pending: "Pending",
    matched: "Matched",
    fulfilled: "Fulfilled",
    urgent: "Urgent",
  }

  return <span className={cn("inline-block rounded-full", statusStyles[status], sizes[size])}>{labels[status]}</span>
}
