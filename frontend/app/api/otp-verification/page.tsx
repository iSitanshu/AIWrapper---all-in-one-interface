import EmailPopup from "@/components/EmailPopup";
import EmailVerifyUsingOtp from "@/components/EmailVerifyusingotp";
import React from "react";

const Page = () => {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Sticky top-right popup */}
      <div className="absolute top-4 right-4">
        <EmailPopup />
      </div>

      {/* Center content */}
      <div className="flex items-center justify-center">
        <EmailVerifyUsingOtp />
      </div>
    </div>
  );
};

export default Page;
