/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import {Fragment, useEffect, useContext, useState, useRef} from "react";
import {motion} from "framer-motion";
import {CSSTransition} from "react-transition-group";
import {AppContext, ModalContext} from "../../../lib/context";
import {v4 as uuid} from "uuid";
import time from "../../../utils/calcuate-time";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {IconButton, Badge} from "@mui/material";
import j from "jquery";
import * as Interfaces from "../../../lib/interfaces";

interface RequestDataInterface {
	requests: Partial<Interfaces.Requests[]>;
	date: Date;
}
function FriendRequests() {
	const {
		state: {socket, user, session},
	} = useContext(AppContext);
	const modalSignal = useContext(ModalContext);
	const [requestsData, setRequestsData] = useState<RequestDataInterface>({
		requests: user?.FriendRequests.reverse() || [],
		date: new Date(),
	});
	const [openModal, setOpenModal] = useState(false);

	const Reject = (id: string, rm: Event) => {
		let data = {
			GID: id,
			CID: user._id,
			CN: user?.FullName,
			CI: user?.Image.profile,
		};
		socket.emit("REJECT_REQUEST", data, (err: string, done: string) => {
			console.log(err ?? done);
			setRequestsData((state) => {
				return {
					...state,
					...{
						requests: state.requests.filter((req) => {
							if (req.From === id) {
								req.Rejected = true;
							}
							return req;
						}),
					},
				};
			});

			setTimeout(() => {
				setRequestsData((state) => {
					return {
						requests: state.requests.filter(
							(req) => req.From !== id
						),
						date: new Date(),
					};
				});
			}, 5000);
		});
	};

	const Accept = (data, e: Event) => {
		console.log("user accepted request %s", data);

		const data_to_emit = {
			GID: data.From,
			GN: data.Name,
			GI: data.Image,
			CID: user._id,
			CN: user?.FullName,
			CI: user?.Image.profile,
		};

		socket.emit(
			"ACCEPT_REQUEST",
			data_to_emit,
			(err: string | object, done: string | boolean) => {
				console.log(err ?? done);

				setTimeout(() => {
					setRequestsData((state) => {
						return {
							...state,
							...{
								requests: state.requests.filter((req) => {
									if (req.From === data.From) {
										req.Accepted = true;
									}
									return req;
								}),
							},
						};
					});
				}, 6000);
			}
		);
	};

	const FRIENDSHIPDEMAND = (data: Interfaces.Requests) => {
		console.log(data);
		const newRequest: Interfaces.Requests = {
			From: data.From,
			Name: data.Name,
			UserName: data.UserName,
			Image: data.Image,
			Date: new Date(),
		};

		setRequestsData((state) => {
			return {
				requests: [newRequest, ...state.requests],
				date: new Date(),
			};
		});
	};

	const REMOVEREQUEST = (data: {from: string}) => {
		setRequestsData((state): RequestDataInterface => {
			return {
				...state,
				...{
					requests: state.requests.filter(
						(user) => user.From !== data.from
					),
				},
			};
		});
	};

	useEffect(() => {
		console.log("mounting times 3");

		if (socket) {
			socket.on("FRIENDSHIPDEMAND", FRIENDSHIPDEMAND);
			socket.on("REMOVEREQUEST", REMOVEREQUEST);
		}

		return () => {
			socket.off("REMOVEREQUEST", REMOVEREQUEST);
			socket.off("FRIENDSHIPDEMAND", FRIENDSHIPDEMAND);
		};
	}, [socket]);

	useEffect(() => {
		if (modalSignal) {
			const modal = modalSignal.current;
			j(modalSignal.current).on("click", closemodal);
			return () => {
				j(modal).off("click", closemodal);
			};
		}
	}, [openModal]);

	const closemodal = () => {
		if (!openModal) return;
		setOpenModal(false);
		j(modalSignal.current).removeClass("show");
	};

	const handleOpen = () => {
		if (!openModal)
			j(modalSignal.current).trigger("click").addClass("show");
		else j(modalSignal.current).removeClass("show");
	};

	return (
		<div className="friendrequest-wrapper">
			<Badge color="secondary" badgeContent={0} showZero>
				<IconButton
					className="open"
					onClick={() => {
						setOpenModal(!openModal);
						handleOpen();
					}}
				>
					<PersonAddIcon fontSize="small" />
				</IconButton>
			</Badge>
			<CSSTransition
				in={openModal}
				timeout={200}
				unmountOnExit
				classNames="requests-box"
			>
				<div className="requests-box">
					<div className="requests-header">
						<div className="title">Friend Requests</div>
						<div className="close-modal" onClick={closemodal}>
							<div className="close">
								<span>Close</span>
							</div>
						</div>
					</div>
					<div className="requests-list">
						<ul className="users">
							{requestsData.requests?.map((user) => {
								var key = uuid();
								console.log(requestsData.date, user.Date);
								var duration = time(
									requestsData.date,
									user.Date
								);

								return (
									<Requests
										key={key}
										accept={Accept}
										reject={Reject}
										user={user}
										duration={duration}
									/>
								);
							})}
							{!Boolean(requestsData.requests?.length) && (
								<div className="no_request">
									<h4>There is no request available</h4>
								</div>
							)}
						</ul>
					</div>
					<PeopleYouMightKnow />
				</div>
			</CSSTransition>
		</div>
	);
}

interface RequestsInterface {
	user: Interfaces.User;
	accept(): void;
	reject(): void;
	duration: string;
}
function Requests(props) {
	const {user, duration, accept: Accept, reject: Reject} = props;

	return (
		<li className="user">
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
						<span>@{user.UserName}</span>
						&nbsp; &nbsp; &nbsp; &nbsp;
						<span> {duration} </span>
					</div>
				</div>
			</div>
			{user?.Accepted && (
				<button className="btn open-chat"> Message </button>
			)}
			{user?.Rejected && (
				<button className="btn rejected" disabled={true}>
					{" "}
					Rejected{" "}
				</button>
			)}
			{!user?.Accepted && !user?.Rejected && (
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
								Reject(user.From, e);
							}}
						>
							Reject
						</span>
					</div>
				</div>
			)}
		</li>
	);
}

function PeopleYouMightKnow() {
	return (
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
	);
}

export default FriendRequests;
