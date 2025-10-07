// components/ReduxDebugger.tsx
'use client'

import { useAppSelector } from '@/lib/hooks'
import { useEffect } from 'react'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => void;
  }
}

export default function ReduxDebugger() {
  const token = useAppSelector((state) => state.currentTokenReducer.currentToken)
  const currentState = useAppSelector((state) => state.currentReducer)
  
  useEffect(() => {
    console.log('🔴 REDUX DEBUG - Token:', token)
    console.log('🔴 REDUX DEBUG - Current State:', currentState)
    console.log(
      '🔴 REDUX DEBUG - Full store available:',
      !!((window as Window & typeof globalThis).__REDUX_DEVTOOLS_EXTENSION__)
    )
  }, [token, currentState])
  
  return null // This component doesn't render anything
}