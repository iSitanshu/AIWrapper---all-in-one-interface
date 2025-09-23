import React, { useEffect } from "react";
import MainNavbar from "./MainNavbar";
import Conversation from "./Conversation";
import InputFooter from "./InputFooter";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setParticularChatId } from "@/lib/features/Infodetail/infoDetailSlice";
import { useParams } from "next/navigation";

const Particular_chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const conversationId = useAppSelector(
    (state) => state.infoReducer.particular_chat_id as string | null
  );

  const params = useParams<{ id?: string }>();

  useEffect(() => {
    if (params?.id) {
      dispatch(setParticularChatId(params.id));
    }
  }, [params?.id, dispatch]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <MainNavbar />

      {/* Conversation container with proper constraints and bottom spacing */}
      <div className="flex-1 flex flex-col min-h-0 px-2 pb-14">
        <div
          className="flex-1 overflow-hidden relative"
          style={{ marginBottom: "20px" }}
        >
          {conversationId ? (
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

export default Particular_chat;
