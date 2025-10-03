import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  role: string;
  message: string;
  timestamp: number;
}

interface InfoDetailState {
  current_email: string;
  particular_chat_id: string | null;
  current_model: string;
  messages: Message[];
  fetch_messages_in_chunk: boolean;
  fetch_new_message: boolean;
  isScolling: boolean;
  isChunkActive: boolean;
}

const initialState: InfoDetailState = {
  current_email: "",
  particular_chat_id: null,
  current_model: "openai/gpt-4o",
  messages: [],
  fetch_messages_in_chunk: false,
  fetch_new_message: false,
  isScolling: false,
  isChunkActive: false
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
    setFetchNewMessage: (state, action) => {
      state.fetch_new_message = action.payload;
    },
    setCurrentModel: (state, action: PayloadAction<string>) => {
      state.current_model = action.payload;
    },
    setMessages: (state, action: PayloadAction<Omit<Message, 'id'> & { id?: string }>) => {
      const newMessage: Message = {
        ...action.payload,
        id: action.payload.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      state.messages = [...state.messages, newMessage];
    },
    addatLast: (state, action: PayloadAction<string>) => {
      if (state.messages && state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        lastMessage.message += action.payload;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setFetchMessage: (state, action) => {
      state.fetch_messages_in_chunk = action.payload;
    },
    updateLastMessage: (state, action: PayloadAction<{ message: string; timestamp?: number }>) => {
      if (state.messages && state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        lastMessage.message = action.payload.message;
        if (action.payload.timestamp) {
          lastMessage.timestamp = action.payload.timestamp;
        }
      }
    },
    setIsScrolling: (state, action) => {
      state.isScolling = action.payload
    },
    setIsChunkActive: (state, action) => {
      state.isChunkActive = action.payload
    }
  },
});

export const {
  setUserEmail,
  setParticularChatId,
  setCurrentModel,
  setMessages,
  addatLast,
  updateLastMessage,
  setFetchMessage,
  setIsScrolling,
  setFetchNewMessage,
  clearMessages,
  setIsChunkActive
} = infoDetailSlice.actions;

export default infoDetailSlice.reducer;