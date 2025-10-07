"use client";

import Main_chat_area from "@/components/Main_chat_area";
import MiniSidebar from "@/components/MiniSidebar";
import Sidebar from "@/components/Sidebar";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { addUserDetails } from "@/lib/features/userDetail/userSlice";
import { useEffect } from "react";
import { setCurrentUserToken } from "@/lib/features/currentToken/currentTokenSlice";

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
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && !token) {
      dispatch(setCurrentUserToken(storedToken));
    } else if (!storedToken) {
      router.push("/sign-in");
    }
  }, [dispatch, router, token]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        dispatch(addUserDetails(decoded));
      } catch (err) {
        console.error("Invalid or expired token:", err);
        localStorage.removeItem('token');
        dispatch(setCurrentUserToken(null)); // Assuming null clears the token
        router.push("/sign-in");
      }
    }
  }, [token, dispatch, router]);

  const currentSidebarStatus = useAppSelector(
    (state) => state.currentReducer.miniSidebarstatus
  );

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
