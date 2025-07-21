"use client"

import { useParticipant } from "@videosdk.live/react-sdk"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MicOff, VideoOff } from "lucide-react"
import { useEffect, useRef } from "react"

interface ParticipantGridProps {
  participants: Map<string, any>
}

export function ParticipantGrid({ participants }: ParticipantGridProps) {
  const participantArray = Array.from(participants.values())

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-2"
    if (count <= 4) return "grid-cols-2"
    if (count <= 6) return "grid-cols-3"
    return "grid-cols-4"
  }

  return (
    <div className={`grid gap-4 h-full ${getGridCols(participantArray.length)}`}>
      {participantArray.map((participant) => (
        <ParticipantTile key={participant.id} participantId={participant.id} />
      ))}
    </div>
  )
}

function ParticipantTile({ participantId }: { participantId: string }) {
  const { webcamStream, micOn, webcamOn, isLocal, displayName, screenShareStream, screenShareOn } =
    useParticipant(participantId)

  const videoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      const mediaStream = new MediaStream()
      mediaStream.addTrack(webcamStream.track)
      videoRef.current.srcObject = mediaStream
      videoRef.current.play().catch(console.error)
    }
  }, [webcamStream])

  useEffect(() => {
    if (screenShareStream && screenShareRef.current) {
      const mediaStream = new MediaStream()
      mediaStream.addTrack(screenShareStream.track)
      screenShareRef.current.srcObject = mediaStream
      screenShareRef.current.play().catch(console.error)
    }
  }, [screenShareStream])

  return (
    <Card className="relative bg-gray-800 border-gray-700 overflow-hidden aspect-video">
      {/* Screen Share Stream */}
      {screenShareOn && screenShareStream ? (
        <video ref={screenShareRef} className="w-full h-full object-cover" autoPlay muted playsInline />
      ) : (
        <>
          {/* Webcam Stream */}
          {webcamOn && webcamStream ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted={isLocal} playsInline />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-700">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-white">{displayName?.charAt(0)?.toUpperCase() || "U"}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2">
        <Badge variant="secondary" className="bg-black/50 text-white">
          {displayName || "Unknown"}
          {isLocal && " (You)"}
        </Badge>
      </div>

      {/* Audio/Video Status */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        {!micOn && (
          <div className="bg-red-500 rounded-full p-1">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
        {!webcamOn && (
          <div className="bg-red-500 rounded-full p-1">
            <VideoOff className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Screen Share Indicator */}
      {screenShareOn && (
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-blue-600 text-white">
            Screen Sharing
          </Badge>
        </div>
      )}
    </Card>
  )
}
