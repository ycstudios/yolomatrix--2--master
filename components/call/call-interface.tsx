"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"
import { useCallContext } from "./call-provider"
export default function CallInterface() {
  const { isCallActive, endCall, localStream, remoteStream, isMuted, isVideoEnabled, toggleMute, toggleVideo } =
    useCallContext()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }

    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [localStream, remoteStream])

  useEffect(() => {
    if (isCallActive && !timerInterval) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      setTimerInterval(interval)
    } else if (!isCallActive && timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
      setCallDuration(0)
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [isCallActive, timerInterval])

  if (!isCallActive) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-sm">Call in progress - {formatTime(callDuration)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-2">
        <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
          {remoteStream ? (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Connecting...</p>
            </div>
          )}

          {localStream && (
            <div className="absolute bottom-2 right-2 w-20 h-20 rounded-md overflow-hidden border-2 border-white">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2 pt-0 pb-2">
        <Button variant="outline" size="icon" onClick={toggleMute} className={isMuted ? "bg-red-100" : ""}>
          {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
        <Button variant="outline" size="icon" onClick={toggleVideo} className={!isVideoEnabled ? "bg-red-100" : ""}>
          {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
        </Button>
        <Button variant="destructive" size="icon" onClick={endCall}>
          <PhoneOff size={16} />
        </Button>
      </CardFooter>
    </Card>
  )
}
