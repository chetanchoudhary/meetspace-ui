"use client"

import { useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Monitor, MonitorOff, Settings, Users, Loader2 } from "lucide-react"

interface ScreenShareControlsProps {
  isHost?: boolean
}

export function ScreenShareControls({ isHost = false }: ScreenShareControlsProps) {
  const { localScreenShareOn, toggleScreenShare, participants } = useMeeting()

  const [isToggling, setIsToggling] = useState(false)

  const handleToggleScreenShare = async () => {
    setIsToggling(true)
    try {
      await toggleScreenShare()
    } catch (error) {
      console.error("Screen share error:", error)
    } finally {
      setIsToggling(false)
    }
  }

  // Get participants who are screen sharing
  const screenSharingParticipants = Array.from(participants.values()).filter((participant) => participant.screenShareOn)

  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Screen Share</h3>
          </div>

          {screenSharingParticipants.length > 0 && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              {screenSharingParticipants.length} Active
            </Badge>
          )}
        </div>

        <Separator className="bg-gray-700" />

        {/* Current Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Your Screen Share</span>
            <Badge variant={localScreenShareOn ? "default" : "secondary"}>
              {localScreenShareOn ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Toggle Button */}
          <Button
            onClick={handleToggleScreenShare}
            disabled={isToggling}
            variant={localScreenShareOn ? "destructive" : "default"}
            className="w-full"
          >
            {isToggling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {localScreenShareOn ? "Stopping..." : "Starting..."}
              </>
            ) : localScreenShareOn ? (
              <>
                <MonitorOff className="w-4 h-4 mr-2" />
                Stop Sharing
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 mr-2" />
                Share Screen
              </>
            )}
          </Button>
        </div>

        {/* Active Screen Shares */}
        {screenSharingParticipants.length > 0 && (
          <>
            <Separator className="bg-gray-700" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Currently Sharing</span>
              </div>

              <div className="space-y-2">
                {screenSharingParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                    <span className="text-sm text-white">{participant.displayName}</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Sharing
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Settings (Host Only) */}
        {isHost && (
          <>
            <Separator className="bg-gray-700" />
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Screen Share Settings
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
