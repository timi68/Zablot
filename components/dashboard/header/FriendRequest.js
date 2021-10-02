/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import {Fragment, useEffect, useContext, useState, useRef} from "react";
import {SocketContext} from "../../../lib/socket";
import {v4 as uuid} from "uuid";
import time from "../../../lib/calcuate-time";
import j from "jquery";

function FriendRequests() {
	const {socket, props, user} = useContext(SocketContext);
	const [request, setRequest] = useState(
		user?.FriendRequests.sort(() => -1) || []
	);
	const [date, setDate] = useState(new Date());

	const Reject = (id, rm) => {
		let data = {
			GID: id,
			CID: props?.user.id,
			CN: user?.FullName,
			CI: user?.Image.profile,
		};
		socket.emit("REJECT_REQUEST", data, (err, done) => {
			console.log(done ?? err);
			j(rm.target)
				.parents(".user")
				.find(".btn-wrapper")
				.remove()
				.end()
				.append("<pre> Request rejected </pre>");

			setTimeout(() => {
				setDate(() => {
					return new Date();
				});
				setRequest((state) => {
					console.log(state);
					return state.filter((req) => req.From !== id);
				});
			}, 1000);
		});
	};
	const Accept = (data, e) => {
		console.log("user accepted request %s", data);

		const data_to_emit = {
			GID: data.From,
			GN: data.Name,
			GI: data.Image,
			CID: props?.user.id,
			CN: user?.FullName,
			CI: user?.Image.profile,
		};

		socket.emit("ACCEPT_REQUEST", data_to_emit, (err, done) => {
			console.log(err ?? done);
			j(e.target)
				.parents(".user")
				.find(".btn-wrapper")
				.remove()
				.end()
				.append("<button class='btn open-chat'> Message </button>");

			setTimeout(() => {
				setDate((state) => {
					return new Date();
				});
				setRequest((state) => {
					return state.filter((req) => {
						if (req.From === data.From) {
							req.Accepted = true;
						}
						return req;
					});
				});
			}, 6000);
		});
	};

	const FRIENDSHIP_DEMAND = (data) => {
		console.log(data);
		const id = uuid();
		const newRequest = {
			From: data.From,
			Name: data.FullName,
			UserName: data.UserName,
			Image: data.Image,
			Date: new Date(),
		};

		setDate(() => {
			return new Date();
		});
		setRequest((state) => {
			return [newRequest, ...state];
		});
	};
	useEffect(() => {
		console.log("mounting times 3");

		if (socket) {
			socket.on("FRIENDSHIP_DEMAND", FRIENDSHIP_DEMAND);
		}

		return () => {
			socket.off("FRIENDSHIP_DEMAND", FRIENDSHIP_DEMAND);
		};
	}, [socket]);

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setDate(() => {
	// 			return new Date();
	// 		});
	// 	}, 60000);
	// }, [date]);

	const Icon = () => {
		if (!j(".request-box").hasClass("show"))
			j(document).find(".show").removeClass("show expand");
		if (request?.length) {
			setTimeout(() => {
				setDate(new Date());
			}, 500);
		}
		j(".request-box").prop("scrollTop", 0).toggleClass("show");
	};

	const Modal = () => {
		j(".request-box .close-modal").parents(".show").removeClass("show");
	};

	console.log("this is request", request);
	return (
		<div className="friendrequest-wrapper">
			<div className="unseen">0</div>
			<div
				className="request-icon icon"
				alt="Friend Requests"
				onClick={Icon}
			>
				<svg
					enableBackground="new 0 0 24 24"
					height="20px"
					viewBox="0 0 24 24"
					width="20px"
					fill="#000000"
				>
					<g>
						<rect
							fill="none"
							className="svg"
							height="20"
							width="20"
						/>
						<rect fill="none" height="20" width="20" />
					</g>
					<g>
						<g>
							<polygon points="22,9 22,7 20,7 20,9 18,9 18,11 20,11 20,13 22,13 22,11 24,11 24,9" />
							<path d="M8,12c2.21,0,4-1.79,4-4s-1.79-4-4-4S4,5.79,4,8S5.79,12,8,12z M8,6c1.1,0,2,0.9,2,2s-0.9,2-2,2S6,9.1,6,8S6.9,6,8,6z" />
							<path d="M8,13c-2.67,0-8,1.34-8,4v3h16v-3C16,14.34,10.67,13,8,13z M14,18H2v-0.99C2.2,16.29,5.3,15,8,15s5.8,1.29,6,2V18z" />
							<path d="M12.51,4.05C13.43,5.11,14,6.49,14,8s-0.57,2.89-1.49,3.95C14.47,11.7,16,10.04,16,8S14.47,4.3,12.51,4.05z" />
							<path d="M16.53,13.83C17.42,14.66,18,15.7,18,17v3h2v-3C20,15.55,18.41,14.49,16.53,13.83z" />
						</g>
					</g>
				</svg>
			</div>
			<div className="request-box">
				<div className="request-header">
					<div className="title">
						<h3>Friend Requests</h3>
					</div>
					<div className="close-modal" onClick={Modal}>
						<div className="close">
							<span>Close</span>
						</div>
					</div>
				</div>
				<div className="request-list">
					<ul className="users">
						{request?.length ? (
							request.map((user) => {
								var key = uuid();
								var duration = time(date, user.Date);

								return (
									<li className="user" key={key}>
										<div className="user-profile">
											<div className="user-image">
												<div className="image-wrapper">
													<img
														src={user.Image}
														alt="user-image"
														className="image"
													/>
												</div>
											</div>
											<div className="user-name">
												<div className="name">
													<span>{user.Name}</span>
												</div>
												<div className="username">
													<span>
														@{user.UserName}
													</span>
													&nbsp; &nbsp; &nbsp; &nbsp;
													<span> {duration} </span>
												</div>
											</div>
										</div>
										{user?.Accepted ? (
											<button className="btn open-chat">
												{" "}
												Message{" "}
											</button>
										) : (
											<div className="friend-reject-accept-btn btn-wrapper">
												<div className="accept btn">
													<span
														className="accept-text"
														onClick={(e) => {
															Accept(user, e);
														}}
													>
														Accept
													</span>
												</div>
												<div className="reject btn">
													<span
														className="reject-text"
														onClick={(e) => {
															Reject(
																user.From,
																e
															);
														}}
													>
														Reject
													</span>
												</div>
											</div>
										)}
									</li>
								);
							})
						) : (
							<div className="no_request">
								<h5>There is no request available</h5>
							</div>
						)}
					</ul>
				</div>
				<div className="related-friends friends">
					<div className="title">You might know this people</div>
					<ul className="users">
						<li className="user">
							<div className="user-profile">
								<div className="user-image">
									<div className="image-wrapper">
										<img
											src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
											alt="user-image"
											className="image"
										/>
									</div>
								</div>
								<div className="user-name">
									<div className="name">
										<span>Oderinde Tobi</span>
									</div>
									<div className="username">
										<span>@tjdbbs</span>
									</div>
								</div>
							</div>
							<div className="friend-reject-accept-btn btn-wrapper">
								<div className="accept btn">
									<span className="accept-text">Add</span>
								</div>
								<div className="reject btn">
									<span className="reject-text">Cancel</span>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default FriendRequests;
