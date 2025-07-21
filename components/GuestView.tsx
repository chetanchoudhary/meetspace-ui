"use client"

import { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, Phone, Monitor, MonitorOff } from "lucide-react"
import { ParticipantGrid } from "./ParticipantGrid"
import { ChatPanel } from "./ChatPanel"
import { ParticipantsList } from "./ParticipantsList"
import { ScreenShareNotification } from "./ScreenShareNotification"

export function GuestView() {
  const {
    participants,
    localMicOn,
    localWebcamOn,
    localScreenShareOn,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    leave,
  } = useMeeting()

  const [activePanel, setActivePanel] = useState<"participants" | "chat" | null>(null)
  const [focusedScreenShare, setFocusedScreenShare] = useState<string | null>(null)
  const participantCount = participants.size

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Meeting Room</h1>
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              Guest
            </Badge>
            {localScreenShareOn && (
              <Badge variant="secondary" className="bg-blue-600">
                <Monitor className="w-4 h-4 mr-1" />
                Sharing Screen
              </Badge>
            )}
            <Badge variant="outline">
              {participantCount} participant{participantCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4">
          <ParticipantGrid participants={participants} />
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
              title={localScreenShareOn ? "Stop Screen Share" : "Start Screen Share"}
            >
              {localScreenShareOn ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </Button>

            <Button variant="destructive" size="lg" onClick={leave} className="rounded-full w-12 h-12">
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
          {activePanel === "participants" && <ParticipantsList participants={participants} isHost={false} />}
          {activePanel === "chat" && <ChatPanel />}
        </div>
      </div>
      {/* Screen Share Notifications */}
      <ScreenShareNotification
        onViewScreenShare={(participantId) => {
          setFocusedScreenShare(participantId)
          setActivePanel(null) // Close other panels to focus on screen share
        }}
      />
    </div>
  )
}
