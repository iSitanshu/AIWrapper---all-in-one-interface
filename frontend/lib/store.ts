import { configureStore } from "@reduxjs/toolkit";
import showSidebar from "./features/show_sidebar/showSidebarSlice"

export const store = () => {
    return configureStore({
        reducer: {
            show: showSidebar
        }
    })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']