import React from 'react'
import MainNavbar from './MainNavbar'
import Conversation from './Conversation'
import InputFooter from './InputFooter'

const Particular_chat = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <MainNavbar />
      
      {/* Conversation container with proper constraints and bottom spacing */}
      <div className="flex-1 flex flex-col min-h-0 px-2 pb-14">
        <div 
          className="flex-1 overflow-hidden relative"
          style={{ marginBottom: '20px' }} // Additional bottom margin
        >
          <Conversation />
        </div>
      </div>
      
      <InputFooter />
    </div>
  )
}

export default Particular_chat