import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader, MoreVertical, Plus, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import {
  clearMessages,
  setFetchNewMessage,
  setParticularChatId,
} from "@/lib/features/Infodetail/infoDetailSlice";
import { Button } from "./ui/button";

interface T {
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date;
  usesId: string;
}

const Previous_chats_list = () => {
  const [chats, setChats] = useState<T[]>([]);
  const conversationId = useAppSelector(
    (state) => state.infoReducer.particular_chat_id
  );
  const [loading, setLoading] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const bearerToken = useAppSelector(
    (state) => state.currentTokenReducer.currentToken
  );

  const handleplusicon = async () => {
    dispatch(setParticularChatId(""));
    dispatch(clearMessages());
    router.push("/");
  };

  const handlePreviousChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/conversations`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setChats(data.conversations || []);
    } catch (error) {
      console.error("Error while fetching previous chats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bearerToken) {
      router.push("/sign-in");
      return;
    }
    handlePreviousChats();
  }, [bearerToken, router, pathname]);

  const toggleDropdown = useCallback((id: string | null) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  const handleparticularchat = useCallback(
    async (chatId: string) => {
      dispatch(setParticularChatId(chatId));
      dispatch(clearMessages());
      dispatch(setFetchNewMessage(false));

      router.push(`/api/conversations/${chatId}`);
    },
    [dispatch, router]
  );

  const handleRenameStart = (chat: T) => {
    setRenamingId(chat.id);
    setRenameValue(chat.title);
    setOpenDropdownId(null);
  };

  const handleRenameSubmit = async (chatId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/change/${chatId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({ newTitle: renameValue }),
        }
      );

      if (response.ok) {
        await handlePreviousChats(); // refresh list
        setRenamingId(null);
        setRenameValue("");
      }
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  const handleDelete = async (chatId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/change/${chatId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      if (response.ok) {
        await handlePreviousChats(); // refresh
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const chatList = React.useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      );
    }

    if (chats.length === 0) {
      return <p className="p-4 text-gray-500 text-sm">No previous chats</p>;
    }

    return chats.map((chat) => {
      const isActive = chat.id === conversationId;
      const isRenaming = renamingId === chat.id;

      return (
        <div
          key={chat.id}
          className={`flex items-center justify-between px-4 py-2 cursor-pointer transition relative
            ${isActive ? "bg-yellow-700 text-yellow-300" : "hover:bg-gray-800"}`}
          onClick={() => !isRenaming && handleparticularchat(chat.id)}
        >
          {isRenaming ? (
            <div className="flex flex-row items-center gap-2 w-full">
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="px-2 py-1 text-black rounded w-full"
                autoFocus
              />
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRenameSubmit(chat.id);
                }}
              >
                <Send size={16} />
              </Button>
            </div>
          ) : (
            <span className="truncate">{chat.title}</span>
          )}

          {!isRenaming && (
            <div className="relative dropdown-container">
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
                  <button
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-800"
                    onClick={() => handleRenameStart(chat)}
                  >
                    Rename
                  </button>
                  <button
                    className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800"
                    onClick={() => handleDelete(chat.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  });

  return (
    <div className="h-full flex flex-col bg-black text-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <span className="text-yellow-300 font-semibold">Chats</span>
        <button
          className="text-yellow-300 hover:scale-110 cursor-pointer transition"
          onClick={() => handleplusicon()}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">{chatList}</div>
    </div>
  );
};

export default Previous_chats_list;
