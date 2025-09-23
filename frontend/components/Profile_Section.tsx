import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/lib/hooks";

interface StoreUser {
  user?: {
    name: string;
    isPremium: boolean;
  };
}

const Profile_Section = () => {
  const storeUser = useAppSelector(
    (state) => state.userReducer.user
  ) as StoreUser;

  const name = storeUser?.user?.name || "Guest";
  const isPremium = storeUser?.user?.isPremium ?? false;

  return (
    <div className="flex gap-3 text-white">
      {/* Avatar with first letter */}
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-gray-900 text-white font-semibold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* User info */}
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-sm">{name}</span>
        <span className="text-xs text-gray-400">
          {isPremium ? "Premium" : "Free"}
        </span>
      </div>
    </div>
  );
};

export default Profile_Section;
