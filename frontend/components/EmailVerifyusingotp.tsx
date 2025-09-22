"use client";

import React, { useState, useRef } from "react";

const EmailVerifyUsingOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input automatically
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        // clear current value first
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // move to previous box if empty
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    console.log("OTP submitted:", otpString);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Enter OTP</h2>
      <p className="text-gray-400 text-center mb-6">Enter the 6-digit code sent to your email</p>

      <form onSubmit={handleSubmit} className="flex justify-center gap-3 mb-6">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-12 h-12 text-center text-lg font-bold text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 transition"
          />
        ))}
      </form>

      {/* Verify Button */}
      <button
        type="submit"
        className="w-full max-w-md py-3 bg-green-400 text-black font-semibold rounded-md hover:bg-green-500 transition"
      >
        Verify OTP
      </button>

      {/* Resend OTP */}
      <p className="text-gray-400 text-center mt-6">
        Didn’t receive the code?{" "}
        <button
          type="button"
          onClick={() => console.log("Resend OTP clicked")}
          className="text-green-400 hover:text-green-500 cursor-pointer font-semibold ml-1 transition"
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
};

export default EmailVerifyUsingOtp;
