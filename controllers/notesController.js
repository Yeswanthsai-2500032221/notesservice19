import express from "express";
import * as notesService from "../services/notesService.js";

const router = express.Router();

// Helper to get token from headers
const getToken = (req) => {
  return req.headers["token"] || req.headers["Token"] || req.headers["authorization"];
};

router.post("/", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ code: 401, message: "Token is required in header" });
  }
  const result = await notesService.createNote(req.body, token);
  res.status(result.code === 200 ? 200 : result.code || 500).json(result);
});

router.get("/", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ code: 401, message: "Token is required in header" });
  }
  const result = await notesService.getAllNotes(token);
  res.status(result.code === 200 ? 200 : result.code || 500).json(result);
});

router.get("/:id", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ code: 401, message: "Token is required in header" });
  }
  const result = await notesService.getNoteById(req.params.id, token);
  res.status(result.code === 200 ? 200 : result.code || 500).json(result);
});

router.put("/:id", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ code: 401, message: "Token is required in header" });
  }
  const result = await notesService.updateNote(req.params.id, req.body, token);
  res.status(result.code === 200 ? 200 : result.code || 500).json(result);
});

router.delete("/:id", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ code: 401, message: "Token is required in header" });
  }
  const result = await notesService.deleteNote(req.params.id, token);
  res.status(result.code === 200 ? 200 : result.code || 500).json(result);
});

export default router;
