import { Check, Clipboard } from "lucide-react";
import React, { useState } from "react";

interface Message {
  id: string;
  content: string;
  isStreaming: boolean;
}

const Copy = ({ message }: { message: Message }) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div className="flex-shrink-0">
      <button
        onClick={() => handleCopy(message.content, message.id)}
        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        title="Copy message"
        disabled={message.isStreaming}
      >
        {copiedMessageId === message.id ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Clipboard className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default Copy;
