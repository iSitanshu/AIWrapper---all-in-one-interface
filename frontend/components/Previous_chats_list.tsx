import React, { useState, useEffect } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setParticularChatId } from "@/lib/features/Infodetail/infoDetailSlice";
import { useRouter } from "next/navigation";

interface T {
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date;
  usesId: string;
}

const Previous_chats_list = () => {
  const [chats, setChats] = useState<T[]>([]);
  const dispatch = useAppDispatch();
  const conversationId = useAppSelector(
    (state) => state.infoReducer.particular_chat_id
  );
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const bearerToken = useAppSelector(
    (state) => state.currentTokenReducer.currentToken
  );

  useEffect(() => {
    if (!bearerToken && !conversationId) {
      router.push("/sign-in");
      return;
    }

    const handlePreviousChats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/conversations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await response.json();
        setChats(data.conversations || []);
      } catch (error) {
        console.error("Error while fetching previous chats", error);
      }
    };

    handlePreviousChats();
  }, [bearerToken, conversationId, router]);

  const toggleDropdown = (id: string | null) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleparticularchat = (chatId: string) => {
    dispatch(setParticularChatId(chatId));
    const currentPath = window.location.pathname;
    const match = currentPath.match(/^\/api\/conversations\/[^/]+$/);
    if (match) {
      router.replace(`/api/conversations/${chatId}`);
    } else {
      router.push(`/api/conversations/${chatId}`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <span className="text-yellow-300 font-semibold">Chats</span>
        <button
          className="text-yellow-300 hover:scale-110 cursor-pointer transition"
          onClick={() => router.push("/")}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No previous chats</p>
        ) : (
          chats.map((chat) => {
            const isActive = chat.id === conversationId; // highlight check
            return (
              <div
                key={chat.id}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer transition relative
                  ${isActive ? "bg-yellow-900 text-yellow-300" : "hover:bg-gray-800"}`}
                onClick={() => handleparticularchat(chat.id)}
              >
                <span className="truncate">{chat.title}</span>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default Previous_chats_list;
