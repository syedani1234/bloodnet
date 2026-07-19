'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface AppointmentBookingModalProps {
  isOpen: boolean
  onClose: () => void
  donor: {
    id: string
    email: string
    name: string
    bloodGroup: string
  }
  hospital: {
    id: string
    name: string
    city: string
  }
  onBookingSuccess?: () => void
}

export function AppointmentBookingModal({ isOpen, onClose, donor, hospital, onBookingSuccess }: AppointmentBookingModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
  })

  async function handleBooking() {
    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast({ title: 'Error', description: 'Please select date and time', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: donor.id,
          donorEmail: donor.email,
          donorName: donor.name,
          hospitalId: hospital.id,
          hospitalName: hospital.name,
          hospitalCity: hospital.city,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          bloodGroup: donor.bloodGroup,
          city: hospital.city,
        }),
      })

      if (res.ok) {
        toast({ title: 'Success', description: 'Appointment booked! Check your email for confirmation.' })
        setBooked(true)
        setTimeout(() => {
          onClose()
          onBookingSuccess?.()
        }, 2000)
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Failed to book appointment', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to book appointment', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {booked ? 'Appointment Confirmed!' : 'Book Donation Appointment'}
          </DialogTitle>
          <DialogDescription>
            {booked ? 'Your appointment has been scheduled.' : 'Select a date and time to donate blood'}
          </DialogDescription>
        </DialogHeader>

        {!booked ? (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Donor</label>
                <p className="font-semibold">{donor.name}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Hospital</label>
                <p className="font-semibold">{hospital.name}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Blood Group</label>
                <p className="font-bold">{donor.bloodGroup}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Appointment Time
                </label>
                <select
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                >
                  <option value="">Select time slot</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                A confirmation email will be sent to {donor.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-900 dark:text-green-100 mb-2">Appointment Scheduled!</p>
              <p className="text-sm text-green-800 dark:text-green-200">
                {formData.appointmentDate} at {formData.appointmentTime}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">Confirmation Details Sent To:</p>
              <p className="text-sm text-muted-foreground">{donor.email}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!booked ? (
            <>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleBooking} disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
