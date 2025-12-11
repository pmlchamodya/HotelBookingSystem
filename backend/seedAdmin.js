import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

// Connect to Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch((err) => console.log(err));

const seedAdmin = async () => {
  try {
    //  Check if admin already exists
    const userExists = await User.findOne({ username: "admin" });
    if (userExists) {
      console.log("⚠️ Admin user already exists!");
      process.exit();
    }

    //  Hash the password "password123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    //  Create the Admin User
    const adminUser = new User({
      name: "Super Admin",
      username: "admin",
      email: "admin@hotel.com",
      password: hashedPassword,
      role: "admin",
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
