import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current_email: ""
}

export const infoDetailSlice = createSlice({
    name: "infoDetail",
    initialState,
    reducers: {
        setUserEmail: (state, action) => {
            state.current_email = action.payload
        }
    }
})

export const { setUserEmail } = infoDetailSlice.actions
export default infoDetailSlice.reducer