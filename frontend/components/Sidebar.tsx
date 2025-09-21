import React from "react";
import Profile_Section from "./Profile_Section";
import Previous_chats_list from "./Previous_chats_list";
import Side_navbar from "./Side_navbar";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 flex flex-col bg-black text-white border-r border-gray-700">
      {/* top: logo + navbar */}
      <div className="h-[10%] flex items-center justify-center border-b border-gray-700">
        <Side_navbar />
      </div>

      {/* middle: previous chats */}
      <div className="h-[80%] overflow-y-auto border-b border-gray-700">
        <Previous_chats_list />
      </div>

      {/* bottom: profile */}
      <div className="h-[10%] flex items-center justify-center">
        <Profile_Section />
      </div>
    </div>
  );
};

export default Sidebar;
