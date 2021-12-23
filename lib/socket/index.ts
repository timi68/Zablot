/* eslint-disable react-hooks/exhaustive-deps */
import {io, Socket} from "socket.io-client";
import React, {useEffect, useState} from "react";

export function useSocket(url) {
	const [socket, setSocket] = useState<Socket | null>(null);
	useEffect(() => {
		const socketIo: Socket = io(url);
		setSocket(socketIo);

		return () => {
			socketIo.disconnect();
		};
	}, []);

	return socket;
}
