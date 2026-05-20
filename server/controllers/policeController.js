import Report from "../models/Report.js";
import Police from "../models/Police.js";
import multer from "multer";
import ResolvedReport from "../models/ResolvedReport.js";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

export const resolveReport = async (req, res) => {
  const { reportId } = req.body;

  try {
    const report = await Report.findById(reportId);
    
    
    
    if (!report) return res.status(404).json({ message: "Report not found" });
    console.log(report);
    report.status = "Resolved";
    report.response="The case is completed";
    await report.save();
    console.log(report);

    const newResolvedReport = new ResolvedReport({
      reportId,
      fileUrl: req.file.path,
    });
    await newResolvedReport.save();

    res.status(200).json({ message: "Report resolved with case history attached" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resolving report " });
  }
};


export const getPoliceDashboardReports = async (req, res) => {
  try {
    const policeId = req.user.id; // From JWT middleware
    console.log(policeId);

    const officer = await Police.findById(policeId);
   

    if (!officer || !officer.stationId) {
      return res.status(404).json({ message: "Station not found for police" });
    }

    const reports = await Report.find({ stationId: officer.stationId }).sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err){
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updatePolicePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const officerId = req.user.id;

  try {
    const officer = await Police.findById(officerId);
    if (!officer) return res.status(404).json({ message: "Officer not found" });

    const isMatch = await bcrypt.compare(currentPassword, officer.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    officer.password = hashedNew;
    await officer.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get police profile
export const getProfile = async (req, res) => {
  try {
    const police = await Police.findById(req.user.id).select('-password');
    if (!police) {
      return res.status(404).json({ message: 'Police officer not found' });
    }
    res.json(police);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update police profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, stationName, rank } = req.body;

    // Build police object
    const policeFields = {};
    if (name) policeFields.name = name;
    if (email) policeFields.email = email;
    
    if (stationName) policeFields.station = stationName;
    if (rank) policeFields.rank = rank;

    let police = await Police.findById(req.user.id);
    if (!police) {
      return res.status(404).json({ message: 'Police officer not found' });
    }

    // Update police profile
    police = await Police.findByIdAndUpdate(
      req.user.id,
      { $set: policeFields },
      { new: true }
    ).select('-password');

    res.json(police);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update police password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const police = await Police.findById(req.user.id);
    if (!police) {
      return res.status(404).json({ message: 'Police officer not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, police.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    police.password = await bcrypt.hash(newPassword, salt);
    await police.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assigned reports

export const getAssignedReports = async (req, res) => {
  try {
    const userId = new  mongoose.Types.ObjectId(req.user.id); // Convert string to ObjectId
    const reports = await Report.find({ assignedOfficers: userId })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};