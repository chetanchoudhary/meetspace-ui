"use client"

import { useState, useEffect } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Video, VideoOff, Mic, MicOff } from "lucide-react"

interface WaitingRoomProps {
  isHost: boolean
  lobbySettings: {
    displayName: string
    micEnabled: boolean
    webcamEnabled: boolean
    selectedMicId: string
    selectedWebcamId: string
    selectedSpeakerId: string
  }
}

export function WaitingRoom({ isHost, lobbySettings }: WaitingRoomProps) {
  const { join, localMicOn, localWebcamOn, toggleMic, toggleWebcam, meeting } = useMeeting({
    onEntryResponded: (decision: string) => {
      if (decision === "denied") {
        setWaitingForApproval(false)
        setIsJoining(false)
      }
    },
  })

  const [isJoining, setIsJoining] = useState(false)
  const [waitingForApproval, setWaitingForApproval] = useState(false)

  // Apply lobby settings when component mounts
  useEffect(() => {
    if (lobbySettings.micEnabled !== localMicOn) {
      toggleMic()
    }
    if (lobbySettings.webcamEnabled !== localWebcamOn) {
      toggleWebcam()
    }
  }, [lobbySettings, localMicOn, localWebcamOn, toggleMic, toggleWebcam])

  const handleJoin = () => {
    setIsJoining(true)
    if (!isHost) {
      setWaitingForApproval(true)
    }
    join()
  }

  if (waitingForApproval) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Card className="p-8 bg-gray-800 border-gray-700 text-center max-w-md">
          <div className="mb-6">
            <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Waiting for Host Approval</h2>
            <p className="text-gray-400">The host will review your request to join the meeting. Please wait...</p>
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                Joining as: <span className="font-medium">{lobbySettings.displayName}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="p-8 bg-gray-800 border-gray-700 text-center max-w-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{isHost ? "Start Meeting" : "Join Meeting"}</h2>
          <p className="text-gray-400">{isHost ? "Ready to start the meeting" : "Ready to join the meeting"}</p>
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300">
              Joining as: <span className="font-medium">{lobbySettings.displayName}</span>
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                {lobbySettings.micEnabled ? (
                  <Mic className="w-3 h-3 text-green-400" />
                ) : (
                  <MicOff className="w-3 h-3 text-red-400" />
                )}
                <span className="text-xs">Mic</span>
              </div>
              <div className="flex items-center space-x-1">
                {lobbySettings.webcamEnabled ? (
                  <Video className="w-3 h-3 text-green-400" />
                ) : (
                  <VideoOff className="w-3 h-3 text-red-400" />
                )}
                <span className="text-xs">Camera</span>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleJoin} disabled={isJoining} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          {isJoining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isHost ? "Starting..." : "Joining..."}
            </>
          ) : isHost ? (
            "Start Meeting"
          ) : (
            "Join Meeting"
          )}
        </Button>
      </Card>
    </div>
  )
}
