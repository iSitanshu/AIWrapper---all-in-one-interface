import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {}
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUserDetails: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { addUserDetails } = userSlice.actions
export default userSlice.reducer