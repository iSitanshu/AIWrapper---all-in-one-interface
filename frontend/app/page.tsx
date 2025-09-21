"use client";

import Main_chat_area from "@/components/Main_chat_area";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar (15% width) */}
      <div className="h-full shrink-0">
        <Sidebar />
      </div>

      {/* Main Chat Area (85% width) */}
      <div className="w-[85%] h-full overflow-hidden">
        <Main_chat_area />
      </div>
    </div>
  );
}
