import express from "express";
import { getPoliceDashboardReports,upload,resolveReport,updatePolicePassword, getProfile, updateProfile, updatePassword, getAssignedReports } from "../controllers/policeController.js";
import { verifyToken,verifyPolice } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/resolve-report", verifyToken, verifyPolice, upload.single("caseHistory"), resolveReport);
router.get("/dashboard", verifyToken,verifyPolice, getPoliceDashboardReports);
router.put("/update-password",verifyToken,verifyPolice,updatePolicePassword);
router.get('/profile', verifyToken, verifyPolice, getProfile);
router.put('/profile/update', verifyToken, verifyPolice, updateProfile);
router.put('/password', verifyToken, verifyPolice, updatePassword);
router.get('/reports', verifyToken, verifyPolice, getAssignedReports);

export default router;