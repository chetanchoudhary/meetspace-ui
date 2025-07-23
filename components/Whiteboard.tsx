"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Eraser, Square, Circle, Minus, RotateCcw, Download } from "lucide-react"

type Tool = "pen" | "eraser" | "rectangle" | "circle" | "line"

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<Tool>("pen")
  const [currentColor, setCurrentColor] = useState("#ffffff")
  const [lineWidth, setLineWidth] = useState(2)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set default styles
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = currentColor
    ctx.lineWidth = lineWidth
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setStartPos({ x, y })

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = currentColor
    ctx.lineWidth = lineWidth

    if (currentTool === "pen") {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentTool === "pen") {
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.beginPath()
      ctx.arc(x, y, lineWidth * 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.globalCompositeOperation = "source-over"
    }
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentTool === "rectangle") {
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y)
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2))
      ctx.beginPath()
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    } else if (currentTool === "line") {
      ctx.beginPath()
      ctx.moveTo(startPos.x, startPos.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "whiteboard.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const colors = ["#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#000000"]

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Tools */}
            <Button
              variant={currentTool === "pen" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentTool("pen")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === "eraser" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentTool("eraser")}
            >
              <Eraser className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === "rectangle" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentTool("rectangle")}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === "circle" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentTool("circle")}
            >
              <Circle className="w-4 h-4" />
            </Button>
            <Button
              variant={currentTool === "line" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentTool("line")}
            >
              <Minus className="w-4 h-4" />
            </Button>

            {/* Line Width */}
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-white">{lineWidth}px</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Colors */}
            <div className="flex space-x-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 ${currentColor === color ? "border-white" : "border-gray-600"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCanvas}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4">
        <Card className="w-full h-full bg-white">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </Card>
      </div>
    </div>
  )
}
