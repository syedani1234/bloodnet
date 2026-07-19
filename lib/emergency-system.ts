export interface EmergencyAlert {
  id: string
  hospitalId: string
  hospitalName: string
  bloodType: string
  unitsRequired: number
  urgencyLevel: 'emergency'
  createdAt: Date
  donorsNotified: number
  status: 'active' | 'fulfilled' | 'cancelled'
}

// In-memory storage for emergency workflow
let activeAlerts: EmergencyAlert[] = []

export function createEmergencyAlert(
  hospitalId: string,
  hospitalName: string,
  bloodType: string,
  unitsRequired: number
): EmergencyAlert {
  const alert: EmergencyAlert = {
    id: Math.random().toString(36).substr(2, 9),
    hospitalId,
    hospitalName,
    bloodType,
    unitsRequired,
    urgencyLevel: 'emergency',
    createdAt: new Date(),
    donorsNotified: 0,
    status: 'active',
  }
  activeAlerts.push(alert)
  return alert
}

export function notifyDonors(alertId: string, donorCount: number) {
  const alert = activeAlerts.find((a) => a.id === alertId)
  if (alert) {
    alert.donorsNotified = donorCount
    console.log(`[v0] Emergency alert ${alertId}: ${donorCount} donors notified`)
  }
}

export function getActiveAlerts(): EmergencyAlert[] {
  return activeAlerts.filter((a) => a.status === 'active')
}

export function fulfilAlert(alertId: string) {
  const alert = activeAlerts.find((a) => a.id === alertId)
  if (alert) {
    alert.status = 'fulfilled'
  }
}

export function cancelAlert(alertId: string) {
  const alert = activeAlerts.find((a) => a.id === alertId)
  if (alert) {
    alert.status = 'cancelled'
  }
}
