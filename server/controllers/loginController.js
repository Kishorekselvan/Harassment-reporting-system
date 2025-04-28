import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Police from "../models/Police.js";
import Admin from "../models/Admin.js";
const secret = process.env.JWT_SECRET||"kalpana75";

export const loginControl= async (req, res) =>
 {
    const { email, password, role } = req.body;
  
    try {
      let foundUser;
  
      if (role === "User") {
        foundUser = await User.findOne({ email });
      } else if (role === "Police") {
        foundUser = await Police.findOne({ email });
      }
      else if(role==="Admin")
        {
          foundUser=await Admin.findOne({email});
        } 
      else {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      if (!foundUser) {
        return res.status(401).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, foundUser.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      
      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        role: role
      };
  
      console.log(" login secret", secret)
      
      const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: { email: foundUser.email, role: role }
      });
  
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }