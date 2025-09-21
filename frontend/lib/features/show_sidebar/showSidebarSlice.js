import { createSlice } from "@reduxjs/toolkit";

const showSlice = createSlice({
    name: "show",
    initialState: {
        currentSidebar: true
    },
    reducers: {
        changecurrentsidebarStatus: (state) => {
            state.currentSidebar = !currentSidebar
        }
    }
})

export const { changecurrentsidebarStatus } = currentSidebar.actions
export default showSlice.reducer