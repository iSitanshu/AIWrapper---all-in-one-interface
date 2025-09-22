"use client";

import Main_chat_area from "@/components/Main_chat_area";
import MiniSidebar from "@/components/MiniSidebar";
import Sidebar from "@/components/Sidebar";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // ✅ default import
import { addUserDetails } from "@/lib/features/userDetail/userSlice";
import { useEffect } from "react";

// define the shape of your token payload
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
  const router = useRouter();
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

      dispatch(addUserDetails(decoded)); // ✅ use decoded directly
    } catch (err) {
      console.error("Invalid token:", err);
      router.push("/sign-in");
    }
  }, [token, dispatch, router]);

  const currentSidebarStatus = useAppSelector(
    (state) => state.currentReducer.miniSidebarstatus
  );

  // Sidebar width: 18% if sidebar, 3% if miniSidebar
  const sidebarWidth = currentSidebarStatus ? "w-[18%]" : "w-[3%]";
  const mainWidth = currentSidebarStatus ? "w-[82%]" : "w-[97%]";

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar or MiniSidebar */}
      <div className={`h-full shrink-0 ${sidebarWidth}`}>
        {currentSidebarStatus ? <Sidebar /> : <MiniSidebar />}
      </div>

      {/* Main Chat Area */}
      <div className={`${mainWidth} h-full overflow-hidden`}>
        <Main_chat_area />
      </div>
    </div>
  );
}
