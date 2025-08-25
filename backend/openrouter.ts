type Model = "openai/gpt-4o" | "openai/gpt-5"; // give all the models
const OPENROUTER_KEY = process.env.OPENROUTER_KEY!; //API key from OpenRouter

type Role = "agent" | "user";
type Message = {
    content: string,
    role: Role
}[]

export const createCompletion = async (messages: Message[], model: Model) => {
  // here we are making api call to openrouter using fetch which helps in
  // handling streamline response such that the openai repsonse in small
  // chunks rather send the data in bunk
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
    while (true) {
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
            return; // Exit function on completion
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {// Yield or return the content chunk
              console.log(content); // this is the chunk response 
              // here we try to display the chunks as arrived from the openrouter 
            }
          } catch (e) {
            // Ignore invalid JSON chunks, they will be handled once complete
          }}}
    }
    if (buffer.startsWith("data: ") && buffer !== "data: [DONE]") { // Process any remaining buffer content
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
};
