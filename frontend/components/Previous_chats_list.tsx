import React, { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";

const Previous_chats_list = () => {
  const [chats] = useState([
    { id: 1, name: "Help with React components", timestamp: "2 hours ago" },
    { id: 2, name: "JavaScript array methods", timestamp: "1 day ago" },
    { id: 3, name: "CSS Grid layout tutorial", timestamp: "2 days ago" },
    { id: 4, name: "API integration best practices", timestamp: "3 days ago" },
    { id: 5, name: "Database optimization tips", timestamp: "1 week ago" },
    { id: 6, name: "React hooks explained", timestamp: "1 week ago" },
    { id: 7, name: "Python data structures", timestamp: "2 weeks ago" },
    { id: 8, name: "Web accessibility guidelines", timestamp: "2 weeks ago" },
  ]);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const toggleDropdown = (id: number | null) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <span className="text-yellow-300 font-semibold">Chats</span>
        <button className="text-yellow-300 hover:scale-110 cursor-pointer transition">
          <Plus size={20} />
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-800 cursor-pointer transition relative"
          >
            <span className="truncate">{chat.name}</span>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent click
                  toggleDropdown(chat.id);
                }}
                className="text-gray-400 hover:text-yellow-300"
              >
                <MoreVertical size={18} />
              </button>

              {openDropdownId === chat.id && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded shadow-lg z-20">
                  <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-800">
                    Rename
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Previous_chats_list;
