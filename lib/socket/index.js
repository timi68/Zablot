/* eslint-disable react-hooks/exhaustive-deps */
import io from "socket.io-client";
import React, { useEffect, useState } from "react";

export function useSocket(url) {
	const [socket, setSocket] = useState(null);
	useEffect(() => {
		const socketIo = io.connect(url);
		setSocket(socketIo);

		return () => {
			socketIo.disconnect();
		};
	}, []);

	return socket;
}

export const SocketContext = React.createContext();
