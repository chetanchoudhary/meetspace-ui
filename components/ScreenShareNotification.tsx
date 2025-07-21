"use client"

import { useEffect, useState } from "react"
import { useMeeting } from "@videosdk.live/react-sdk"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, X, Maximize2 } from "lucide-react"

interface ScreenShareNotificationProps {
  onViewScreenShare?: (participantId: string) => void
}

export function ScreenShareNotification({ onViewScreenShare }: ScreenShareNotificationProps) {
  const { participants } = useMeeting()
  const [screenSharingParticipants, setScreenSharingParticipants] = useState<any[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const sharingParticipants = Array.from(participants.values()).filter(
      (participant) => participant.screenShareOn && !participant.isLocal,
    )
    setScreenSharingParticipants(sharingParticipants)
  }, [participants])

  const visibleNotifications = screenSharingParticipants.filter((participant) => !dismissed.has(participant.id))

  const handleDismiss = (participantId: string) => {
    setDismissed((prev) => new Set([...prev, participantId]))
  }

  const handleViewScreenShare = (participantId: string) => {
    onViewScreenShare?.(participantId)
    handleDismiss(participantId)
  }

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-40 space-y-2">
      {visibleNotifications.map((participant) => (
        <Card key={participant.id} className="bg-blue-900 border-blue-700 p-4 min-w-80">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Monitor className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white">
                {participant.displayName || "Someone"} is sharing their screen
              </h4>
              <p className="text-xs text-blue-200 mt-1">Click to view the shared content</p>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewScreenShare(participant.id)}
                className="text-white hover:bg-blue-800 px-2"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(participant.id)}
                className="text-white hover:bg-blue-800 px-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
