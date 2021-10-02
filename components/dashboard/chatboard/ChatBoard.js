/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {useRef, useContext, useEffect, useState, useCallback} from "react";
import {SocketContext} from "../../../lib/socket";
import {v4 as uuid} from "uuid";
import j from "jquery";
import ChatRoom from "../ChatRoom";

function ChatBoard() {
	const {socket, props, user} = useContext(SocketContext);
	const [friends, setFriends] = useState(user?.Friends || []);
	const [loading, setLoading] = useState(true);

	const NewFriend = useCallback((data) => {
		console.log("NewFriends emitted", data);
		setFriends((state) => {
			state = [data, ...state];
			return state;
		});
	}, []);

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
						: parseInt(user.UnseenMessages) + 1;
					user.Last_Message = data.message;
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
					user.Last_Message = "You: " + data.message;

					oldState.unshift(user);
				}
				return;
			});

			return oldState;
		});
	}, []);

	const Status = useCallback((data) => {
		setFriends((state) => {
			const newState = state.map((user) => {
				if (user.Id === data._id) {
					user.active = data.online;
				}
				return user;
			});

			return newState;
		});
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("NEWFRIEND", NewFriend);
			socket.on("INCOMINGMESSAGE", IncomingMessage);
			socket.on("OUTGOINGMESSAGE", OutgoingMessage);
			socket.on("STATUS", Status);
		}

		socket.emit("ACTIVEUSERS", (actives) => {
			console.log(actives);
			setFriends((state) => {
				state = state.map((user) => {
					const _id = user.Id.slice(19, 24);
					const active = actives.includes(_id);
					if (active) {
						user.active = true;
					} else {
						user.active = false;
					}
					return user;
				});

				return state;
			});

			setLoading(false);
		});

		return () => {
			socket.off("NEWFRIEND", NewFriend);
			socket.off("INCOMINGMESSAGE", IncomingMessage);
			socket.off("OUTGOINGMESSAGE", OutgoingMessage);
			socket.off("STATUS", Status);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	const Common = () => {
		j(".common-chats").fadeIn(1000).next(".private-chats").fadeOut();
		j(".nav-active").removeClass("p");
	};
	const Private = () => {
		j(".nav-active").addClass("p");
		j(".private-chats").addClass("p").fadeIn(1000);
	};
	function openRoom(user, e) {
		console.log(
			parseInt(j(e.target).parents(".user").find(".not-seen span").html())
		);
		var html =
			parseInt(
				j(e.target).parents(".user").find(".not-seen span").html()
			) > 0;
		if (html) {
			setFriends((state) => {
				state = state.map((u) => {
					if (u.Id === user.Id) {
						u.UnseenMessages = 0;
					}
					return u;
				});

				return state;
			});
		}
		ChatRoom({j, user, from: props?.user.id, e, socket});
	}

	console.log(friends);
	return (
		<aside className="chats-container chat-board">
			<div className="toggle"></div>
			<div className="chat-wrapper">
				<div className="chats-header">
					<div className="title">Chats</div>
					<div className="chats-nav">
						<div
							className="common public-chats"
							alt="Common chats"
							onClick={Common}
						>
							<div className="icon">
								<i>
									<svg
										enableBackground="new 0 0 24 24"
										height="24px"
										viewBox="0 0 24 24"
										width="24px"
										fill="#000000"
									>
										<rect
											fill="none"
											height="24"
											width="24"
										/>
										<g>
											<path d="M12,12.75c1.63,0,3.07,0.39,4.24,0.9c1.08,0.48,1.76,1.56,1.76,2.73L18,18H6l0-1.61c0-1.18,0.68-2.26,1.76-2.73 C8.93,13.14,10.37,12.75,12,12.75z M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1 C4.76,14.04,4.39,14,4,14c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85 C21.93,14.21,20.99,14,20,14c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M12,6c1.66,0,3,1.34,3,3 c0,1.66-1.34,3-3,3s-3-1.34-3-3C9,7.34,10.34,6,12,6z" />
										</g>
									</svg>
								</i>
							</div>
						</div>
						<div
							className="private"
							alt="Private chats"
							onClick={Private}
						>
							<div className="icon">
								<i>
									<svg
										className="svg"
										id="svg"
										height="24px"
										viewBox="0 0 24 24"
										width="24px"
										fill="#000000"
									>
										<path d="M0 0h24v24H0z" fill="none" />
										<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
									</svg>
								</i>
							</div>
						</div>
						<div className="nav-active"></div>
					</div>
				</div>
				<div className="chats-body">
					<div className="common-chats pub-chats">
						{loading ? (
							<h1> Getting your friends reading ... </h1>
						) : (
							<ul className="chats-list">
								{friends?.length
									? friends.map((user) => {
											var key = uuid();
											return (
												<li
													className="chat user"
													key={key}
												>
													<div className="user">
														<div className="user-image userimage">
															<div className="image-wrapper">
																<img
																	src={
																		user.Image ||
																		"./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
																	}
																	alt=""
																	className="image"
																/>
															</div>
														</div>
													</div>
													<div
														className="username"
														onClick={(e) =>
															openRoom(user, e)
														}
													>
														<div className="name">
															<span>
																{user.Name}
															</span>
															<br />
															<span className="last-message">
																{
																	user.Last_Message
																}
															</span>
														</div>
													</div>
													<div className="status not-seen-message">
														{user.active ? (
															<div className="active"></div>
														) : (
															<div className="offline"></div>
														)}
														{user.UnseenMessages >
														0 ? (
															<div className="not-seen">
																<span>
																	{
																		user.UnseenMessages
																	}
																</span>
															</div>
														) : (
															""
														)}
													</div>
												</li>
											);
									  })
									: ""}
							</ul>
						)}
					</div>
					<div className="private-chats" style={{display: "none"}}>
						<ul className="chats-list">
							<li className="chat">
								<div className="user">
									<div className="userimage">
										<img
											src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
											alt=""
											className="image"
										/>
									</div>
								</div>
								<div className="username">
									<div className="name">
										<span>
											Oderinde james Oluwatimileyin
										</span>
										<br />
										<span className="last-message">
											Whats up, how are you doing Lorem
											ipsum dolor sit amet consectetur
											adipisicing elit. Consectetur odio
											aspernatur alias!
										</span>
									</div>
								</div>
								<div className="status uncheck-message">
									<div className="active"></div>
									<div className="unchecked-number">
										<span>2</span>
									</div>
								</div>
							</li>
						</ul>
						<div className="chat-security">
							<div className="label">
								<h4>Enter security key to open</h4>
							</div>
							<div className="lock">
								<input
									className="input unlock"
									data-role="input"
									placeholder="Enter key "
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

export default ChatBoard;
