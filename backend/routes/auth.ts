import { Router } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn, Login } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator";
import base32, { encode } from "hi-base32";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";
import { withRateLimit } from "next-limitr";
import { NextResponse } from "next/server";
import { getOrSetCache } from "../utils/cache";

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

    const { otp, expires } = TOTP.generate(
      base32.encode(data.email + process.env.JWT_SECRET!)
    );

    // Hash a password
    const hashedPassword = await bcrypt.hash(data.password, costFactor);

    const generatedOTP = otp;
    if (process.env.NODE_ENV !== "development") {
      await sendEmail(
        data.email,
        "Login to aiWrapper",
        `Log into aiWrapper your otp is ${otp}`
      );
      console.log("Email edition Log into your aiWrapper using otp", otp);
    } else {
      console.log("Log into your aiWrapper", otp);
    }

    try {
      await prismaClient.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.log("User already exists");
    }

    res.json({
      message: "Check your email",
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error",
      success: false,
    });
  }
});

router.post("/signin", async (req, res) => {
  const { success, data } = SignIn.safeParse(req.body);

  if (!success) {
    res.status(411).send("Invalid OTP");
    return;
  }

  // Verify with some otp library
  const { otp } = TOTP.generate(
    base32.encode(data.email + process.env.JWT_SECRET!)
  );

  if (otp != data.otp) {
    res.json({
      message: "Invalid OTP after verify with some otp library",
      success: false,
    });
    return;
  }

  // const userId = process.env.JWT_SECRET;
  const user = await prismaClient.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    res.json({
      message: "User not found",
      success: false,
    });
    return;
  }

  const token = jwt.sign(
    {
      user,
    },
    process.env.JWT_SECRET!
  );

  res.json({
    token,
    success: true,
  });
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
