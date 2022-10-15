/* eslint-disable react-hooks/exhaustive-deps */
import { io } from "socket.io-client";
import type { Socket } from "socket.io";
import React, { useEffect, useState } from "react";

export function useSocket(url: string, loggedIn: boolean) {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (loggedIn) {
      // @ts-ignore
      const socketIo: Socket = io(url);
      setSocket(socketIo);

      const pingInterval = setInterval(() => {
        console.log("connection status ", socketIo.connected);
        socketIo.emit("online");
      }, 5000);

      return () => {
        socketIo.disconnect();
        clearInterval(pingInterval);
      };
    }
  }, [loggedIn]);

  return socket;
}
