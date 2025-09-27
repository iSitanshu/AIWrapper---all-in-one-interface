import { setFetchMessage, setMessages } from "@/lib/features/Infodetail/infoDetailSlice";
import { useAppDispatch } from "@/lib/hooks";
// import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
// import { v4 as uuidv4 } from 'uuid';

const TextArea = () => {
  const [message, setMessage] = useState<string>("");
  const handleTextareaInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
      textarea.style.overflowY =
        textarea.scrollHeight > 160 ? "auto" : "hidden";
    },
    []
  );
  const dispatch = useAppDispatch();

  const handleInputSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      dispatch(setMessages({role: "User" , message: message, timestamp: Date.now()}));
      dispatch(setFetchMessage(true));
      setMessage("")
  }

  return (
    <form
      className="flex w-full max-w-2xl border border-gray-700 rounded-md bg-gray-800"
      style={{ minHeight: "48px" }}
      onSubmit={(e) => {handleInputSubmit(e)}}
    >
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={1}
        className="flex-1 w-full px-4 py-3 bg-gray-800 text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-yellow-300 overflow-y-auto rounded-l-md"
        style={{ maxHeight: "160px" }}
        onInput={handleTextareaInput}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className={`px-4 py-3 rounded-r-md border-l border-gray-700 flex-shrink-0 ${
          message.trim()
            ? "bg-yellow-300 text-gray-900 hover:bg-yellow-400"
            : "bg-yellow-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    </form>
  );
};

export default TextArea;
