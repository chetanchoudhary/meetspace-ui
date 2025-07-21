"use client"

import { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Monitor, MonitorOff, Settings, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface ScreenShareControlsProps {
  className?: string
}

export function ScreenShareControls({ className }: ScreenShareControlsProps) {
  const { localScreenShareOn, toggleScreenShare } = useMeeting()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggleScreenShare = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await toggleScreenShare()
    } catch (err) {
      setError("Failed to toggle screen share. Please try again.")
      console.error("Screen share error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`p-4 bg-gray-800 border-gray-700 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Screen Share
          </h3>
          <Badge
            variant={localScreenShareOn ? "secondary" : "outline"}
            className={localScreenShareOn ? "bg-green-600" : ""}
          >
            {localScreenShareOn ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2 text-sm">
          {localScreenShareOn ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Your screen is being shared</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Screen sharing is off</span>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-900/20 p-2 rounded">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={localScreenShareOn ? "destructive" : "default"}
            onClick={handleToggleScreenShare}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : localScreenShareOn ? (
              <MonitorOff className="w-4 h-4 mr-2" />
            ) : (
              <Monitor className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Processing..." : localScreenShareOn ? "Stop Sharing" : "Start Sharing"}
          </Button>

          <Button variant="outline" size="sm" className="px-3 bg-transparent">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Share your entire screen, application window, or browser tab</p>
          <p>• Other participants will see your shared content in real-time</p>
          <p>• You can stop sharing at any time</p>
        </div>
      </div>
    </Card>
  )
}
