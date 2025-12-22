import express from "express";
import Facility from "../models/Facility.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

//  GET
router.get("/", async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

//   POST
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    try {
      const newFacility = new Facility(req.body);
      const savedFacility = await newFacility.save();
      res
        .status(201)
        .json({ message: "Facility added!", facility: savedFacility });
    } catch (err) {
      res.status(500).json({ error: "Failed to add facility." });
    }
  }
);

//   PUT
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    try {
      const updatedFacility = await Facility.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json({ message: "Updated successfully!", facility: updatedFacility });
    } catch (err) {
      res.status(500).json({ error: "Failed to update." });
    }
  }
);

//  DELETE
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "staff"),
  async (req, res) => {
    try {
      await Facility.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete." });
    }
  }
);

export default router;
