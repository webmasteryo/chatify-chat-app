import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.port || 3000;

app.use(express.json({ limit: "10mb" })); // req.body
app.use(
  cors({ origin: ENV.CLIENT_URL || "http://localhost:5173", credentials: true })
);
app.use(cookieParser()); // using cookieParser

app.use("/api/auth/", authRoutes);
app.use("/api/message/", messageRoutes);
server.listen(PORT, () => {
  console.log("app is listening on port" + PORT);
  connectDB();
});
