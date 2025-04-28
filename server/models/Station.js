import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  officers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Police"
  }]
}, { collection: 'stations' });

export default mongoose.model("Station", stationSchema);
