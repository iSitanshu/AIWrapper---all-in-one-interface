import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader, MoreVertical, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import { clearMessages, setFetchMessage, setFetchNewMessage, setMessages, setParticularChatId } from "@/lib/features/Infodetail/infoDetailSlice";

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname(); // Add this to detect route changes
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const bearerToken = useAppSelector(
    (state) => state.currentTokenReducer.currentToken
  );

const handleplusicon = async () => {
    dispatch(setParticularChatId(""))
    dispatch(clearMessages())
    router.push('/')
  }
  
  // Add refs to prevent multiple fetches and redirects
  const hasFetched = useRef(false);
  const hasRedirected = useRef(false);
  const previousPathname = useRef(pathname);

  

    const handlePreviousChats = async () => {
      try {
        setLoading(true);
        hasFetched.current = true;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/conversations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setChats(data.conversations || []);
      } catch (error) {
        console.error("Error while fetching previous chats", error);
        hasFetched.current = false;
      } finally {
        setLoading(false)
      }
    };

  useEffect(() => {
    // Prevent multiple executions unless route actually changed
    if (hasFetched.current && pathname === previousPathname.current) return;
    
    previousPathname.current = pathname;

    if (!bearerToken) {
      // Prevent multiple redirects
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.push("/sign-in");
      }
      return;
    }

    handlePreviousChats();
  }, [bearerToken, router, pathname]); // Add pathname to dependencies

  // Memoize the toggleDropdown function
  const toggleDropdown = useCallback((id: string | null) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  // Memoize the handleparticularchat function
  const handleparticularchat = useCallback( async (chatId: string) => {
    // Only dispatch if the chatId is actually changing
    dispatch(setParticularChatId(chatId));
    
    dispatch(clearMessages());

    const currentPath = window.location.pathname;
    const match = currentPath.match(/^\/api\/conversations\/[^/]+$/);
      
    dispatch(setFetchNewMessage(false));
    if (match) {
      router.replace(`/api/conversations/${chatId}`);
    } else {
      router.push(`/api/conversations/${chatId}`);
    }
  }, [conversationId, dispatch, router]); // Add conversationId as dependency

  // Close dropdown when clicking outside - useCallback to prevent recreating
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only close if clicking outside the dropdown
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Optimize chat list rendering with useMemo
  const chatList = React.useMemo(() => {
    if (chats.length === 0) {
      return <p className="p-4 text-gray-500 text-sm">No previous chats</p>;
    }

    const handleRename = async (chatId: string) => {
      
    }

    const handleDelete = async (chatId: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/change/${chatId}`,{
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`
          }
        })
        if (response.ok) {
      await handlePreviousChats(); // ✅ refresh list immediately
    }
      } catch (error) {
        console.error(`Something wrong with the conversation Id, ${error}`)
      }
    }

    // ✅ Loading screen
        if (loading) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-4">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-400">Loading conversation...</p>
              </div>
            </div>
          );
        }

    return chats.map((chat) => {
      const isActive = chat.id === conversationId;
      return (
        <div
          key={chat.id}
          className={`flex items-center justify-between px-4 py-2 cursor-pointer transition relative
            ${isActive ? "bg-yellow-900 text-yellow-300" : "hover:bg-gray-800"}`}
          onClick={() => handleparticularchat(chat.id)}
        >
          <span className="truncate">{chat.title}</span>
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
                onClick={() => handleRename(chat.id)}
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
        </div>
      );
    });
  }, [chats, conversationId, handleparticularchat, toggleDropdown, openDropdownId]);

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <span className="text-yellow-300 font-semibold">Chats</span>
        <button
          className="text-yellow-300 hover:scale-110 cursor-pointer transition"
          onClick={() => handleplusicon()}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chatList}
      </div>
    </div>
  );
};

export default Previous_chats_list;