import { useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { Clipboard, Check, Loader } from 'lucide-react'

interface Message {
  id: string
  content: string
  conversationId: string
  createdAt: string
  role: 'user' | 'assistant'
  updatedAt: string
}

const Conversation = () => {
  const conversationId = useAppSelector((state) => state.infoReducer.particular_chat_id)
  const bearerToken = useAppSelector((state) => state.currentTokenReducer.currentToken)
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!conversationId || !bearerToken) {
      router.push('/sign-in')
      return
    }

    const fetchCurrentChat = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/conversations/${conversationId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        )
        
        if (!response.ok) throw new Error('Failed to fetch conversation')
        
        const data = await response.json()
        setMessages(data.conversation?.messages || [])
      } catch (error) {
        console.error('Error while fetching current chat history', error)
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentChat()
  }, [conversationId, bearerToken, router])

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Start a conversation to see messages here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-4">
            {message.role === 'user' ? (
              // User message - Right aligned
              <div className="flex justify-end">
                <div className="flex flex-col items-end max-w-[70%]">
                  <div className="bg-gray-100 rounded-2xl rounded-br-md px-4 py-3">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">
                      {formatContent(message.content)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ) : (
              // AI message - Left aligned
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-full">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <div className="bg-transparent">
                      <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                        {formatContent(message.content)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default Conversation