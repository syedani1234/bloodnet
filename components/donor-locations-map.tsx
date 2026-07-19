"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Donor {
  id: string
  name: string
  bloodGroup: string
  city: string
  lat: number
  lng: number
  lastDonation: string
  verified: boolean
  successfulDonations: number
}

interface DonorLocationsMapProps {
  donors: Donor[]
  onDonorSelect?: (donor: Donor) => void
  selectedDonorId?: string | null
}

export function DonorLocationsMap({ donors, onDonorSelect, selectedDonorId }: DonorLocationsMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredDonorId, setHoveredDonorId] = useState<string | null>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const MAP_WIDTH = 800
  const MAP_HEIGHT = 600
  const CENTER_X = MAP_WIDTH / 2
  const CENTER_Y = MAP_HEIGHT / 2

  // Normalize coordinates to map
  const getMapCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * MAP_WIDTH * scale + pan.x
    const y = ((90 - lat) / 180) * MAP_HEIGHT * scale + pan.y
    return { x, y }
  }

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw donors
    donors.forEach((donor) => {
      const { x, y } = getMapCoordinates(donor.lat, donor.lng)
      const isSelected = selectedDonorId === donor.id
      const isHovered = hoveredDonorId === donor.id

      // Draw marker circle
      ctx.fillStyle = isSelected || isHovered ? "#dc2626" : "#ef4444"
      ctx.beginPath()
      ctx.arc(x, y, isSelected ? 12 : 10, 0, Math.PI * 2)
      ctx.fill()

      // Draw white border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, isSelected ? 12 : 10, 0, Math.PI * 2)
      ctx.stroke()

      // Draw tooltip on hover
      if (isHovered) {
        const text = `${donor.name} (${donor.bloodGroup})`
        ctx.font = "12px sans-serif"
        ctx.fillStyle = "#ffffff"
        const textWidth = ctx.measureText(text).width

        ctx.fillStyle = "#000000"
        ctx.globalAlpha = 0.8
        ctx.fillRect(x - textWidth / 2 - 6, y - 30, textWidth + 12, 24)
        ctx.globalAlpha = 1

        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(text, x, y - 18)
      }
    })

    // Draw center indicator
    ctx.strokeStyle = "#9ca3af"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(CENTER_X - 10, CENTER_Y)
    ctx.lineTo(CENTER_X + 10, CENTER_Y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(CENTER_X, CENTER_Y - 10)
    ctx.lineTo(CENTER_X, CENTER_Y + 10)
    ctx.stroke()
    ctx.setLineDash([])
  }, [donors, hoveredDonorId, selectedDonorId, pan, scale])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let foundDonor = false
    for (const donor of donors) {
      const { x: mx, y: my } = getMapCoordinates(donor.lat, donor.lng)
      const distance = Math.sqrt((x - mx) ** 2 + (y - my) ** 2)

      if (distance < 15) {
        setHoveredDonorId(donor.id)
        canvas.style.cursor = "pointer"
        foundDonor = true
        break
      }
    }

    if (!foundDonor) {
      setHoveredDonorId(null)
      canvas.style.cursor = isDragging ? "grabbing" : "grab"
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredDonorId) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove2 = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !hoveredDonorId) return

    const donor = donors.find((d) => d.id === hoveredDonorId)
    if (donor && onDonorSelect) {
      onDonorSelect(donor)
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const newScale = e.deltaY < 0 ? Math.min(scale + 0.1, 3) : Math.max(scale - 0.1, 0.5)
    setScale(newScale)
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-sm">Interactive Donor Map</h3>
          <p className="text-xs text-muted-foreground">
            Drag to pan • Scroll to zoom • Click on markers for details
          </p>
        </div>
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          <canvas
            ref={canvasRef}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            className="w-full h-auto block"
            onMouseMove={(e) => {
              handleMouseMove(e)
              handleMouseMove2(e)
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
            onWheel={handleWheel}
          />
        </div>
        <div className="mt-3 text-xs text-muted-foreground text-center">
          {hoveredDonorId
            ? "Click to select donor"
            : selectedDonorId
              ? "Donor selected - view details on the right"
              : "Hover over markers to see donor info"}
        </div>
      </CardContent>
    </Card>
  )
}
