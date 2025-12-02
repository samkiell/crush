import express from "express";
import CbtSession from "../models/CbtSession.js";

const router = express.Router();

// Kill Session
router.post("/sessions/kill", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await CbtSession.findByIdAndUpdate(
      sessionId,
      { status: "invalidated" },
      { new: true }
    );

    if (req.io) {
      req.io.to(sessionId).emit("sessionKilled", { reason: "Admin action" });
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
