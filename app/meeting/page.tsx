"use client"

import { Suspense } from "react"
import { MeetingRoom } from "@/components/MeetingRoom"

export default function MeetingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white">Loading meeting...</div>
          </div>
        }
      >
        <MeetingRoom />
      </Suspense>
    </div>
  )
}
