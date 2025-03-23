// client/src/pages/NoteEditor.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

function NoteEditor() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket, connected, username, roomUsers } = useSocket();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const timeoutRef = useRef(null);

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000"
          }/api/notes/${roomId}`
        );
        setNote(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Note not found");
        setLoading(false);
      }
    };

    fetchNote();
  }, [roomId]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket || !connected) return;

    // Listen for note updates
    socket.on("note-updated", (updatedNote) => {
      setNote((prevNote) => ({
        ...prevNote,
        title: updatedNote.title || prevNote.title,
        content: updatedNote.content || prevNote.content,
      }));
    });

    // Listen for user joined events
    socket.on("user-joined", (data) => {
      addNotification(`${data.username} joined the room`);
    });

    // Listen for user left events
    socket.on("user-left", (socketId) => {
      addNotification(`A user left the room`);
    });

    // Listen for room users update
    socket.on("room-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("note-updated");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("room-users");
    };
  }, [socket, connected]);

  // Add a notification with auto-removal
  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);

    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 3000);
  };

  // Handle note content change with debouncing
  const handleContentChange = (e) => {
    const newContent = e.target.value;

    setNote((prev) => ({ ...prev, content: newContent }));

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout for debouncing
    timeoutRef.current = setTimeout(() => {
      updateNote({ content: newContent });
    }, 500);
  };

  // Handle note title change with debouncing
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;

    setNote((prev) => ({ ...prev, title: newTitle }));

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout for debouncing
    timeoutRef.current = setTimeout(() => {
      updateNote({ title: newTitle });
    }, 500);
  };

  // Update note in the database and emit changes to other users
  const updateNote = async (updates) => {
    if (!socket || !connected) return;

    try {
      // Send update to other users in the room
      socket.emit("update-note", {
        roomId,
        ...updates,
      });

      // Save to database
      await axios.patch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000"
        }/api/notes/${roomId}`,
        updates
      );
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  if (loading) return <div className="loading">Loading note...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="note-editor">
      <header>
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          className="note-title"
          placeholder="Untitled Note"
        />
        <div className="header-actions">
          <button onClick={() => navigate("/")}>Back to Home</button>
          <div className="room-info">
            <span>Room ID: {roomId}</span>
            <span>Online: {onlineUsers.length}</span>
          </div>
        </div>
      </header>

      <div className="editor-container">
        <div className="sidebar">
          <div className="online-users">
            <h3>Online Users</h3>
            <ul>
              <li>You ({username})</li>
              {onlineUsers
                .filter((id) => id !== socket.id)
                .map((id) => (
                  <li key={id}>User {id.substring(0, 4)}...</li>
                ))}
            </ul>
          </div>
        </div>

        <div className="content-area">
          <textarea
            value={note.content}
            onChange={handleContentChange}
            placeholder="Start typing your note here..."
            className="note-content"
          />
        </div>
      </div>

      <div className="notifications">
        {notifications.map((notif) => (
          <div key={notif.id} className="notification">
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoteEditor;
