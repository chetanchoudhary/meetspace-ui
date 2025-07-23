"use client"

import { Suspense } from "react"
import { MeetingRoom } from "@/components/MeetingRoom"

function MeetingContent() {
  return <MeetingRoom />
}

export default function MeetingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Loading meeting...</div>
          </div>
        }
      >
        <MeetingContent />
      </Suspense>
    </div>
  )
}
