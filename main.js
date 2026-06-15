import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./controllers/notesController.js";
import auditRouter from "./controllers/auditController.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Register routers
app.use("/notes", notesRouter);
app.use("/audit", auditRouter);

// Default endpoint
app.get("/", (req, res) => {
  res.json({ code: 200, message: "Notes Service Running..." });
});

// Listener
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
