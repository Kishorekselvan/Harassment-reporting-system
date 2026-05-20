import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }]  // 👈 add this
});

export default mongoose.model("User", userSchema);