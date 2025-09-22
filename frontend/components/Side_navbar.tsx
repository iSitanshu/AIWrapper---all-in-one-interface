import { changeminisidebarStatus } from "@/lib/features/currentState/currentStateSlice";
import { useAppDispatch } from "@/lib/hooks";
import { CombineIcon, PanelLeftClose } from "lucide-react";
import React from "react";

const Side_navbar = () => {
  const dispatch = useAppDispatch();
  const handleMiniSidebarStatus = async () => {
    dispatch(changeminisidebarStatus());
  }
  
  
  return (
    <div className="flex items-center justify-between w-full px-4 text-white">
      {/* Left side: Brand name */}
      <CombineIcon />
      {/* Right side: Icon */}
      <button className="hover:text-yellow-300 transition">
        <PanelLeftClose size={22} 
      onClick={handleMiniSidebarStatus}/>
      </button>
    </div>
  );
};

export default Side_navbar;
