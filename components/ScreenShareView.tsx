"use client"

import { useEffect, useRef } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, Maximize2, Minimize2, User } from "lucide-react"
import { useState } from "react"

interface ScreenShareViewProps {
  presenterId: string
}

export function ScreenShareView({ presenterId }: ScreenShareViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { displayName, screenShareStream, screenShareOn } = useParticipant(presenterId)

  useEffect(() => {
    if (videoRef.current && screenShareStream) {
      if (screenShareStream instanceof MediaStream) {
        const videoObj = videoRef.current
        if (videoObj.srcObject !== screenShareStream) {
          videoObj.srcObject = screenShareStream
          videoObj.play().catch((error) => {
            console.error("Error playing screen share video:", error)
          })
        }
      }
    }
  }, [screenShareStream])

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  if (!screenShareOn || !screenShareStream) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-center text-gray-400">
          <Monitor className="w-12 h-12 mx-auto mb-4" />
          <p>No screen share active</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-full relative group">
      <Card className="h-full bg-gray-900 border-gray-700 overflow-hidden">
        <div className="h-full relative">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />

          {/* Screen Share Info Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-600 text-white">
                <Monitor className="w-3 h-3 mr-1" />
                Screen Share
              </Badge>
              <Badge variant="secondary" className="bg-gray-800/80 text-white">
                <User className="w-3 h-3 mr-1" />
                {displayName || "Unknown"}
              </Badge>
            </div>

            <Button
              onClick={toggleFullscreen}
              variant="secondary"
              size="sm"
              className="bg-gray-800/80 hover:bg-gray-700/80 text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* Presenter Info */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-800/80 rounded-lg px-3 py-2">
              <p className="text-white text-sm font-medium">{displayName || "Unknown"} is presenting</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
