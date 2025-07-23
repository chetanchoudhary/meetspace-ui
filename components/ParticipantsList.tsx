"use client"
import { useParticipant } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Users, Mic, MicOff, Video, VideoOff, MoreVertical, UserX, Volume2, Crown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ParticipantItemProps {
  participantId: string
  isHost?: boolean
}

function ParticipantItem({ participantId, isHost = false }: ParticipantItemProps) {
  const { displayName, micOn, webcamOn, isLocal } = useParticipant(participantId)

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{displayName?.charAt(0)?.toUpperCase() || "?"}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium truncate">{displayName || "Unknown"}</span>
            {isLocal && (
              <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                You
              </Badge>
            )}
            {isHost && <Crown className="w-3 h-3 text-yellow-400" />}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Media Status */}
        <div className="flex items-center space-x-1">
          {micOn ? <Mic className="w-4 h-4 text-green-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
          {webcamOn ? <Video className="w-4 h-4 text-green-400" /> : <VideoOff className="w-4 h-4 text-red-400" />}
        </div>

        {/* Actions Menu */}
        {!isLocal && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                <Volume2 className="w-4 h-4 mr-2" />
                Mute for me
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                <MicOff className="w-4 h-4 mr-2" />
                Mute participant
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                <UserX className="w-4 h-4 mr-2" />
                Remove participant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

interface ParticipantsListProps {
  participants: Map<string, any> | undefined
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  const participantIds = participants ? Array.from(participants.keys()) : []
  const participantCount = participantIds.length

  return (
    <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Participants
          </div>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            {participantCount}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4">
            {participantIds.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No participants</p>
              </div>
            ) : (
              <div className="space-y-1">
                {participantIds.map((participantId, index) => (
                  <ParticipantItem
                    key={participantId}
                    participantId={participantId}
                    isHost={index === 0} // First participant is typically the host
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
