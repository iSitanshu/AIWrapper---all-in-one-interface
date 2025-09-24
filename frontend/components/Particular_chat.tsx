import React, { useEffect } from "react";
import MainNavbar from "./MainNavbar";
import Conversation from "./Conversation";
import InputFooter from "./InputFooter";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { setParticularChatId } from "@/lib/features/Infodetail/infoDetailSlice";
import { useParams } from "next/navigation";

const Particular_chat: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const conversationId = useAppSelector(
  //   (state) => state.infoReducer.particular_chat_id as string | null
  // );

  // ✅ Destructure only the stable value, not the whole object
  const params = useParams<{ id?: string }>();
  const id = typeof params.id === "string" && params.id ? params.id : "";

  // Only store id if route is /conversations/:id, else store empty string

  // useEffect(() => {
  //   if (id && id !== conversationId) {
  //     // only dispatch when it's actually different
  //     dispatch(setParticularChatId(id));
  //   }
  // }, [id, conversationId, dispatch]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <MainNavbar />

      {/* Conversation container */}
      <div className="flex-1 flex flex-col min-h-0 px-2 pb-14">
        <div className="flex-1 overflow-hidden relative mb-5">
          {id ? (
            <Conversation />
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
