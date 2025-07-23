"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, X, Maximize2, User } from "lucide-react"

interface ScreenShareNotificationProps {
  presenterName: string
  onDismiss: () => void
  onViewFullscreen: () => void
}

export function ScreenShareNotification({ presenterName, onDismiss, onViewFullscreen }: ScreenShareNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss()
    }, 10000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <Card className="bg-gray-800 border-gray-700 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-600 text-white">Screen Share Started</Badge>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  <User className="w-3 h-3 inline mr-1" />
                  {presenterName} is sharing their screen
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={onViewFullscreen}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  setIsVisible(false)
                  onDismiss()
                }}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
