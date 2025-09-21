import { PanelLeftClose } from "lucide-react";
import React from "react";

const Side_navbar = () => {
  return (
    <div className="flex items-center justify-between w-full px-4 text-white">
      {/* Left side: Brand name */}
      <p className="font-bold text-lg">AIWrapper</p>

      {/* Right side: Icon */}
      <button className="hover:text-yellow-300 transition">
        <PanelLeftClose size={22} />
      </button>
    </div>
  );
};

export default Side_navbar;
