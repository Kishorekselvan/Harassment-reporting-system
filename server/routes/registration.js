import express from "express";
import { registerControl } from "../controllers/registerController.js";

const router = express.Router();


router.post("/register", registerControl);

export default router;
