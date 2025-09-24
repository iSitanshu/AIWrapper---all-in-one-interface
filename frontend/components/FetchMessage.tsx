import { useAppSelector } from '@/lib/hooks';
import React, { useState, useEffect, useRef } from 'react'
import { Clipboard, Check, Loader } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setCurrentMessage, setFetchMessagesInChunk } from '@/lib/features/Infodetail/infoDetailSlice';

const FetchMessage = () => {
  const dispatch = useDispatch();
  const bearerToken = useAppSelector((state) => state.currentTokenReducer.currentToken);
  const conversationId = useAppSelector((state) => state.infoReducer.particular_chat_id);
  const currentModel = useAppSelector((state) => state.infoReducer.current_model);
  const currentMessage = useAppSelector((state) => state.infoReducer.current_message);
  const fetchMessagesinchunk = useAppSelector((state) => state.infoReducer.fetch_messages_in_chunk);

  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [streamingResponse, currentMessage]);

  useEffect(() => {
    if (fetchMessagesinchunk) {
      handleOpenRouter();
    }
  }, [fetchMessagesinchunk]);

  const handleOpenRouter = async () => {
    if (!bearerToken || !currentModel || !conversationId || !currentMessage) return;

    setIsStreaming(true);
    setStreamingResponse('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            conversationId,
            message: currentMessage,
            model: currentModel,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch conversation");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setStreamingResponse(accumulatedText);
        
        // Log each chunk as it arrives
        console.log("Chunk from server:", chunk);
      }

      console.log("Final full response:", accumulatedText);
    } catch (error) {
      console.error("Error while sending and fetching response from the model", error);
    } finally {
      setIsStreaming(false);
      // Clear the states after streaming is complete
      dispatch(setCurrentMessage(''));
      dispatch(setFetchMessagesInChunk(false));
    }
  };

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

  if (!fetchMessagesinchunk || !currentMessage) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Message - Right Aligned */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end">
            <div className="flex flex-col items-end max-w-[70%]">
              <div className="bg-gray-100 rounded-2xl rounded-br-md px-4 py-3">
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {formatContent(currentMessage)}
                </p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* AI Response - Left Aligned with Streaming */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-full">
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleCopy(streamingResponse, 'streaming-response')}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy message"
                  disabled={isStreaming && streamingResponse === ''}
                >
                  {copiedMessageId === 'streaming-response' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clipboard className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex flex-col">
                <div className="bg-transparent">
                  <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                    {formatContent(streamingResponse)}
                    {isStreaming && (
                      <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Loading indicator when streaming starts but no content yet */}
          {isStreaming && streamingResponse === '' && (
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
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default FetchMessage;