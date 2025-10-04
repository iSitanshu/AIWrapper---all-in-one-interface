import { Router, type Request, type Response } from "express";
import { CreateChatSchema, Role } from "../types";
import { createCompletion } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../middleware/auth_middleware";
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

router.get("/get/conversationId", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId || req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const conversationId = crypto.randomUUID();
  let data = req.query.data;
  let title = "Untitled Conversation";
  if (typeof data === "string") {
    title = data.substring(0, 20) + "...";
  } else if (Array.isArray(data) && typeof data[0] === "string") {
    title = data[0].substring(0, 20) + "...";
  }

  await prismaClient.conversation.create({
    data: {
      title,
      id: conversationId,
      userId,
    },
  });

  res.json({ conversationId });
});

router.get("/conversations", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const conversations = await prismaClient.conversation.findMany({
    where: { userId },
    orderBy: {
      updatedAt: "desc"
    }
  });

  res.json({ conversations });
});

router.get("/conversations/:conversationId", authMiddleware, async (req: AuthenticatedRequest, res) => {
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

  // Store messages in DB
  await prismaClient.message.createMany({
    data: [
      { conversationId, content: data.message, role: Role.User },
      { conversationId, content: response, role: Role.Agent },
    ],
  });
});

// router.post("/demo_chat", (req: Request, res: Response) => {
//   const { message, model, conversationId } = req.body;

//   // Simulate auth check
//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   // Simulated 100-word assistant response
//   const fakeResponse =
//     "This is a simulated assistant response meant to mimic how your actual fl;kgkdlgjdf This is a simulated assistant This is a simulated assistant response meant to mimic how response meant to mimic how your actual backend might stream your actual backend might stream data back to the frontend. data back to the frontend. It is broken into smaller It is broken into smaller chunks and sent gradually to chunks and sent gradually to simulate real-time typing behavior or simulate real-time typing behavior or streaming, which gives the user streaming, which gives the user the feel of a live the feel of a live assistant. Each of these sentences assistant. Each of these sentences adds to the illusion of adds to the illusion of a dynamic response generation process a dynamic response generation process happening in real time. happening in real time.  gdfo gdfoig lkdf f gijofd ijg foigj fdg fdg jofdig ofdi gofd gofidg ofdi gjodfig fd gfd goidfj goifd goifd g backend might stream data back to the frontend. It is broken into smaller chunks and sent gradually to simulate real-time typing behavior or streaming, which gives the user the feel of a live assistant. Each of these sentences adds to the illusion of a dynamic response generation process happening in real time.";

//   const words = fakeResponse.split(" ");
//   const chunkSize = 20;

//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   let index = 0;

//   const interval = setInterval(() => {
//     if (index >= words.length) {
//       clearInterval(interval);
//       res.end(); // End the stream
//       return;
//     }

//     const chunkWords = words.slice(index, index + chunkSize);
//     const chunk = chunkWords.join(" ") + " ";

//     res.write(chunk);
//     index += chunkSize;
//   }, 1000); // Send a chunk every second
// });

export default router;
