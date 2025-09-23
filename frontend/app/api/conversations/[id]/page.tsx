"use client"
import MiniSidebar from '@/components/MiniSidebar'
import Particular_chat from '@/components/Particular_chat';
import Sidebar from '@/components/Sidebar'
import { useAppSelector } from '@/lib/hooks';
import React from 'react'

const Particular_chat_component = () => {
    const currentSidebarStatus = useAppSelector(
        (state) => state.currentReducer.miniSidebarstatus
      );
    
      // Sidebar width: 18% if sidebar, 3% if miniSidebar
      const sidebarWidth = currentSidebarStatus ? "w-[18%]" : "w-[3%]";
      const mainWidth = currentSidebarStatus ? "w-[82%]" : "w-[97%]";

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar or MiniSidebar */}
      <div className={`h-full shrink-0 ${sidebarWidth}`}>
        {currentSidebarStatus ? <Sidebar /> : <MiniSidebar />}
      </div>

      {/* Main Chat Area */}
      <div className={`${mainWidth} h-full overflow-hidden`}>
        <Particular_chat />
      </div>
    </div>
  )
}

export default Particular_chat_component

