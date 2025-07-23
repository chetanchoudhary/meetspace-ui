"use client"

import { useState } from "react"
import { MeetingProvider } from "@videosdk.live/react-sdk"
import { WaitingRoom } from "./WaitingRoom"
import { HostView } from "./HostView"

interface MeetingRoomProps {
  token: string
  meetingId: string
  participantName: string
}

export function MeetingRoom({ token, meetingId, participantName }: MeetingRoomProps) {
  const [meetingState, setMeetingState] = useState<"lobby" | "waiting" | "joined" | "left" | "error">("lobby")
  const [error, setError] = useState<string | null>(null)

  const config = {
    meetingId,
    micEnabled: true,
    webcamEnabled: true,
    name: participantName,
    mode: "CONFERENCE" as const,
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

  const handleJoinMeeting = () => {
    setMeetingState("waiting")
  }

  if (meetingState === "lobby") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Join Meeting</h2>
          <p className="text-gray-300 mb-4">Meeting ID: {meetingId}</p>
          <p className="text-gray-300 mb-6">Name: {participantName}</p>
          <button
            onClick={handleJoinMeeting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Meeting
          </button>
        </div>
      </div>
    )
  }

  if (meetingState === "error") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setMeetingState("lobby")
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (meetingState === "left") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Meeting Ended</h2>
          <p className="text-gray-300 mb-6">You have left the meeting.</p>
          <button
            onClick={() => setMeetingState("lobby")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Another Meeting
          </button>
        </div>
      </div>
    )
  }

  return (
    <MeetingProvider
      config={config}
      token={token}
      onMeetingJoined={handleMeetingJoined}
      onMeetingLeft={handleMeetingLeft}
      onError={handleError}
    >
      {meetingState === "waiting" && <WaitingRoom />}
      {meetingState === "joined" && <HostView />}
    </MeetingProvider>
  )
}
