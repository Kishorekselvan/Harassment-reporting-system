import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String, // e.g., "T Nagar", "Adyar"
    required: true,
  },
  assignedStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
  },
  assignedOfficers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Police",
    },
  ],
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  response: {
    type: String,
    default: "The Officer is on the way",
    
  }
}, { collection: 'reports' });

export default mongoose.model("Report", reportSchema);
