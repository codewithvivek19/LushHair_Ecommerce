"use client"

import { useEffect, useRef } from "react"

export function SalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sample data
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    const salesData = [
      420, 450, 380, 410, 490, 520, 480, 510, 490, 530, 550, 520, 560, 580, 540, 570, 590, 610, 580, 620, 640, 600, 630,
      650, 670, 640, 680, 700, 720, 750,
    ]

    // Chart dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#e2e8f0"
    ctx.stroke()

    // Calculate scales
    const xScale = (width - 2 * padding) / (days.length - 1)
    const yMax = Math.max(...salesData) * 1.1
    const yScale = (height - 2 * padding) / yMax

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"

    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * (height - 2 * padding)) / 5
      const value = Math.round((i * yMax) / 5)
      ctx.fillText(`$${value}`, padding - 10, y)

      // Draw horizontal grid lines
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.strokeStyle = "#e2e8f0"
      ctx.stroke()
    }

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    for (let i = 0; i < days.length; i += 5) {
      const x = padding + i * xScale
      ctx.fillText(`${days[i]}`, x, height - padding + 10)
    }

    // Draw data line
    ctx.beginPath()
    ctx.moveTo(padding, height - padding - salesData[0] * yScale)

    for (let i = 1; i < days.length; i++) {
      const x = padding + i * xScale
      const y = height - padding - salesData[i] * yScale
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding + (days.length - 1) * xScale, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
    ctx.fill()

    // Draw data points
    for (let i = 0; i < days.length; i++) {
      const x = padding + i * xScale
      const y = height - padding - salesData[i] * yScale

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} width={800} height={300} className="h-full w-full" />
    </div>
  )
}

