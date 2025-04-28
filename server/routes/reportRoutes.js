import express from "express";
import { submitReport,updateReportStatus,getReportById,getReports,deleteReport,searchReports,assignReport,respondToReport,getResolvedReports} from "../controllers/reportController.js";
import { getUserReports } from "../controllers/reportController.js";
import { verifyToken,verifyPolice } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/submit", verifyToken,submitReport);
//router.put("/update-status", updateReportStatus);
//router.put("/assign", assignReport);
router.get("/get-report", verifyToken,getReports); 
router.get("/user-reports", verifyToken, getUserReports);
router.delete("/delete", deleteReport); 
router.get("/search", searchReports); 
router.post("/:reportId/respond",verifyToken,verifyPolice,respondToReport);
router.get("/case-history/:reportId", verifyToken,getResolvedReports);
// GET /api/reports/:id
router.get('/:id', verifyToken, getReportById);


export default router;