"use client"

import { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mic, MicOff, Video, VideoOff, Users } from "lucide-react"

export function WaitingRoom() {
  const [isJoining, setIsJoining] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [webcamEnabled, setWebcamEnabled] = useState(true)

  const { join, leave, toggleMic, toggleWebcam, meetingId, localParticipant, participants } = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined from WaitingRoom")
      setIsJoining(false)
    },
    onMeetingLeft: () => {
      console.log("Meeting left from WaitingRoom")
      setIsJoining(false)
    },
    onError: (error) => {
      console.error("Meeting error in WaitingRoom:", error)
      setIsJoining(false)
    },
    onEntryResponded: (participantId, decision) => {
      console.log("Entry responded:", participantId, decision)
      if (decision === "allowed") {
        setIsJoining(false)
      }
    },
  })

  const handleJoinMeeting = () => {
    setIsJoining(true)
    join()
  }

  const handleLeaveMeeting = () => {
    leave()
  }

  const handleToggleMic = () => {
    toggleMic()
    setMicEnabled(!micEnabled)
  }

  const handleToggleWebcam = () => {
    toggleWebcam()
    setWebcamEnabled(!webcamEnabled)
  }

  const participantCount = participants ? participants.size + 1 : 1

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Meeting Lobby</CardTitle>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              ID: {meetingId}
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Users className="w-3 h-3 mr-1" />
              {participantCount}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Media Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant={micEnabled ? "default" : "destructive"}
              size="sm"
              onClick={handleToggleMic}
              className="flex items-center space-x-2"
            >
              {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{micEnabled ? "Mute" : "Unmute"}</span>
            </Button>

            <Button
              variant={webcamEnabled ? "default" : "destructive"}
              size="sm"
              onClick={handleToggleWebcam}
              className="flex items-center space-x-2"
            >
              {webcamEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              <span>{webcamEnabled ? "Stop Video" : "Start Video"}</span>
            </Button>
          </div>

          {/* Join/Leave Buttons */}
          <div className="space-y-2">
            {!isJoining ? (
              <Button onClick={handleJoinMeeting} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Join Meeting
              </Button>
            ) : (
              <Button disabled className="w-full" size="lg">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </Button>
            )}

            <Button
              onClick={handleLeaveMeeting}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              Leave
            </Button>
          </div>

          {/* Status */}
          <div className="text-center">
            <p className="text-sm text-gray-400">{isJoining ? "Connecting to meeting..." : "Ready to join"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
