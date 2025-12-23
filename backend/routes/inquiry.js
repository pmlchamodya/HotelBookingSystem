import express from "express";
import Inquiry from "../models/Inquiry.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// POST /api/inquiries
router.post("/", async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();

    req.io.emit("new_notification", {
      message: `📩 New Inquiry from ${req.body.name}: "${req.body.subject}"`,
      type: "inquiry",
    });

    res.status(201).json({ message: "Inquiry sent successfully!" });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET /api/inquiries
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    try {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  }
);

// PUT /api/inquiries/:id/status
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    const { status } = req.body;
    try {
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }

      inquiry.status = status;
      await inquiry.save();
      res.json({ message: "Status updated successfully", inquiry });
    } catch (error) {
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);

// DELETE /api/inquiries/:id
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      await Inquiry.findByIdAndDelete(req.params.id);
      res.json({ message: "Inquiry deleted successfully" });
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  }
);

export default router;
