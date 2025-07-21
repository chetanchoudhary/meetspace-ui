"use client"

import { useMeeting } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, Crown, MoreVertical, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ParticipantsListProps {
  participants: Map<string, any>
  isHost: boolean
}

export function ParticipantsList({ participants, isHost }: ParticipantsListProps) {
  const { meeting } = useMeeting()
  const participantArray = Array.from(participants.values())

  const handleRemoveParticipant = (participantId: string) => {
    if (isHost && meeting) {
      // VideoSDK method to remove participant
      meeting.remove(participantId)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-white">Participants ({participantArray.length})</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {participantArray.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {participant.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{participant.displayName || "Unknown"}</span>
                    {participant.isLocal && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                    {isHost && participant.id === participantArray[0]?.id && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>

                  <div className="flex items-center space-x-1 mt-1">
                    {participant.micOn ? (
                      <Mic className="w-3 h-3 text-green-400" />
                    ) : (
                      <MicOff className="w-3 h-3 text-red-400" />
                    )}
                    {participant.webcamOn ? (
                      <Video className="w-3 h-3 text-green-400" />
                    ) : (
                      <VideoOff className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Host Controls */}
              {isHost && !participant.isLocal && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRemoveParticipant(participant.id)} className="text-red-400">
                      <UserX className="w-4 h-4 mr-2" />
                      Remove from meeting
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
