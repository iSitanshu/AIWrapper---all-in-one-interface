import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Button } from "./ui/button";
import { setCurrentUserToken } from "@/lib/features/currentToken/currentTokenSlice";

interface StoreUser {
  user?: {
    name: string;
    isPremium: boolean;
  };
}

const Profile_Section = () => {
  const dispatch = useAppDispatch();
  const [renderLogout, setRenderLogout] = useState(false);
  const storeUser = useAppSelector(
    (state) => state.userReducer.user
  ) as StoreUser;

  const name = storeUser?.user?.name || "Guest";
  const isPremium = storeUser?.user?.isPremium ?? false;

  return (
    <div className="flex items-center gap-3 text-white relative">
      {/* Logout button (shows on toggle) */}
      {renderLogout && (
        <Button
          onClick={() => {
            dispatch(setCurrentUserToken(null));
            localStorage.removeItem('token');
          }}
          variant="destructive"
          className="absolute bottom-13 left-0 w-24 py-2 text-sm rounded-lg shadow-md cursor-pointer"
        >
          Logout
        </Button>
      )}

      {/* Avatar with first letter */}
      <Avatar
        className="h-12 w-12 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setRenderLogout((prev) => !prev)}
      >
        <AvatarFallback className="bg-gray-900 text-white font-semibold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* User info */}
      <div className="flex flex-col leading-tight cursor-pointer">
        <span className="font-semibold text-sm">{name}</span>
        <span className="text-xs text-gray-400">
          {isPremium ? "Premium" : "Free"}
        </span>
      </div>
    </div>
  );
};

export default Profile_Section;
