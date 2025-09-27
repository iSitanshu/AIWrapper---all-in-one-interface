import { addatLast, setFetchNewMessage, setIsScrolling, setMessages, setParticularChatId } from '@/lib/features/Infodetail/infoDetailSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { Check, Clipboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Rendering = () => {
  const dispatch = useAppDispatch();
  const bearerToken = useAppSelector((state) => state.currentTokenReducer.currentToken);
  const conversationId = useAppSelector((state) => state.infoReducer.particular_chat_id);
  const router = useRouter();
  
  const currentModel = useAppSelector((state) => state.infoReducer.current_model);
  const messages = useAppSelector((state) => state.infoReducer.messages || []);
  
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = async (content: string, messageIndex: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIndex(messageIndex);
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stable handleOpenRouter function with useCallback and proper dependencies
  const handleOpenRouter = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isProcessing) {
      console.log('Already processing, skipping...');
      return;
    }

    if (!bearerToken || !currentModel) {
      return;
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage || lastUserMessage.role !== 'User') {
      return;
    }

    // Check if we already have an assistant response for this user message
    const hasAssistantResponse = messages.some((msg, index) => 
      index === messages.length - 1 && msg.role === 'assistant'
    );

    if (hasAssistantResponse) {
      return;
    }

    setIsProcessing(true);
    setIsThinking(true);

    

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ 
          conversationId: conversationId || null, 
          message: lastUserMessage.message, 
          model: currentModel 
        }),
      });

      const newConversationId = response.headers.get('X-Conversation-Id');

      if(newConversationId && !conversationId) {
        dispatch(setParticularChatId(newConversationId));
        router.push(`/conversations/${newConversationId}`);
      }

      // Set initial assistant message
      dispatch(setMessages({
        role: "assistant", 
        message: "", 
        timestamp: Date.now()
      }));

      if (!response.ok) throw new Error('Failed to fetch conversation');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsThinking(false);
          setIsProcessing(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        
        // Update the store with the latest chunk
        dispatch(addatLast(chunk));
      }

    } catch (error) {
      console.error('Error while streaming response', error);
      setIsThinking(false);
      setIsProcessing(false);
      setIsScrolling(false);
    }
  }, [bearerToken, currentModel, conversationId, messages, dispatch, isProcessing]);

  // Trigger AI response when new user message is added
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role === 'User') {
      const hasAssistantResponse = messages.length > 1 && 
                                 messages[messages.length - 2].role === 'assistant' &&
                                 messages[messages.length - 2].timestamp > lastMessage.timestamp;

      if (!hasAssistantResponse && !isProcessing) {
        handleOpenRouter();
      }
    }
  }, [messages.length]);

  // Get the last assistant message (for streaming display)
  const getLastAssistantMessage = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        return messages[i];
      }
    }
    return null;
  };

  const lastAssistantMessage = getLastAssistantMessage();
  const isLastMessageAssistant = messages.length > 0 && messages[messages.length - 1].role === 'assistant';

  return (
    <div className="flex flex-col space-y-6 p-4">
      {messages.map((message, index) => (
        <div key={index} className={`flex flex-col space-y-2 ${
          message.role === 'User' ? 'items-end' : 'items-start'
        }`}>
          
          {/* Message Content */}
          <div className={`flex items-start ${
            message.role === 'User' 
              ? 'flex-row-reverse space-x-reverse space-x-2 max-w-[80%]' 
              : 'flex-col w-full'
          }`}>
            
            {/* Message Bubble */}
            <div className={`rounded-lg px-4 py-2 ${
              message.role === 'User' 
                ? 'bg-white text-black shadow-md max-w-full' 
                : 'text-white w-full'
            }`}>
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.message}
                {/* Show typing indicator for the last assistant message that's being streamed */}
                {isThinking && isLastMessageAssistant && index === messages.length - 1 && (
                  <span className="ml-1 inline-block w-2 h-4 bg-white animate-pulse"></span>
                )}
              </p>
            </div>

            {/* Copy Button - Only show for assistant messages (right side) */}
            {message.role === 'assistant' && message.message && (
              <div className="flex justify-end mt-1">
                <button
                  onClick={() => handleCopy(message.message, index)}
                  className="p-1 rounded text-gray-400 hover:text-gray-200 transition-opacity"
                >
                  {copiedMessageIndex === index ? (
                    <Check size={16} />
                  ) : (
                    <Clipboard size={16} />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <span className={`text-xs text-gray-500 ${
            message.role === 'User' ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      ))}

      {/* AI Thinking Indicator - Show when thinking but no assistant message created yet */}
      {isThinking && !lastAssistantMessage && (
        <div className="flex flex-col items-start space-y-2 w-full">
          <div className="text-white rounded-lg px-4 py-2 w-full">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
          <span className="text-xs text-gray-500 text-left">
            {formatTime(Date.now())}
          </span>
        </div>
      )}
    </div>
  );
};

export default Rendering;