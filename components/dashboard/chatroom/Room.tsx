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
import axios from "axios";
import {AppContext} from "../../../lib/context";
import RoomBody from "./roombody";
import Poll from "./Poll";

const Room = React.forwardRef((props: Interfaces.RoomProps, ref) => {
	const {
		state: {socket, user},
	} = React.useContext(AppContext);

	const SendRef = React.useRef<HTMLButtonElement>(null);
	const MessageBoxRef = React.useRef<HTMLTextAreaElement>(null);
	const RoomBodyRef = React.useRef<Interfaces.RoomBodyRefType>(null);
	const MediaRef = React.useRef<HTMLDivElement>(null);
	const PollRef = React.useRef<{toggle(): void}>(null);

	React.useImperativeHandle(
		ref,
		() => ({
			getProps() {
				let messages = RoomBodyRef.current.getMessages();
				return {...props.roomData, messages};
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

	return (
		<div className="chats-form" id={props.roomData.user._id}>
			<div
				className="close-card"
				data-role="close room"
				onClick={UpdateRooms}
			>
				<IconButton size="small">
					<CloseOutlinedIcon fontSize="small" className="icon" />
				</IconButton>
			</div>
			<div
				className="image-preview-wrapper application"
				role="application"
			></div>
			<div
				className="video-preview-wrapper application"
				role="application"
			></div>
			<div className="form-group chats-room">
				<div className="room-header">
					<div className="profile">
						<div
							className="avatar user_image list_item"
							dangerouslySetInnerHTML={{
								__html: String(
									props.roomData.target.closest(".chat")
										.children[0].innerHTML
								),
							}}
						/>
						<div className="name">
							<span className="textname">james</span>
							<div className="active-sign">
								<div className="active-text">online</div>
							</div>
						</div>
						<div className="options">
							<div className="options-list">
								<div className="option navigate"></div>
							</div>
						</div>
					</div>
				</div>
				<RoomBody
					ref={RoomBodyRef}
					messages={props.roomData.messages}
					user={props.roomData.user}
					target={props.roomData.target}
					socket={socket}
					chatboard={props.chatBoard}
				/>
				<div className="room-footer">
					<div className="message-create-box input-box">
						<div className="input-group">
							<div className="icon media-icon">
								<IconButton size="small">
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
										<IconButton className=" icon image-icon">
											<ImageOutlinedIcon />
										</IconButton>
										<label className="icon-label">
											Image
										</label>
										<input
											className="file-control image-file"
											type="file"
											name="image-file"
											id="40abf369-1e9image"
											accept="image/*"
											hidden
										/>
									</li>
									<li className="media image toggle-image">
										<IconButton className="icon video-icon">
											<VideoLibraryIcon />
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
											onClick={() =>
												PollRef.current.toggle()
											}
										>
											<PollOutlinedIcon />
										</IconButton>
										<label className="icon-label">
											Poll
										</label>
									</li>
								</ul>
							</div>
						</div>
						<Poll ref={PollRef} />
					</div>
				</div>
			</div>
		</div>
	);
});

Room.displayName = "Room";

export default Room;
