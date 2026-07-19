"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Shield, Trash2, MoreVertical, CheckCircle, XCircle, Lock, ChevronLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function UserManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<Array<{
    id: string
    name: string
    email: string
    role: string
    city: string
    status: string
    isVerified?: boolean
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        if (data.users) {
          setUsers(data.users.map((u: { id: string; name: string; email: string; role: string; city: string; isVerified?: boolean }) => ({
            ...u,
            status: u.isVerified ? 'verified' : 'pending',
          })))
        }
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-950/20 max-w-md w-full">
            <CardContent className="pt-12 pb-12">
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">Access Denied</h2>
                <p className="text-red-800 dark:text-red-200 mb-6">
                  You do not have permission to access this page. Admin access required.
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={() => router.push('/dashboard')}>
                <ChevronLeft className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    )
  }


  const getRoleColor = (role: string) => {
    const colors = {
      donor: "bg-blue-500/20 text-blue-700",
      recipient: "bg-red-500/20 text-red-700",
      hospital: "bg-green-500/20 text-green-700",
      admin: "bg-purple-500/20 text-purple-700",
    }
    return colors[role as keyof typeof colors] || "bg-gray-500/20 text-gray-700"
  }

  const getStatusIcon = (status: string) => {
    if (status === "verified") return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === "suspended") return <XCircle className="w-4 h-4 text-red-500" />
    return <Badge className="text-xs">Pending</Badge>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading users from MongoDB...' : `${users.length} users from bloodnet & bloodnet_karachi`}
            </p>
          </div>
          <Button>Export Users</Button>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Users Table */}
        <Card className="glass soft-shadow">
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users
                .filter((u) =>
                  !searchTerm ||
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className="text-sm text-muted-foreground capitalize">{user.status}</span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">{user.city}</p>
                      <p className="text-xs text-muted-foreground">City</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Verify User
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
