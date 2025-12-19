import express from "express";
import Room from "../models/Rooms.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// GET /api/rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// GET /api/rooms/:id
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// POST /api/rooms
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    try {
      const newRoom = new Room(req.body);
      await newRoom.save();
      res
        .status(201)
        .json({ message: "Room added successfully!", room: newRoom });
    } catch (error) {
      console.error("Error adding room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  }
);

// PUT /api/rooms/:id
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!updatedRoom) {
        return res.status(404).json({ error: "Room not found" });
      }

      res.json({ message: "Room updated successfully!", room: updatedRoom });
    } catch (error) {
      console.error("Error updating room:", error);
      res.status(500).json({ error: "Failed to update room" });
    }
  }
);

// DELETE /api/rooms/:id
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deletedRoom = await Room.findByIdAndDelete(req.params.id);

      if (!deletedRoom) {
        return res.status(404).json({ error: "Room not found" });
      }

      res.json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ error: "Failed to delete room" });
    }
  }
);

export default router;
