import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import bookingRoutes from "./routes/booking.js";
import inquiryRoutes from "./routes/inquiry.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inquiries", inquiryRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
