import { Router, type Request } from "express";
import { authMiddleware } from "../auth_middleware";
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

router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    console.log(id)
    const userId = req.userId || req.user?.id;
    console.log(userId);


    if (!userId) {
        return res.status(401).json({ message: "Login before deleting the conversation" });
    }

    try {
        const update_response = await prismaClient.conversation.findFirst({
            where: {id},
        },
        // data: {
        //     title: newTitle
        // }
    )
        // console.log(response);

        return res.status(200).json({ message: "Rename conversation Succcessfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to rename conversation" });
    }
})

export default router;  