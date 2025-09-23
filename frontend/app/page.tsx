"use client";

import Main_chat_area from "@/components/Main_chat_area";
import MiniSidebar from "@/components/MiniSidebar";
import Sidebar from "@/components/Sidebar";
import Particular_chat from "@/components/Particular_chat"; // ✅ import this
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { addUserDetails } from "@/lib/features/userDetail/userSlice";
import { useEffect } from "react";

interface UserPayload {
  createdAt: string;
  credits: number;
  email: string;
  id: string;
  isPremium: boolean;
  name: string;
  password: string;
  updatedAt: string;
}

export default function Home() {
  const chatid = useAppSelector(
    (state) => state.infoReducer.particular_chat_id
  );
  const router = useRouter();
  const pathname = usePathname(); // ✅ current URL path
  const token = useAppSelector(
    (state) => state.currentTokenReducer.currentToken
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      const decoded = jwtDecode<UserPayload>(token);
      console.log("here is the decoded token", decoded);
      dispatch(addUserDetails(decoded));
    } catch (err) {
      console.error("Invalid token:", err);
      router.push("/sign-in");
    }
  }, [token, dispatch, router]);

  const currentSidebarStatus = useAppSelector(
    (state) => state.currentReducer.miniSidebarstatus
  );

  const sidebarWidth = currentSidebarStatus ? "w-[18%]" : "w-[3%]";
  const mainWidth = currentSidebarStatus ? "w-[82%]" : "w-[97%]";

  // ✅ Extract conversationId from URL
  const pathParts = pathname.split("/");
  const conversationId =
    pathParts[1] === "api" && pathParts[2] === "conversations"
      ? pathParts[3]
      : null;

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar or MiniSidebar */}
      <div className={`h-full shrink-0 ${sidebarWidth}`}>
        {currentSidebarStatus ? <Sidebar /> : <MiniSidebar />}
      </div>

      {/* Main Chat Area */}
      <div className={`${mainWidth} h-full overflow-hidden`}>
        {conversationId && conversationId === chatid ? (
          <Particular_chat /> // ✅ if match
        ) : (
          <Main_chat_area /> // ✅ default
        )}
      </div>
    </div>
  );
}
