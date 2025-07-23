"use client"

import { Suspense } from "react"
import { MeetingRoom } from "@/components/MeetingRoom"

function MeetingPageContent() {
  return <MeetingRoom />
}

export default function MeetingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <MeetingPageContent />
    </Suspense>
  )
}
