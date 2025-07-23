"use client"

import { useRef, useEffect } from "react"
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScreenShareView } from "./ScreenShareView"
import { Mic, MicOff, Video, VideoOff, Crown, Monitor, User } from "lucide-react"

interface ParticipantTileProps {
  participantId: string
  isLocal?: boolean
}

function ParticipantTile({ participantId, isLocal = false }: ParticipantTileProps) {
  const { displayName, webcamStream, micOn, webcamOn, screenShareOn, isHost } = useParticipant(participantId)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && webcamStream) {
      const videoObj = videoRef.current
      if (videoObj.srcObject !== webcamStream) {
        videoObj.srcObject = webcamStream
        videoObj.play().catch(console.error)
      }
    }
  }, [webcamStream])

  const initials =
    displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <Card className="relative bg-gray-800 border-gray-700 overflow-hidden aspect-video">
      {/* Video or Avatar */}
      {webcamOn && webcamStream ? (
        <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-gray-600 text-white text-lg">{initials}</AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
        {/* Top badges */}
        <div className="absolute top-2 left-2 flex space-x-1">
          {isHost && (
            <Badge variant="secondary" className="bg-yellow-600 text-white text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Host
            </Badge>
          )}
          {isLocal && (
            <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
              You
            </Badge>
          )}
          {screenShareOn && (
            <Badge variant="secondary" className="bg-green-600 text-white text-xs">
              <Monitor className="w-3 h-3 mr-1" />
              Sharing
            </Badge>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-white text-sm font-medium truncate">{displayName || "Unknown"}</span>

          <div className="flex space-x-1">
            <div className={`p-1 rounded ${micOn ? "bg-green-600" : "bg-red-600"}`}>
              {micOn ? <Mic className="w-3 h-3 text-white" /> : <MicOff className="w-3 h-3 text-white" />}
            </div>

            <div className={`p-1 rounded ${webcamOn ? "bg-green-600" : "bg-red-600"}`}>
              {webcamOn ? <Video className="w-3 h-3 text-white" /> : <VideoOff className="w-3 h-3 text-white" />}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function ParticipantGrid() {
  const { localParticipant, participants } = useMeeting()

  // Get all participants including local
  const allParticipants = [{ id: "local", ...localParticipant }, ...Array.from(participants.values())]

  // Separate screen sharing participants
  const screenSharingParticipants = allParticipants.filter((p) => p.screenShareOn)
  const regularParticipants = allParticipants.filter((p) => !p.screenShareOn)

  // Calculate grid layout
  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-1 md:grid-cols-2"
    if (count <= 4) return "grid-cols-2"
    if (count <= 6) return "grid-cols-2 md:grid-cols-3"
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Screen Shares Section */}
      {screenSharingParticipants.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Screen Shares</span>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {screenSharingParticipants.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {screenSharingParticipants.map((participant) => (
              <ScreenShareView
                key={`screen-${participant.id}`}
                participantId={participant.id === "local" ? "local" : participant.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Participants Grid */}
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Participants</span>
          <Badge variant="outline" className="border-gray-500 text-gray-400">
            {regularParticipants.length}
          </Badge>
        </div>

        <div className={`grid ${getGridCols(regularParticipants.length)} gap-4 h-full`}>
          {regularParticipants.map((participant) => (
            <ParticipantTile
              key={participant.id}
              participantId={participant.id === "local" ? "local" : participant.id}
              isLocal={participant.id === "local"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
