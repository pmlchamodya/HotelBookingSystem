/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { notifyInfo } from "./ToastContext";
import { AuthContext } from "../../context/AuthContext";
import notificationSound from "../../assets/audio/notification.mp3";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // 1. Connect to Backend
    const newSocket = io("http://localhost:5000");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    // 2. Remove old listeners to prevent double firing
    newSocket.off("new_notification");

    // 3. Listen for notifications
    newSocket.on("new_notification", (data) => {
      if (user && (user.role === "admin" || user.role === "staff")) {
        // Sound
        try {
          const audio = new Audio(notificationSound);
          audio.play().catch(() => {
            console.log("Browser blocked audio. User interaction needed.");
          });
        } catch {
          console.log("Audio Error");
        }

        // Notification
        notifyInfo(`🔔 ${data.message}`);
      }
    });

    return () => {
      newSocket.off("new_notification");
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
