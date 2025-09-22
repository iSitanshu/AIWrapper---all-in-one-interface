import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    miniSidebarstatus: true
}

export const currentSlice = createSlice({
    name: "show",
    initialState,
    reducers: {
        changeminisidebarStatus: (state) => {
            state.miniSidebarstatus = !state.miniSidebarstatus
            console.log("current mini side bar status - ",state.miniSidebarstatus);
        }
    } // properties and function
})

export const { changeminisidebarStatus } = currentSlice.actions
export default currentSlice.reducer