import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true
  },
  senderRole: {
    type: String,
    enum: ["USER", "POLICE"],
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Message", messageSchema);
