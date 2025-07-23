"use client"

import { useRef, useEffect, useState } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Maximize2, Minimize2, X, Monitor } from "lucide-react"

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
  const { displayName, screenShareStream, screenShareOn } = useParticipant(participantId)
  const screenShareRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (screenShareRef.current && screenShareStream) {
      const videoObj = screenShareRef.current

      if (videoObj.srcObject !== screenShareStream) {
        videoObj.srcObject = screenShareStream
        videoObj.play().catch(console.error)
      }

      const handleLoadedData = () => setIsLoading(false)
      const handleError = () => setIsLoading(false)

      videoObj.addEventListener("loadeddata", handleLoadedData)
      videoObj.addEventListener("error", handleError)

      return () => {
        videoObj.removeEventListener("loadeddata", handleLoadedData)
        videoObj.removeEventListener("error", handleError)
      }
    }
  }, [screenShareStream])

  if (!screenShareOn || !screenShareStream) {
    return null
  }

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-black flex items-center justify-center"
    : "relative w-full h-full"

  return (
    <div className={containerClasses}>
      <Card className={`${isFullscreen ? "w-full h-full" : "w-full"} bg-gray-900 border-gray-700 overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">{displayName} is sharing</span>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Screen Share
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {onToggleFullscreen && (
              <Button variant="ghost" size="sm" onClick={onToggleFullscreen} className="text-gray-400 hover:text-white">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            )}

            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Screen Share Content */}
        <div className="relative bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <Monitor className="w-12 h-12 mx-auto text-gray-400 mb-2 animate-pulse" />
                <p className="text-gray-400">Loading screen share...</p>
              </div>
            </div>
          )}

          <video
            ref={screenShareRef}
            autoPlay
            playsInline
            muted
            className={`w-full ${isFullscreen ? "h-screen object-contain" : "h-64 md:h-96 object-contain"}`}
            style={{ backgroundColor: "#000" }}
          />
        </div>
      </Card>
    </div>
  )
}
