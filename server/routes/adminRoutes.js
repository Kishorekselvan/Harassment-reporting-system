import express from "express";
import {
  getAllReports,
  getPoliceByStation,
  addPoliceOfficer,
  deletePoliceOfficer,
  getReportById,
  getAllStations 
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/add-police", verifyToken, verifyAdmin, addPoliceOfficer);


router.get("/police", verifyToken, verifyAdmin, getPoliceByStation);


router.delete("/delete-police", verifyToken, verifyAdmin, deletePoliceOfficer);


router.get("/reports", verifyToken, verifyAdmin, getAllReports);


router.get("/admin/reports/:reportId", getReportById);


router.get("/stations", verifyToken, verifyAdmin, getAllStations);

export default router;
