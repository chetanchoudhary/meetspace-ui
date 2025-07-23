"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePubSub } from "@videosdk.live/react-sdk"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

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

  const { publish } = usePubSub("CHAT", {
    onMessageReceived: (data: any) => {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: data.senderId,
        senderName: data.senderName,
        message: data.message,
        timestamp: new Date(data.timestamp),
      }
      setMessages((prev) => [...prev, chatMessage])
    },
  })

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        senderId: "local", // This would be the actual participant ID
        senderName: "You", // This would be the actual participant name
      }

      publish(messageData, { persist: true })
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span className="font-medium">{message.senderName}</span>
                <span>{message.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="text-sm text-white bg-gray-700 rounded-lg p-2">{message.message}</div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm">No messages yet. Start the conversation!</div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border-gray-600 text-white"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
