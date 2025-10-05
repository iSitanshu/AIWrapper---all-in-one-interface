// import express from "express";
// import cors from "cors"
// import authRouter from "./routes/auth"
// import aiRouter from "./routes/ai"
// import chatRouter from "./routes/chat.js";
// import { rateLimiter } from "./middleware/rateLimiter.js";

// const app = express();

// app.use(cors({ origin: process.env.CORS_ORIGIN }));
// app.use(express.json());
// app.use("/auth", rateLimiter(5, 60), authRouter)
// app.use("/ai", rateLimiter(20, 60), aiRouter)
// app.use("/chat/change" ,rateLimiter(20, 60), chatRouter);

// app.listen(process.env.PORT || 3000,() => console.log(`Server running on PORT: 5000`));


import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import aiRouter from "./routes/ai";
import chatRouter from "./routes/chat.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

try {
  console.log(">>> Starting application...");

  // STEP 1: Check for all required environment variables
  // IMPORTANT: Make sure this list is complete!
  const requiredEnv = [
    'DATABASE_URL',
    'JWT_SECRET',
    'CORS_ORIGIN',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN'
  ];

  for (const v of requiredEnv) {
    if (!process.env[v]) {
      throw new Error(`FATAL ERROR: Missing required environment variable: ${v}`);
    }
  }
  console.log(">>> All required environment variables found.");

  // STEP 2: Your Express application setup
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors({ origin: process.env.CORS_ORIGIN }));
  app.use(express.json());
  app.use("/auth", rateLimiter(5, 60), authRouter);
  app.use("/ai", rateLimiter(20, 60), aiRouter);
  app.use("/chat/change", rateLimiter(20, 60), chatRouter);

  // STEP 3: Start the server
  app.listen(PORT, () => console.log(`>>> Server started successfully on PORT: ${PORT}`));

} catch (e) {
  // If any error happens during startup, it will be caught here
  console.error("!!!!!! APPLICATION FAILED TO START !!!!!");
  console.error(e);
  process.exit(1); // Exit with a failure code
}