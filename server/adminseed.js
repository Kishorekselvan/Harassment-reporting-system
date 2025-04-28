import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminData = [
      { email: "admin1@example.com", password: hashedPassword },
      { email: "admin2@example.com", password: hashedPassword }
    ];

    await Admin.insertMany(adminData);
    console.log("Admins seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Error seeding admins:", err);
    process.exit(1);
  }
};

seedAdmins();

