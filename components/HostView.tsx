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
import { ScreenShareNotification } from "./ScreenShareNotification"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  MessageSquare,
  PenTool,
  Settings,
  MoreVertical,
} from "lucide-react"

interface HostViewProps {
  onLeaveMeeting: () => void
}

export function HostView({ onLeaveMeeting }: HostViewProps) {
  const [activePanel, setActivePanel] = useState<"participants" | "chat" | "whiteboard" | null>(null)
  const [showScreenShare, setShowScreenShare] = useState(false)

  const {
    leave,
    toggleMic,
    toggleWebcam,
    localMicOn,
    localWebcamOn,
    participants,
    presenterId,
    localParticipant,
    startRecording,
    stopRecording,
    recordingState,
  } = useMeeting({
    onMeetingLeft: () => {
      console.log("Host left meeting")
      onLeaveMeeting()
    },
    onParticipantJoined: (participant) => {
      console.log("Participant joined:", participant.displayName)
    },
    onParticipantLeft: (participant) => {
      console.log("Participant left:", participant.displayName)
    },
    onPresenterChanged: (presenterId) => {
      console.log("Presenter changed:", presenterId)
      setShowScreenShare(!!presenterId)
    },
    onRecordingStateChanged: (data) => {
      console.log("Recording state changed:", data)
    },
  })

  const handleLeaveMeeting = () => {
    leave()
  }

  const handleToggleRecording = () => {
    if (recordingState === "RECORDING_STARTED") {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const participantCount = Object.keys(participants).length + 1 // +1 for local participant
  const isRecording = recordingState === "RECORDING_STARTED"

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-600">Host</Badge>
              <div className="text-white">
                <h2 className="font-semibold">{localParticipant?.displayName || "Host"}</h2>
                <p className="text-sm text-gray-400">{participantCount} participants</p>
              </div>
              {isRecording && (
                <Badge className="bg-red-600 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  Recording
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleToggleRecording} variant={isRecording ? "destructive" : "secondary"} size="sm">
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Screen Share Notification */}
        {presenterId && <ScreenShareNotification presenterId={presenterId} />}

        {/* Video Area */}
        <div className="flex-1 relative">
          {showScreenShare && presenterId ? (
            <ScreenShareView presenterId={presenterId} />
          ) : (
            <ParticipantGrid participants={participants} localParticipant={localParticipant} />
          )}
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={toggleMic}
              variant={localMicOn ? "default" : "secondary"}
              size="lg"
              className={localMicOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}
            >
              {localMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
              onClick={toggleWebcam}
              variant={localWebcamOn ? "default" : "secondary"}
              size="lg"
              className={localWebcamOn ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}
            >
              {localWebcamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <ScreenShareControls />

            <Button
              onClick={() => setActivePanel(activePanel === "participants" ? null : "participants")}
              variant={activePanel === "participants" ? "default" : "secondary"}
              size="lg"
            >
              <Users className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
              variant={activePanel === "chat" ? "default" : "secondary"}
              size="lg"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => setActivePanel(activePanel === "whiteboard" ? null : "whiteboard")}
              variant={activePanel === "whiteboard" ? "default" : "secondary"}
              size="lg"
            >
              <PenTool className="w-5 h-5" />
            </Button>

            <Button onClick={handleLeaveMeeting} variant="destructive" size="lg">
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {activePanel && (
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          {activePanel === "participants" && <ParticipantsList participants={participants} isHost={true} />}
          {activePanel === "chat" && <ChatPanel />}
          {activePanel === "whiteboard" && <Whiteboard />}
        </div>
      )}
    </div>
  )
}
