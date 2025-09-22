import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentToken: null
}

export const currentTokenSlice = createSlice({
    name: "token",
    initialState, 
    reducers: {
        setCurrentUserToken: (state, action) => {
            state.currentToken = action.payload
        }
    }
})

export const { setCurrentUserToken } = currentTokenSlice.actions
export default currentTokenSlice.reducer