"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Video, VideoOff, Mic, MicOff, Settings, Users } from "lucide-react"

interface LobbySettings {
  displayName: string
  audioEnabled: boolean
  videoEnabled: boolean
}

interface PreMeetingLobbyProps {
  initialSettings: LobbySettings
  onJoinMeeting: (settings: LobbySettings) => void
  meetingId: string
}

export function PreMeetingLobby({ initialSettings, onJoinMeeting, meetingId }: PreMeetingLobbyProps) {
  const [settings, setSettings] = useState<LobbySettings>(initialSettings)
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async () => {
    setIsJoining(true)
    // Simulate a brief delay for joining
    setTimeout(() => {
      onJoinMeeting(settings)
      setIsJoining(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8">
        {/* Video Preview */}
        <div className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                {settings.videoEnabled ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm">Camera Preview</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Camera Off</p>
                  </div>
                )}
              </div>

              {/* Media Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant={settings.audioEnabled ? "default" : "secondary"}
                  size="lg"
                  onClick={() => setSettings((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
                  className={settings.audioEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}
                >
                  {settings.audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                  variant={settings.videoEnabled ? "default" : "secondary"}
                  size="lg"
                  onClick={() => setSettings((prev) => ({ ...prev, videoEnabled: !prev.videoEnabled }))}
                  className={settings.videoEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}
                >
                  {settings.videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join Form */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-400" />
                Join Meeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="meetingId" className="text-gray-300 text-sm font-medium">
                  Meeting ID
                </Label>
                <Input
                  id="meetingId"
                  value={meetingId}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-300 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="displayName" className="text-gray-300 text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, displayName: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="audio-toggle" className="text-gray-300 text-sm font-medium">
                    Join with microphone
                  </Label>
                  <Switch
                    id="audio-toggle"
                    checked={settings.audioEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, audioEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="video-toggle" className="text-gray-300 text-sm font-medium">
                    Join with camera
                  </Label>
                  <Switch
                    id="video-toggle"
                    checked={settings.videoEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, videoEnabled: checked }))}
                  />
                </div>
              </div>

              <Button
                onClick={handleJoin}
                disabled={isJoining || !settings.displayName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                size="lg"
              >
                {isJoining ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  "Join Meeting"
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  By joining, you agree to our terms of service and privacy policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
