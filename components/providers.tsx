'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { AuthProvider } from './auth-provider'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="bloodnet-theme">
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
