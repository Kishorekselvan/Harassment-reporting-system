import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";
import Report from "../models/Report.js";

/* POLICE CREATES CHAT */
export const createChat = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const isAssigned = report.assignedOfficers.some(
      officerId => officerId.toString() === req.user.id
    );
    if (!isAssigned) {
      return res.status(403).json({ message: "Not assigned" });
    }

    const existingChat = await ChatRoom.findOne({ reportId });
    if (existingChat) return res.status(200).json(existingChat);

    const chat = await ChatRoom.create({
      reportId,
      userId: report.userId,
      policeId: req.user.id
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { chatRoomId, message } = req.body;

    const chat = await ChatRoom.findById(chatRoomId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (chat.isLocked) return res.status(403).json({ message: "Chat locked" });

    if (
      (req.user.role === "User" && chat.userId.toString() !== req.user.id) ||
      (req.user.role === "Police" && chat.policeId.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const msg = await Message.create({
      chatRoomId,
      senderRole: req.user.role.toUpperCase(),
      senderId: req.user.id,
      message
    });

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET MESSAGES */
export const getMessages = async (req, res) => {
  const messages = await Message.find({ chatRoomId: req.params.chatRoomId })
    .sort({ createdAt: 1 });
  res.json(messages);
};

/* MARK SEEN */
export const markSeen = async (req, res) => {
  try {
    const result = await Message.updateMany(
      {
        chatRoomId: req.params.chatRoomId,
        senderRole: { $ne: req.user.role.toUpperCase() },
        seen: false                     // ✅ ONLY UNSEEN MESSAGES
      },
      { seen: true }
    );

    res.json({
      message: "Seen updated",
      updatedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getChatByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const chat = await ChatRoom.findOne({ reportId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not created yet" });
    }

    // Authorization check
    if (
      (req.user.role === "User" && chat.userId.toString() !== req.user.id) ||
      (req.user.role === "Police" && chat.policeId.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};