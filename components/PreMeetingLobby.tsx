"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  Settings,
  User,
  Camera,
  Headphones,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

interface PreMeetingLobbyProps {
  onComplete: (settings: {
    displayName: string
    micEnabled: boolean
    webcamEnabled: boolean
    selectedMicId: string
    selectedWebcamId: string
    selectedSpeakerId: string
  }) => void
}

interface MediaDevice {
  deviceId: string
  label: string
  kind: string
}

export function PreMeetingLobby({ onComplete }: PreMeetingLobbyProps) {
  const searchParams = useSearchParams()
  const userName = searchParams.get("name") || ""

  // State
  const [displayName, setDisplayName] = useState(userName)
  const [micEnabled, setMicEnabled] = useState(false)
  const [webcamEnabled, setWebcamEnabled] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [devices, setDevices] = useState<MediaDevice[]>([])
  const [selectedMicId, setSelectedMicId] = useState("")
  const [selectedWebcamId, setSelectedWebcamId] = useState("")
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("")
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [isTestingAudio, setIsTestingAudio] = useState(false)
  const [deviceTestResults, setDeviceTestResults] = useState({
    camera: "untested" as "untested" | "success" | "error",
    microphone: "untested" as "untested" | "success" | "error",
    speaker: "untested" as "untested" | "success" | "error",
  })

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number>()

  // Get available devices
  const getDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const formattedDevices: MediaDevice[] = deviceList.map((device) => ({
        deviceId: device.deviceId,
        label: device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`,
        kind: device.kind,
      }))
      setDevices(formattedDevices)

      // Set default devices
      const defaultMic = formattedDevices.find((d) => d.kind === "audioinput")
      const defaultCamera = formattedDevices.find((d) => d.kind === "videoinput")
      const defaultSpeaker = formattedDevices.find((d) => d.kind === "audiooutput")

      if (defaultMic && !selectedMicId) setSelectedMicId(defaultMic.deviceId)
      if (defaultCamera && !selectedWebcamId) setSelectedWebcamId(defaultCamera.deviceId)
      if (defaultSpeaker && !selectedSpeakerId) setSelectedSpeakerId(defaultSpeaker.deviceId)
    } catch (error) {
      console.error("Error getting devices:", error)
    }
  }

  // Request permissions
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      stream.getTracks().forEach((track) => track.stop())
      setPermissionsGranted(true)
      await getDevices()
    } catch (error) {
      console.error("Permission denied:", error)
      setPermissionsGranted(false)
    }
  }

  // Start video preview
  const startVideoPreview = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: webcamEnabled ? { deviceId: selectedWebcamId } : false,
        audio: micEnabled ? { deviceId: selectedMicId } : false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current && webcamEnabled) {
        videoRef.current.srcObject = stream
        setDeviceTestResults((prev) => ({ ...prev, camera: "success" }))
      }

      if (micEnabled) {
        setupAudioAnalyzer(stream)
        setDeviceTestResults((prev) => ({ ...prev, microphone: "success" }))
      }
    } catch (error) {
      console.error("Error starting preview:", error)
      if (webcamEnabled) {
        setDeviceTestResults((prev) => ({ ...prev, camera: "error" }))
      }
      if (micEnabled) {
        setDeviceTestResults((prev) => ({ ...prev, microphone: "error" }))
      }
    }
  }

  // Setup audio analyzer for level detection
  const setupAudioAnalyzer = (stream: MediaStream) => {
    try {
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
          setAudioLevel(Math.min(100, (average / 128) * 100))
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      updateAudioLevel()
    } catch (error) {
      console.error("Error setting up audio analyzer:", error)
    }
  }

  // Test speaker
  const testSpeaker = async () => {
    setIsTestingAudio(true)
    try {
      const audio = new Audio("/placeholder.svg?height=1&width=1")
      if (selectedSpeakerId && (audio as any).setSinkId) {
        await (audio as any).setSinkId(selectedSpeakerId)
      }
      await audio.play()
      setDeviceTestResults((prev) => ({ ...prev, speaker: "success" }))
    } catch (error) {
      console.error("Error testing speaker:", error)
      setDeviceTestResults((prev) => ({ ...prev, speaker: "error" }))
    } finally {
      setIsTestingAudio(false)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Update preview when settings change
  useEffect(() => {
    if (permissionsGranted) {
      startVideoPreview()
    }
  }, [webcamEnabled, micEnabled, selectedWebcamId, selectedMicId, permissionsGranted])

  // Initial permission request
  useEffect(() => {
    requestPermissions()
  }, [])

  const handleJoinMeeting = () => {
    if (!displayName.trim()) {
      alert("Please enter your display name")
      return
    }

    onComplete({
      displayName: displayName.trim(),
      micEnabled,
      webcamEnabled,
      selectedMicId,
      selectedWebcamId,
      selectedSpeakerId,
    })
  }

  const micDevices = devices.filter((d) => d.kind === "audioinput")
  const cameraDevices = devices.filter((d) => d.kind === "videoinput")
  const speakerDevices = devices.filter((d) => d.kind === "audiooutput")

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Join Meeting</CardTitle>
          <p className="text-gray-400 text-center">Test your devices and configure settings before joining</p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Preview */}
            <div className="space-y-4">
              <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden relative">
                {webcamEnabled ? (
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <VideoOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-400">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Audio Level Indicator */}
                {micEnabled && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4" />
                        <Progress value={audioLevel} className="flex-1 h-2" />
                        <span className="text-xs">{Math.round(audioLevel)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant={micEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setMicEnabled(!micEnabled)}
                  className="rounded-full w-12 h-12"
                >
                  {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                  variant={webcamEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setWebcamEnabled(!webcamEnabled)}
                  className="rounded-full w-12 h-12"
                >
                  {webcamEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="space-y-4">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="devices">
                    <Settings className="w-4 h-4 mr-2" />
                    Devices
                  </TabsTrigger>
                  <TabsTrigger value="test">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Test
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mic-toggle">Microphone</Label>
                      <Switch id="mic-toggle" checked={micEnabled} onCheckedChange={setMicEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="camera-toggle">Camera</Label>
                      <Switch id="camera-toggle" checked={webcamEnabled} onCheckedChange={setWebcamEnabled} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="devices" className="space-y-4">
                  {!permissionsGranted ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                      <p className="text-gray-400 mb-4">Camera and microphone permissions are required</p>
                      <Button onClick={requestPermissions}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Grant Permissions
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>
                          <Camera className="w-4 h-4 inline mr-2" />
                          Camera
                        </Label>
                        <Select value={selectedWebcamId} onValueChange={setSelectedWebcamId}>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select camera" />
                          </SelectTrigger>
                          <SelectContent>
                            {cameraDevices.map((device) => (
                              <SelectItem key={device.deviceId} value={device.deviceId}>
                                {device.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          <Mic className="w-4 h-4 inline mr-2" />
                          Microphone
                        </Label>
                        <Select value={selectedMicId} onValueChange={setSelectedMicId}>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select microphone" />
                          </SelectTrigger>
                          <SelectContent>
                            {micDevices.map((device) => (
                              <SelectItem key={device.deviceId} value={device.deviceId}>
                                {device.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          <Headphones className="w-4 h-4 inline mr-2" />
                          Speaker
                        </Label>
                        <Select value={selectedSpeakerId} onValueChange={setSelectedSpeakerId}>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Select speaker" />
                          </SelectTrigger>
                          <SelectContent>
                            {speakerDevices.map((device) => (
                              <SelectItem key={device.deviceId} value={device.deviceId}>
                                {device.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="test" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Camera className="w-5 h-5" />
                        <span>Camera Test</span>
                      </div>
                      <Badge
                        variant={
                          deviceTestResults.camera === "success"
                            ? "default"
                            : deviceTestResults.camera === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {deviceTestResults.camera === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {deviceTestResults.camera === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {deviceTestResults.camera === "success"
                          ? "Working"
                          : deviceTestResults.camera === "error"
                            ? "Failed"
                            : "Not tested"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mic className="w-5 h-5" />
                        <span>Microphone Test</span>
                      </div>
                      <Badge
                        variant={
                          deviceTestResults.microphone === "success"
                            ? "default"
                            : deviceTestResults.microphone === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {deviceTestResults.microphone === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {deviceTestResults.microphone === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {deviceTestResults.microphone === "success"
                          ? "Working"
                          : deviceTestResults.microphone === "error"
                            ? "Failed"
                            : "Not tested"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="w-5 h-5" />
                        <span>Speaker Test</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            deviceTestResults.speaker === "success"
                              ? "default"
                              : deviceTestResults.speaker === "error"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {deviceTestResults.speaker === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {deviceTestResults.speaker === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {deviceTestResults.speaker === "success"
                            ? "Working"
                            : deviceTestResults.speaker === "error"
                              ? "Failed"
                              : "Not tested"}
                        </Badge>
                        <Button size="sm" onClick={testSpeaker} disabled={isTestingAudio}>
                          {isTestingAudio ? "Testing..." : "Test"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {micEnabled && (
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Audio Level</span>
                        <span className="text-sm">{Math.round(audioLevel)}%</span>
                      </div>
                      <Progress value={audioLevel} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">Speak to test your microphone</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Join Button */}
              <Button
                onClick={handleJoinMeeting}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={!displayName.trim() || !permissionsGranted}
              >
                Join Meeting
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
