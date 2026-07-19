'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'donor' | 'receiver' | 'hospital' | 'admin' | null

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Exclude<UserRole, null>
  bloodGroup?: string
  city: string
  area?: string
  isVerified?: boolean
  profilePicture?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('bloodnet_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
      }
    }
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      const normalizedUser = {
        ...data.user,
        role: data.user?.role ?? role,
        city: data.user?.city ?? 'Karachi',
        phone: data.user?.phone ?? '',
      }
      setUser(normalizedUser)
      localStorage.setItem('bloodnet_user', JSON.stringify(normalizedUser))
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      const normalizedUser = {
        ...data.user,
        role: data.user?.role ?? 'donor',
        city: data.user?.city ?? 'Karachi',
        phone: data.user?.phone ?? '',
      }
      setUser(normalizedUser)
      localStorage.setItem('bloodnet_user', JSON.stringify(normalizedUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bloodnet_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
