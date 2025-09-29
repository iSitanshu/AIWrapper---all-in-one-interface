import express from "express";
import { getOrSetCache } from "../utils/cache";
import { redis } from "../utils/redisClient";

const router = express.Router();

// Pretend this is your DB call
async function fetchConversationsFromDB(userId: string) {
  console.log("Fetching from DB...");
  return [
    { id: "1", message: "Hello", createdAt: new Date() },
    { id: "2", message: "How are you?", createdAt: new Date() },
  ];
}

// GET previous conversations
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  const cacheKey = `conversations:${userId}`;

  try {
    const conversations = await getOrSetCache(
      cacheKey,
      () => fetchConversationsFromDB(userId), // fallback fetch
      300 // cache for 5 minutes
    );

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST new conversation (and update cache)
router.post("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  const newMessage = req.body; // {id, message, createdAt...}

  try {
    // 1. Save to DB (replace this with actual DB logic)
    console.log("Saving to DB...", newMessage);

    // 2. Update Redis cache
    const cacheKey = `conversations:${userId}`;
    const cached = await redis.get(cacheKey);

    let updatedConversations = [];
    if (typeof cached === "string") {
      updatedConversations = JSON.parse(cached);
    } else {
      updatedConversations = await fetchConversationsFromDB(userId);
    }

    updatedConversations.push(newMessage);

    await redis.set(cacheKey, JSON.stringify(updatedConversations), { ex: 300 });

    res.json({ success: true, conversations: updatedConversations });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
