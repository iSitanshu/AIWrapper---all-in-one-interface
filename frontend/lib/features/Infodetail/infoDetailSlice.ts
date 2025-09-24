import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  current_email: "",
  particular_chat_id: "",
  current_model: "openai/gpt-4o",
  fetch_messages_in_chunk: false,
  current_message: "",
};

export const infoDetailSlice = createSlice({
  name: "infoDetail",
  initialState,
  reducers: {
    setUserEmail: (state, action) => {
      state.current_email = action.payload;
    },
    setParticularChatId: (state, action) => {
      state.particular_chat_id = action.payload;
    },
    setCurrentModel: (state, action) => {
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
  },
});

export const {
  setUserEmail,
  setParticularChatId,
  setCurrentModel,
  setFetchMessagesInChunk,
  setCurrentMessage,
} = infoDetailSlice.actions;
export default infoDetailSlice.reducer;
