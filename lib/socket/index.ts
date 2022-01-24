/* eslint-disable react-hooks/exhaustive-deps */
import {io, Socket} from "socket.io-client";
import React, {useEffect, useState} from "react";

export function useSocket(url: string, loggedIn: boolean) {
	const [socket, setSocket] = useState<Socket | null>(null);
	useEffect(() => {
		if (loggedIn) {
			const socketIo: Socket = io(url);
			setSocket(socketIo);

			return () => {
				socketIo.disconnect();
			};
		}
	}, [loggedIn]);

	return socket;
}
