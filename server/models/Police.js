import mongoose from "mongoose";

const policeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station" },
  stationName: { type: String, required: true },
  rank: { type: String, required: true },
  badgeNumber: { type: String, required: true },
  department: { type: String, required: true },
});

const Police = mongoose.model("Police", policeSchema);

export default Police;  // Default export
