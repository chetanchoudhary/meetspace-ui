"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Monitor, X, Eye } from "lucide-react"

interface ScreenShareNotificationProps {
  participantName: string
  participantId: string
  onView?: (participantId: string) => void
  onDismiss?: () => void
  autoHide?: boolean
  duration?: number
}

export function ScreenShareNotification({
  participantName,
  participantId,
  onView,
  onDismiss,
  autoHide = true,
  duration = 5000,
}: ScreenShareNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, onDismiss])

  const handleView = () => {
    onView?.(participantId)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <Card className="p-4 bg-gray-800 border-gray-700 shadow-lg max-w-sm">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Monitor className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-semibold text-white truncate">Screen Share Started</h4>
                <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                  New
                </Badge>
              </div>

              <p className="text-sm text-gray-300 mb-3">
                <span className="font-medium">{participantName}</span> is now sharing their screen
              </p>

              <div className="flex space-x-2">
                <Button size="sm" onClick={handleView} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-gray-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
