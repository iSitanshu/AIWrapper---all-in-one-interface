import { SUPPORTER_MODELS, type Message, type MODEL } from "./types";

const OPENROUTER_KEY = process.env.OPENROUTER_KEY!; //API key from OpenRouter
const MAX_TOKEN_ITERATIONS = 1000;

export const createCompletion = async (
  messages: Message[],
  model: MODEL,
  cb: (chunk: string) => void
) => {
  // here we are making api call to openrouter using fetch which helps in
  // handling streamline response such that the openai repsonse in small
  // chunks rather send the data in bunk

  return new Promise<void>(async (resolve, reject) => {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`, // for verification
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model, // Use the dynamic model parameter
          messages: messages, // Correct variable name
          stream: true, // help in sending the response in chunks
          max_tokens: 1000 // ✅ add this to stay within your credit/token limit
        }),
      }
    );
    
    // Check for non-streaming errors from the API
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorBody)}`);
    }

    // reader created to read incoming data from the response body chunk by chunk
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder(); // raw data chunks to readable text
    let buffer = "";
    try {
      let tokenIteration = 0;
      while (true) {
        tokenIteration++;
        if(tokenIteration > MAX_TOKEN_ITERATIONS) {
          resolve();
          return;
        }
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); // Process complete lines from buffer
        buffer = lines.pop() || ""; // The last line might be incomplete
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6);
            if (data === "[DONE]") {
              resolve();
              return; // Exit function on completion
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                // Yield or return the content chunk
                cb(content); // this is the chunk response
                // here we try to display the chunks as arrived from the openrouter
              }
            } catch (e) {
              // Ignore invalid JSON chunks, they will be handled once complete
            }
          }
        }
      }
      if (buffer.startsWith("data: ") && buffer !== "data: [DONE]") {
        // Process any remaining buffer content
        try {
          const parsed = JSON.parse(buffer.slice(6));
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            console.log(content); // this is the final response
          }
        } catch (e) {
          console.error("Failed to parse final JSON chunk:", e);
        }
      }
    } catch (e) {
      console.error("Streaming error:", e);
    } finally {
      reader.cancel();
    }
  });
};
