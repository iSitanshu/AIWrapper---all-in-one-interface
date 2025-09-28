import { redis } from "./redisClient";

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  const cached = await redis.get(key);
  if (typeof cached === "string") return JSON.parse(cached) as T;

  const data = await fetcher();
  await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  return data;
}
