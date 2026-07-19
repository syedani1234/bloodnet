"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Donor {
  id: string
  name: string
  bloodGroup: string
  city: string
  lastDonation: string
  verified: boolean
  successfulDonations: number
  lat: number
  lng: number
  age?: number
  email?: string
  phone?: string
  healthStatus?: string
  distance?: number
}

interface KarachiDonorMapProps {
  donors: Donor[]
  selectedBloodGroup?: string
  onDonorSelect?: (donor: Donor) => void
  selectedDonorId?: string | null
}

// Karachi coordinates and landmarks
const KARACHI_CENTER = { lat: 24.8607, lng: 67.0011 }
const KARACHI_BOUNDS = {
  north: 25.0,
  south: 24.7,
  west: 66.8,
  east: 67.3,
}

export function KarachiDonorMap({ donors, selectedBloodGroup, onDonorSelect, selectedDonorId }: KarachiDonorMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredDonorId, setHoveredDonorId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(12)

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Convert lat/lng to canvas coordinates
  const getCanvasCoordinates = (lat: number, lng: number, canvasWidth: number, canvasHeight: number) => {
    const latRange = KARACHI_BOUNDS.north - KARACHI_BOUNDS.south
    const lngRange = KARACHI_BOUNDS.east - KARACHI_BOUNDS.west

    const x = ((lng - KARACHI_BOUNDS.west) / lngRange) * canvasWidth
    const y = ((KARACHI_BOUNDS.north - lat) / latRange) * canvasHeight

    return { x, y }
  }

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Background
    ctx.fillStyle = "#e8f4f8"
    ctx.fillRect(0, 0, width, height)

    // Water/background pattern
    ctx.fillStyle = "#f0f9fc"
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = "#d0e8f2"
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Center point
    const center = getCanvasCoordinates(KARACHI_CENTER.lat, KARACHI_CENTER.lng, width, height)
    ctx.fillStyle = "#dc2626"
    ctx.globalAlpha = 0.1
    ctx.beginPath()
    ctx.arc(center.x, center.y, 80, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // Draw donors
    donors.forEach((donor) => {
      const pos = getCanvasCoordinates(donor.lat, donor.lng, width, height)
      const isSelected = selectedDonorId === donor.id
      const isHovered = hoveredDonorId === donor.id
      const matchesBloodFilter = !selectedBloodGroup || selectedBloodGroup === "all" || donor.bloodGroup === selectedBloodGroup

      if (!matchesBloodFilter) {
        ctx.globalAlpha = 0.3
      }

      // Marker circle
      ctx.fillStyle = isSelected || isHovered ? "#991b1b" : "#dc2626"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, isSelected ? 14 : 10, 0, Math.PI * 2)
      ctx.fill()

      // Border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, isSelected ? 14 : 10, 0, Math.PI * 2)
      ctx.stroke()

      // Blood type label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.globalAlpha = 1
      ctx.fillText(donor.bloodGroup, pos.x, pos.y)

      // Verification checkmark
      if (donor.verified) {
        ctx.fillStyle = "#16a34a"
        ctx.font = "bold 12px sans-serif"
        ctx.fillText("✓", pos.x + 12, pos.y - 10)
      }

      // Tooltip on hover
      if (isHovered) {
        const tooltipText = `${donor.name} (${donor.bloodGroup})`
        ctx.globalAlpha = 0.95
        ctx.fillStyle = "#000000"
        ctx.font = "12px sans-serif"
        const textWidth = ctx.measureText(tooltipText).width
        ctx.fillRect(pos.x - textWidth / 2 - 8, pos.y - 35, textWidth + 16, 24)

        ctx.fillStyle = "#ffffff"
        ctx.fillText(tooltipText, pos.x, pos.y - 23)
        ctx.globalAlpha = 1
      }
    })
  }, [donors, hoveredDonorId, selectedDonorId, selectedBloodGroup])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let foundDonor = false
    for (const donor of donors) {
      const pos = getCanvasCoordinates(donor.lat, donor.lng, canvas.width, canvas.height)
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)

      if (distance < 18) {
        setHoveredDonorId(donor.id)
        canvas.style.cursor = "pointer"
        foundDonor = true
        break
      }
    }

    if (!foundDonor) {
      setHoveredDonorId(null)
      canvas.style.cursor = "grab"
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !hoveredDonorId || !onDonorSelect) return

    const donor = donors.find((d) => d.id === hoveredDonorId)
    if (donor) {
      // Calculate distance
      const distance = calculateDistance(KARACHI_CENTER.lat, KARACHI_CENTER.lng, donor.lat, donor.lng)
      onDonorSelect({ ...donor, distance })
    }
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="space-y-3 mb-4">
          <h3 className="font-semibold text-sm">Karachi Donor Locations</h3>
          <p className="text-xs text-muted-foreground">
            Click on markers to view donor details • Red markers show donors in your area
          </p>
        </div>
        <div className="border border-border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
            className="w-full h-auto block cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredDonorId(null)}
            onClick={handleClick}
          />
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full" />
            <span>Active Donors</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Verified Donors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
