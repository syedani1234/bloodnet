'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ReceiverDashboard from '@/components/dashboards/receiver-dashboard'

export default function ReceiverPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user.role !== 'receiver') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user || user.role !== 'receiver') {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ReceiverDashboard user={user} />
        </div>
      </main>
      <Footer />
    </>
  )
}
