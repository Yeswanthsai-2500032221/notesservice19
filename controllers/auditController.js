import express from "express";
import AuditLog from "../models/auditLog.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SECRETE_KEY = process.env.SECRETE_KEY;

// Middleware to verify token for Audit Logs (Only Admin can view logs, but any authenticated user can create a log)
const verifyToken = (req, res, next) => {
  const token = req.headers["token"] || req.headers["Token"] || req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ code: 401, message: "Token is required in header" });
  }
  try {
    const payload = jwt.verify(token, SECRETE_KEY);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ code: 401, message: "Invalid or expired token" });
  }
};

router.post("/", verifyToken, async (req, res) => {
  try {
    const { action, details } = req.body;
    if (!action || !details) {
      return res.status(400).json({ code: 400, message: "action and details are required" });
    }
    const log = await AuditLog.create({ action, details });
    res.status(200).json({ code: 200, message: "Audit log created successfully", log });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    // Only Admin can view audit logs
    if (req.user.role !== 3) {
      return res.status(403).json({ code: 403, message: "Access Denied: Admins only" });
    }
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.status(200).json({ code: 200, logs });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

export default router;
