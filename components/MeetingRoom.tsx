"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MeetingProvider } from "@videosdk.live/react-sdk"
import { PreMeetingLobby } from "./PreMeetingLobby"
import { WaitingRoom } from "./WaitingRoom"
import { HostView } from "./HostView"
import { GuestView } from "./GuestView"

type MeetingState = "lobby" | "waiting" | "joined"
type UserRole = "host" | "guest"

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
  const [userRole, setUserRole] = useState<UserRole>("guest")
  const [lobbySettings, setLobbySettings] = useState<LobbySettings>({
    displayName: searchParams?.get("name") || "Anonymous",
    audioEnabled: true,
    videoEnabled: true,
  })

  const token = searchParams?.get("token")
  const meetingId = searchParams?.get("roomid")

  useEffect(() => {
    if (!token || !meetingId) {
      console.error("Missing required parameters: token and roomid")
    }
  }, [token, meetingId])

  const handleJoinFromLobby = (settings: LobbySettings) => {
    setLobbySettings(settings)
    setMeetingState("waiting")
  }

  const handleMeetingJoined = (role: UserRole) => {
    setUserRole(role)
    setMeetingState("joined")
  }

  const handleLeaveMeeting = () => {
    setMeetingState("lobby")
    setUserRole("guest")
  }

  if (!token || !meetingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Meeting Link</h1>
          <p className="text-gray-600">
            Please check your meeting URL and ensure it includes both token and roomid parameters.
          </p>
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
        <WaitingRoom onMeetingJoined={handleMeetingJoined} onLeaveMeeting={handleLeaveMeeting} userRole={userRole} />
      ) : userRole === "host" ? (
        <HostView onLeaveMeeting={handleLeaveMeeting} />
      ) : (
        <GuestView onLeaveMeeting={handleLeaveMeeting} />
      )}
    </MeetingProvider>
  )
}
