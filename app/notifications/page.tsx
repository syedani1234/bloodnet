"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Heart, Bell, CheckCircle, Clock, Trash2, CheckCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

interface Notification {
  id: string
  type: "emergency" | "match" | "request" | "update" | "achievement"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?city=${encodeURIComponent(user.city)}&userEmail=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error('[v0] Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Poll for new notifications every 3 seconds
    const interval = setInterval(fetchNotifications, 3000)
    return () => clearInterval(interval)
  }, [user])

  const handleDelete = async (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
    try {
      await fetch(`/api/notifications?city=${encodeURIComponent(user?.city || 'Karachi')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', notificationId: id, city: user?.city, userEmail: user?.email }),
      })
    } catch (error) {
      console.error('[v0] Error deleting notification:', error)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    try {
      await fetch(`/api/notifications?city=${encodeURIComponent(user?.city || 'Karachi')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-as-read', notificationId: id, city: user?.city, userEmail: user?.email }),
      })
    } catch (error) {
      console.error('[v0] Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    try {
      await fetch(`/api/notifications?city=${encodeURIComponent(user?.city || 'Karachi')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-all-as-read', city: user?.city, userEmail: user?.email }),
      })
    } catch (error) {
      console.error('[v0] Error marking all as read:', error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "match":
        return <Heart className="w-5 h-5 text-pink-500" />
      case "achievement":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} new notification${unreadCount !== 1 ? 's' : ''}` : "All caught up"}
                </p>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 text-primary">{unreadCount}</Badge>
                  <Button
                    onClick={handleMarkAllAsRead}
                    variant="outline"
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all as read
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No notifications yet</p>
                <p className="text-muted-foreground text-sm mt-1">Check back later for updates</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`glass soft-shadow cursor-pointer transition-all hover:shadow-md ${
                    !notification.read 
                      ? "border-l-4 border-l-primary bg-primary/5" 
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-muted/50">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">{notification.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 mb-4">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {notification.actionUrl && (
                            <Button 
                              size="sm" 
                              onClick={() => (window.location.href = notification.actionUrl!)}
                              className="gap-1"
                            >
                              View
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Mark as read
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(notification.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
