import { changeminisidebarStatus } from "@/lib/features/currentState/currentStateSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CombineIcon, PanelLeftClose, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { useRouter } from "next/navigation";
import { clearMessages, setParticularChatId } from "@/lib/features/Infodetail/infoDetailSlice";


interface StoreUser {
  user?: {
    name: string;
    isPremium: boolean;
  };
}

const MiniSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleplusicon = async () => {
    dispatch(setParticularChatId(""))
    dispatch(clearMessages())
    router.push('/')
  }

  const handleMiniSidebarStatus = () => {
    dispatch(changeminisidebarStatus());
  };

  const storeUser = useAppSelector(
    (state) => state.userReducer.user
  ) as StoreUser;

  const name = storeUser?.user?.name || "Guest";

  return (
    <div className="flex flex-col items-center justify-between h-screen w-16 bg-gray-900 text-white py-4">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <CombineIcon size={28} className="text-yellow-300" />

        {/* Collapse/Expand Button */}
        <button
          className="hover:text-yellow-300 transition"
          onClick={handleMiniSidebarStatus}
        >
          <PanelLeftClose size={22} />
        </button>

        {/* Plus Button */}
        <button className="text-yellow-300 hover:scale-110 cursor-pointer transition">
          <Plus size={22} 
          onClick={() => handleplusicon()}
          />
        </button>
      </div>

      {/* Bottom Section - Profile Avatar */}
      <div>
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gray-700 text-white font-semibold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default MiniSidebar;
