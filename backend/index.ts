import express from "express";
import cors from "cors"
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import chatRouter from "./routes/chat.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", rateLimiter(5, 60), authRouter)
app.use("/ai", rateLimiter(10, 60), aiRouter)
app.use("/chat/change" ,rateLimiter(5, 60), chatRouter);

app.listen(5000,() => console.log(`Server running on PORT: 5000`));