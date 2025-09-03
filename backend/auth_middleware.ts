import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization?.split(" ")[1];

    if(!authToken){
        res.send({
            message: "Auth token is invalid",
            success: false
        })
        return;
    }
    const data = jwt.verify(authToken, process.env.JWT_SECRET!);
    console.log(data);

    next();
}