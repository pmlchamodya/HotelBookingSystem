import express from "express";
import Review from "../models/Review.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// 1. CREATE REVIEW
router.post("/", authenticateToken, async (req, res) => {
  const newReview = new Review(req.body);
  try {
    const savedReview = await newReview.save();

        res.status(200).json(savedReview);
  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json(err);
  }
});

// 2. GET ALL REVIEWS
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET REVIEWS BY ROOM ID
router.get("/:roomId", async (req, res) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. DELETE REVIEW
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json("Review not found");
    if (
      review.user.toString() === req.user.id ||
      req.user.role === "admin" ||
      req.user.role === "staff"
    ) {
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json("Review has been deleted.");
    } else {
      res.status(403).json("You can only delete your own reviews!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. UPDATE REVIEW
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json("Review not found");

    // Check if the current user is the owner
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json("You can only edit your own reviews!");
    }

    // Update fields
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          rating: req.body.rating,
          comment: req.body.comment,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
