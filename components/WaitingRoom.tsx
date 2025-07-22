"use client"

import { useState, useEffect } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Video, VideoOff, Mic, MicOff, Users, Clock } from "lucide-react"

interface WaitingRoomProps {
  onMeetingJoined: () => void
  onLeaveMeeting: () => void
}

export function WaitingRoom({ onMeetingJoined, onLeaveMeeting }: WaitingRoomProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [waitingForApproval, setWaitingForApproval] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [waitTime, setWaitTime] = useState(0)

  const { join, leave, localMicOn, localWebcamOn, toggleMic, toggleWebcam, meetingId, participants, localParticipant } =
    useMeeting({
      onMeetingJoined: () => {
        console.log("onMeetingJoined event fired")
        setIsJoining(false)
        setWaitingForApproval(false)
        onMeetingJoined()
      },
      onMeetingLeft: () => {
        console.log("onMeetingLeft event fired")
        onLeaveMeeting()
      },
      onError: (error) => {
        console.error("Meeting error:", error)
        setIsJoining(false)
        setWaitingForApproval(false)
        setErrorMessage("Failed to join meeting. Please check your connection and try again.")
      },
      onEntryResponded: (decision: string) => {
        console.log("Entry response:", decision)
        if (decision === "denied") {
          setWaitingForApproval(false)
          setIsJoining(false)
          setErrorMessage("Your request to join was denied by the host.")
        } else if (decision === "allowed") {
          setWaitingForApproval(false)
          // Don't call onMeetingJoined here, wait for the actual onMeetingJoined event
        }
      },
      onParticipantJoined: (participant) => {
        console.log("Participant joined:", participant)
      },
    })

  // Timer for waiting time
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (waitingForApproval) {
      interval = setInterval(() => {
        setWaitTime((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [waitingForApproval])

  const handleJoin = () => {
    setIsJoining(true)
    setErrorMessage("")
    setWaitTime(0)

    console.log("Attempting to join meeting...")
    join()
  }

  const handleLeave = () => {
    leave()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const participantCount = Object.keys(participants || {}).length

  // Show waiting for approval screen when waiting
  if (waitingForApproval) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Card className="p-8 bg-gray-800 border-gray-700 text-center max-w-md">
          <div className="mb-6">
            <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Waiting for Host Approval</h2>
            <p className="text-gray-400 mb-4">The host will review your request to join the meeting. Please wait...</p>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span>Waiting time: {formatTime(waitTime)}</span>
              </div>

              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    {localMicOn ? (
                      <Mic className="w-3 h-3 text-green-400" />
                    ) : (
                      <MicOff className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-xs">Mic</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {localWebcamOn ? (
                      <Video className="w-3 h-3 text-green-400" />
                    ) : (
                      <VideoOff className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-xs">Camera</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLeave}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            Cancel
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="p-8 bg-gray-800 border-gray-700 text-center max-w-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Join Meeting</h2>
          <p className="text-gray-400 mb-4">Ready to join the meeting</p>

          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded-lg">
              <div className="text-sm">
                <div className="mb-2">
                  <p className="text-gray-400">Meeting ID</p>
                  <p className="text-white font-mono text-xs">{meetingId}</p>
                </div>
                {localParticipant && (
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="text-white font-medium">{localParticipant.displayName}</p>
                  </div>
                )}
              </div>
            </div>

            {participantCount > 0 && (
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Users className="w-4 h-4" />
                <span>
                  {participantCount} participant{participantCount !== 1 ? "s" : ""} in meeting
                </span>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-1">
                {localMicOn ? <Mic className="w-4 h-4 text-green-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                <span className="text-xs text-gray-300">Microphone</span>
              </div>
              <div className="flex items-center space-x-1">
                {localWebcamOn ? (
                  <Video className="w-4 h-4 text-green-400" />
                ) : (
                  <VideoOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-gray-300">Camera</span>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex space-x-2">
            <Button onClick={toggleMic} variant={localMicOn ? "default" : "secondary"} size="sm" className="flex-1">
              {localMicOn ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
              {localMicOn ? "Mute" : "Unmute"}
            </Button>
            <Button
              onClick={toggleWebcam}
              variant={localWebcamOn ? "default" : "secondary"}
              size="sm"
              className="flex-1"
            >
              {localWebcamOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
              {localWebcamOn ? "Stop Video" : "Start Video"}
            </Button>
          </div>

          <Button onClick={handleJoin} disabled={isJoining} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining Meeting...
              </>
            ) : (
              "Join Meeting"
            )}
          </Button>

          <Button
            onClick={onLeaveMeeting}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            Back to Lobby
          </Button>
        </div>
      </Card>
    </div>
  )
}
