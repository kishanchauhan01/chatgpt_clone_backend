import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from root");
});

import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

export { app };
