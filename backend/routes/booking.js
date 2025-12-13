import express from "express";
import Booking from "../models/Booking.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

//   POST /api/bookings
router.post("/", authenticateToken, async (req, res) => {
  const { roomId, checkInDate, checkOutDate, totalPrice } = req.body;

  try {
    const newBooking = new Booking({
      user: req.user.id,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending",
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Booking failed" });
  }
});

//  GET /api/bookings/my-bookings
router.get("/my-bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("room", "name type price image")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//  GET /api/bookings/all
router.get(
  "/all",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "name email")
        .populate("room", "name")
        .sort({ createdAt: -1 });
      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// PUT /api/bookings/:id
router.put("/:id", authenticateToken, async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check permissions (Only Admin/Staff or the owner can update)
    if (
      req.user.role !== "admin" &&
      req.user.role !== "staff" &&
      booking.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();
    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
