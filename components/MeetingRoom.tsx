"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { MeetingProvider } from "@videosdk.live/react-sdk"
import { PreMeetingLobby } from "./PreMeetingLobby"
import { WaitingRoom } from "./WaitingRoom"
import { HostView } from "./HostView"

type MeetingState = "lobby" | "waiting" | "joined"

interface LobbySettings {
  displayName: string
  audioEnabled: boolean
  videoEnabled: boolean
  selectedCamera?: string
  selectedMicrophone?: string
  selectedSpeaker?: string
}

export function MeetingRoom() {
  const searchParams = useSearchParams()
  const [meetingState, setMeetingState] = useState<MeetingState>("lobby")
  const [lobbySettings, setLobbySettings] = useState<LobbySettings>({
    displayName: searchParams?.get("name") || "Anonymous",
    audioEnabled: true,
    videoEnabled: true,
  })

  const token = searchParams?.get("token")
  const meetingId = searchParams?.get("roomid")

  const handleJoinFromLobby = (settings: LobbySettings) => {
    setLobbySettings(settings)
    setMeetingState("waiting")
  }

  const handleMeetingJoined = () => {
    console.log("Meeting joined successfully")
    setMeetingState("joined")
  }

  const handleLeaveMeeting = () => {
    setMeetingState("lobby")
  }

  if (!token || !meetingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Meeting Link</h1>
          <p className="text-gray-600 mb-4">
            Please check your meeting URL and ensure it includes both token and roomid parameters.
          </p>
          <div className="text-sm text-gray-500 bg-gray-100 p-4 rounded-lg">
            <p className="font-medium mb-2">Expected format:</p>
            <code className="text-xs break-all">/meeting?token=YOUR_JWT_TOKEN&roomid=YOUR_ROOM_ID</code>
          </div>
        </div>
      </div>
    )
  }

  if (meetingState === "lobby") {
    return <PreMeetingLobby initialSettings={lobbySettings} onJoinMeeting={handleJoinFromLobby} />
  }

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: lobbySettings.audioEnabled,
        webcamEnabled: lobbySettings.videoEnabled,
        name: lobbySettings.displayName,
        mode: "CONFERENCE",
      }}
      token={token}
    >
      {meetingState === "waiting" ? (
        <WaitingRoom onMeetingJoined={handleMeetingJoined} onLeaveMeeting={handleLeaveMeeting} />
      ) : (
        <HostView onLeaveMeeting={handleLeaveMeeting} />
      )}
    </MeetingProvider>
  )
}
