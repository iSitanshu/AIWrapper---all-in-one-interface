import React, { useState, useCallback } from "react";
import TextArea from "./TextArea";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { setCurrentModel } from "@/lib/features/Infodetail/infoDetailSlice";

const models = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus" },
  { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet" },
  { id: "meta/llama-3", name: "Llama 3" },
];

const MainChatArea = () => {
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    setIsDropdownOpen(false); 
    dispatch(setCurrentModel(modelId));
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <Button className="text-3xl font-bold text-center py-6 text-gray-100 hover: cursor-pointer">
        AIWrapper
      </Button>

      {/* Model selector + input area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Model Selector */}
        <div className="w-full max-w-2xl mb-6 relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex justify-between items-center bg-gray-800 text-gray-200 px-4 py-2 rounded-md border border-gray-700 hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-300"
          >
            {models.find((m) => m.id === selectedModel)?.name || "Select model"}
            <svg
              className="w-4 h-4 ml-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute mt-2 w-1/3 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    selectedModel === model.id ? "bg-gray-700 text-white" : "text-gray-200"
                  } hover:bg-gray-700`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat placeholder */}
        <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center mb-6 h-64">
          <svg
            className="w-12 h-12 text-gray-500 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="text-gray-400 text-center">
            Start a conversation by typing a message below
          </p>
        </div>

        {/* Message Input */}
        <TextArea />
      </div>
    </div>
  );
};

export default MainChatArea;