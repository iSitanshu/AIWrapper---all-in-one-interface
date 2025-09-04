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
        const data = jwt.verify(authToken, process.env.JWT_SECRET!);
        req.userId = (data as unknown as JwtPayload).userId as unknown as string;
    
        next();
    } catch (error) {
        res.send({
            message: "Auth token invalid",
            success: false
        })
    }
}