import { Router } from "express";
import { CreateUser, SignIn, Login } from "../types";
import jwt from "jsonwebtoken";
// import { PrismaClient } from "../generated/prisma";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { withRateLimit } from "next-limitr";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

const router = Router();
const passwordToHash = process.env.ENCRYPT_PASSWORD_WORD || "random_word";
const costFactor = process.env.ENCRYPT_CODE
  ? Number(process.env.ENCRYPT_CODE)
  : 10;

export const GET = withRateLimit({
  limit: 2,
  windowMs: 60000, // 1 minute
})((req) => {
  return NextResponse.json({ message: "Hello world!" });
});


// TODO: RATE LIMIT this
router.post("/initiate_signup", async (req, res) => {
  try {
    const { success, data } = CreateUser.safeParse(req.body);

    if (!success) {
      res.status(411).send("Invalid Input");
      return;
    }

     // ✅ Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(202).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, costFactor);

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    
  const token = jwt.sign(
    {
      user,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    success: true,
  });
  } catch (error) {
    res.json({
      message: "Internal Server error",
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  const { success, data } = Login.safeParse(req.body);

  if (!success) {
    res.status(411).send("Invalid Input");
    return;
  }
  
  const user = await prismaClient.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
  return res.status(404).json({ message: "User not found", success: false });
}

  
  const isMatch = await bcrypt.compare(data.password,user.password);
  if (!isMatch) {
    res.status(411).send("Incorrect Password");
    return;
  }

  const token = jwt.sign(
    {
      user
    },
    process.env.JWT_SECRET!,
    {expiresIn: "7d"}
  );

  res.json({
    token,
    success: true,
  });
});

export default router;
