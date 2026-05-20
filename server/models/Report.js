import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    description: {
      type: String,
      required: true
    },

    // 🔥 FIXED: store coordinates instead of string
    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },

    assignedStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station"
    },

    assignedOfficers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Police"
      }
    ],

    status: {
      type: String,
      default: "Pending"
    },

    response: {
      type: String,
      default: "The Officer is on the way"
    }
  },
  {
    collection: "reports",
    timestamps: true // replaces manual createdAt
  }
);

export default mongoose.model("Report", reportSchema);
