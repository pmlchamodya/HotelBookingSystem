import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
dotenv.config();

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Staff Seeding");

    // Check if staff already exists
    const existingStaff = await User.findOne({ username: "staff" });
    if (existingStaff) {
      console.log("⚠️ Staff user already exists!");
      process.exit();
    }

    // Create Staff User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const newStaff = new User({
      name: "Hotel Staff Member",
      username: "staff",
      email: "staff@hotel.com",
      password: hashedPassword,
      role: "staff",
    });

    await newStaff.save();
    console.log("🎉 Staff User Created Successfully!");
    console.log("👉 Username: staff");
    console.log("👉 Password: password123");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding staff:", error);
    process.exit(1);
  }
};

seedStaff();
