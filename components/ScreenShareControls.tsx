"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, MonitorOff, AlertCircle } from "lucide-react"

interface ScreenShareControlsProps {
  isSharing: boolean
  onToggleScreenShare: () => void
}

export function ScreenShareControls({ isSharing, onToggleScreenShare }: ScreenShareControlsProps) {
  const [shareError, setShareError] = useState<string | null>(null)

  const handleToggleScreenShare = async () => {
    try {
      setShareError(null)
      await onToggleScreenShare()
    } catch (error: any) {
      console.error("Screen share error:", error)
      setShareError(error.message || "Failed to share screen")
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleToggleScreenShare}
        variant={isSharing ? "destructive" : "outline"}
        size="lg"
        className={isSharing ? "bg-red-600 hover:bg-red-700" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
      >
        {isSharing ? (
          <>
            <MonitorOff className="w-5 h-5 mr-2" />
            Stop Sharing
          </>
        ) : (
          <>
            <Monitor className="w-5 h-5 mr-2" />
            Share Screen
          </>
        )}
      </Button>

      {isSharing && (
        <Badge className="bg-red-600 text-white animate-pulse">
          <Monitor className="w-3 h-3 mr-1" />
          Sharing
        </Badge>
      )}

      {shareError && (
        <div className="flex items-center space-x-1 text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{shareError}</span>
        </div>
      )}
    </div>
  )
}
