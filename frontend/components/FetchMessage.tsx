// import { useAppSelector } from '@/lib/hooks';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useDispatch } from 'react-redux';
// import {setFetchMessagesInChunk,addMessage,updateMessageContent,setMessageStreaming, clearMessages} from '@/lib/features/Infodetail/infoDetailSlice';
// import AIThinking from './AIThinking';
// import Copy from './Copy';

// const FetchMessage = () => {
//   const dispatch = useDispatch();
//   const bearerToken = useAppSelector((state) => state.currentTokenReducer.currentToken);
//   const conversationId = useAppSelector((state) => state.infoReducer.particular_chat_id);
//   const currentModel = useAppSelector((state) => state.infoReducer.current_model);
//   const currentMessage = useAppSelector((state) => state.infoReducer.current_message);
//   const fetchMessagesinchunk = useAppSelector((state) => state.infoReducer.fetch_messages_in_chunk);
//   const messages = useAppSelector((state) => state.infoReducer.messages || []);

//   const [isStreaming, setIsStreaming] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const hasFetchedRef = useRef(false);
//   const streamingMessageIdRef = useRef<string | null>(null);
//   const aireply = useAppSelector((state) => state.infoReducer.messages)

//   // ✅ Smooth auto-scroll
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isStreaming, scrollToBottom]);

//   const generateMessageId = () =>
//     `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//   const handleOpenRouter = useCallback(async () => {
//     if (!bearerToken || !currentModel || !conversationId || !currentMessage || hasFetchedRef.current) {
//       return;
//     }

//     hasFetchedRef.current = true;
//     setIsStreaming(true);

//     const userMessageId = generateMessageId();
//     const aiMessageId = generateMessageId();
//     streamingMessageIdRef.current = aiMessageId;

//     try {
//       // User message
//       dispatch(
//         addMessage({
//           id: userMessageId,
//           role: 'user',
//           content: currentMessage,
//           timestamp: new Date().toISOString(),
//           conversationId,
//         })
//       );

//       // Placeholder AI message
//       dispatch(
//         addMessage({
//           id: aiMessageId,
//           role: 'assistant',
//           content: '',
//           timestamp: new Date().toISOString(),
//           conversationId,
//           isStreaming: true,
//         })
//       );

//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${bearerToken}`,
//         },
//         body: JSON.stringify({ conversationId, message: currentMessage, model: currentModel }),
//       });

//       if (!response.ok) throw new Error('Failed to fetch conversation');

//       const reader = response.body?.getReader();
//       if (!reader) throw new Error('No reader available');

//       const decoder = new TextDecoder();
//       let fullResponse = '';

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         fullResponse += chunk;

//         // ✅ Only update instead of re-adding
//         dispatch(updateMessageContent({ id: aiMessageId, content: fullResponse }));
//         dispatch(setMessageStreaming({ id: aiMessageId, isStreaming: true }));
//       }

//       dispatch(setMessageStreaming({ id: aiMessageId, isStreaming: false }));
//     } catch (error) {
//       console.error('Error while streaming response', error);

//       if (streamingMessageIdRef.current) {
//         dispatch(
//           updateMessageContent({
//             id: streamingMessageIdRef.current,
//             content: '⚠️ Error generating response.',
//           })
//         );
//         dispatch(setMessageStreaming({ id: streamingMessageIdRef.current, isStreaming: false }));
//       }
//     } finally {
//   setIsStreaming(false);
//   streamingMessageIdRef.current = null;
//   setTimeout(() => {
//     dispatch(setFetchMessagesInChunk(false));
//     hasFetchedRef.current = false;
//   }, 100);
//   dispatch(clearMessages());
// }
// }, [bearerToken, currentModel, conversationId, currentMessage, dispatch]);

//   useEffect(() => {
//     if (fetchMessagesinchunk && currentMessage && !hasFetchedRef.current) {
//       handleOpenRouter();
//     }
//   }, [fetchMessagesinchunk, currentMessage, handleOpenRouter]);


//   const formatContent = (content: string) => {
//     const lines = content.split('\n');
//     return lines.map((line, index) => (
//       <React.Fragment key={index}>
//         {line}
//         {index < lines.length - 1 && <br />}
//       </React.Fragment>
//     ));
//   };

//   const currentConversationMessages = messages
//     .filter((msg) => msg.conversationId === conversationId)
//     .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
//     .map((msg) => ({
//       ...msg,
//       isStreaming: msg.isStreaming ?? false, // Ensure isStreaming is always boolean
//     }));

//   if (currentConversationMessages.length === 0 && !isStreaming) {
//   return <div className="text-gray-400 text-sm">No messages yet...</div>;
// }


//   return (
//     <div className="flex flex-col space-y-4">
//       {currentConversationMessages.map((message) => (
//         <div key={message.id} className={`flex justify-${message.role === 'user' ? 'end' : 'start'}`}>
//           <div className={`flex flex-col items-${message.role === 'user' ? 'end' : 'start'} max-w-[70%]`}>
//             <div
//               className={`flex items-start space-x-2 max-w-full ${
//                 message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//               }`}
//             >
//               {message.role === 'assistant' && (
//                 <Copy message={message} />
//               )}

//               <div
//                 className={`rounded-2xl px-4 py-3 ${
//                   message.role === 'user'
//                     ? 'bg-gray-100 rounded-br-md'
//                     : message.isError
//                     ? 'bg-red-100 border border-red-200'
//                     : 'bg-blue-100 rounded-bl-md'
//                 }`}
//               >
//                 <p
//                   className={`text-sm whitespace-pre-wrap ${
//                     message.role === 'user'
//                       ? 'text-gray-800'
//                       : message.isError
//                       ? 'text-red-800'
//                       : 'text-gray-800'
//                   }`}
//                 >
//                   {formatContent(message.content)}
//                   {message.isStreaming && (
//                     <span className="inline-block w-2 h-4 bg-gray-600 ml-1 animate-pulse"></span>
//                   )}
//                 </p>
//               </div>
//             </div>
//             <span className="text-xs text-gray-500 mt-1">
//               {new Date(message.timestamp).toLocaleTimeString()}
//             </span>
//           </div>
//         </div>
//       ))}

//       {/* Loader when AI hasn't started output yet */}
//       {isStreaming &&
//         streamingMessageIdRef.current &&
//         !currentConversationMessages.find((msg) => msg.id === streamingMessageIdRef.current) && (
//           <AIThinking />
//         )}

//       <div ref={messagesEndRef} />
      
//     </div>
//   );
// };

// export default FetchMessage;