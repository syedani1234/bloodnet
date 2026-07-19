'use client'

import { useEffect, useRef, useState } from 'react'

interface Donor {
  id: string
  name: string
  bloodGroup: string
  city: string
  phone: string
  email: string
  age: number
  lastDonation: string
  health: number
  available: boolean
  lat: number
  lng: number
  donations: number
  verified: boolean
}

interface DonorsMapProps {
  donors: Donor[]
  selectedDonor?: string | null
  onDonorHover?: (donor: Donor | null) => void
  onDonorSelect?: (donor: Donor) => void
  userLocation?: { lat: number; lng: number }
}

export function DonorsMap({
  donors,
  selectedDonor,
  onDonorHover,
  onDonorSelect,
  userLocation = { lat: 24.8607, lng: 67.0011 },
}: DonorsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markers = useRef<Map<string, any>>(new Map())
  const [hoveredDonor, setHoveredDonor] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    import('leaflet').then((L) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      if (map.current) return

      map.current = L.default.map(mapContainer.current as HTMLDivElement).setView(
        [userLocation.lat, userLocation.lng],
        12
      )

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current)

      // Add user location marker
      const userIcon = L.default.divIcon({
        html: `<div style="background-color: #2563EB; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">📍</div>`,
        iconSize: [40, 40],
        className: 'user-marker',
      })

      L.default.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map.current)
        .bindPopup('<div><strong>Your Location</strong></div>')

      // Add donor markers
      donors.forEach((donor) => {
        const isSelected = selectedDonor === donor.id
        const isHovered = hoveredDonor === donor.id
        const healthColor = donor.health > 90 ? '#10B981' : donor.health > 80 ? '#3B82F6' : '#F59E0B'
        const size = isSelected || isHovered ? 50 : 40

        const customIcon = L.default.divIcon({
          html: `<div style="background-color: ${healthColor}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: ${size * 0.6}px; border: 3px solid white; box-shadow: 0 2px 12px rgba(0,0,0,0.4); transition: all 0.2s; cursor: pointer;">💉</div>`,
          iconSize: [size, size],
          className: 'donor-marker',
        })

        const marker = L.default.marker([donor.lat, donor.lng], { icon: customIcon })
          .addTo(map.current)
          .bindPopup(
            `<div style="min-width: 200px;">
              <strong>${donor.name}</strong><br/>
              Blood: ${donor.bloodGroup}<br/>
              Health: ${donor.health}%<br/>
              <button class="select-donor" style="margin-top: 8px; padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">Select Donor</button>
            </div>`
          )

        marker.on('click', () => {
          onDonorSelect?.(donor)
        })

        // When popup opens, wire the popup button to call the React handler
        marker.on('popupopen', (e: any) => {
          try {
            const popupEl = e.popup.getElement()
            const btn = popupEl?.querySelector?.('.select-donor') as HTMLButtonElement | null
            if (btn) {
              const handler = () => onDonorSelect?.(donor)
              btn.addEventListener('click', handler)
              // store handler for potential cleanup
              ;(btn as any).__selectHandler = handler
            }
          } catch (err) {
            // no-op
          }
        })

        marker.on('popupclose', (e: any) => {
          try {
            const popupEl = e.popup.getElement()
            const btn = popupEl?.querySelector?.('.select-donor') as HTMLButtonElement | null
            if (btn && (btn as any).__selectHandler) {
              btn.removeEventListener('click', (btn as any).__selectHandler)
              delete (btn as any).__selectHandler
            }
          } catch (err) {
            // no-op
          }
        })

        marker.on('mouseover', () => {
          setHoveredDonor(donor.id)
          onDonorHover?.(donor)
        })

        marker.on('mouseout', () => {
          setHoveredDonor(null)
          onDonorHover?.(null)
        })

        markers.current.set(donor.id, marker)
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [donors, userLocation, selectedDonor, hoveredDonor, onDonorHover, onDonorSelect])

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '500px', borderRadius: '8px' }}
      className="border border-border"
    />
  )
}
