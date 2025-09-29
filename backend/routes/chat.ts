import { Router, type Request } from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { PrismaClient } from "../generated/prisma";

const router = Router();

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

// Extend Express.Request safely
interface AuthenticatedRequest extends Request {
  user?: User;
  userId: string;
}

router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const userId = req.userId || req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Login before deleting the conversation" });
    }

    try {
        await prismaClient.message.deleteMany({
            where: { conversationId: id },
        });

        const deletedConversation = await prismaClient.conversation.delete({
            where: { id },
        });

        return res.status(200).json({ message: "Conversation and related messages deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete conversation" });
    }
});

router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { newTitle } = req.body;  // Get new title from request body
    const title = newTitle.substring(0, 20) + "...";
    const userId = req.userId || req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Login before renaming the conversation" });
    }

    try {
        await prismaClient.conversation.update({
            where: { id },
            data: {
                title,
            },
        });

        return res.status(200).json({
            message: "Conversation renamed successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to rename conversation" });
    }
})

export default router;  