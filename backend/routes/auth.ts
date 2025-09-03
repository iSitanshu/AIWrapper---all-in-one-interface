import { Router } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator";
import base32, { encode } from "hi-base32";

const router = Router();

// TODO: RATE LIMIT this
router.post("/initiate_signin", async (req, res) => {
  try {
    const { success, data } = CreateUser.safeParse(req.body);

    if (!success) {
      res.status(411).send("Invalid Input");
      return;
    }

    const { otp, expires } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!));

    const generatedOTP = otp;
    if (process.env.NODE_ENV !== "development") {
      await sendEmail(
        data.email,
        "Login to aiWrapper",
        `Log into aiWrapper your otp is ${otp}`
      );
    } else {
      console.log("Log into your aiWrapper", otp);
    }
    res.json({
      message: "Check your email",
      success: true,
    });
  } catch (error) {
    console.log("Error in the post initial_signup route", error);
    res.json({
      message: "Internal Server error",
      success: false,
    });
  }
});

router.post("/signin", (req, res) => {
  const { success, data } = SignIn.safeParse(req.body);

  if (!success) {
    res.status(411).send("Invalid OTP");
    return;
  }

  // Verify with some otp library
  const { otp } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!));
  if (otp != data.otp) {
    res.json({
      message: "Invalid OTP after verify with some otp library",
      success: false,
    });
    return;
  }

  // const userId = process.env.JWT_SECRET;
  const userId = "Sitanshu";

  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET!
  );

  res.json({
    token,
    success: true,
  });
});

export default router;
