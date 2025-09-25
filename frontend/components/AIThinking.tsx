import { Loader } from "lucide-react";
import React from "react";

const AIThinking = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-2 max-w-full">
        <Loader className="w-4 h-4 animate-spin text-blue-500" />
        <p className="text-gray-400 text-sm">AI is thinking...</p>
      </div>
    </div>
  );
};

export default AIThinking;
