"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Square, Circle, Type, Eraser, Trash2, Download, Palette, Minus, RotateCcw } from "lucide-react"

type Tool = "pen" | "rectangle" | "circle" | "text" | "eraser"

interface DrawingPoint {
  x: number
  y: number
}

interface DrawingPath {
  id: string
  tool: Tool
  points: DrawingPoint[]
  color: string
  strokeWidth: number
}

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<Tool>("pen")
  const [currentColor, setCurrentColor] = useState("#3B82F6")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [paths, setPaths] = useState<DrawingPath[]>([])
  const [currentPath, setCurrentPath] = useState<DrawingPoint[]>([])

  const colors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#EC4899", // Pink
    "#000000", // Black
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Redraw all paths
    paths.forEach((path) => {
      if (path.points.length < 2) return

      ctx.strokeStyle = path.color
      ctx.lineWidth = path.strokeWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(path.points[0].x, path.points[0].y)

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y)
      }

      ctx.stroke()
    })
  }, [paths])

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const pos = getMousePos(e)
    setCurrentPath([pos])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const pos = getMousePos(e)
    setCurrentPath((prev) => [...prev, pos])

    // Draw current stroke
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = currentColor
    ctx.lineWidth = strokeWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (currentPath.length > 0) {
      ctx.beginPath()
      ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing) return

    setIsDrawing(false)

    if (currentPath.length > 1) {
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        tool: currentTool,
        points: currentPath,
        color: currentColor,
        strokeWidth: strokeWidth,
      }

      setPaths((prev) => [...prev, newPath])
    }

    setCurrentPath([])
  }

  const clearCanvas = () => {
    setPaths([])
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const undoLastAction = () => {
    setPaths((prev) => prev.slice(0, -1))
  }

  const tools = [
    { id: "pen" as Tool, icon: PenTool, label: "Pen" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "text" as Tool, icon: Type, label: "Text" },
    { id: "eraser" as Tool, icon: Eraser, label: "Eraser" },
  ]

  return (
    <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <PenTool className="w-5 h-5 mr-2" />
            Whiteboard
          </div>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            Collaborative
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Toolbar */}
        <div className="border-b border-gray-700 p-4 space-y-4">
          {/* Tools */}
          <div className="flex items-center space-x-2">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Button
                  key={tool.id}
                  onClick={() => setCurrentTool(tool.id)}
                  variant={currentTool === tool.id ? "default" : "outline"}
                  size="sm"
                  className={
                    currentTool === tool.id
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  <IconComponent className="w-4 h-4" />
                </Button>
              )
            })}
          </div>

          {/* Colors */}
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-6 h-6 rounded border-2 ${currentColor === color ? "border-white" : "border-gray-600"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="flex items-center space-x-2">
            <Minus className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-gray-400 text-sm w-6">{strokeWidth}px</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={undoLastAction}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              disabled={paths.length === 0}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              onClick={clearCanvas}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white rounded-lg border border-gray-600 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </CardContent>
    </Card>
  )
}
