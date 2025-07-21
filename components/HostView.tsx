"use client"

import { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Users,
  MessageSquare,
  Phone,
  UserCheck,
  UserX,
  Palette,
} from "lucide-react"
import { ParticipantGrid } from "./ParticipantGrid"
import { ChatPanel } from "./ChatPanel"
import { Whiteboard } from "./Whiteboard"
import { ParticipantsList } from "./ParticipantsList"

export function HostView() {
  const {
    meeting,
    participants,
    localMicOn,
    localWebcamOn,
    localScreenShareOn,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    leave,
    end,
  } = useMeeting({
    onEntryRequested: (data: any) => {
      setPendingRequests((prev) => [...prev, data])
    },
    onEntryResponded: (participantId: string) => {
      setPendingRequests((prev) => prev.filter((req) => req.participantId !== participantId))
    },
  })

  const [activePanel, setActivePanel] = useState<"participants" | "chat" | "whiteboard" | null>(null)
  const [pendingRequests, setPendingRequests] = useState<any[]>([])

  const handleApproveEntry = (participantId: string) => {
    meeting?.respondEntry(participantId, "allowed")
  }

  const handleRejectEntry = (participantId: string) => {
    meeting?.respondEntry(participantId, "denied")
  }

  const participantCount = participants.size

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Meeting Room</h1>
            <Badge variant="secondary" className="bg-green-600">
              <Users className="w-4 h-4 mr-1" />
              Host
            </Badge>
            <Badge variant="outline">
              {participantCount} participant{participantCount !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-yellow-400">
                {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}
              </span>
              {pendingRequests.map((request) => (
                <div key={request.participantId} className="flex items-center space-x-2 bg-gray-700 p-2 rounded">
                  <span className="text-sm">{request.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 text-green-400 border-green-400 bg-transparent"
                    onClick={() => handleApproveEntry(request.participantId)}
                  >
                    <UserCheck className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 text-red-400 border-red-400 bg-transparent"
                    onClick={() => handleRejectEntry(request.participantId)}
                  >
                    <UserX className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4">
          {activePanel === "whiteboard" ? <Whiteboard /> : <ParticipantGrid participants={participants} />}
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={localMicOn ? "default" : "destructive"}
              size="lg"
              onClick={toggleMic}
              className="rounded-full w-12 h-12"
            >
              {localMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
              variant={localWebcamOn ? "default" : "destructive"}
              size="lg"
              onClick={toggleWebcam}
              className="rounded-full w-12 h-12"
            >
              {localWebcamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button
              variant={localScreenShareOn ? "secondary" : "outline"}
              size="lg"
              onClick={toggleScreenShare}
              className="rounded-full w-12 h-12"
            >
              {localScreenShareOn ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </Button>

            <Button
              variant={activePanel === "whiteboard" ? "secondary" : "outline"}
              size="lg"
              onClick={() => setActivePanel(activePanel === "whiteboard" ? null : "whiteboard")}
              className="rounded-full w-12 h-12"
            >
              <Palette className="w-5 h-5" />
            </Button>

            <Button variant="destructive" size="lg" onClick={end} className="rounded-full w-12 h-12">
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Panel Tabs */}
        <div className="flex border-b border-gray-700">
          <Button
            variant={activePanel === "participants" ? "secondary" : "ghost"}
            className="flex-1 rounded-none"
            onClick={() => setActivePanel(activePanel === "participants" ? null : "participants")}
          >
            <Users className="w-4 h-4 mr-2" />
            Participants
          </Button>
          <Button
            variant={activePanel === "chat" ? "secondary" : "ghost"}
            className="flex-1 rounded-none"
            onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {activePanel === "participants" && <ParticipantsList participants={participants} isHost={true} />}
          {activePanel === "chat" && <ChatPanel />}
        </div>
      </div>
    </div>
  )
}
