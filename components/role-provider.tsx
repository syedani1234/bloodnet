"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type UserRole = "donor" | "recipient" | "hospital" | "admin" | null

interface User {
  id: string
  email: string
  role: UserRole
  name: string
  verified: boolean
  healthScore?: number
}

interface RoleContextType {
  user: User | null
  role: UserRole
  setUser: (user: User | null) => void
  logout: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <RoleContext.Provider value={{ user, role: user?.role ?? null, setUser, logout }}>{children}</RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRole must be used within RoleProvider")
  }
  return context
}
