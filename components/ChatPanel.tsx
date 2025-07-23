"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePubSub } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageSquare } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: Date
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { publish, messages: pubSubMessages } = usePubSub("CHAT", {
    onMessageReceived: (data) => {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: data.senderId,
        senderName: data.senderName,
        message: data.message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, chatMessage])
    },
  })

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      publish(
        {
          message: newMessage.trim(),
          timestamp: new Date().toISOString(),
        },
        { persist: true },
      )
      setNewMessage("")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-3 py-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-400">{msg.senderName}</span>
                    <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="bg-gray-700 rounded-lg px-3 py-2">
                    <p className="text-gray-200 text-sm break-words">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              maxLength={500}
            />
            <Button type="submit" disabled={!newMessage.trim()} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
