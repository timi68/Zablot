/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import {Socket} from "socket.io-client";
import {MessageType} from "../../../lib/interfaces";
import Image from "next/image";
import GroupMessage from "./GroupMessage";
import Skeleton from "@mui/material/Skeleton";

type PropsType = {
	message: MessageType;
	messagesId: string;
	nextComingId: boolean;
	hrs: number | string;
	mins: number | string;
	cur: Date;
	pre: Date | null;
	i: number;
	setMessageData: React.Dispatch<
		React.SetStateAction<{
			messages: MessageType[];
			type: "in" | "out" | "loaded";
		}>
	>;
};

function IncomingImage(props: PropsType) {
	const {message, hrs, mins, cur, pre, i, nextComingId, setMessageData} =
		props;
	// const [uploading, setUploading] = React.useState<number>(0);

	React.useEffect(() => {
		if (!message.blobUrl) {
			if (
				!(
					window.File &&
					window.FileReader &&
					window.FileList &&
					window.Blob
				)
			) {
				alert("The File APIs are not fully supported in this browser.");
				return;
			}

			try {
				(async () => {
					const uploadImage = await axios.get<Blob>(message.url, {
						responseType: "blob",
					});
					setMessageData((prevState) => {
						const messages: MessageType[] = prevState.messages.map(
							(m) => {
								if (m._id === message._id) {
									m.blobUrl = URL.createObjectURL(
										uploadImage.data
									);
								}
								return m;
							}
						);
						return {messages, type: null};
					});
				})();
			} catch (error) {
				alert(`Error: ${error.message}`);
				return;
			}
		}
	}, []);

	const className = `incoming-message incoming-media${
		nextComingId || i === 0 ? " adjust-mg" : ""
	} `;

	const time = hrs + ":" + mins;
	const Group = GroupMessage({cur, pre, i});

	return (
		<React.Fragment>
			{Group && (
				<div className="group">
					<span>{Group}</span>
				</div>
			)}
			<div className={className}>
				<div className="media-wrapper">
					{Boolean(message.blobUrl) && (
						<div className="media image-file">
							<img
								src={message.blobUrl}
								alt={message.filename}
								className="image"
							/>
						</div>
					)}
					{!Boolean(message.blobUrl) && (
						<Skeleton
							variant="rectangular"
							animation="wave"
							width={100}
							height={150}
						/>
					)}
					<span className="time">
						<small>{time}</small>
					</span>
				</div>
			</div>
		</React.Fragment>
	);
}

export default IncomingImage;
