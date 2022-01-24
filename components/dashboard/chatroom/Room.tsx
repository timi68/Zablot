/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {IconButton} from "@mui/material";
import * as Interfaces from "../../../lib/interfaces";
import {AppContext} from "../../../lib/context";
import RoomBody from "./RoomBody";
import Poll from "./Poll";
import RoomHeader from "./RoomHeader";

const Room = React.forwardRef((props: Interfaces.RoomProps, ref) => {
	const {
		state: {socket, user},
	} = React.useContext(AppContext);
	const SendRef = React.useRef<HTMLButtonElement>(null);
	const MessageBoxRef = React.useRef<HTMLTextAreaElement>(null);
	const RoomBodyRef = React.useRef<Interfaces.RoomBodyRefType>(null);
	const MediaRef = React.useRef<HTMLDivElement>(null);
	const PollRef = React.useRef<{
		toggle(hide?: boolean): void;
		getPollData(): {
			pollData: Interfaces.RoomType["pollData"];
			pollToggled: boolean;
		};
	}>(null);
	const ImageFileRef = React.useRef<HTMLInputElement>(null);
	const VideoFileRef = React.useRef<HTMLButtonElement>(null);

	React.useImperativeHandle(
		ref,
		() => ({
			getProps() {
				let messages = RoomBodyRef.current.getMessages();
				let pollData = PollRef.current.getPollData();
				return {...props.roomData, messages, loaded: true, ...pollData};
			},
		}),
		[]
	);

	const handleChangeEvent = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	): void => {
		e.preventDefault();

		if (e.target.value) SendRef.current.classList.add("active");
		else SendRef.current.classList.remove("active");

		return;
	};

	const sendMessage = (): void => {
		let messageText: string = MessageBoxRef.current.value;

		if (!messageText) return;
		(MessageBoxRef.current.value = ""),
			SendRef.current.classList.remove("active");

		var newMessage: Interfaces.MessageType = {
			message: messageText,
			date: new Date(),
			coming: user._id,
			going: props.roomData.user.Id,
			Format: "plain",
			_id: props.roomData.user._id,
		};

		socket.emit(
			"OUTGOINGMESSAGE",
			newMessage,
			(err: string, {messageId}: {messageId: string}) => {
				console.log(err);
				if (!err) {
					newMessage._id = messageId;
					RoomBodyRef.current.setMessages(newMessage, "out");
					props.chatBoard.current.SetLastMessage(
						props.roomData.user.Id,
						messageText,
						user._id
					);
				}
				console.log({err});
			}
		);
	};

	const UpdateRooms = (): void => {
		props.setRooms((prev) => {
			let newRooms = [];
			let i = 0;

			while (i > prev.length) {
				if (props.index === i) continue;
				let roomProps = props.roomsRef[i].current.getProps();
				newRooms.push(roomProps);
			}

			return newRooms;
		});
	};

	/**
	 * This function controls the media toggler
	 *
	 */
	const handleToggle: (type: "poll" | "video" | "image") => void = (type) => {
		MediaRef.current.classList.remove("active");
		switch (type) {
			case "poll":
				PollRef.current.toggle();
				break;
			case "image":
				ImageFileRef.current.click();
			default:
				break;
		}
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (
			!(
				window.File &&
				window.FileReader &&
				window.FileList &&
				window.Blob
			)
		) {
			alert("The File APIs are not fully supported in this browser.");
			return false;
		}

		const file = e.target.files[0];
		const imageFileType: string[] = [
			"image/jpeg",
			"image/jpg",
			"image/svg",
			"image/png",
			"image/jfif",
		];
		const videoFileType: string[] = [
			"video/mp4",
			"video/avi",
			"video/mv4",
			"video/ogm",
			"video/mpg",
		];

		if (imageFileType.includes(file?.type)) {
			// read the files
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = function (event) {
				// blob stuff
				var blob = new Blob([event.target.result]); // create blob...
				window.URL = window.URL || window.webkitURL;
				var blobURL = window.URL.createObjectURL(blob); // and get it's URL

				let newMessage: Interfaces.MessageType = {
					message: "Image",
					Format: "image",
					date: new Date(),
					coming: user._id,
					going: props.roomData.user.Id,
					_id: props.roomData.user._id,
					blobUrl: blobURL,
					filename: file.name,
					file,
					upload: true,
				};

				RoomBodyRef.current.setMessages(newMessage, "out");
				props.chatBoard.current.SetLastMessage(
					props.roomData.user.Id,
					"Image",
					user._id
				);
			};
		}
	};

	return (
		<div className="chats-form" id={props.roomData.user._id}>
			<div
				className="image-preview-wrapper application"
				role="application"
			></div>
			<div
				className="video-preview-wrapper application"
				role="application"
			></div>
			<div className="form-group chats-room">
				<RoomHeader
					socket={socket}
					target={props.roomData.target}
					_id={props.roomData.user.Id}
					UpdateRooms={UpdateRooms}
				/>
				<RoomBody
					ref={RoomBodyRef}
					messages={props.roomData.messages}
					user={props.roomData.user}
					coming={user._id}
					target={props.roomData.target}
					socket={socket}
					chatboard={props.chatBoard}
					loaded={props.roomData.loaded}
				/>
				<div className="room-footer">
					<div className="message-create-box input-box">
						<div className="input-group message-box">
							<div className="icon media-icon">
								<IconButton
									size="small"
									onClick={() =>
										MediaRef.current.classList.add("active")
									}
								>
									<AttachmentOutlinedIcon fontSize="small" />
								</IconButton>
							</div>
							<textarea
								className="text-control"
								name="message"
								ref={MessageBoxRef}
								onChange={handleChangeEvent}
								id="text-control message"
								placeholder="Type a message.."
							></textarea>
							<div className="send-btn">
								<IconButton
									className="btn send"
									size="small"
									ref={SendRef}
									onClick={sendMessage}
								>
									<SendIcon className="send-icon" />
								</IconButton>
							</div>
						</div>
						<div className="media-message-wrapper" ref={MediaRef}>
							<div className="multimedia-list list">
								<ul className="media-list">
									<li className="media video toggle-video">
										<IconButton
											className=" icon image-icon"
											onClick={() =>
												handleToggle("image")
											}
										>
											<ImageOutlinedIcon fontSize="small" />
										</IconButton>
										<label className="icon-label">
											Image
										</label>
										<input
											className="file-control image-file"
											type="file"
											name="image-file"
											id="image-file"
											ref={ImageFileRef}
											accept="image/*"
											onChange={handleFile}
											hidden
										/>
									</li>
									<li className="media image toggle-image">
										<IconButton className="icon video-icon">
											<VideoLibraryIcon fontSize="small" />
										</IconButton>
										<label className="icon-label">
											Video
										</label>
										<input
											className="file-control video-file"
											type="file"
											accept="video/*"
											id="40abf369-1e9video"
											name="video-file"
											hidden
										/>
									</li>
									<li className="media poll toggle-poll">
										<IconButton
											className="icon"
											id="poll-icon"
											onClick={() => handleToggle("poll")}
										>
											<PollOutlinedIcon fontSize="small" />
										</IconButton>
										<label className="icon-label">
											Poll
										</label>
									</li>
								</ul>
							</div>
						</div>
						<Poll
							ref={PollRef}
							roomBody={RoomBodyRef}
							going={props.roomData.user.Id}
							_id={props.roomData.user.Id}
							coming={user._id}
							data={props.roomData.pollData}
							toggled={props.roomData.pollToggled}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
Room.displayName = "Room";

export default Room;
