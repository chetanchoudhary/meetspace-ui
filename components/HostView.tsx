"use client"

import { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ParticipantGrid } from "./ParticipantGrid"
import { ChatPanel } from "./ChatPanel"
import { ParticipantsList } from "./ParticipantsList"
import { Whiteboard } from "./Whiteboard"
import { ScreenShareView } from "./ScreenShareView"
import { ScreenShareControls } from "./ScreenShareControls"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageSquare,
  Users,
  PenTool,
  Phone,
  Settings,
  RepeatIcon as Record,
  StopCircle,
} from "lucide-react"

interface HostViewProps {
  onLeaveMeeting: () => void
}

export function HostView({ onLeaveMeeting }: HostViewProps) {
  const [activePanel, setActivePanel] = useState<"chat" | "participants" | "whiteboard" | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const {
    leave,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    localMicOn,
    localWebcamOn,
    localScreenShareOn,
    participants,
    presenterId,
    meetingId,
    startRecording,
    stopRecording,
  } = useMeeting({
    onMeetingLeft: () => {
      console.log("Meeting left from HostView")
      onLeaveMeeting()
    },
    onError: (error) => {
      console.error("Meeting error in HostView:", error)
    },
    onRecordingStarted: () => {
      setIsRecording(true)
    },
    onRecordingStopped: () => {
      setIsRecording(false)
    },
  })

  const handleLeaveMeeting = () => {
    if (leave) {
      leave()
    }
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const participantCount = participants ? participants.size : 0

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white font-semibold">Meeting Room</h1>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              ID: {meetingId}
            </Badge>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Host
            </Badge>
            {isRecording && (
              <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
                <Record className="w-3 h-3 mr-1" />
                Recording
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">{participantCount} participants</span>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Screen Share or Participant Grid */}
          <div className="flex-1 p-4">
            {presenterId ? (
              <ScreenShareView presenterId={presenterId} />
            ) : (
              <ParticipantGrid participants={participants} />
            )}
          </div>

          {/* Controls Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              {/* Media Controls */}
              <Button
                onClick={toggleMic}
                variant={localMicOn ? "default" : "secondary"}
                size="lg"
                className={localMicOn ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}
              >
                {localMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              <Button
                onClick={toggleWebcam}
                variant={localWebcamOn ? "default" : "secondary"}
                size="lg"
                className={localWebcamOn ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}
              >
                {localWebcamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              {/* Screen Share */}
              <ScreenShareControls isSharing={localScreenShareOn} onToggleScreenShare={toggleScreenShare} />

              {/* Recording */}
              <Button
                onClick={handleToggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                className={
                  isRecording ? "bg-red-600 hover:bg-red-700" : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Record className="w-5 h-5" />}
              </Button>

              {/* Panel Toggles */}
              <Button
                onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
                variant={activePanel === "chat" ? "default" : "outline"}
                size="lg"
                className={
                  activePanel === "chat"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                <MessageSquare className="w-5 h-5" />
              </Button>

              <Button
                onClick={() => setActivePanel(activePanel === "participants" ? null : "participants")}
                variant={activePanel === "participants" ? "default" : "outline"}
                size="lg"
                className={
                  activePanel === "participants"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                <Users className="w-5 h-5" />
              </Button>

              <Button
                onClick={() => setActivePanel(activePanel === "whiteboard" ? null : "whiteboard")}
                variant={activePanel === "whiteboard" ? "default" : "outline"}
                size="lg"
                className={
                  activePanel === "whiteboard"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                <PenTool className="w-5 h-5" />
              </Button>

              {/* Leave Meeting */}
              <Button
                onClick={handleLeaveMeeting}
                variant="destructive"
                size="lg"
                className="bg-red-600 hover:bg-red-700 ml-8"
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            {activePanel === "chat" && <ChatPanel />}
            {activePanel === "participants" && <ParticipantsList participants={participants} />}
            {activePanel === "whiteboard" && <Whiteboard />}
          </div>
        )}
      </div>
    </div>
  )
}
