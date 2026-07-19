'use client'

import { useEffect, useRef } from 'react'

interface BloodRequest {
  id: string
  hospitalName: string
  bloodGroup: string
  units: number
  urgency: 'normal' | 'urgent' | 'emergency'
  lat: number
  lng: number
  createdAt: string
}

interface KarachiBloodRequestMapProps {
  requests: BloodRequest[]
  userLocation?: { lat: number; lng: number }
}

const urgencyColors = {
  normal: '#3B82F6',
  urgent: '#F59E0B',
  emergency: '#EF4444',
}

const urgencyIcons = {
  normal: '🩸',
  urgent: '⚠️',
  emergency: '🚨',
}

export function KarachiBloodRequestMap({
  requests,
  userLocation = { lat: 24.8607, lng: 67.0011 },
}: KarachiBloodRequestMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Dynamically import Leaflet only on client side
    import('leaflet').then((L) => {
      // Import CSS dynamically
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      if (map.current) return

      // Initialize map
      map.current = L.default.map(mapContainer.current as HTMLDivElement).setView(
        [userLocation.lat, userLocation.lng],
        12
      )

      // Add OpenStreetMap tiles
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current)

      // Add user location marker (blue)
      const userIcon = L.default.divIcon({
        html: `<div style="background-color: #3B82F6; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">📍</div>`,
        iconSize: [40, 40],
        className: 'custom-marker',
      })

      L.default.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map.current)
        .bindPopup(
          '<div><strong>Your Location</strong><br/>Hospital/Request Location</div>'
        )

      // Add blood request markers
      requests.forEach((request) => {
        const color = urgencyColors[request.urgency]
        const icon = urgencyIcons[request.urgency]

        const customIcon = L.default.divIcon({
          html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${icon}</div>`,
          iconSize: [40, 40],
          className: 'blood-request-marker',
        })

        L.default.marker([request.lat, request.lng], { icon: customIcon })
          .addTo(map.current)
          .bindPopup(
            `<div>
              <strong>${request.hospitalName}</strong><br/>
              Blood Type: ${request.bloodGroup}<br/>
              Units: ${request.units}<br/>
              Urgency: <span style="color: ${color}; font-weight: bold;">${request.urgency.toUpperCase()}</span><br/>
              <small>${request.createdAt}</small>
            </div>`
          )
      })

      return () => {
        if (map.current) {
          map.current.remove()
          map.current = null
        }
      }
    })
  }, [userLocation, requests])

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '400px', borderRadius: '8px' }}
      className="border border-border"
    />
  )
}
