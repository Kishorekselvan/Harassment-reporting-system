import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import reportRoutes from "./routes/reportRoutes.js";
import registration from "./routes/registration.js";
import login from "./routes/login.js";
import policeRoutes from "./routes/policeRoutes.js";
import adminRoutes from"./routes/adminRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reports', reportRoutes);
app.use("/api/auth",registration);
app.use("/api/auth",login);
app.use("/api/police",policeRoutes);
app.use("/api/admin",adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
