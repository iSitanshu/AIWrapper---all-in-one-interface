import React from "react";
import MainNavbar from "./MainNavbar";
import Conversation from "./Conversation";
import InputFooter from "./InputFooter";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import Rendering from "./Rendering";

const Particular_chat: React.FC = () => {
  // ✅ Destructure only the stable value, not the whole object
  const params = useParams<{ id?: string }>();
  const id = typeof params.id === "string" && params.id ? params.id : "";

  const fetch_new_message_in_chunks = useAppSelector(
    (state) => state.infoReducer.fetch_new_message
  );

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <MainNavbar />

      {/* Conversation container */}
      <div className="flex-1 flex flex-col min-h-0 px-2 pb-14">
        <div className="flex-1 overflow-hidden relative mb-5">
          {id ? (
            fetch_new_message_in_chunks ? (
              <Rendering />
            ) : (
              <Conversation />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>

      <InputFooter />
    </div>
  );
};

export default React.memo(Particular_chat);
