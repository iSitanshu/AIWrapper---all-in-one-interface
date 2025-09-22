"use client";
import { setCurrentUserToken } from "@/lib/features/currentToken/currentTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";

const EmailVerifyUsingOtp = () => {
  const dispatch = useAppDispatch()
  const email = useAppSelector((state) => state.infoReducer.current_email);
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
        { email, otp: otpString }
      );

      if (response.data.success) {
        console.log("OTP verified ✅", response.data);
        dispatch(setCurrentUserToken(response.data.token));
        router.push('/');
      } else {
        console.error("❌ OTP verification failed:", response.data.message || response.data);
        // Optionally show error to user here
      }
    } catch (error) {
      console.error("❌ Error verifying OTP", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Enter OTP</h2>
      <p className="text-gray-400 text-center mb-6">
        Enter the 6-digit code sent to your email
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 w-full max-w-md"
      >
        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => { inputsRef.current[idx] = el; }}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-12 text-center text-lg font-bold text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 transition"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-400 text-black font-semibold rounded-md hover:bg-green-500 transition cursor-pointer"
        >
          Verify OTP
        </button>
      </form>

      <p className="text-gray-400 text-center mt-6">
        Didn’t receive the code?{" "}
        <button
          type="button"
          onClick={() => router.push("/sign-up")}
          className="text-green-400 hover:text-green-500 cursor-pointer font-semibold ml-1 transition"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default EmailVerifyUsingOtp;
