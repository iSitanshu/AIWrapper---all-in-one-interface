import { type Request, type Response, type NextFunction } from "express";
import { redis } from "../utils/redisClient";

export function rateLimiter(limit: number, windowSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers["x-forwarded-for"] as string) ?? req.socket.remoteAddress ?? "127.0.0.1";
    const key = `rate_limit:${req.path}:${ip}`;

    const pipeline = redis.multi();
    pipeline.incr(key);
    pipeline.expire(key, windowSeconds);
    const [count] = (await pipeline.exec()) as number[];

    if (typeof count === "undefined") {
    return res.status(500).send("Rate limiter error");
  }
    if (count > limit) {
      return res.status(429).send("Too Many Requests");
    }

    next();
  };
}
