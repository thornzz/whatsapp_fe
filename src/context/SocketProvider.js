import React, { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);
const socket = io(process.env.REACT_APP_API_ENDPOINT.split("/api/v1")[0]);

export const SocketProvider = ({ user, children }) => {
  useEffect(() => {
    if (user && socket.connected) {
      socket.emit("join", { userId: user._id, user });
      console.log("join tetiklendi");
    }
    socket.on("connect", () => {
      if (user) {
        socket.emit("join", { userId: user._id, user });
        console.log("join tetiklendi");
      }
      console.log("connect tetiklendi");
    });

    // Temizlik fonksiyonu
    return () => {
      socket.off("connect");
    };
  }, [user]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Hook şeklinde kullanım için
export const useSocketContext = () => useContext(SocketContext);
