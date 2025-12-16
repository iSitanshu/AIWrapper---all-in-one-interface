import express from "express";
import cors from "cors"
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import chatRouter from "./routes/chat.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();

const PORT = process.env.PORT || 3000;

// app.use(cors({
//   origin: true,
//   credentials: true
// }));
app.use(cors({
  origin: `${process.env.CORS_ORIGIN}`,
  credentials: true
}));
app.use(express.json());
app.use("/auth", authRouter)
app.use("/ai", aiRouter)
app.use("/chat/change" , chatRouter);
// app.use("/auth", rateLimiter(5, 60), authRouter)
// app.use("/ai", rateLimiter(20, 60), aiRouter)
// app.use("/chat/change" ,rateLimiter(20, 60), chatRouter);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));


