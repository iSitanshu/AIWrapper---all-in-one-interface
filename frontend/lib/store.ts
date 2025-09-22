import { configureStore } from "@reduxjs/toolkit";
import currentReducer from './features/currentState/currentStateSlice'
import infoReducer from './features/Infodetail/infoDetailSlice'
import currentTokenReducer from './features/currentToken/currentTokenSlice'
import userReducer from './features/userDetail/userSlice'

export const store = () => {
    return configureStore({
        reducer: {
            currentReducer,
            infoReducer,
            currentTokenReducer,
            userReducer,
        }
    })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']