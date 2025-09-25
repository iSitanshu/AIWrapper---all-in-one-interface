import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Message type definition
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  conversationId: string;
  isStreaming?: boolean;
  isError?: boolean;
}

interface InfoDetailState {
  current_email: string;
  particular_chat_id: string;
  current_model: string;
  fetch_messages_in_chunk: boolean;
  current_message: string;
  messages: Message[];
}

const initialState: InfoDetailState = {
  current_email: "",
  particular_chat_id: "",
  current_model: "openai/gpt-4o",
  fetch_messages_in_chunk: false,
  current_message: "",
  messages: [],
};

export const infoDetailSlice = createSlice({
  name: "infoDetail",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.current_email = action.payload;
    },
    setParticularChatId: (state, action: PayloadAction<string>) => {
      state.particular_chat_id = action.payload;
    },
    setCurrentModel: (state, action: PayloadAction<string>) => {
      // state.current_model = action.payload;
      // console.log(action.payload);
      state.current_model = "openai/gpt-4o";
    },
    setFetchMessagesInChunk: (state, action: PayloadAction<boolean>) => {
      state.fetch_messages_in_chunk = action.payload;
    },
    setCurrentMessage: (state, action: PayloadAction<string>) => {
      state.current_message = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const existingIndex = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (existingIndex >= 0) {
        // Update existing message
        state.messages[existingIndex] = action.payload;
      } else {
        // Add new message
        state.messages.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearConversationMessages: (state, action: PayloadAction<string>) => {
      // Clear messages for a specific conversation
      state.messages = state.messages.filter(msg => msg.conversationId !== action.payload);
    },
    updateMessageContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
      }
    },
    setMessageStreaming: (state, action: PayloadAction<{ id: string; isStreaming: boolean }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.isStreaming = action.payload.isStreaming;
      }
    },
  },
});

export const {
  setUserEmail,
  setParticularChatId,
  setCurrentModel,
  setFetchMessagesInChunk,
  setCurrentMessage,
  addMessage,
  clearMessages,
  clearConversationMessages,
  updateMessageContent,
  setMessageStreaming,
} = infoDetailSlice.actions;
export default infoDetailSlice.reducer;