import { redis } from "./redisClient";

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300 // 5 minutes default
): Promise<T> {
  // 1. Try Redis cache
  const cached = await redis.get(key);
  if (cached) {
    console.log("Cache hit:", key);
    if (typeof cached === "string") return JSON.parse(cached) as T;
  }

  // 2. Fetch from DB (or another source)
  const data = await fetcher();

  // 3. Save in cache
  await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  console.log("Cache miss → data stored:", key);

  return data;
}
