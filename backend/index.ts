import express from "express";
import { CreateChatSchema, Role } from "./types";
import { createCompletion } from "./openrouter";
import { InMemoryStore } from "./InMemoryStore";

const app = express();

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { success, data } = CreateChatSchema.safeParse(req.body);

  const conversationId = data?.conversationId ?? Bun.randomUUIDv7();
  // data.conversationId hai too purani chat track kar sakte hain varna naya create

  if (!success) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
    return;
  }

  // to give the context to the model about the previous chat conversation
  let existingMessages = InMemoryStore.getInstance().get(conversationId)

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8"); // no json no web page but a SSE
  res.setHeader("Connection", "keep-alive"); // keep the connection open and alive to keep sending chunks of data
  let response = "";
  // Event Emitters
  await createCompletion([...existingMessages, {
    role: Role.User,
    content: data.message
  }] ,data.model, (chunk: string) => {
    response +=chunk;
    res.write(chunk);
  });
  res.end();

  InMemoryStore.getInstance().add(conversationId, {
    role: Role.Agent,
    content: data.message
  })

  // store in the DB
  // ai sdk, openrouter
});

app.listen(3000);
