import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UserChatPage.css"; // reuse same CSS

const API = "http://localhost:5000";

const PoliceChatPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);

  const token = localStorage.getItem("token");

  /* -------------------------------
     CREATE / GET CHAT ROOM
     (Police initiates chat)
  -------------------------------- */
  useEffect(() => {
    const createChat = async () => {
      try {
        const res = await axios.post(
          `${API}/api/chat/create/${reportId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChatRoom(res.data);
        setLocked(res.data.isLocked);
      } catch (err) {
        console.error(err);
        alert("Chat not available.");
      }
    };

    createChat();
  }, [reportId, token]);

  /* -------------------------------
     FETCH MESSAGES (AUTO REFRESH)
  -------------------------------- */
  useEffect(() => {
    if (!chatRoom) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API}/api/chat/messages/${chatRoom._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatRoom, token]);

  /* -------------------------------
     MARK SEEN
  -------------------------------- */
useEffect(() => {
  if (!chatRoom || messages.length === 0) return;

  const unseenUserMessages = messages.some(
    msg => msg.senderRole === "USER" && !msg.seen
  );

  if (!unseenUserMessages) return;

  const markSeenAndRefresh = async () => {
    try {
      await axios.put(
        `${API}/api/chat/seen/${chatRoom._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔥 REFRESH
      const res = await axios.get(
        `${API}/api/chat/messages/${chatRoom._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  markSeenAndRefresh();
}, [messages, chatRoom, token]);



  /* -------------------------------
     SEND MESSAGE
  -------------------------------- */
  const sendMessage = async () => {
    if (!text.trim() || locked) return;

    try {
      await axios.post(
        `${API}/api/chat/send`,
        {
          chatRoomId: chatRoom._id,
          message: text,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with User</h2>
        
        <button onClick={() => navigate(-1)} className="back-btn">
          Back
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${
              msg.senderRole === "POLICE" ? "police-msg" : "user-msg"
            }`}
          >
            <p>{msg.message}</p>
            {msg.senderRole === "POLICE" && (
              <span className="seen">
                {msg.seen ? "✔✔ Seen" : "✔ Sent"}
              </span>
            )}
          </div>
        ))}
      </div>

      {locked ? (
        <div className="locked-chat">
          🔒 Chat is locked. Case has been resolved.
        </div>
      ) : (
        <div className="chat-input">
          <textarea
  className="chat-textarea"
  placeholder="Type a message"
  value={text}
  rows={2}
  onChange={(e) => setText(e.target.value)}
  onKeyDown={(e) => handleKeyDown(e)}
/>

          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default PoliceChatPage;
