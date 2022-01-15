/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {IconButton, Container, CircularProgress} from "@mui/material";
import * as Interfaces from "../../../lib/interfaces";
import axios from "axios";
import {AppContext} from "../../../lib/context";
import {Socket} from "socket.io-client";
import j from "jquery";
import IncomingMessage from "./IncomingMessage";
import OutgoingMessage from "./OutgoingMessage";
import RoomBody from "./roombody";
import Room from "./Room";

const ChatRoom = React.forwardRef(function (
	props: {chatBoard: React.RefObject<Interfaces.AppChatBoardType>},
	ref
) {
	const [rooms, setRooms] = React.useState<Partial<Interfaces.RoomType[]>>(
		[]
	);
	const [roomsRef, setRoomRef] = React.useState<Interfaces.RoomProps["ref"]>(
		[]
	);

	React.useEffect(() => {
		const refs: React.RefObject<{
			getProps(): Interfaces.RoomType;
		} | null>[] = Array(rooms.length)
			//@ts-ignore
			.fill()
			.map((_, i) => roomsRef[i] || React.createRef());
		setRoomRef(refs);
	}, [rooms]);

	React.useImperativeHandle(ref, () => ({
		OpenRoom(user: Interfaces.Friends, target: HTMLElement) {
			setRooms((prev) => {
				let current = [...prev, {user, messages: [], target}];
				return current;
			});
		},
	}));

	return (
		<div className="chat-rooms-container">
			<div className="chat-rooms-wrapper">
				{rooms?.map((roomData, i) => {
					return (
						<Room
							key={i}
							index={i}
							roomsRef={roomsRef}
							roomData={roomData}
							ref={roomsRef[i]}
							setRooms={setRooms}
							chatBoard={props.chatBoard}
						/>
					);
				})}
			</div>
		</div>
	);
});

ChatRoom.displayName = "ChatRoomContainer";

const Poll = React.forwardRef((props, ref) => {
	const [open, setOpen] = React.useState<boolean>(false);

	React.useImperativeHandle(
		ref,
		() => ({
			toggle() {
				setOpen(true);
			},
		}),
		[]
	);

	return (
		<div className="create-question create-poll">
			<div className="poll-header">
				<div className="title">
					<div className="text">Poll</div>
				</div>
				<div className="discard-wrap">
					<div className="text">
						<span>Discard</span>
					</div>
				</div>
				<div className="create-wrap">
					<div className="text">
						<span>Create</span>
					</div>
				</div>
			</div>
			<div className="poll-body">
				<div className="question-box">
					<div className="title">
						<div className="text">Question</div>
					</div>
					<div className="text-box question">
						<textarea
							className="text-control"
							id="question"
							name="question"
							placeholder="Enter your question.."
						></textarea>
					</div>
				</div>
				<div className="question-options">
					<div className="header">
						<div className="title">
							<div className="text">Options</div>
						</div>
						<IconButton className="add-options add">
							<AddRoundedIcon />
						</IconButton>
					</div>
					<ul className="option-list wrap"></ul>
				</div>
				<div className="additional-options">
					<div className="title">
						<div className="text">Additional options</div>
					</div>
					<div className="options">
						<div className="option-wrap timer">
							<label htmlFor="timing" className="label">
								Set time(s)
							</label>
							<input
								className="text-control time"
								type="text"
								id="timing"
								name="time"
								maxLength={3}
								autoComplete="new"
							/>
						</div>
						<div className="coin option-wrap">
							<label htmlFor="coin" className="label">
								Add coin
							</label>
							<input
								className="text-control coin"
								type="text"
								id="coin"
								name="coin"
								maxLength={3}
								autoComplete="new"
							/>
						</div>
						<div className="challenge option-wrap">
							<div className="label-text">
								<div className="text">Challenge</div>
							</div>
							<div className="control">
								<input
									className="radio challenge"
									type="checkbox"
									id="challenge"
									name="challenge"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

Poll.displayName = "Poll";

function Option() {
	return (
		<li className="option">
			<div className="text-box">
				<input
					type="radio"
					name="answer"
					id="answer"
					className="answer"
				/>
				<textarea
					name="option-input"
					placeholder="Enter option.."
					className="text-control text-box"
				></textarea>
			</div>
			<div className="remove-option">
				<IconButton className="icon" size="small">
					<CloseOutlinedIcon fontSize="small" />
				</IconButton>
			</div>
		</li>
	);
}

function OutgoingForm() {
	return (
		<div className="outgoing-message outgoing-form" id="61df669ba3">
			<div
				className="form-message poll question "
				id="61df669ba318756587a3de31"
			>
				<div className="form-group">
					<div className="poll-question">
						<div className="poll-question-header">
							<div className="timer">
								<div className="time-count">
									Time <b>60s</b>
								</div>
							</div>
							<div className="coin-added">
								<div className="coin">
									coins <b>200</b>
								</div>
							</div>
						</div>
						<div className="text" id="question">
							what is the name of the boy?
						</div>
					</div>
					<div className="poll-options">
						<ul className="options">
							<li className="option ">
								<div className="form-group">
									<input
										type="radio"
										name="a6f638d5-9a7"
										id="option"
										className="option0"
									/>
								</div>
								<div className="option-text label">
									<label>james is my name</label>
								</div>
							</li>
							<li className="option ">
								<div className="form-group">
									<input
										type="radio"
										name="a6f638d5-9a7"
										id="option"
										className="option1"
									/>
								</div>
								<div className="option-text label">
									<label>i really don't know</label>
								</div>
							</li>
							<li className="option ">
								<div className="form-group">
									<input
										type="radio"
										name="a6f638d5-9a7"
										id="option"
										className="option2"
									/>
								</div>
								<div className="option-text label">
									<label>
										and what is the main thing do now
									</label>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatRoom;
