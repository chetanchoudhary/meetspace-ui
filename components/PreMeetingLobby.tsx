"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Mic, MicOff, CameraOff, Volume2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface LobbySettings {
  displayName: string
  audioEnabled: boolean
  videoEnabled: boolean
  selectedCamera?: string
  selectedMicrophone?: string
  selectedSpeaker?: string
}

interface PreMeetingLobbyProps {
  initialSettings: LobbySettings
  onJoinMeeting: (settings: LobbySettings) => void
}

export function PreMeetingLobby({ initialSettings, onJoinMeeting }: PreMeetingLobbyProps) {
  const [settings, setSettings] = useState<LobbySettings>(initialSettings)
  const [devices, setDevices] = useState<{
    cameras: MediaDeviceInfo[]
    microphones: MediaDeviceInfo[]
    speakers: MediaDeviceInfo[]
  }>({
    cameras: [],
    microphones: [],
    speakers: [],
  })

  const [deviceStatus, setDeviceStatus] = useState<{
    camera: "testing" | "success" | "error" | "idle"
    microphone: "testing" | "success" | "error" | "idle"
    speaker: "testing" | "success" | "error" | "idle"
  }>({
    camera: "idle",
    microphone: "idle",
    speaker: "idle",
  })

  const [audioLevel, setAudioLevel] = useState(0)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    requestPermissions()
    return () => {
      cleanup()
    }
  }, [])

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = stream
      setPermissionsGranted(true)
      await enumerateDevices()
      await testDevices()
    } catch (error) {
      console.error("Permission denied:", error)
      setPermissionsGranted(false)
    }
  }

  const enumerateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const cameras = deviceList.filter((device) => device.kind === "videoinput")
      const microphones = deviceList.filter((device) => device.kind === "audioinput")
      const speakers = deviceList.filter((device) => device.kind === "audiooutput")

      setDevices({ cameras, microphones, speakers })

      // Set default devices
      if (cameras.length > 0 && !settings.selectedCamera) {
        setSettings((prev) => ({ ...prev, selectedCamera: cameras[0].deviceId }))
      }
      if (microphones.length > 0 && !settings.selectedMicrophone) {
        setSettings((prev) => ({ ...prev, selectedMicrophone: microphones[0].deviceId }))
      }
      if (speakers.length > 0 && !settings.selectedSpeaker) {
        setSettings((prev) => ({ ...prev, selectedSpeaker: speakers[0].deviceId }))
      }
    } catch (error) {
      console.error("Error enumerating devices:", error)
    }
  }

  const testDevices = async () => {
    await testCamera()
    await testMicrophone()
    await testSpeaker()
  }

  const testCamera = async () => {
    setDeviceStatus((prev) => ({ ...prev, camera: "testing" }))
    try {
      const constraints = {
        video: settings.selectedCamera ? { deviceId: settings.selectedCamera } : true,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setDeviceStatus((prev) => ({ ...prev, camera: "success" }))

      // Stop previous stream
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((track) => track.stop())
      }
      streamRef.current = stream
    } catch (error) {
      console.error("Camera test failed:", error)
      setDeviceStatus((prev) => ({ ...prev, camera: "error" }))
    }
  }

  const testMicrophone = async () => {
    setDeviceStatus((prev) => ({ ...prev, microphone: "testing" }))
    try {
      const constraints = {
        audio: settings.selectedMicrophone ? { deviceId: settings.selectedMicrophone } : true,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      // Setup audio analysis
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setAudioLevel(Math.round((average / 255) * 100))
          requestAnimationFrame(updateAudioLevel)
        }
      }
      updateAudioLevel()

      setDeviceStatus((prev) => ({ ...prev, microphone: "success" }))
    } catch (error) {
      console.error("Microphone test failed:", error)
      setDeviceStatus((prev) => ({ ...prev, microphone: "error" }))
    }
  }

  const testSpeaker = async () => {
    setDeviceStatus((prev) => ({ ...prev, speaker: "testing" }))
    try {
      // Create a test audio element
      const audio = new Audio("/placeholder.svg") // Using a placeholder, in real app use a test tone
      if (settings.selectedSpeaker && "setSinkId" in audio) {
        await (audio as any).setSinkId(settings.selectedSpeaker)
      }
      setDeviceStatus((prev) => ({ ...prev, speaker: "success" }))
    } catch (error) {
      console.error("Speaker test failed:", error)
      setDeviceStatus((prev) => ({ ...prev, speaker: "error" }))
    }
  }

  const handleDeviceChange = async (deviceType: "camera" | "microphone" | "speaker", deviceId: string) => {
    setSettings((prev) => ({
      ...prev,
      [`selected${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}`]: deviceId,
    }))

    // Re-test the changed device
    if (deviceType === "camera") {
      await testCamera()
    } else if (deviceType === "microphone") {
      await testMicrophone()
    } else if (deviceType === "speaker") {
      await testSpeaker()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "testing":
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Ready
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      case "testing":
        return <Badge variant="secondary">Testing...</Badge>
      default:
        return <Badge variant="outline">Not Tested</Badge>
    }
  }

  const canJoinMeeting =
    permissionsGranted &&
    deviceStatus.camera !== "error" &&
    deviceStatus.microphone !== "error" &&
    settings.displayName.trim().length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join Meeting</CardTitle>
          <p className="text-gray-600">Configure your settings before joining</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="camera">Camera</Label>
                      <Switch
                        id="camera"
                        checked={settings.videoEnabled}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, videoEnabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="microphone">Microphone</Label>
                      <Switch
                        id="microphone"
                        checked={settings.audioEnabled}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, audioEnabled: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {settings.videoEnabled ? (
                      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CameraOff className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant={settings.videoEnabled ? "default" : "secondary"}
                      onClick={() => setSettings((prev) => ({ ...prev, videoEnabled: !prev.videoEnabled }))}
                    >
                      {settings.videoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={settings.audioEnabled ? "default" : "secondary"}
                      onClick={() => setSettings((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
                    >
                      {settings.audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="devices" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Camera</Label>
                  <Select
                    value={settings.selectedCamera}
                    onValueChange={(value) => handleDeviceChange("camera", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.cameras.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex items-center space-x-2">
                    {getStatusIcon(deviceStatus.camera)}
                    {getStatusBadge(deviceStatus.camera)}
                  </div>
                </div>

                <div>
                  <Label>Microphone</Label>
                  <Select
                    value={settings.selectedMicrophone}
                    onValueChange={(value) => handleDeviceChange("microphone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.microphones.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex items-center space-x-2">
                    {getStatusIcon(deviceStatus.microphone)}
                    {getStatusBadge(deviceStatus.microphone)}
                  </div>
                </div>

                <div>
                  <Label>Speaker</Label>
                  <Select
                    value={settings.selectedSpeaker}
                    onValueChange={(value) => handleDeviceChange("speaker", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select speaker" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.speakers.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Speaker ${device.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex items-center space-x-2">
                    {getStatusIcon(deviceStatus.speaker)}
                    {getStatusBadge(deviceStatus.speaker)}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Camera Test</h3>
                      {getStatusBadge(deviceStatus.camera)}
                    </div>
                    <Button onClick={testCamera} disabled={deviceStatus.camera === "testing"} className="w-full">
                      {deviceStatus.camera === "testing" ? "Testing..." : "Test Camera"}
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Microphone Test</h3>
                      {getStatusBadge(deviceStatus.microphone)}
                    </div>
                    <div className="mb-2">
                      <Label>Audio Level: {audioLevel}%</Label>
                      <Progress value={audioLevel} className="mt-1" />
                    </div>
                    <Button
                      onClick={testMicrophone}
                      disabled={deviceStatus.microphone === "testing"}
                      className="w-full"
                    >
                      {deviceStatus.microphone === "testing" ? "Testing..." : "Test Microphone"}
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Speaker Test</h3>
                      {getStatusBadge(deviceStatus.speaker)}
                    </div>
                    <Button onClick={testSpeaker} disabled={deviceStatus.speaker === "testing"} className="w-full">
                      <Volume2 className="h-4 w-4 mr-2" />
                      {deviceStatus.speaker === "testing" ? "Testing..." : "Test Speaker"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">System Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Permissions</span>
                        {permissionsGranted ? (
                          <Badge variant="default" className="bg-green-500">
                            Granted
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Denied</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Camera</span>
                        {getStatusBadge(deviceStatus.camera)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Microphone</span>
                        {getStatusBadge(deviceStatus.microphone)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Speaker</span>
                        {getStatusBadge(deviceStatus.speaker)}
                      </div>
                    </div>
                  </div>

                  {!permissionsGranted && (
                    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Permissions Required</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Please allow camera and microphone access to join the meeting.
                      </p>
                      <Button onClick={requestPermissions} size="sm">
                        Grant Permissions
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Button onClick={() => onJoinMeeting(settings)} disabled={!canJoinMeeting} size="lg" className="px-8">
              Join Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
