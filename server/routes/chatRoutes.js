import express from "express";
import {
  createChat,
  sendMessage,
  getChatByReport,
  getMessages,
  markSeen
} from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create/:reportId", verifyToken, createChat);
router.post("/send", verifyToken, sendMessage);
router.get("/messages/:chatRoomId", verifyToken, getMessages);
router.put("/seen/:chatRoomId", verifyToken, markSeen);
router.get("/by-report/:reportId", verifyToken, getChatByReport);

export default router;
