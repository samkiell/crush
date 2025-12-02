import express from "express";
import CbtSession from "../models/CbtSession.js";
import IntegrityLog from "../models/IntegrityLog.js";
import { processAnswers, calculateScore } from "../services/syncService.js";

const router = express.Router();

// Start Session
router.post("/start", async (req, res) => {
  try {
    const { userId, subject, year, mode, totalQuestions } = req.body;
    // Calculate endTime based on mode/subject (e.g., 2 hours for CBT)
    // For now, default to 2 hours
    const durationMs = 2 * 60 * 60 * 1000;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMs);

    const session = await CbtSession.create({
      userId, // Ensure this is a valid ObjectId or handle accordingly
      subject,
      year,
      mode,
      totalQuestions,
      startTime,
      endTime,
      status: "active",
    });

    res.json({ sessionId: session._id, startTime, endTime });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Answers (Sync)
router.post("/:sessionId/answer", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body; // Array of answers
    const results = await processAnswers(sessionId, answers);
    res.json({ success: true, synced: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Integrity Log
router.post("/:sessionId/integrity", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { eventType, details, severity } = req.body;

    await IntegrityLog.create({
      sessionId,
      eventType,
      details,
      severity,
    });

    // Optional: Check threshold and lock session
    // const logs = await IntegrityLog.countDocuments({ sessionId });
    // if (logs > 10) ...

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Session
router.post("/:sessionId/submit", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await calculateScore(sessionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Status
router.get("/:sessionId/status", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await CbtSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json({ status: session.status, endTime: session.endTime });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
