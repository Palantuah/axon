"use client"

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawHalftoneWave = () => {
      const gridSize = 15
      const rows = Math.ceil(canvas.height / gridSize)
      const cols = Math.ceil(canvas.width / gridSize)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize
          const centerY = y * gridSize
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - canvas.width / 2, 2) + 
            Math.pow(centerY - canvas.height / 2, 2)
          )
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + 
            Math.pow(canvas.height / 2, 2)
          )
          const normalizedDistance = distanceFromCenter / maxDistance
          
          const waveOffset = Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5
          const size = gridSize * waveOffset * 0.6

          ctx.beginPath()
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2)
          ctx.fillStyle = theme === 'dark' 
            ? `rgba(255, 255, 255, ${waveOffset * 0.05})`
            : `rgba(0, 0, 0, ${waveOffset * 0.05})`
          ctx.fill()
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = theme === 'dark' 
        ? 'rgba(0, 0, 0, 0.1)' 
        : 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawHalftoneWave()

      time += 0.01
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="w-full h-screen inset-0 absolute z-0 blur-sm bg-background" />
}

