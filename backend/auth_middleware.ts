import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization?.split(" ")[1];

    if(!authToken){
        res.send({
            message: "Auth token is invalid",
            success: false
        })
        return;
    }
    try {
        const data = jwt.verify(authToken, process.env.JWT_SECRET!) as JwtPayload;
        // req.userId = (data as unknown as JwtPayload).userId as unknown as string;

        const extractedId = typeof data.userId === "object" ? data.userId.id : data.userId;

        (req as any).userId = extractedId;

        next();
    } catch (error) {
        res.send({
            message: "Auth token invalid",
            success: false
        })
    }
}