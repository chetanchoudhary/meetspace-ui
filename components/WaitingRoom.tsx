"use client"

import { useState, useEffect } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, VideoOff, Mic, MicOff, Users, Clock, Wifi } from "lucide-react"

export function WaitingRoom() {
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "failed">("connecting")
  const [waitTime, setWaitTime] = useState(0)

  const { join, leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn, meetingId, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined from WaitingRoom")
      setConnectionStatus("connected")
    },
    onMeetingLeft: () => {
      console.log("Meeting left from WaitingRoom")
    },
    onError: (error) => {
      console.error("Meeting error in WaitingRoom:", error)
      setConnectionStatus("failed")
    },
  })

  useEffect(() => {
    // Auto-join when component mounts
    if (join) {
      console.log("Auto-joining meeting...")
      join()
    }
  }, [join])

  useEffect(() => {
    // Start wait time counter
    const interval = setInterval(() => {
      setWaitTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleLeaveMeeting = () => {
    if (leave) {
      leave()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Status Indicator */}
              <div className="flex items-center justify-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connectionStatus === "connecting"
                      ? "bg-yellow-500 animate-pulse"
                      : connectionStatus === "connected"
                        ? "bg-green-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-gray-300 text-sm">
                  {connectionStatus === "connecting" && "Connecting to meeting..."}
                  {connectionStatus === "connected" && "Connected - Joining meeting room"}
                  {connectionStatus === "failed" && "Connection failed"}
                </span>
              </div>

              {/* Meeting Info */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Joining Meeting</h2>
                <div className="flex items-center justify-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Meeting ID: {meetingId}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Wait time: {formatTime(waitTime)}</span>
                  </div>
                </div>
              </div>

              {/* Participant Info */}
              {localParticipant && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-2">You're joining as:</p>
                  <p className="text-white font-semibold">{localParticipant.displayName}</p>
                </div>
              )}

              {/* Connection Status */}
              <div className="flex justify-center">
                {connectionStatus === "connecting" && (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                    <span>Establishing connection...</span>
                  </div>
                )}
                {connectionStatus === "connected" && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Wifi className="w-5 h-5" />
                    <span>Connected successfully</span>
                  </div>
                )}
                {connectionStatus === "failed" && (
                  <div className="text-red-400">
                    <p>Failed to connect to the meeting</p>
                  </div>
                )}
              </div>

              {/* Media Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleMic}
                  variant={localMicOn ? "default" : "secondary"}
                  size="lg"
                  className={localMicOn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}
                >
                  {localMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={toggleWebcam}
                  variant={localWebcamOn ? "default" : "secondary"}
                  size="lg"
                  className={localWebcamOn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}
                >
                  {localWebcamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  onClick={handleLeaveMeeting}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Leave Meeting
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-xs text-gray-500 max-w-md mx-auto">
                <p>
                  If you're having trouble connecting, please check your internet connection and try refreshing the
                  page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
