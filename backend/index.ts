import express from "express";
import cors from "cors"
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import chatRouter from "./routes/chat.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use("/auth", rateLimiter(5, 60), authRouter)
app.use("/ai", rateLimiter(20, 60), aiRouter)
app.use("/chat/change" ,rateLimiter(20, 60), chatRouter);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(process.env.PORT || 3000,() => console.log(`Server running on PORT: 5000`));