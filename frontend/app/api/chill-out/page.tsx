"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const RateLimitComponent = () => {
  const [cooldown, setCooldown] = useState(60); // 1 minute cooldown
  const [isCooldownActive, setIsCooldownActive] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isCooldownActive) {
      intervalId = setInterval(() => {
        setCooldown((prevCooldown) => {
          if (prevCooldown <= 1) {
            setIsCooldownActive(false);
            return 0;
          }
          return prevCooldown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isCooldownActive]);

  const handleRetry = () => {
    // Implement logic to retry the request
    router.push('/sign-in')
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Rate Limit Exceeded</h2>
      <p className="text-lg text-gray-600 mb-6">
        You have exceeded the allowed number of requests. Please try again after {cooldown} seconds.
      </p>
      {isCooldownActive ? (
        <p className="text-lg text-gray-600">Cooldown: {cooldown} seconds</p>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default RateLimitComponent;