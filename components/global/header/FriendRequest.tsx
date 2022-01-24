/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import {
	Fragment,
	useEffect,
	useContext,
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import {motion} from "framer-motion";
import {CSSTransition} from "react-transition-group";
import {AppContext, ModalContext} from "../../../lib/context";
import {v4 as uuid} from "uuid";
import time from "../../../utils/CalculateTime";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {IconButton, Badge} from "@mui/material";
import j from "jquery";
import * as Interfaces from "../../../lib/interfaces";

type PropsType = {
	SearchbarRef: Interfaces.Ref;
	ChatboardRef: Interfaces.Ref;
	children?: React.ReactNode;
};

const FriendRequests = function (props: PropsType, ref) {
	const {
		state: {socket, user, session},
		dispatch,
	} = useContext(AppContext);
	const modalSignal = useContext(ModalContext);
	const [requests, setRequests] = useState<Partial<Interfaces.Requests[]>>(
		user?.FriendRequests.reverse() || []
	);
	const [openModal, setOpenModal] = useState(false);
	const IconButtonRef = useRef<HTMLButtonElement>(null);

	const Reject = (id: string) => {
		let data = {
			going_id: id,
			coming_id: user._id,
			coming_name: user?.FullName,
			coming_image: user?.Image.profile,
		};
		socket.emit("REJECT_REQUEST", data, (err: string, done: string) => {
			console.log(err ?? done);
			setRequests((state) => {
				return (state = state.filter((req) => {
					if (req.From === id) {
						req.Rejected = true;
					}
					return req;
				}));
			});

			setTimeout(() => {
				setRequests((state) => {
					return (state = state.filter((req) => req.From !== id));
				});
			}, 5000);
		});
	};

	const Accept = (data: Interfaces.Requests) => {
		console.log("user accepted request %s", data);

		const data_to_emit = {
			going_id: data.From,
			going_name: data.Name,
			going_image: data.Image,
			coming_id: user._id,
			coming_name: user?.FullName,
			coming_image: user?.Image.profile,
		};

		socket.emit(
			"ACCEPT_REQUEST",
			data_to_emit,
			(err: string | object, id: string) => {
				console.log(err ?? id);

				setTimeout(() => {
					setRequests((state) => {
						state = state.filter((req) => {
							if (req.From === data.From) {
								req.Accepted = true;
							}
							return req;
						});
						return state;
					});
				}, 6000);

				const NewFriendDetails: Interfaces.Friends = {
					_id: id,
					Id: data.From,
					Name: data.Name,
					active: true,
					Image: data.Image,
					UnseenMessages: 1,
					Last_Message: "You are now friends",
					LastPersonToSendMessage: null,
					IsPrivate: false,
				};

				props.SearchbarRef.current.UpdateFriends(NewFriendDetails);
				props.ChatboardRef.current.UpdateFriends(NewFriendDetails);
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

		setRequests((state) => {
			return (state = [newRequest, ...state]);
		});
	};

	const REMOVEREQUEST = (data: {from: string}) => {
		setRequests((state) => {
			return (state = state.filter((user) => user.From !== data.from));
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
		IconButtonRef.current.classList.remove("active");
	};

	const handleOpen = () => {
		if (!openModal)
			j(modalSignal?.current).trigger("click").addClass("show");
		else j(modalSignal?.current).removeClass("show");

		IconButtonRef.current.classList.toggle("active");
	};

	return (
		<div className="friendrequest-wrapper">
			<Badge color="secondary" badgeContent={0} showZero>
				<IconButton
					className="open"
					ref={IconButtonRef}
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
							{requests?.map((user, index) => {
								var duration = time(user.Date);

								return (
									<Requests
										key={index}
										accept={Accept}
										reject={Reject}
										user={user}
										duration={duration}
									/>
								);
							})}
							{!Boolean(requests?.length) && (
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
};

interface RequestsInterface {
	user: Interfaces.Requests;
	accept(user: Interfaces.Requests): void;
	reject(id: string): void;
	duration: string;
}
function Requests(props: RequestsInterface) {
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
								Accept(user);
							}}
						>
							Accept
						</span>
					</div>
					<div className="reject btn">
						<span
							className="reject-text"
							onClick={(e) => {
								Reject(user.From);
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
