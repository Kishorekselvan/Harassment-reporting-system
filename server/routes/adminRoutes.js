import express from "express";
import {
  getAllReports,
  getPoliceByStation,
  addPoliceOfficer,
  deletePoliceOfficer,
  getReportById,
  getAllStations // Import the new controller function
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to add a police officer
router.post("/add-police", verifyToken, verifyAdmin, addPoliceOfficer);

// Route to get police officers by station
router.get("/police", verifyToken, verifyAdmin, getPoliceByStation);

// Route to delete a police officer
router.delete("/delete-police", verifyToken, verifyAdmin, deletePoliceOfficer);

// Route to get all reports
router.get("/reports", verifyToken, verifyAdmin, getAllReports);

// Route to get a report by ID
router.get("/admin/reports/:reportId", getReportById);

// New route to get all stations
router.get("/stations", verifyToken, verifyAdmin, getAllStations);

export default router;
