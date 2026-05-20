import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    address: {
      type: String
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    officers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Police"
      }
    ]
  },
  { collection: "stations", timestamps: true }
);

stationSchema.index({ location: "2dsphere" });

export default mongoose.model("Station", stationSchema);
