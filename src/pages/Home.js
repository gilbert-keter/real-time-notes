// client/src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

function Home() {
  const [action, setAction] = useState("join"); // 'join' or 'create'
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { joinRoom } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (action === "create") {
      if (!title.trim()) {
        setError("Title is required");
        return;
      }

      // Generate a unique room ID
      const generatedRoomId = Math.random().toString(36).substring(2, 10);

      try {
        // Create a new note in the database
        await axios.post(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000"
          }/api/notes`,
          {
            title,
            content: "null",
            roomId: generatedRoomId,
          }
        );

        // Join the room and navigate to it
        joinRoom(generatedRoomId, username);
        navigate(`/notes/${generatedRoomId}`);
      } catch (err) {
        setError("Failed to create note");
        console.error(err);
      }
    } else {
      // Join existing room
      if (!roomId.trim()) {
        setError("Room ID is required");
        return;
      }

      try {
        // Check if room exists
        const response = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000"
          }/api/notes/${roomId}`
        );

        if (response.status === 200) {
          // Join the room and navigate to it
          joinRoom(roomId, username);
          navigate(`/notes/${roomId}`);
        }
      } catch (err) {
        setError("Room not found");
        console.error(err);
      }
    }
  };

  return (
    <div className="home-container">
      <h1>Real-Time Collaborative Notes</h1>

      <div className="action-toggle">
        <button
          className={action === "join" ? "active" : ""}
          onClick={() => setAction("join")}
        >
          Join Existing Note
        </button>
        <button
          className={action === "create" ? "active" : ""}
          onClick={() => setAction("create")}
        >
          Create New Note
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        {action === "join" ? (
          <div className="form-group">
            <label>Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Note Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              required
            />
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <button type="submit" className="submit-btn">
          {action === "join" ? "Join Note" : "Create Note"}
        </button>
      </form>
    </div>
  );
}

export default Home;
