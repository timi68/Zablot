import Image from "next/image";
import React from "react";
import {AppContext} from "../../../lib/context";
import {v4 as uuid} from "uuid";
import j from "jquery";
import {ChatRoom} from "../../../utils/ChatRoom";
import {motion} from "framer-motion";
import {Tab, Tabs, CircularProgress} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {Button, CardActionArea} from "@material-ui/core";
import * as Interface from "../../../lib/interfaces";

interface ChatBoardType {
	chatRoom: {
		current: {
			OpenRoom(user: Interface.Friends, target: HTMLElement): void;
		};
	};
}
const ChatBoard = React.forwardRef(function (props: ChatBoardType, ref) {
	const {
		state: {socket, session, user, activeFriends},
		dispatch,
	} = React.useContext(AppContext);
	const [friends, setFriends] = React.useState<Interface.Friends[]>(
		user?.Friends || []
	);
	const [loading, setLoading] = React.useState(!Boolean(activeFriends));
	const [tabToOpen, setTabToOpen] = React.useState(0);
	const chatBoard = React.useRef(null);

	React.useImperativeHandle(
		ref,
		() => ({
			UpdateFriends(friend: Interface.Friends) {
				console.log("Updating friends");
				setFriends((friends) => [friend, ...friends]);
			},
			SetLastMessage(id: string, message: string, flow: string) {
				setFriends((prevFriends) => {
					const currentFriends = prevFriends.map((friend) => {
						if (friend.Id === id) {
							friend.Last_Message = message;
							friend.LastPersonToSendMessage = flow;
						}
						return friend;
					});
					return currentFriends;
				});
			},
		}),
		[]
	);
	const NewFriend = React.useCallback(
		(data: Interface.Friends) => {
			console.log("NewFriends emitted", data);
			setFriends([data, ...friends]);
		},
		[friends]
	);

	const IncomingMessage = React.useCallback((data: Interface.MessageType) => {
		console.log(" IncomingMessage emitted", data);
		const id = [];
		j(".chats-form").each((i, e) => {
			id.push(j(e).attr("id").slice(0, 12));
		});

		setFriends((state) => {
			const oldState = state.filter((user) => user.Id !== data.coming);
			state.map((user) => {
				if (user.Id === data.coming) {
					user.UnseenMessages = id.includes(data._id)
						? 0
						: Number(user.UnseenMessages) + 1;
					user.Last_Message = data.message;
					user.LastPersonToSendMessage = data.coming;
					oldState.unshift(user);
				}
				return;
			});

			return oldState;
		});
	}, []);

	const Status = React.useCallback((data) => {
		setFriends((state) => {
			const newState = state.map((user) => {
				if (user.Id === data._id) user.active = data.online;
				return user;
			});

			return newState;
		});
	}, []);

	const ANSWERED = React.useCallback((data) => {
		console.log(data);
	}, []);

	const handleActiveFriends = (actives) => {
		setFriends((state) => {
			state = state.map((user) => {
				const _id = user.Id.slice(19, 24);
				const active = actives.includes(_id);

				if (active) user.active = true;
				else user.active = false;

				return user;
			});

			return state;
		});

		dispatch({
			type: Interface.ActionType.ACTIVEFRIENDS,
			payload: {activeFriends: actives},
		});
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	};

	React.useEffect(() => {
		if (socket) {
			socket.on("INCOMINGMESSAGE", IncomingMessage);
			socket.on("STATUS", Status);
			socket.on("ANSWERED", ANSWERED);
		}

		if (!activeFriends) {
			socket.emit("ACTIVEUSERS", handleActiveFriends);
		} else {
			handleActiveFriends(activeFriends);
		}

		return () => {
			socket.off("INCOMINGMESSAGE", IncomingMessage);
			socket.off("STATUS", Status);
			socket.off("ANSWERED", ANSWERED);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	function openRoom(
		userRoom: Interface.Friends,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	): void {
		setFriends((state) => {
			state = state.map((u) => {
				if (u.Id === userRoom.Id) u.UnseenMessages = 0;
				return u;
			});
			return state;
		});

		socket.emit(
			"CLEANSEEN",
			{_id: user._id, Id: userRoom._id},
			(err: string, done: string) => {
				console.log(err || done);
				if (err) {
					alert("Internal server error: restarting window now");
					location.reload();
				}
			}
		);

		let target = e.target as HTMLElement;
		// ChatRoom({j, user, from: session.id, e, socket});
		props.chatRoom.current.OpenRoom(userRoom, target);
		openChatBoard();
		return;
	}

	const openChatBoard = () => {
		const bar = chatBoard.current;
		if (!bar.classList.contains("show"))
			document.querySelector(".show")?.classList.remove("show");
		bar.classList.toggle("show");
	};

	return (
		<div className="chats-container chat-board" ref={chatBoard}>
			<div onClick={openChatBoard} className="open"></div>
			<div className="chat-wrapper">
				<div className="chats-header">
					<div className="title">Chats</div>
					<div className="chats-nav">
						<Navbar
							setTabToOpen={setTabToOpen}
							tabToOpen={tabToOpen}
						/>
					</div>
				</div>
				<motion.div
					animate={{
						translateX: !Boolean(tabToOpen) ? "0%" : "-50%",
					}}
					transition={{duration: 0.2}}
					className="chats-body"
				>
					{loading ? (
						<>
							<div className="loader">
								<CircularProgress sx={{color: "grey"}} />
							</div>
							<div className="loader">
								<CircularProgress sx={{color: "grey"}} />
							</div>
						</>
					) : (
						<>
							<Friends
								friendId={session.id}
								friends={friends}
								openRoom={openRoom}
							/>
							<Private
								friends={friends}
								openRoom={openRoom}
								friendId={session.id}
							/>
						</>
					)}
				</motion.div>
			</div>
		</div>
	);
});

ChatBoard.displayName = "ChatBoard";

type NavbarType = {tabToOpen: number; setTabToOpen(value: number): void};
function Navbar(props: NavbarType) {
	const {setTabToOpen, tabToOpen} = props;
	function a11yProps(index) {
		return {
			id: `tab${index}`,
		};
	}

	function handleChange(event, value) {
		console.log(value);
		setTabToOpen(value);
	}
	return (
		<Tabs
			variant="fullWidth"
			value={tabToOpen}
			textColor="inherit"
			onChange={handleChange}
			aria-label="Chats tab"
			className="tab_list"
		>
			<Tab
				icon={<PeopleAltOutlinedIcon fontSize="medium" />}
				{...a11yProps(0)}
			/>
			<Tab icon={<SecurityIcon fontSize="medium" />} {...a11yProps(1)} />
		</Tabs>
	);
}

interface chats {
	friendId: String;
	user: Interface.Friends;
	open(
		user: Interface.Friends,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	): void;
}
/**
 *
 */
function Chats({friendId, user, open}: chats): JSX.Element {
	return (
		<CardActionArea
			className="chats_listItem list_item chat"
			role="listitem"
			onClick={(e) => open(user, e)}
		>
			<div className="avatar user_image list_item" role="listitem">
				<Image
					src={"/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
					alt={user.Name}
					layout="fill"
					role="img"
					className="image list_image"
				/>
				<div className="badge user_active_signal"></div>
			</div>
			<div className="text" role="listitem">
				<div className="user_name primary_text">{user.Name}</div>
				<div className="last_message secondary_text">
					{user?.LastPersonToSendMessage === friendId && "You: "}
					{user.Last_Message === "Image" ? (
						<ImageOutlinedIcon fontSize="small" />
					) : (
						user.Last_Message
					)}
				</div>
			</div>
			{!!user.UnseenMessages && (
				<div className="unseenmessages badge">
					<span className="label count">{user.UnseenMessages}</span>
				</div>
			)}
		</CardActionArea>
	);
}

/**
 *
 * @param {{friends: Object[]}} props
 * @returns
 */
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
							{PrivateFriends?.map((user) => {
								var key = uuid();
								return (
									<Chats
										key={key}
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

/**
 *
 * @param {{friends: Object[]}} props
 * @returns
 */
function Friends(props: props) {
	const {friendId, friends, openRoom} = props;
	const NotPrivateFriends = friends?.filter((friend) => !friend.IsPrivate);
	return (
		<div className="friends_chats chats_listbox" role="listbox">
			<ul className="chats-list list" role="list">
				{NotPrivateFriends?.map((user) => {
					var key = uuid();
					return (
						<Chats
							key={key}
							friendId={friendId}
							open={openRoom}
							user={user}
						/>
					);
				})}
				{!friends?.length && (
					<div className="no-friend-available">
						<div className="text">
							<span>You dont have any friend</span>
						</div>
					</div>
				)}
			</ul>
		</div>
	);
}

export default ChatBoard;
