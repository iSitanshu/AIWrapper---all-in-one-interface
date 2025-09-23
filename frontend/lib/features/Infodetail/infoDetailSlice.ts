import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current_email: "",
    particular_chat_id: ""
}

export const infoDetailSlice = createSlice({
    name: "infoDetail",
    initialState,
    reducers: {
        setUserEmail: (state, action) => {
            state.current_email = action.payload
        },
        setParticularChatId: (state, action) => {
            state.particular_chat_id = action.payload
        }
    }
})

export const { setUserEmail, setParticularChatId } = infoDetailSlice.actions
export default infoDetailSlice.reducer