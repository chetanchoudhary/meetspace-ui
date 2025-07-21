"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk"
import { HostView } from "./HostView"
import { GuestView } from "./GuestView"
import { WaitingRoom } from "./WaitingRoom"
import { PreMeetingLobby } from "./PreMeetingLobby"

export function MeetingRoom() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const roomId = searchParams.get("roomid")
  const userName = searchParams.get("name")

  if (!token || !roomId || !userName) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Meeting Link</h1>
          <p>Please check your meeting URL and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <MeetingProvider
      config={{
        meetingId: roomId,
        micEnabled: false,
        webcamEnabled: false,
        name: userName,
      }}
      token={token}
    >
      <MeetingContainer />
    </MeetingProvider>
  )
}

function MeetingContainer() {
  const { meeting, participants } = useMeeting()
  const [isHost, setIsHost] = useState(false)
  const [meetingState, setMeetingState] = useState<"lobby" | "waiting" | "joined" | "left">("lobby")
  const [lobbySettings, setLobbySettings] = useState({
    displayName: "",
    micEnabled: false,
    webcamEnabled: false,
    selectedMicId: "",
    selectedWebcamId: "",
    selectedSpeakerId: "",
  })

  useEffect(() => {
    if (meeting) {
      // Simple host detection - first participant
      const participantArray = Array.from(participants.values())
      setIsHost(participantArray.length <= 1)

      meeting.on("meeting-joined", () => {
        setMeetingState("joined")
      })

      meeting.on("meeting-left", () => {
        setMeetingState("left")
      })
    }
  }, [meeting, participants])

  const handleLobbyComplete = (settings: typeof lobbySettings) => {
    setLobbySettings(settings)
    setMeetingState("waiting")
  }

  if (meetingState === "lobby") {
    return <PreMeetingLobby onComplete={handleLobbyComplete} />
  }

  if (meetingState === "waiting") {
    return <WaitingRoom isHost={isHost} lobbySettings={lobbySettings} />
  }

  if (meetingState === "left") {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Meeting Ended</h1>
          <p>Thank you for joining the meeting.</p>
        </div>
      </div>
    )
  }

  return isHost ? <HostView /> : <GuestView />
}
