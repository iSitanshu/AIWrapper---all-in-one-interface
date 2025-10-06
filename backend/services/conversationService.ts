// import { PrismaClient } from "../generated/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function fetchConversationsFromDB(userId: string) {
  const conversations = prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return conversations;
}
