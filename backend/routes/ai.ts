import { Router } from "express";
import { CreateChatSchema, Role } from "../types";
import { createCompletion } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../auth_middleware";
import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient();

const router = Router();

router.post("/chat", async (req, res) => {
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
  console.log("This is the existing Messages - ",existingMessages);

  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();let response = "";
  // Event Emitters
  console.log("before openai")
  await createCompletion([...existingMessages, {
    role: Role.User,
    content: data.message
  }] ,data.model, (chunk: string) => {
    response +=chunk;
    res.write(chunk);
  });
  res.end();
  console.log("after openai")

  // message = {} 
  InMemoryStore.getInstance().add(conversationId, {
    role: Role.Agent,
    content: message
  })

  if(!data.conversationId) {
    await prismaClient.conversation.create({
      data: {
        title: message.substring(0,20) + "...",
        id: conversationId,
        userId,
      }
    })
  }

  await prismaClient.message.createMany({
    data: [
      {
        conversationId,
        content: data.message,
        role: Role.User
      },
      {
        conversationId,
        content: message,
        role: Role.Agent
      }
    ]
  })
  // store in the DB
});

export default router;