import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // Importing User Model

dotenv.config();

// Connect to Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch((err) => console.log(err));

const seedAdmin = async () => {
  try {
    // 1. Check if admin already exists
    const userExists = await User.findOne({ username: "admin" });
    if (userExists) {
      console.log("⚠️ Admin user already exists!");
      process.exit();
    }

    // 2. Hash the password "password123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 3. Create the Admin User
    const adminUser = new User({
      name: "Super Admin",
      username: "admin", // The username you asked for
      email: "admin@hotel.com", // Dummy email
      password: hashedPassword, // Encrypted password
      role: "admin", // Role is admin
    });

    await adminUser.save();
    console.log("🎉 Admin User Created Successfully!");
    console.log("👉 Username: admin");
    console.log("👉 Password: password123");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
