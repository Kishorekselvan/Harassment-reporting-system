import express from "express";
import { loginControl } from "../controllers/loginController.js";

const router = express.Router();


router.post("/login", loginControl);

export default router;
