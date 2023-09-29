/* eslint-disable react-hooks/exhaustive-deps */
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import React from "react";
import { useAppSelector } from "./redux/store";
import Cookie from "js-cookie";

export function useSocket(url: string, loggedIn: boolean) {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    if (loggedIn) {
      // @ts-ignore
      const socketIo: Socket = io(url, {
        auth: {
          token: Cookie.get("sid"),
        },
      });
      setSocket(socketIo);

      const pingInterval = setInterval(() => {
        // console.log("connection status ===>", socketIo.connected);
        socketIo.emit("online");
      }, 5000);

      return () => {
        socketIo.disconnect();
        clearInterval(pingInterval);
      };
    }
  }, [loggedIn]);

  React.useEffect(() => {
    const disconnected = (_reason: any) => {
      // console.log("disconnected", reason, socket.id);
      socket?.connect();
    };

    if (socket) {
      socket.on("disconnect", disconnected);
      socket.on("reconnect", (socket) => {
        console.log("Reconnected ===>", { socket });
      });
    }

    return () => {
      socket?.off("disconnect", disconnected);
    };
  }, [socket]);

  return socket;
}
