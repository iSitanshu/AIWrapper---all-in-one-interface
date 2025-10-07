// import { configureStore } from "@reduxjs/toolkit";
// import currentReducer from './features/currentState/currentStateSlice'
// import infoReducer from './features/Infodetail/infoDetailSlice'
// import currentTokenReducer from './features/currentToken/currentTokenSlice'
// import userReducer from './features/userDetail/userSlice'

// export const store = () => {
//     return configureStore({
//         reducer: {
//             currentReducer,
//             infoReducer,
//             currentTokenReducer,
//             userReducer,
//         }
//     })
// }

// export type AppStore = ReturnType<typeof store>
// export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch']



// lib/store.ts - FIXED VERSION
import { configureStore } from '@reduxjs/toolkit'
import currentReducer from './features/currentState/currentStateSlice'
import infoReducer from './features/Infodetail/infoDetailSlice'
import currentTokenReducer from './features/currentToken/currentTokenSlice'
import userReducer from './features/userDetail/userSlice'

// ✅ Create store ONCE as a singleton
import type { Store } from '@reduxjs/toolkit'
let store: Store | null = null

export const makeStore = () => {
  if (store) {
    return store // Return existing store if already created
  }
  
  store = configureStore({
    reducer: {
      currentReducer,
      currentTokenReducer, 
      infoReducer,
      userReducer,
    },
  })
  
  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// ✅ Export the singleton instance
export const getStore = () => {
  if (!store) {
    store = makeStore()
  }
  return store
}