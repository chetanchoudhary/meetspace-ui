"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MeetingProvider } from "@videosdk.live/react-sdk"
import { PreMeetingLobby } from "./PreMeetingLobby"
import { WaitingRoom } from "./WaitingRoom"
import { HostView } from "./HostView"

type MeetingState = "lobby" | "waiting" | "joined" | "left" | "error"

interface LobbySettings {
  displayName: string
  audioEnabled: boolean
  videoEnabled: boolean
}

export function MeetingRoom() {
  const searchParams = useSearchParams()
  const [meetingState, setMeetingState] = useState<MeetingState>("lobby")
  const [error, setError] = useState<string | null>(null)
  const [lobbySettings, setLobbySettings] = useState<LobbySettings>({
    displayName: searchParams?.get("name") || "Anonymous User",
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

  const handleMeetingJoined = () => {
    console.log("Meeting joined successfully")
    setMeetingState("joined")
  }

  const handleMeetingLeft = () => {
    console.log("Meeting left")
    setMeetingState("left")
  }

  const handleError = (error: any) => {
    console.error("Meeting error:", error)
    setError(error?.message || "An error occurred")
    setMeetingState("error")
  }

  const handleLeaveMeeting = () => {
    setMeetingState("lobby")
    setError(null)
  }

  // Show error if missing required parameters
  if (!token || !meetingId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-4">Invalid Meeting Link</h2>
          <p className="text-red-200 mb-4">
            Please check your meeting URL and ensure it includes both token and roomid parameters.
          </p>
          <div className="text-sm text-red-300 bg-red-900 p-4 rounded-lg">
            <p className="font-medium mb-2">Expected format:</p>
            <code className="text-xs break-all">/meeting?token=YOUR_JWT_TOKEN&roomid=YOUR_ROOM_ID</code>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (meetingState === "error") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-4">Meeting Error</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={handleLeaveMeeting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show left state
  if (meetingState === "left") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-4">Meeting Ended</h2>
          <p className="text-gray-300 mb-6">You have left the meeting.</p>
          <button
            onClick={handleLeaveMeeting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Join Another Meeting
          </button>
        </div>
      </div>
    )
  }

  // Show lobby
  if (meetingState === "lobby") {
    return <PreMeetingLobby initialSettings={lobbySettings} onJoinMeeting={handleJoinFromLobby} meetingId={meetingId} />
  }

  // Show meeting with VideoSDK provider
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
      onMeetingJoined={handleMeetingJoined}
      onMeetingLeft={handleMeetingLeft}
      onError={handleError}
    >
      {meetingState === "waiting" && <WaitingRoom />}
      {meetingState === "joined" && <HostView onLeaveMeeting={handleLeaveMeeting} />}
    </MeetingProvider>
  )
}
