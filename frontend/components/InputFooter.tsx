import React, { useCallback, useState } from "react";
import TextArea from "./TextArea";
import { setCurrentModel } from "@/lib/features/Infodetail/infoDetailSlice";
import { useAppDispatch } from "@/lib/hooks";

const models = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus" },
  { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet" },
  { id: "meta/llama-3", name: "Llama 3" },
];

const InputFooter = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
  const dispatch = useAppDispatch();

  const handleModelSelect = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    setIsDropdownOpen(false);
    dispatch(setCurrentModel(modelId));
  }, [dispatch]);

  return (
    <div className="fixed bottom-6 w-full flex items-end justify-center px-4">
      <div className="flex w-full max-w-5xl gap-2 items-end">
        {/* Model Selector */}
        <div className="relative">
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
            <div className="absolute bottom-full mb-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    selectedModel === model.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-200"
                  } hover:bg-gray-700`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-1">
          <TextArea />
        </div>
      </div>
    </div>
  );
};

export default InputFooter;
