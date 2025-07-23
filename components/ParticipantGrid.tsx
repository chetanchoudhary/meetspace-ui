"use client"

import { useEffect, useRef } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, VideoOff, Pin, MoreVertical, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ParticipantViewProps {
  participantId: string
}

function ParticipantView({ participantId }: ParticipantViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { displayName, webcamStream, micOn, webcamOn, isLocal, mode } = useParticipant(participantId)

  useEffect(() => {
    if (videoRef.current && webcamStream) {
      // Type check to ensure webcamStream is a MediaStream
      if (webcamStream instanceof MediaStream) {
        const videoObj = videoRef.current
        if (videoObj.srcObject !== webcamStream) {
          videoObj.srcObject = webcamStream
          videoObj.play().catch((error) => {
            console.error("Error playing video:", error)
          })
        }
      } else {
        console.warn("webcamStream is not a MediaStream:", webcamStream)
      }
    }
  }, [webcamStream])

  return (
    <Card className="relative bg-gray-800 border-gray-700 overflow-hidden group">
      <div className="aspect-video relative">
        {webcamOn && webcamStream ? (
          <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-semibold text-lg">{displayName?.charAt(0)?.toUpperCase() || "?"}</span>
              </div>
              <VideoOff className="w-6 h-6 text-gray-500 mx-auto" />
            </div>
          </div>
        )}

        {/* Participant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-medium truncate">{displayName || "Unknown"}</span>
              {isLocal && (
                <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                  You
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {micOn ? <Mic className="w-4 h-4 text-green-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
            </div>
          </div>
        </div>

        {/* Hover Controls */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <Button size="sm" variant="secondary" className="bg-black/50 hover:bg-black/70 text-white">
              <Pin className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-black/50 hover:bg-black/70 text-white">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface ParticipantGridProps {
  participants: Map<string, any> | undefined
}

export function ParticipantGrid({ participants }: ParticipantGridProps) {
  if (!participants || participants.size === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <p>No participants in the meeting</p>
        </div>
      </div>
    )
  }

  const participantIds = Array.from(participants.keys())
  const participantCount = participantIds.length

  // Determine grid layout based on participant count
  const getGridClass = () => {
    if (participantCount === 1) return "grid-cols-1"
    if (participantCount === 2) return "grid-cols-2"
    if (participantCount <= 4) return "grid-cols-2 grid-rows-2"
    if (participantCount <= 6) return "grid-cols-3 grid-rows-2"
    if (participantCount <= 9) return "grid-cols-3 grid-rows-3"
    return "grid-cols-4 grid-rows-3"
  }

  return (
    <div className="h-full p-4">
      <div className={`grid ${getGridClass()} gap-4 h-full`}>
        {participantIds.map((participantId) => (
          <ParticipantView key={participantId} participantId={participantId} />
        ))}
      </div>
    </div>
  )
}
