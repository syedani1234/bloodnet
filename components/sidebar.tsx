"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

interface SidebarProps {
  items: SidebarItem[]
  userRole: "donor" | "recipient" | "hospital" | "admin"
  userName?: string
}

export function Sidebar({ items, userRole, userName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const roleColors = {
    donor: "bg-blue-500/10 text-blue-700",
    recipient: "bg-red-500/10 text-red-700",
    hospital: "bg-green-500/10 text-green-700",
    admin: "bg-purple-500/10 text-purple-700",
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-64px)] bg-card border-r border-border transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Collapse Button */}
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h3 className="font-semibold text-sm">Menu</h3>}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          <ChevronDown className={cn("w-4 h-4 transition-transform", collapsed && "rotate-90")} />
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="px-2 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* User Role & Logout */}
      <div className="absolute bottom-4 left-0 right-0 px-2 space-y-2">
        {!collapsed && (
          <div className={cn("px-4 py-2 rounded-lg text-xs font-medium", roleColors[userRole])}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start bg-transparent"
          onClick={() => (window.location.href = "/")}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
