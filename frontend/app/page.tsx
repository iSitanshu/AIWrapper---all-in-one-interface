"use client";
import { useEffect } from "react";
const BACKEND_URL = "http://localhost:5000";

export default function Home() {
  useEffect(() => {
    const fetchStream = async () => {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "What is 2+2 ?",
          model: "openai/gpt-4o",
        }),
      });

      if (!response.body){
        console.log("No response body");
        return;
      }

      // reader created to read incoming data from the response body chunk by chunk
      const reader = response.body.getReader();
      const decoder = new TextDecoder(); // raw data chunks to readable text 
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (value) {
          const chunk = decoder.decode(value);
          // Handle each chunk here (e.g., update state)
          console.log("Received Chunks - ",chunk);
        }
        done = streamDone;
      }
    };

    fetchStream();
  }, []);
  return <div>Hi there, this is sitanshu</div>;
}
