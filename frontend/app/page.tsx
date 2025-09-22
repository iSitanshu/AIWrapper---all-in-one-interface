"use client";

import Main_chat_area from "@/components/Main_chat_area";
import MiniSidebar from "@/components/MiniSidebar";
import Sidebar from "@/components/Sidebar";
import { useAppSelector } from "@/lib/hooks";

export default function Home() {
  const currentSidebarStatus = useAppSelector((state) => state.currentReducer.miniSidebarstatus);

  // Sidebar width: 15% if sidebar, 5% if miniSidebar
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
        <Main_chat_area />
      </div>
    </div>
  );
}
