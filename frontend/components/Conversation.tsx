import React, { useState, useEffect, useRef, useCallback } from "react";
import { Clipboard, Check, Loader } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useParams, useRouter } from "next/navigation";
import Rendering from "./Rendering";

interface Message {
  id: string;
  content: string;
  conversationId: string;
  createdAt: string;
  role: "user" | "assistant";
  updatedAt: string;
}

const Conversation: React.FC = () => {
  const { id: conversationId } = useParams<{ id?: string }>();
  
  const bearerToken = useAppSelector(
    (state) => state.currentTokenReducer.currentToken
  );
  const isScrolling = useAppSelector((state) => state.infoReducer.isScolling);
  const fetchmessagesinchunk = useAppSelector(
    (state) => state.infoReducer.fetch_messages_in_chunk
  );

  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Empty messages when conversationId changes
  useEffect(() => {
    setMessages([]);
  }, [conversationId]);

  // Enhanced scroll effect
  useEffect(() => {
    if (isScrolling || messages.length > 0 || fetchmessagesinchunk) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [isScrolling, messages.length, fetchmessagesinchunk]);

  // ✅ Also scroll when new messages are added (as a fallback)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isScrolling]); // Scroll when the number of messages changes

  // ✅ Fetch chat only when conversationId changes
  const fetchCurrentChat = useCallback(async () => {
    if (!conversationId) return;
    if (!bearerToken) {
      router.push("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/conversations/${conversationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch conversation");

      const data = await response.json();
      setMessages(data.conversation?.messages || []);
    } catch (error) {
      console.error("Error while fetching current chat history", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [conversationId, bearerToken, router]);

  useEffect(() => {
    if (conversationId) {
      fetchCurrentChat();
    }
  }, [fetchCurrentChat, conversationId]);

  // ✅ Copy functionality
  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatContent = (content: string) =>
    content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));

  // ✅ No conversation selected
  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // ✅ Main conversation view
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-4">
            {message.role === "user" ? (
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

        {/* Real-time streaming messages */}
        {fetchmessagesinchunk && <Rendering />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default React.memo(Conversation);