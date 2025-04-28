
import bcrypt from "bcryptjs";
import User from "../models/User.js";
export const registerControl=async (req, res) => {
  const { email, password} = req.body;

  try {
    const existingUser = await User.findOne({ email })
       

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if(email && password)
    {
      const newUser = new User({ email, password: hashedPassword });
      console.log(newUser);
      await newUser.save();
    } 
    else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};
