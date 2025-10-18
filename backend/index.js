// ====== Task Management API (Simplified + Joi Validation) ======
// Run: npm install express cors mongodb joi
// Then: node server.js

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// --- Config ---
const app = express();
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI || "";
const DB_NAME = process.env.MONGO_DB || "default";

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
const client = new MongoClient(MONGO_URI);
async function connectToDB() {
  await client.connect();
  console.log("✅ Connected to MongoDB");
}

// --- ROUTES ---

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

import useTaskRoute from "./routes/task.route.js";
import useStudentRoute from "./routes/student.route.js";

export let db;

import setup from "./setup.js";

// --- Start Server ---
connectToDB().then(async () => {
  db = client.db(DB_NAME);
  app.use("/api/tasks", useTaskRoute());
  app.use("/api/students", useStudentRoute());

  try {
    await setup();
    console.log("Successfully ran setup script");
  } catch (error) {
    console.error("Failed to run setup script:", error.message);
  }

  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
