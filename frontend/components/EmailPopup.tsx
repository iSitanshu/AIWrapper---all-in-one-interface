"use client";

import React, { useEffect, useState } from "react";

const EmailVerificationBox: React.FC = () => {
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(true);
  const [loaderWidth, setLoaderWidth] = useState(100); // percentage

  useEffect(() => {
    const interval = 50; // update every 50ms
    const totalTime = 5000; // 5 seconds
    const step = (interval / totalTime) * 100; // percent to reduce each step

    const timer = setInterval(() => {
      setLoaderWidth((prev) => {
        const next = prev - step;
        if (next <= 0) {
          clearInterval(timer);
          setActive(false);
          setTimeout(() => setVisible(false), 500);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full max-w-md mx-auto">

      <div
        className={`relative bg-white p-6 rounded-2xl shadow-lg transition-all duration-500 ${
          active ? "opacity-100" : "opacity-60 bg-gray-100 cursor-not-allowed"
        }`}
      >
        {/* Green loader with inline width animation */}
        {active && (
          <div
            className="absolute top-0 left-0 h-1 bg-green-500 rounded-t"
            style={{ width: `${loaderWidth}%`, transition: "width 50ms linear" }}
          />
        )}

        <p className="text-center text-lg font-semibold text-gray-800">
          Check your email for the verification
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          We have sent a verification link to your email address
        </p>
      </div>

      {!active && (
        <div className="mt-8 bg-green-100 p-4 rounded-lg text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-500 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-green-800 font-medium">
            Email verified successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationBox;
