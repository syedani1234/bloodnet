"use client"

import { Bell, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Notification {
  id: string
  title: string
  description: string
  type: "info" | "warning" | "success" | "error"
  timestamp: string
  read: boolean
}

interface NotificationDropdownProps {
  notifications?: Notification[]
  onMarkAllAsRead?: () => void
}

export function NotificationDropdown({ notifications = [], onMarkAllAsRead }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.()
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="m-0">
            <div>
              <p className="font-semibold">Notifications</p>
              {unreadCount > 0 && <p className="text-xs text-muted-foreground mt-1">{unreadCount} unread</p>}
            </div>
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleMarkAllAsRead}
              className="h-8 px-2 text-xs gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-2.5 p-4 cursor-pointer hover:bg-muted/50 rounded-sm">
                <div className="flex items-center gap-3 w-full">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                    {notification.type}
                  </span>
                  {!notification.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                  <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">{notification.timestamp}</span>
                </div>
                <div className="w-full">
                  <p className="font-medium text-sm leading-snug">{notification.title}</p>
                  <p className="text-xs text-muted-foreground leading-snug mt-1">{notification.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
