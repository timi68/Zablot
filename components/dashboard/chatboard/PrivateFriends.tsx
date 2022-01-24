import React from "react";
import * as Interface from "../../../lib/interfaces";
import {Button} from "@mui/material";
import Chats from "./Chats";

interface props {
	friends: Interface.Friends[];
	openRoom(
		user: Interface.Friends,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	): void;
	friendId: string;
}

interface props {
	friends: Interface.Friends[];
	openRoom(
		user: Interface.Friends,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	): void;
	friendId: string;
}
function Private(props: props) {
	const {friends, openRoom, friendId} = props;
	const [opened, setOpened] = React.useState(false);
	const checkPin = () => setOpened(true);

	const PrivateFriends = friends?.filter(
		(friend) => friend.IsPrivate === true
	);

	return (
		<div className="private_chats chats_listbox">
			{opened && (
				<>
					{!!PrivateFriends?.length && (
						<ul className="chats-list list">
							{PrivateFriends?.map((user, index) => {
								return (
									<Chats
										key={index}
										friendId={friendId}
										open={openRoom}
										user={user}
									/>
								);
							})}
						</ul>
					)}
					{!friends?.length && (
						<div className="no-friend-available">
							<div className="text">
								<span>No Private Chat</span>
							</div>
						</div>
					)}
				</>
			)}
			{!PrivateFriends?.length && !opened && (
				<div className="chat-security">
					<div className="label">
						<h4>Enter security key to open</h4>
					</div>
					<div className="lock">
						<input
							className="input unlock"
							data-role="input"
							placeholder="Enter key"
							type="tel"
						/>
						<Button
							variant="outlined"
							fullWidth
							className="openPrivate"
							onClick={checkPin}
						>
							Open
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Private;
