// client/src/context/SocketContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Connect to the server
    const newSocket = io(
      process.env.REACT_APP_API_URL || "http://localhost:5000"
    );

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    newSocket.on("room-users", (users) => {
      setRoomUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (roomId, name) => {
    if (socket && roomId) {
      setUsername(name);
      setCurrentRoom(roomId);
      socket.emit("join-room", roomId, name);
    }
  };

  const value = {
    socket,
    connected,
    currentRoom,
    roomUsers,
    username,
    joinRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
