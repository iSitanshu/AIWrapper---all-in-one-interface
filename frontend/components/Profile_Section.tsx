import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile_Section = () => {
  return (
    <div className="flex gap-3 text-white">
      {/* Avatar (left side) */}
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* Name & Plan (right side) */}
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-sm">Name</span>
        <span className="text-xs text-gray-400">Plan</span>
      </div>
    </div>
  );
};

export default Profile_Section;
