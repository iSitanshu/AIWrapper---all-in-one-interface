import { useAppSelector } from '@/lib/hooks';
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Clipboard, Check, Loader } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setCurrentMessage, setFetchMessagesInChunk, addMessage } from '@/lib/features/Infodetail/infoDetailSlice';

const FetchMessage = () => {
  const dispatch = useDispatch();
  const bearerToken = useAppSelector((state) => state.currentTokenReducer.currentToken);
  const conversationId = useAppSelector((state) => state.infoReducer.particular_chat_id);
  const currentModel = useAppSelector((state) => state.infoReducer.current_model);
  const currentMessage = useAppSelector((state) => state.infoReducer.current_message);
  const fetchMessagesinchunk = useAppSelector((state) => state.infoReducer.fetch_messages_in_chunk);
  const messages = useAppSelector((state) => state.infoReducer.messages || []); // Add this to your store if not exists

  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);
  const streamingMessageIdRef = useRef<string | null>(null); // Track the streaming message ID

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]); // Scroll when messages or streaming state changes

  // Generate unique IDs for messages
  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

 const handleOpenRouter = useCallback(async () => {
  if (!bearerToken || !currentModel || !conversationId || !currentMessage || hasFetchedRef.current) {
    return;
  }

  hasFetchedRef.current = true;
  setIsStreaming(true);

  const userMessageId = generateMessageId();
  const aiMessageId = generateMessageId();
  streamingMessageIdRef.current = aiMessageId;

  try {
    // ✅ Add user message
    dispatch(addMessage({
      id: userMessageId,
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      conversationId
    }));

    // ✅ Add placeholder AI message
    dispatch(addMessage({
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      conversationId,
      isStreaming: true
    }));

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ conversationId, message: currentMessage, model: currentModel }),
    });

    if (!response.ok) throw new Error("Failed to fetch conversation");

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      // ✅ Update message content instead of re-adding
      dispatch(updateMessageContent({ id: aiMessageId, content: fullResponse }));
      dispatch(setMessageStreaming({ id: aiMessageId, isStreaming: true }));
    }

    // ✅ Mark streaming complete
    dispatch(setMessageStreaming({ id: aiMessageId, isStreaming: false }));

  } catch (error) {
    console.error("Error while streaming response", error);

    if (streamingMessageIdRef.current) {
      dispatch(updateMessageContent({
        id: streamingMessageIdRef.current,
        content: '⚠️ Error generating response.'
      }));
      dispatch(setMessageStreaming({ id: streamingMessageIdRef.current, isStreaming: false }));
    }
  } finally {
    setIsStreaming(false);
    streamingMessageIdRef.current = null;
    setTimeout(() => {
      dispatch(setCurrentMessage(''));
      dispatch(setFetchMessagesInChunk(false));
      hasFetchedRef.current = false;
    }, 100);
  }
}, [bearerToken, currentModel, conversationId, currentMessage, dispatch]);

  useEffect(() => {
    // Only trigger if we have the flag set, current message, and haven't fetched yet
    if (fetchMessagesinchunk && currentMessage && !hasFetchedRef.current) {
      handleOpenRouter();
    }
  }, [fetchMessagesinchunk, currentMessage, handleOpenRouter]);

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Filter messages for current conversation and sort by timestamp
  const currentConversationMessages = messages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Don't render if no messages and not currently streaming
  if (currentConversationMessages.length === 0 && !isStreaming) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Render all messages from store */}
      {currentConversationMessages.map((message) => (
        <div 
          key={message.id} 
          className={`flex justify-${message.role === 'user' ? 'end' : 'start'}`}
        >
          <div className={`flex flex-col items-${message.role === 'user' ? 'end' : 'start'} max-w-[70%]`}>
            <div className={`flex items-start space-x-2 max-w-full ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {/* Copy button for AI messages */}
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy message"
                    disabled={message.isStreaming}
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clipboard className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
              
              <div className={`rounded-2xl px-4 py-3 ${
                message.role === 'user' 
                  ? 'bg-gray-100 rounded-br-md' 
                  : message.isError 
                    ? 'bg-red-100 border border-red-200'
                    : 'bg-blue-100 rounded-bl-md'
              }`}>
                <p className={`text-sm whitespace-pre-wrap ${
                  message.role === 'user' 
                    ? 'text-gray-800' 
                    : message.isError 
                      ? 'text-red-800'
                      : 'text-gray-800'
                }`}>
                  {formatContent(message.content)}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-gray-600 ml-1 animate-pulse"></span>
                  )}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}

      {/* Loading indicator when streaming starts but no content yet */}
      {isStreaming && streamingMessageIdRef.current && !currentConversationMessages.find(msg => msg.id === streamingMessageIdRef.current) && (
        <div className="flex justify-start">
          <div className="flex items-start space-x-2 max-w-full">
            <div className="flex-shrink-0">
              <Clipboard className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex flex-col">
              <div className="bg-transparent">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin text-blue-500" />
                  <p className="text-gray-400 text-sm">AI is thinking...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default FetchMessage;