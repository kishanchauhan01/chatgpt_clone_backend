import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";

const app = express();
const httpServer = createServer(app);
initSocket(httpServer)

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from root");
});

import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import chatRouter from "./routes/chat.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chats", chatRouter);

app.use(errorHandler);

export { httpServer };
