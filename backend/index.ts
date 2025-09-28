import express from "express";
import cors from "cors"
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import chatRouter from "./routes/chat.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth",authRouter)
app.use("/ai",aiRouter)
app.use("/chat/change", chatRouter);

app.listen(5000,() => console.log(`Server running on PORT: 5000`));