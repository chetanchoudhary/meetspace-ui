"use client"

import { useState, useEffect } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ParticipantGrid } from "./ParticipantGrid"
import { ChatPanel } from "./ChatPanel"
import { ParticipantsList } from "./ParticipantsList"
import { ScreenShareView } from "./ScreenShareView"
import { ScreenShareNotification } from "./ScreenShareNotification"
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, MessageSquare, Monitor, Settings, User } from "lucide-react"

interface GuestViewProps {
  onLeave: () => void
}

export function GuestView({ onLeave }: GuestViewProps) {
  const {
    localMicOn,
    localWebcamOn,
    localScreenShareOn,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    participants,
    leave,
  } = useMeeting()

  const [activeTab, setActiveTab] = useState<"participants" | "chat">("participants")
  const [fullscreenScreenShare, setFullscreenScreenShare] = useState<string | null>(null)
  const [screenShareNotifications, setScreenShareNotifications] = useState<
    Array<{
      id: string
      participantName: string
      participantId: string
    }>
  >([])

  // Monitor screen sharing participants
  useEffect(() => {
    const screenSharingParticipants = Array.from(participants.values()).filter(
      (participant) => participant.screenShareOn,
    )

    // Add notifications for new screen shares
    screenSharingParticipants.forEach((participant) => {
      const existingNotification = screenShareNotifications.find((notif) => notif.participantId === participant.id)

      if (!existingNotification) {
        setScreenShareNotifications((prev) => [
          ...prev,
          {
            id: `${participant.id}-${Date.now()}`,
            participantName: participant.displayName || "Unknown",
            participantId: participant.id,
          },
        ])
      }
    })

    // Remove notifications for participants who stopped sharing
    setScreenShareNotifications((prev) =>
      prev.filter((notif) => screenSharingParticipants.some((p) => p.id === notif.participantId)),
    )
  }, [participants])

  const handleLeaveMeeting = () => {
    leave()
    onLeave()
  }

  const handleViewScreenShare = (participantId: string) => {
    setFullscreenScreenShare(participantId)
  }

  const handleDismissNotification = (notificationId: string) => {
    setScreenShareNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }

  const screenSharingParticipants = Array.from(participants.values()).filter((participant) => participant.screenShareOn)

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Meeting Room - Guest</h1>
              <Badge variant="secondary" className="bg-blue-600 text-white">
                Guest
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                {participants.size + 1} Participants
              </Badge>
              {screenSharingParticipants.length > 0 && (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  <Monitor className="w-3 h-3 mr-1" />
                  {screenSharingParticipants.length} Sharing
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Video Grid */}
          <div className="flex-1 p-4">
            {fullscreenScreenShare ? (
              <ScreenShareView
                participantId={fullscreenScreenShare}
                isFullscreen={true}
                onToggleFullscreen={() => setFullscreenScreenShare(null)}
                onClose={() => setFullscreenScreenShare(null)}
              />
            ) : (
              <ParticipantGrid participants={participants} />
            )}
          </div>

          {/* Side Panel */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab("participants")}
                className={`flex-1 p-3 text-sm font-medium ${
                  activeTab === "participants"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                Participants
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 p-3 text-sm font-medium ${
                  activeTab === "chat" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4 mx-auto mb-1" />
                Chat
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "participants" && <ParticipantsList participants={participants} isHost={false} />}
              {activeTab === "chat" && <ChatPanel />}
            </div>
          </div>
        </div>

        {/* Screen Share Display */}
        {screenSharingParticipants.length > 0 && !fullscreenScreenShare && (
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {screenSharingParticipants.slice(0, 2).map((participant) => (
                <ScreenShareView
                  key={participant.id}
                  participantId={participant.id}
                  onToggleFullscreen={() => setFullscreenScreenShare(participant.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
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
              <Monitor className="w-5 h-5" />
            </Button>

            <Separator orientation="vertical" className="h-8 bg-gray-600" />

            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 bg-transparent">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>

            <Button variant="destructive" size="lg" onClick={handleLeaveMeeting}>
              <PhoneOff className="w-5 h-5 mr-2" />
              Leave Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Screen Share Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {screenShareNotifications.map((notification) => (
          <ScreenShareNotification
            key={notification.id}
            participantName={notification.participantName}
            participantId={notification.participantId}
            onView={handleViewScreenShare}
            onDismiss={() => handleDismissNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  )
}
