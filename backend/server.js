import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Routes Imports
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import bookingRoutes from "./routes/booking.js";
import inquiryRoutes from "./routes/inquiry.js";
import roomRoutes from "./routes/rooms.js";
import facilityRoutes from "./routes/facilities.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- SOCKET.IO
// Create a standard HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Run when a client connects
io.on("connection", (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Middleware to Attach 'io' to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/facilities", facilityRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// IMPORTANT: Use server.listen instead of app.listen
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
