/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import {AppContext} from "../../../lib/context";
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
	const {
		state: {
			user: {_id},
		},
	} = React.useContext(AppContext);

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
			setRooms((prev): Interfaces.RoomType[] => {
				let current: Interfaces.RoomType[] = [
					...prev,
					{
						user,
						messages: [],
						target,
						loaded: false,
						pollData: {
							question: "",
							options: [
								{text: "", checked: false},
								{text: "", checked: false},
							],
							Format: "Form",
							_id: user._id,
							coming: _id,
							going: user.Id,
						},
						pollToggled: false,
					},
				];
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

export default ChatRoom;
