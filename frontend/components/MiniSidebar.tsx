import { changeminisidebarStatus } from '@/lib/features/currentState/currentStateSlice';
import { useAppDispatch } from '@/lib/hooks';
import { CombineIcon, PanelLeftClose, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from 'react';

const MiniSidebar = () => {
  const dispatch = useAppDispatch();

  const handleMiniSidebarStatus = () => {
    dispatch(changeminisidebarStatus());
  };

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
          <Plus size={22} />
        </button>
      </div>

      {/* Bottom Section - Profile Avatar */}
      <div>
        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default MiniSidebar;
