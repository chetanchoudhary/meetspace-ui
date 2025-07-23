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
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, MessageSquare, PenTool, Hand } from "lucide-react"

interface GuestViewProps {
  onLeaveMeeting: () => void
}

export function GuestView({ onLeaveMeeting }: GuestViewProps) {
  const [activePanel, setActivePanel] = useState<"participants" | "chat" | "whiteboard" | null>(null)
  const [showScreenShare, setShowScreenShare] = useState(false)
  const [handRaised, setHandRaised] = useState(false)

  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn, participants, presenterId, localParticipant } =
    useMeeting({
      onMeetingLeft: () => {
        console.log("Guest left meeting")
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
    })

  const handleLeaveMeeting = () => {
    leave()
  }

  const handleRaiseHand = () => {
    setHandRaised(!handRaised)
    // In a real implementation, you would send this to other participants
    console.log(handRaised ? "Hand lowered" : "Hand raised")
  }

  const participantCount = Object.keys(participants).length + 1 // +1 for local participant

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600">Guest</Badge>
              <div className="text-white">
                <h2 className="font-semibold">{localParticipant?.displayName || "Guest"}</h2>
                <p className="text-sm text-gray-400">{participantCount} participants</p>
              </div>
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
              onClick={handleRaiseHand}
              variant={handRaised ? "default" : "secondary"}
              size="lg"
              className={handRaised ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              <Hand className="w-5 h-5" />
            </Button>

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
          {activePanel === "participants" && <ParticipantsList participants={participants} isHost={false} />}
          {activePanel === "chat" && <ChatPanel />}
          {activePanel === "whiteboard" && <Whiteboard />}
        </div>
      )}
    </div>
  )
}
