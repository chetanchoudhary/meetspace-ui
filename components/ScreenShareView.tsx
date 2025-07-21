"use client"

import { useEffect, useRef } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Monitor, Maximize2, Minimize2, X } from "lucide-react"

interface ScreenShareViewProps {
  participantId: string
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  onClose?: () => void
}

export function ScreenShareView({
  participantId,
  isFullscreen = false,
  onToggleFullscreen,
  onClose,
}: ScreenShareViewProps) {
  const { screenShareStream, displayName, isLocal } = useParticipant(participantId)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (screenShareStream && videoRef.current) {
      const mediaStream = new MediaStream()
      mediaStream.addTrack(screenShareStream.track)
      videoRef.current.srcObject = mediaStream
      videoRef.current.play().catch(console.error)
    }
  }, [screenShareStream])

  if (!screenShareStream) {
    return null
  }

  return (
    <Card
      className={`relative bg-black border-gray-700 overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "aspect-video"
      }`}
    >
      {/* Screen Share Video */}
      <video ref={videoRef} className="w-full h-full object-contain" autoPlay muted playsInline />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <Badge variant="secondary" className="bg-blue-600 text-white">
          <Monitor className="w-4 h-4 mr-1" />
          {displayName || "Unknown"} {isLocal && "(You)"}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {onToggleFullscreen && (
          <Button variant="secondary" size="sm" onClick={onToggleFullscreen} className="bg-black/50 hover:bg-black/70">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        )}
        {onClose && (
          <Button variant="secondary" size="sm" onClick={onClose} className="bg-black/50 hover:bg-black/70">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Screen Share Info */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/50 rounded-lg p-2 text-white text-sm">
          Screen sharing from {displayName || "Unknown"}
        </div>
      </div>
    </Card>
  )
}
