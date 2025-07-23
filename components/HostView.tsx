"use client"

import { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ParticipantGrid } from "./ParticipantGrid"
import { ParticipantsList } from "./ParticipantsList"
import { ChatPanel } from "./ChatPanel"
import { Whiteboard } from "./Whiteboard"
import { ScreenShareControls } from "./ScreenShareControls"
import { ScreenShareNotification } from "./ScreenShareNotification"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Users,
  MessageSquare,
  PenTool,
  RepeatIcon as Record,
  StopCircle,
  Crown,
} from "lucide-react"

export function HostView() {
  const [activePanel, setActivePanel] = useState<"participants" | "chat" | "whiteboard">("participants")
  const [isRecording, setIsRecording] = useState(false)

  const {
    leave,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    startRecording,
    stopRecording,
    localParticipant,
    participants,
    meetingId,
  } = useMeeting()

  const handleStartRecording = () => {
    startRecording()
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    stopRecording()
    setIsRecording(false)
  }

  const participantCount = participants ? participants.size + 1 : 1

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h1 className="text-xl font-bold text-white">Host Dashboard</h1>
            </div>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              Meeting ID: {meetingId}
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Users className="w-3 h-3 mr-1" />
              {participantCount} participants
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* Recording Controls */}
            {!isRecording ? (
              <Button onClick={handleStartRecording} size="sm" className="bg-red-600 hover:bg-red-700">
                <Record className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={handleStopRecording} size="sm" variant="destructive">
                <StopCircle className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}

            <Button onClick={leave} size="sm" variant="destructive">
              <Phone className="w-4 h-4 mr-2" />
              End Meeting
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Screen Share Notification */}
          <ScreenShareNotification />

          {/* Video Grid */}
          <div className="flex-1 p-4">
            <ParticipantGrid />
          </div>

          {/* Controls */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={toggleMic} variant={localParticipant?.micOn ? "default" : "destructive"} size="lg">
                {localParticipant?.micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              <Button onClick={toggleWebcam} variant={localParticipant?.webcamOn ? "default" : "destructive"} size="lg">
                {localParticipant?.webcamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              <ScreenShareControls />

              <Separator orientation="vertical" className="h-8" />

              <Button
                onClick={() => setActivePanel("participants")}
                variant={activePanel === "participants" ? "default" : "outline"}
                size="sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Participants
              </Button>

              <Button
                onClick={() => setActivePanel("chat")}
                variant={activePanel === "chat" ? "default" : "outline"}
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>

              <Button
                onClick={() => setActivePanel("whiteboard")}
                variant={activePanel === "whiteboard" ? "default" : "outline"}
                size="sm"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Whiteboard
              </Button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white capitalize">{activePanel}</h2>
            </div>

            <div className="flex-1 overflow-hidden">
              {activePanel === "participants" && <ParticipantsList />}
              {activePanel === "chat" && <ChatPanel />}
              {activePanel === "whiteboard" && <Whiteboard />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
