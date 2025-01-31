import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";
import { app,server } from "./lib/socket.js";



dotenv.config();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON request bodies


app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB(); // Connect to the database
  console.log(`Server is running on port ${PORT}`);
});