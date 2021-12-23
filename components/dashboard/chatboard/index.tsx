import Image from "next/image";
import {useRef, useContext, useEffect, useState, useCallback} from "react";
import {AppContext} from "../../../lib/context";
import {v4 as uuid} from "uuid";
import j from "jquery";
import {ChatRoom} from "../../../utils/ChatRoom";
import {motion} from "framer-motion";
import {Tab, Tabs, CircularProgress} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import {Button, CardActionArea} from "@material-ui/core";
import * as Interface from "../../../lib/interfaces";

function ChatBoard() {
	const {
		state: {socket, session, user},
	} = useContext(AppContext);
	const [friends, setFriends] = useState<Interface.Friends[]>(
		user?.Friends || []
	);
	const [loading, setLoading] = useState(true);
	const [tabToOpen, setTabToOpen] = useState(0);
	const chatBoard = useRef(null);

	const NewFriend = useCallback(
		(data: Interface.Friends) => {
			console.log("NewFriends emitted", data);
			setFriends([data, ...friends]);
		},
		[friends]
	);

	const IncomingMessage = useCallback((data) => {
		console.log(" IncomingMessage emitted", data);
		const id = [];
		const dataId = data._id.slice(12, data._id.length);
		j(".chats-form").each((i, e) => {
			id.push(j(e).attr("id").slice(0, 12));
		});

		setFriends((state) => {
			const oldState = state.filter((user) => user.Id !== data.from);
			state.map((user) => {
				if (user.Id === data.from) {
					user.UnseenMessages = id.includes(dataId)
						? 0
						: Number(user.UnseenMessages) + 1;
					user.Last_Message = data.message;
					user.LastPersonToSendMessage = data.from;
					oldState.unshift(user);
				}
				return;
			});

			return oldState;
		});
	}, []);

	const OutgoingMessage = useCallback((data) => {
		setFriends((state) => {
			const oldState = state.filter((user) => user.Id !== data.to);
			state.map((user) => {
				if (user.Id === data.to) {
					user.Last_Message = data.message;
					user.LastPersonToSendMessage = data.from;
					oldState.unshift(user);
				}
			});

			return oldState;
		});
	}, []);

	const Status = useCallback((data) => {
		setFriends((state) => {
			const newState = state.map((user) => {
				if (user.Id === data._id) user.active = data.online;
				return user;
			});

			return newState;
		});
	}, []);

	const ANSWERED = useCallback((data) => {
		console.log(data);
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("NEWFRIEND", NewFriend);
			socket.on("INCOMINGMESSAGE", IncomingMessage);
			socket.on("OUTGOINGMESSAGE", OutgoingMessage);
			socket.on("STATUS", Status);
			socket.on("ANSWERED", ANSWERED);
		}
		socket.emit("ACTIVEUSERS", (actives) => {
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
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		});

		return () => {
			socket.off("NEWFRIEND", NewFriend);
			socket.off("INCOMINGMESSAGE", IncomingMessage);
			socket.off("OUTGOINGMESSAGE", OutgoingMessage);
			socket.off("STATUS", Status);
			socket.off("ANSWERED", ANSWERED);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	function openRoom(
		user: Interface.Friends,
		e: React.MouseEvent<HTMLElement, MouseEvent>
	): void {
		const friendId = session.id;

		setFriends((state) => {
			state = state.map((u) => {
				if (u.Id === user.Id) u.UnseenMessages = 0;
				return u;
			});
			return state;
		});
		socket.emit("CLEANSEEN", {_id: friendId, Id: user._id}, (err, done) => {
			console.log(err || done);
			if (err) {
				alert("Internal server error: restarting window now");
				location.reload();
			}
		});

		ChatRoom({j, user, from: session.id, e, socket});
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
						<div className="loader">
							<CircularProgress sx={{color: "grey"}} />
						</div>
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
}

/**
 *
 * @param {{setTabToOpen: Function, tabToOpen: number}} props
 * @returns {JSX.Element} returns a react component
 */
function Navbar(props) {
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
						<i className="ion-ios-image" style={{fontSize: 17}}></i>
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
	const [opened, setOpened] = useState(false);
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
					{!PrivateFriends?.length && (
						<div className="add_new private_chats_member">
							No Private Chats
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
			</ul>
		</div>
	);
}

export default ChatBoard;
