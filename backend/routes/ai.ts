import { Router } from "express";
import { CreateChatSchema, Role } from "../types";
import { createCompletion } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../auth_middleware";

const router = Router();

router.post("/chat", authMiddleware, async (req, res) => {
  const userId = req.userId;
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

  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();let response = "";
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

export default router;