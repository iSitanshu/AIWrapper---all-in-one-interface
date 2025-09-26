import { Router, type Request } from "express";
import { CreateChatSchema, Role } from "../types";
import { createCompletion } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../auth_middleware";
import { PrismaClient } from "../generated/prisma";
import crypto from "crypto";

const prismaClient = new PrismaClient();

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  credits: number;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Body {
  message: string;
  model: string;
  conversationId?: string;
}

// Extend Express.Request safely
interface AuthenticatedRequest extends Request {
  user?: User;
  userId: string;
  body: Body;
}

const router = Router();

router.get("/conversations", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const conversations = await prismaClient.conversation.findMany({
    where: { userId },
  });

  res.json({ conversations });
});

router.get(
  "/conversations/:conversationId",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const userId = req.userId || req.user?.id;
    const conversationId = req.params.conversationId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversation = await prismaClient.conversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    res.json({ conversation });
  }
);

router.post("/chat", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { success, data } = CreateChatSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }

  const conversationId = data.conversationId ?? crypto.randomUUID();
  // Send conversation metadata first
  // res.write(`data: ${JSON.stringify({ conversationId })}\n\n`);

  // Get previous messages from memory
  let existingMessages = InMemoryStore.getInstance().get(conversationId);

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let response = "";

  // Stream model response
  await createCompletion(
    [...existingMessages, { role: Role.User, content: data.message }],
    data.model,
    (chunk: string) => {
      response += chunk;
      res.write(chunk);
    }
  );
  res.end();

  // Save to in-memory store
  InMemoryStore.getInstance().add(conversationId, {
    role: Role.Agent,
    content: response,
  });

  // Create conversation if new
  if (!data.conversationId) {
    await prismaClient.conversation.create({
      data: {
        title: data.message.substring(0, 20) + "...",
        id: conversationId,
        userId,
      },
    });
  }

  // Store messages in DB
  await prismaClient.message.createMany({
    data: [
      { conversationId, content: data.message, role: Role.User },
      { conversationId, content: response, role: Role.Agent },
    ],
  });

  
});

export default router;
