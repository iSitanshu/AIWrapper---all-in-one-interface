import { configureStore } from "@reduxjs/toolkit";
import currentReducer from './features/currentState/currentStateSlice'

export const store = () => {
    return configureStore({
        reducer: {
            currentReducer
        }
    })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']